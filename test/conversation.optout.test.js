'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { load, withEnv } = require('./helpers');

function setup(initialState) {
  const sent = { texts: [], buttons: [] };
  const user = {
    waId: '573111',
    state: initialState,
    optInAt: new Date(),
    async save() {
      return this;
    },
  };
  const wa = {
    sendText: async (_to, text) => void sent.texts.push(text),
    sendButtons: async (_to, text) => void sent.buttons.push(text),
  };
  const { handleIncomingMessage } = load('services/conversation.service', {
    'models/User': { findOne: async () => user, create: async () => user },
    'models/Coupon': {},
    'models/Campaign': {},
    'models/Redemption': {},
    'services/whatsapp.service': wa,
    'services/matching.service': {},
  });
  return { handleIncomingMessage, user, sent };
}

const DEV = { NODE_ENV: 'development' };

for (const word of ['STOP', 'stop', 'Baja', ' salir ', 'NO MAS', 'no más', 'Cancelar', 'alto']) {
  test(`"${word}" da de baja al usuario`, () =>
    withEnv(DEV, async () => {
      const { handleIncomingMessage, user, sent } = setup('active');
      await handleIncomingMessage({ waId: user.waId, type: 'text', text: word });
      assert.equal(user.state, 'opted_out');
      assert.equal(user.optInAt, null);
      assert.equal(sent.texts.length, 1);
      assert.match(sent.texts[0], /dado de baja/);
      assert.equal(sent.buttons.length, 0, 'no se le reenvía el menú de ofertas');
    }));
}

for (const phrase of ['bajar precios', 'quiero salir a comer', 'no gracias']) {
  test(`"${phrase}" NO es una baja`, () =>
    withEnv(DEV, async () => {
      const { handleIncomingMessage, user, sent } = setup('new');
      await handleIncomingMessage({ waId: user.waId, type: 'text', text: phrase });
      assert.notEqual(user.state, 'opted_out');
      assert.equal(sent.texts.filter((t) => /dado de baja/.test(t)).length, 0);
    }));
}

test('quien se dio de baja y escribe "Hola" vuelve a pedir el opt-in', () =>
  withEnv(DEV, async () => {
    const { handleIncomingMessage, user, sent } = setup('opted_out');
    await handleIncomingMessage({ waId: user.waId, type: 'text', text: 'Hola' });
    assert.equal(user.state, 'awaiting_optin');
    assert.equal(sent.buttons.length, 1);
  }));

test('un usuario dado de baja que comparte ubicación no recibe ofertas', () =>
  withEnv(DEV, async () => {
    const { handleIncomingMessage, user, sent } = setup('opted_out');
    await handleIncomingMessage({ waId: user.waId, type: 'location', location: { lat: 4.6, lng: -74.1 } });
    assert.equal(user.state, 'awaiting_optin', 'se le pide consentimiento de nuevo');
    assert.equal(sent.buttons.length, 1);
  }));
