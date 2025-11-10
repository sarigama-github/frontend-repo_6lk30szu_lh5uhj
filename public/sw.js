self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('parknote-v1').then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/manifest.webmanifest',
    ]))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
