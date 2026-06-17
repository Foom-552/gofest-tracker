<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json" />
    
    <!-- Theme color for browser UI -->
    <meta name="theme-color" content="#E3350D" />
    
    <!-- Apple iOS specific tags -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="GO Fest '26" />
    <link rel="apple-touch-icon" href="/icon-192x192.png" />

    <title>GO Fest Global Tracker</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>

    <!-- Service Worker Registration -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch((err) => {
              console.error('ServiceWorker registration failed: ', err);
            });
        });
      }
    </script>
    
    <!-- If using Vite or Create React App, your built JS will be injected below automatically -->
  </body>
</html>
const CACHE_NAME = 'gofest-tracker-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  // Note: In a production build (like Vite or CRA), your JS and CSS bundle names 
  // are dynamically generated. Modern tools usually auto-inject these. 
  // If you are building manually, you would list your main JS/CSS files here.
];

// Install Event: Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// Activate Event: Clean up old caches if we update the CACHE_NAME
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache-First Strategy
// Perfect for spotty cell service. It checks the cache first. If the file is there, 
// it serves it instantly. If not, it tries the network.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }
      // Otherwise fetch from network
      return fetch(event.request).catch(() => {
        // Optional: Return a fallback offline page if network fails and not in cache
        console.warn('Network request failed and no cache available for: ', event.request.url);
      });
    })
  );
});
