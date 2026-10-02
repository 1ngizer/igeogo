'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { load, mockRes, withEnv, query } = require('./helpers');

function setup({ existing, updated }) {
  const calls = { filter: null, couponInc: 0 };
  const Redemption = {
    findOne: () => query(existing),
    findOneAndUpdate: (filter) => {
      calls.filter = filter;
      return query(updated);
    },
  };
  const Coupon = {
    updateOne: async () => {
      calls.couponInc += 1;
      return {};
    },
  };
  const { validate } = load('controllers/redemption.controller', {
    'models/Redemption': Redemption,
    'models/Coupon': Coupon,
  });
  return { validate, calls };
}

const run = async (validate, code) => {
  const res = mockRes();
  await validate({ body: { code } }, res);
  return res;
};

const fresh = () => ({
  _id: 'r1',
  status: 'pendiente',
  coupon: { _id: 'cp1', title: '2x1 Pizza', expiresAt: new Date(Date.now() + 86400000) },
  merchant: { name: 'Pizzería' },
});

test('sin código responde 400', () =>
  withEnv({ NODE_ENV: 'development' }, async () => {
    const { validate } = setup({ existing: null });
    assert.equal((await run(validate, '  ')).code, 400);
  }));

test('código inexistente responde 404', () =>
  withEnv({ NODE_ENV: 'development' }, async () => {
    const { validate } = setup({ existing: null });
    assert.equal((await run(validate, 'ABC123')).code, 404);
  }));

test('código ya canjeado responde 409 y no toca el contador', () =>
  withEnv({ NODE_ENV: 'development' }, async () => {
    const { validate, calls } = setup({ existing: { ...fresh(), status: 'canjeado' } });
    const res = await run(validate, 'abc123');
    assert.equal(res.code, 409);
    assert.equal(calls.couponInc, 0);
  }));

test('cupón vencido responde 410', () =>
  withEnv({ NODE_ENV: 'development' }, async () => {
    const e = fresh();
    e.coupon.expiresAt = new Date(Date.now() - 1000);
    const { validate } = setup({ existing: e });
    assert.equal((await run(validate, 'ABC123')).code, 410);
  }));

test('canje válido: 200, marca canjeado de forma atómica y suma al contador', () =>
  withEnv({ NODE_ENV: 'development' }, async () => {
    const e = fresh();
    const { validate, calls } = setup({ existing: e, updated: { ...e, status: 'canjeado', redeemedAt: new Date() } });
    const res = await run(validate, 'abc123');
    assert.equal(res.code, 200);
    assert.equal(res.body.ok, true);
    assert.deepEqual(calls.filter.status, { $ne: 'canjeado' }, 'el filtro atómico evita el doble canje');
    assert.equal(calls.couponInc, 1);
  }));

test('condición de carrera: si otro canjeó en medio, responde 409 y no cuenta dos veces', () =>
  withEnv({ NODE_ENV: 'development' }, async () => {
    const { validate, calls } = setup({ existing: fresh(), updated: null });
    const res = await run(validate, 'abc123');
    assert.equal(res.code, 409);
    assert.equal(calls.couponInc, 0);
  }));
