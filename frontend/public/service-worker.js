const CACHE_NAME = 'surgevenger-v1';
const API_CACHE_NAME = 'surgevenger-api-v1';

const urlsToCache = [
  '/',
  '/guest-view',
  '/status',
  '/patients',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell');
      return Promise.all(
        urlsToCache.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn(`Failed to cache ${url}:`, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.url.includes('/patients/anonymized')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => null);

          if (cachedResponse) {
            fetchPromise;
            return cachedResponse;
          }

          return (
            fetchPromise ||
            new Response(JSON.stringify([]), {
              headers: { 'Content-Type': 'application/json' },
            })
          );
        });
      })
    );
    return;
  }

  if (
    request.url.includes('/api/') ||
    request.url.includes('/admin/') ||
    request.url.includes('/statuses')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return (
              cachedResponse ||
              new Response(JSON.stringify({ error: 'Offline' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              })
            );
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request).catch(() => {
          if (request.destination === 'document') {
            return caches.match('/');
          }
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
  }
});
