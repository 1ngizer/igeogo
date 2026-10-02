'use strict';

const path = require('path');
const os = require('os');

// dotenv lee el .env del cwd: aislamos para que un .env local no contamine las pruebas.
process.chdir(os.tmpdir());

const SRC = path.join(__dirname, '..', 'src');
const abs = (p) => require.resolve(path.join(SRC, p));

const ENV_KEYS = [
  'NODE_ENV',
  'APP_SECRET',
  'WHATSAPP_APP_SECRET',
  'WHATSAPP_TEMPLATE_NAME',
  'WHATSAPP_TEMPLATE_LANG',
  'WOMPI_EVENTS_SECRET',
  'ANTHROPIC_MODEL',
];

/** Ejecuta fn con un entorno controlado y restaura las variables al terminar. */
async function withEnv(env, fn) {
  const saved = {};
  for (const k of ENV_KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  Object.assign(process.env, env);
  try {
    return await fn();
  } finally {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
}

/** Carga un módulo de src sin caché y con dependencias reemplazadas por stubs. */
function load(modulePath, stubs = {}) {
  // Los modelos reales se recompilan en cada carga: hay que vaciar el registro de Mongoose.
  require('mongoose').deleteModel(/.*/);
  for (const k of Object.keys(require.cache)) if (k.startsWith(SRC)) delete require.cache[k];
  for (const [p, exports] of Object.entries(stubs)) {
    const id = abs(p);
    require.cache[id] = { id, filename: id, loaded: true, exports };
  }
  return require(abs(modulePath));
}

/** Respuesta de Express simulada. */
function mockRes() {
  const r = { code: 200, body: undefined };
  r.status = (c) => ((r.code = c), r);
  r.json = (b) => ((r.body = b), r);
  r.sendStatus = (c) => ((r.code = c), r);
  return r;
}

/** Objeto "thenable" que imita una consulta de Mongoose con .populate() encadenado. */
function query(value) {
  return {
    populate: () => query(value),
    then: (resolve, reject) => Promise.resolve(value).then(resolve, reject),
  };
}

module.exports = { load, mockRes, withEnv, query, SRC };
