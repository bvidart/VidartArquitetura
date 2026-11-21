// Service Worker — VA. Arquitetura & Interiores — Jornada de Descoberta v4
const CACHE_NAME = 'va-atelier-v4';

const SHELL_ASSETS = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './storage.js',
  './app.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './assets/va-ref-01.webp',
  './assets/va-ref-02.webp',
  './assets/va-ref-03.webp',
  './assets/va-ref-04.webp',
  './assets/va-ref-05.webp',
  './assets/va-ref-06.webp',
  './assets/va-ref-07.webp',
  './assets/va-ref-08.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    )
  );
  self.clients.claim();
});

function isShellRequest(request, url) {
  if (request.mode === 'navigate') return true;
  const dest = request.destination;
  if (dest === 'document' || dest === 'style' || dest === 'script') return true;
  return /\.(html|css|js|json)(\?.*)?$/i.test(url.pathname) || url.pathname === '/';
}

function isMediaOrFontRequest(request, url) {
  const dest = request.destination;
  if (dest === 'font' || dest === 'image') return true;
  return (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('images.unsplash.com') ||
    /\.(woff2?|ttf|otf|png|jpe?g|webp|svg)(\?.*)?$/i.test(url.pathname)
  );
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }
    throw err;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) return cached;
  const networkResponse = await networkPromise;
  if (networkResponse) return networkResponse;
  return Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (isShellRequest(request, url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isMediaOrFontRequest(request, url)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
