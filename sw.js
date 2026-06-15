const CACHE_NAME = 'karma-farmer-v1';
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
  'manifest.json'
];

self.addEventListener('install', (e) => {
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
