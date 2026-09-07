'use strict';

// Service worker mínimo para que la app sea instalable (PWA).
// Estrategia network-first para la navegación; cachea el shell básico.
var CACHE = 'igeogo-app-v1';
var SHELL = ['/app/', '/app/index.html', '/app/manifest.json', '/app/icon.svg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL).catch(function(){}); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  // Nunca cachear la API ni peticiones que no sean GET.
  if (e.request.method !== 'GET' || url.pathname.indexOf('/app/api') === 0) return;
  e.respondWith(
    fetch(e.request).catch(function () { return caches.match(e.request); })
  );
});
