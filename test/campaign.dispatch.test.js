'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { load, withEnv } = require('./helpers');

const PROD = { NODE_ENV: 'production', APP_SECRET: 'test-secret' };

function setup({ status = 'pagada', failFor = [] } = {}) {
  const calls = { templates: [], texts: [], userQuery: null };
  const camp = {
    _id: 'c1',
    status,
    cliente: '573000000000',
    producto: 'Pizza\n   grande', // un salto de línea haría que Meta rechace la variable
    discountPercent: 30,
    messages: 3,
    estimatedReach: 3,
    category: 'comida',
    radius: 1000,
    location: { coordinates: [-74, 4.6] },
    async save() {
      return this;
    },
  };
  const Campaign = {
    findById: async () => camp,
    findOneAndUpdate: async (q, u) => {
      if (q.status !== camp.status) return null;
      camp.status = u.$set.status;
      return camp;
    },
  };
  const User = {
    find: (q) => {
      calls.userQuery = q;
      return { select: () => ({ limit: () => ({ lean: async () => ['573111', '573222', '573333'].map((waId) => ({ waId })) }) }) };
    },
    updateOne: async () => ({}),
  };
  const wa = {
    sendTemplate: async (to, name, lang, comp) => {
      if (failFor.includes(to)) throw new Error('131047 fuera de ventana');
      calls.templates.push({ to, name, lang, params: comp[0].parameters.map((p) => p.text) });
    },
    sendText: async (to) => {
      calls.texts.push(to);
    },
  };
  const { dispatchCampaign } = load('services/campaign.service', {
    'models/Campaign': Campaign,
    'models/User': User,
    'services/whatsapp.service': wa,
  });
  return { dispatchCampaign, camp, calls };
}

test('envía solo por plantilla (oferta_cercana, es_CO) con variables saneadas', () =>
  withEnv(PROD, async () => {
    const { dispatchCampaign, camp, calls } = setup();
    const r = await dispatchCampaign('c1');
    assert.deepEqual(r, { attempted: 3, sent: 3, failed: 0 });
    assert.equal(calls.templates.length, 3);
    assert.equal(calls.templates[0].name, 'oferta_cercana');
    assert.equal(calls.templates[0].lang, 'es_CO');
    assert.deepEqual(calls.templates[0].params, ['Pizza grande', '30% de descuento']);
    assert.equal(calls.texts.length, 0, 'no debe haber texto libre');
    assert.equal(camp.status, 'enviada');
  }));

test('un fallo de envío cuenta como fallido y NO cae a texto libre', () =>
  withEnv(PROD, async () => {
    const { dispatchCampaign, calls } = setup({ failFor: ['573222'] });
    const r = await dispatchCampaign('c1');
    assert.equal(r.sent, 2);
    assert.equal(r.failed, 1);
    assert.equal(calls.texts.length, 0);
  }));

test('respeta WHATSAPP_TEMPLATE_NAME y WHATSAPP_TEMPLATE_LANG', () =>
  withEnv({ ...PROD, WHATSAPP_TEMPLATE_NAME: 'otra_plantilla', WHATSAPP_TEMPLATE_LANG: 'es' }, async () => {
    const { dispatchCampaign, calls } = setup();
    await dispatchCampaign('c1');
    assert.equal(calls.templates[0].name, 'otra_plantilla');
    assert.equal(calls.templates[0].lang, 'es');
  }));

test('la audiencia excluye a quienes se dieron de baja o no tienen opt-in', () =>
  withEnv(PROD, async () => {
    const { dispatchCampaign, calls } = setup();
    await dispatchCampaign('c1');
    assert.deepEqual(calls.userQuery.state.$nin.sort(), ['awaiting_optin', 'new', 'opted_out']);
  }));

test('no despacha campañas sin pagar', () =>
  withEnv(PROD, async () => {
    const { dispatchCampaign, calls } = setup({ status: 'propuesta' });
    await assert.rejects(dispatchCampaign('c1'), /no ha sido pagada/);
    assert.equal(calls.templates.length, 0);
  }));

test('no despacha dos veces la misma campaña', () =>
  withEnv(PROD, async () => {
    const { dispatchCampaign } = setup();
    await dispatchCampaign('c1');
    await assert.rejects(dispatchCampaign('c1'), /ya fue enviada/);
  }));

test('dos despachos simultáneos: solo uno envía', () =>
  withEnv(PROD, async () => {
    const { dispatchCampaign, calls } = setup();
    const results = await Promise.allSettled([dispatchCampaign('c1'), dispatchCampaign('c1')]);
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    assert.equal(results.filter((r) => r.status === 'rejected').length, 1);
    assert.equal(calls.templates.length, 3, 'la audiencia no debe recibir el mensaje duplicado');
  }));
