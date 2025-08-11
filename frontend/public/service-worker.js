const API_CACHE_NAME = 'surgevenger-api-v1';
const STATIC_CACHE_NAME = 'surgevenger-static-v1';

const urlsToCache = [
  '/',
  '/guest-view',
  '/status',
  '/patients',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

const isAuthRequest = (url) => {
  return (
    url.includes('clerk') ||
    url.includes('auth') ||
    url.includes('login') ||
    url.includes('logout') ||
    url.includes('session')
  );
};

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return Promise.all(
          urlsToCache.map((url) => {
            return cache.add(url).catch((err) => {
              console.warn(`Failed to cache ${url}:`, err);
            });
          })
        );
      }),
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('API cache ready for data');
      }),
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== API_CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (isAuthRequest(request.url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (
    request.url.includes('/patients') ||
    request.url.includes('/admin/statuses') ||
    request.url.includes('/api/patients')
  ) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin/')) {
    return;
  }

  event.respondWith(handleStaticRequest(request));
});

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      console.log(`Cached API response: ${request.url}`);
      return networkResponse;
    }

    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log(`Serving from cache: ${request.url}`);
      return cachedResponse;
    }

    return new Response(
      JSON.stringify({ error: 'Network error and no cache available' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.log(`Network failed for ${request.url}, trying cache...`);

    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log(`Serving from cache: ${request.url}`);
      return cachedResponse;
    }

    return new Response(
      JSON.stringify({
        error: 'Offline - no cached data available',
        offline: true,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    if (request.destination === 'document') {
      const cachedResponse = await caches.match('/');
      return cachedResponse || new Response('Offline', { status: 503 });
    }

    return new Response('Offline', { status: 503 });
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'patient-data-sync') {
    event.waitUntil(syncPatientData());
  }
});

async function syncPatientData() {
  const cache = await caches.open(API_CACHE_NAME);

  const endpointsToSync = [
    '/patients/anonymized',
    '/statuses',
    '/admin/patients',
  ];

  for (const endpoint of endpointsToSync) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        await cache.put(endpoint, response.clone());
        console.log(`Background synced: ${endpoint}`);
      }
    } catch (error) {
      console.log(`Background sync failed for ${endpoint}:`, error);
    }
  }
}
