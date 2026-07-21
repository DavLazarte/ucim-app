const CACHE_NAME = 'ucim-pwa-cache-v3';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/logo.webp'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Ignorar las llamadas a la API (Next.js backend proxy o Laravel)
  // No queremos cachear esto porque necesitamos que muestre siempre info en tiempo real (deuda, perfil)
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api') || url.hostname.includes('ucim.test') || url.hostname.includes('ucim.devsign.ar')) {
    return;
  }

  // Stale-While-Revalidate para el frontend (sirve de la caché rápido, pero la actualiza en background)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Solo guardamos en caché si la respuesta es válida
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Fallback offline: Si falla la red y no estaba en caché
        });

        // Retornamos la respuesta rápida desde caché si existe, sino esperamos a la de red
        return cachedResponse || fetchPromise;
      });
    })
  );
});
