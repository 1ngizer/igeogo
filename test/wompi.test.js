'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { load, withEnv } = require('./helpers');

const SECRET = 'evsecret';

function signedEvent({ ageSeconds = 5, amount = 150000, tamper = false } = {}) {
  const ts = Math.floor(Date.now() / 1000) - ageSeconds;
  const checksum = crypto
    .createHash('sha256')
    .update(`t1APPROVED${amount}${ts}${SECRET}`)
    .digest('hex');
  return {
    data: { transaction: { id: 't1', status: 'APPROVED', amount_in_cents: tamper ? 999 : amount } },
    timestamp: ts,
    signature: {
      properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
      checksum,
    },
  };
}

const verify = (event, env = { WOMPI_EVENTS_SECRET: SECRET }) =>
  withEnv({ NODE_ENV: 'development', ...env }, () => load('services/wompi.service').verifyEvent(event));

test('evento reciente y bien firmado es válido', async () => {
  assert.equal(await verify(signedEvent()), true);
});

test('un reintento de Wompi a los 20 minutos sigue siendo válido', async () => {
  assert.equal(await verify(signedEvent({ ageSeconds: 20 * 60 })), true);
});

test('el último reintento (~23 h) sigue siendo válido', async () => {
  assert.equal(await verify(signedEvent({ ageSeconds: 23 * 3600 })), true);
});

test('un evento de más de 25 h se rechaza', async () => {
  assert.equal(await verify(signedEvent({ ageSeconds: 26 * 3600 })), false);
});

test('si se altera el monto el checksum no coincide', async () => {
  assert.equal(await verify(signedEvent({ tamper: true })), false);
});

test('sin WOMPI_EVENTS_SECRET se rechaza todo', async () => {
  assert.equal(await verify(signedEvent(), {}), false);
});

test('sin checksum se rechaza', async () => {
  const ev = signedEvent();
  delete ev.signature.checksum;
  assert.equal(await verify(ev), false);
});

test('createPaymentLink convierte pesos a centavos (x100)', async () => {
  const calls = [];
  const axios = { post: async (url, body) => (calls.push(body), { data: { data: { id: 'L1' } } }) };
  // axios es una dependencia externa: se sustituye en la caché de require.
  const axiosId = require.resolve('axios');
  const prev = require.cache[axiosId];
  require.cache[axiosId] = { id: axiosId, filename: axiosId, loaded: true, exports: axios };
  try {
    process.env.WOMPI_PRIVATE_KEY = 'k';
    const svc = load('services/wompi.service');
    const r = await svc.createPaymentLink({ name: 'n', amountCop: 1500, redirectUrl: 'https://x' });
    assert.equal(calls[0].amount_in_cents, 150000); // piso real de Wompi
    assert.equal(r.id, 'L1');
  } finally {
    delete process.env.WOMPI_PRIVATE_KEY;
    if (prev) require.cache[axiosId] = prev;
    else delete require.cache[axiosId];
  }
});
