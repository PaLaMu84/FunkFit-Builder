const CACHE='funkfit-v0.7.4-alpha.17';
const ASSETS=[
  './',
  './index.html',
  './manifest.json?v=0.7.4a17',
  './css/app.css?v=0.7.4a17',
  './js/app.js?v=0.7.4a17',
  './data/exercises.json',
  './data/workoutTemplates.json',
  './data/bodyColors.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isAppFile =
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/js/app.js') ||
    url.pathname.endsWith('/css/app.css') ||
    url.pathname.endsWith('/manifest.json') ||
    url.pathname.endsWith('/data/exercises.json') ||
    url.pathname.endsWith('/data/workoutTemplates.json') ||
    url.pathname.endsWith('/data/bodyColors.json');

  if (isAppFile) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
