'use strict';

// Piso de Wompi: 150000 centavos = $1.500 COP. (El "150000" del error de su API estaba en centavos.)

const test = require('node:test');
const assert = require('node:assert/strict');
const { load, mockRes, withEnv } = require('./helpers');

const ENV = { NODE_ENV: 'development' };

function setup({ campaign, reach = 20, wompiFails = false } = {}) {
  const calls = { created: [], links: [] };
  const Campaign = {
    findOne: async () => campaign,
    create: async (doc) => (calls.created.push(doc), { _id: 'new', ...doc }),
  };
  const User = {
    findOne: async () => ({ waId: '573111', role: 'cliente', maxDistanceMeters: 2000 }),
    countDocuments: async () => reach,
  };
  const wompi = {
    createPaymentLink: async (args) => {
      calls.links.push(args);
      if (wompiFails) throw new Error('detalle interno secreto: key=abc');
      return { id: 'L1', url: 'https://checkout.wompi.co/l/L1' };
    },
  };
  const ai = { moderateCampaignCopy: async () => ({ ok: true }) };
  const Pricing = {
    getPricing: async () => ({
      pricePerMessage: 100,
      plans: [{ name: 'Básico', price: 50000, messages: 550, campaigns: 3 }],
    }),
  };
  const ctrl = load('controllers/app.controller', {
    'models/Campaign': Campaign,
    'models/User': User,
    'services/wompi.service': wompi,
    'services/ai.service': ai,
    'models/Pricing': Pricing,
  });
  return { ctrl, calls };
}

const create = async (ctrl, body) => {
  const res = mockRes();
  await ctrl.createCampaign({ waId: '573111', body: { producto: 'Pizza', category: 'comida', lat: 4.6, lng: -74.1, ...body } }, res);
  return res;
};

const pay = async (ctrl) => {
  const res = mockRes();
  await ctrl.payCampaign({ waId: '573111', params: { id: 'c1' } }, res);
  return res;
};

test('pago por mensaje por debajo de $1.500 se rechaza al crear', () =>
  withEnv(ENV, async () => {
    const { ctrl, calls } = setup({ reach: 10 });
    const res = await create(ctrl, { messages: 10 }); // 10 x $100 = $1.000
    assert.equal(res.code, 400);
    assert.match(res.body.error, /\$1\.500/);
    assert.match(res.body.error, /15 mensajes/);
    assert.equal(calls.created.length, 0);
  }));

test('exactamente 15 mensajes ($1.500) se acepta', () =>
  withEnv(ENV, async () => {
    const { ctrl, calls } = setup({ reach: 15 });
    const res = await create(ctrl, { messages: 15 });
    assert.equal(res.code, 201);
    assert.equal(calls.created[0].budget, 1500);
  }));

test('14 mensajes ($1.400) se rechaza', () =>
  withEnv(ENV, async () => {
    const { ctrl } = setup({ reach: 14 });
    assert.equal((await create(ctrl, { messages: 14 })).code, 400);
  }));

test('un plan (Básico $50.000) pasa aunque el alcance sea pequeño', () =>
  withEnv(ENV, async () => {
    const { ctrl, calls } = setup({ reach: 5 });
    const res = await create(ctrl, { plan: 'Básico' });
    assert.equal(res.code, 201);
    assert.equal(calls.created[0].budget, 50000);
  }));

test('el cobro rechaza presupuestos por debajo del piso sin llamar a Wompi', () =>
  withEnv(ENV, async () => {
    for (const budget of [0, 1000, 1499]) {
      const { ctrl, calls } = setup({ campaign: { status: 'propuesta', budget } });
      const res = await pay(ctrl);
      assert.equal(res.code, 400, `presupuesto ${budget}`);
      assert.equal(calls.links.length, 0);
    }
  }));

test('el cobro de $1.500 genera el link de Wompi', () =>
  withEnv(ENV, async () => {
    const campaign = { status: 'propuesta', budget: 1500, producto: 'Pizza', plan: 'por_mensaje', async save() {} };
    const { ctrl, calls } = setup({ campaign });
    const res = await pay(ctrl);
    assert.equal(res.code, 200);
    assert.equal(res.body.checkoutUrl, 'https://checkout.wompi.co/l/L1');
    assert.equal(calls.links[0].amountCop, 1500);
  }));

test('si Wompi falla, el error al cliente es genérico y no filtra detalles', () =>
  withEnv(ENV, async () => {
    const campaign = { status: 'propuesta', budget: 50000, producto: 'Pizza', plan: 'Básico', async save() {} };
    const { ctrl } = setup({ campaign, wompiFails: true });
    const res = await pay(ctrl);
    assert.equal(res.code, 500);
    assert.doesNotMatch(JSON.stringify(res.body), /secreto|key=abc/);
  }));

test('una campaña ya pagada no se cobra de nuevo', () =>
  withEnv(ENV, async () => {
    const { ctrl, calls } = setup({ campaign: { status: 'pagada', budget: 50000 } });
    assert.equal((await pay(ctrl)).code, 400);
    assert.equal(calls.links.length, 0);
  }));
