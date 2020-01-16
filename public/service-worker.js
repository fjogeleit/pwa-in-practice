workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.core.setCacheNameDetails({ prefix: 'pwa-in-practice' });

workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// use the cache api for ressources like images, pdfs, audio for better performance
workbox.routing.registerRoute(
  new RegExp('https://i.picsum.photos/(.*)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 3 * 24 * 60 * 60
      })
    ]
  })
);

// cache external layout ressources like fonts
workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'googleapis',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 3 * 24 * 60 * 60
      })
    ]
  })
);

// cache current user page to stay authorized while offline
workbox.routing.registerRoute(
  new RegExp('/user/current'),
  new workbox.strategies.NetworkFirst()
);
