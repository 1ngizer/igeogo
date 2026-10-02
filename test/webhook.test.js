'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { load, mockRes, withEnv } = require('./helpers');

const BODY = '{"object":"x"}';
const sign = (secret, body = BODY) => `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`;

// Devuelve el código HTTP con el que responde receive() ante una petición dada.
async function post({ env, signature }) {
  return withEnv(env, async () => {
    const { receive } = load('controllers/webhook.controller');
    const res = mockRes();
    const req = {
      get: (h) => (h.toLowerCase() === 'x-hub-signature-256' ? signature : undefined),
      rawBody: Buffer.from(BODY),
      body: { object: 'otro' }, // tras el ACK sale sin procesar
    };
    await receive(req, res);
    return res.code;
  });
}

const PROD = { NODE_ENV: 'production', APP_SECRET: 'app-secret' };

test('producción sin WHATSAPP_APP_SECRET rechaza (falla cerrado)', async () => {
  assert.equal(await post({ env: PROD }), 403);
});

test('con secreto y sin cabecera de firma rechaza', async () => {
  assert.equal(await post({ env: { ...PROD, WHATSAPP_APP_SECRET: 'meta' } }), 403);
});

test('con secreto y firma inválida rechaza', async () => {
  assert.equal(await post({ env: { ...PROD, WHATSAPP_APP_SECRET: 'meta' }, signature: 'sha256=deadbeef' }), 403);
});

test('firma de otro secreto rechaza', async () => {
  assert.equal(await post({ env: { ...PROD, WHATSAPP_APP_SECRET: 'meta' }, signature: sign('otro') }), 403);
});

test('con secreto y firma válida acepta', async () => {
  assert.equal(await post({ env: { ...PROD, WHATSAPP_APP_SECRET: 'meta' }, signature: sign('meta') }), 200);
});

test('en desarrollo sin secreto acepta (comodidad local)', async () => {
  assert.equal(await post({ env: { NODE_ENV: 'development' } }), 200);
});
