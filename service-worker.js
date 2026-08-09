const CACHE='funkfit-v0.7.4-alpha.39';
const ASSETS=[
  './',
  './index.html',
  './manifest.json?v=0.7.4a39',
  './css/app.css?v=0.7.4a39',
  './js/app.js?v=0.7.4a39',
  './data/exercises.json',
  './data/workoutTemplates.json',
  './data/sharedGames.json?v=0.7.4-alpha.39',
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

  // sharedGames.json er versionskritisk. Hent frisk først; brug kun cache offline.
  if (url.pathname.endsWith('/data/sharedGames.json')) {
    event.respondWith(
      fetch(event.request, {cache:'no-store'})
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(async () =>
          (await caches.match(event.request)) ||
          (await caches.match('./data/sharedGames.json?v=0.7.4-alpha.39'))
        )
    );
    return;
  }

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
      fetch(event.request, {cache:'no-store'})
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
