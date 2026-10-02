'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const CONFIG = path.join(__dirname, '..', 'src', 'config');

// Proceso hijo: config evalúa APP_SECRET al cargarse y puede lanzar.
function loadConfig(env) {
  const code = `const c=require(${JSON.stringify(CONFIG)});console.log([c.devLike,c.jwtSecret.slice(0,6),c.whatsapp.templateLang].join('|'))`;
  try {
    const out = execFileSync('node', ['-e', code], {
      cwd: os.tmpdir(), // sin .env
      env: { PATH: process.env.PATH, HOME: process.env.HOME, ...env },
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { ok: true, out: out.trim() };
  } catch (e) {
    return { ok: false, out: `${e.stderr || ''}${e.stdout || ''}` };
  }
}

test('sin NODE_ENV y sin APP_SECRET la app no arranca (seguro por defecto)', () => {
  const r = loadConfig({});
  assert.equal(r.ok, false);
  assert.match(r.out, /APP_SECRET/);
});

test('producción sin APP_SECRET no arranca', () => {
  const r = loadConfig({ NODE_ENV: 'production' });
  assert.equal(r.ok, false);
  assert.match(r.out, /FATAL/);
});

test('NODE_ENV=development sin APP_SECRET usa el secreto de desarrollo', () => {
  const r = loadConfig({ NODE_ENV: 'development' });
  assert.equal(r.ok, true);
  assert.match(r.out, /^true\|igeogo\|/);
});

test('NODE_ENV=test sin APP_SECRET también arranca', () => {
  assert.equal(loadConfig({ NODE_ENV: 'test' }).ok, true);
});

test('con APP_SECRET se usa tal cual y el idioma de plantilla por defecto es es_CO', () => {
  const r = loadConfig({ NODE_ENV: 'production', APP_SECRET: 'abc123def456' });
  assert.equal(r.out, 'false|abc123|es_CO');
});

test('WHATSAPP_TEMPLATE_LANG sobreescribe el idioma', () => {
  const r = loadConfig({ NODE_ENV: 'production', APP_SECRET: 'x', WHATSAPP_TEMPLATE_LANG: 'es' });
  assert.ok(r.out.endsWith('|es'));
});

test('ADMIN_API_KEY ya no sirve de secreto de sesión', () => {
  const r = loadConfig({ NODE_ENV: 'production', ADMIN_API_KEY: 'solo-admin' });
  assert.equal(r.ok, false);
});
