const CACHE_NAME = 'karma-farmer-v3';
const ASSETS = [
  'index.html',
  'css/base.css',
  'css/layout.css',
  'css/components.css',
  'css/animations.css',
  'css/autofill.css',
  'js/config.js',
  'js/prompt.js',
  'js/api.js',
  'js/ui.js',
  'js/autofill.js',
  'js/app.js',
  'icon.svg',
  'icon.png',
  'manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force active activation
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Claim active clients immediately
});

self.addEventListener('fetch', (e) => {
  // Exclude Gemini API calls from cache
  if (e.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
