const CACHE_NAME = 'parknote-runtime-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([
        '/',
        '/index.html',
        '/manifest.webmanifest',
      ]);
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k === CACHE_NAME ? Promise.resolve() : caches.delete(k)))
      );
      self.clients.claim();
    })()
  );
});

// Cache-first for same-origin GET requests, with runtime add to cache.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Handle navigation requests (SPA shell)
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('/index.html');
        try {
          const fresh = await fetch(req);
          // Cache a copy of fresh index for future offline
          cache.put('/index.html', fresh.clone());
          return fresh;
        } catch (_) {
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // Only cache same-origin assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const fresh = await fetch(req);
          // Cache JS/CSS/PNG/SVG/WEBP/WASM/etc.
          cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          return cached || Response.error();
        }
      })()
    );
  }
});
