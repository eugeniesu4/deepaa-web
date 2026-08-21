// DeepAA Web 2.3: disable the old service worker proxy.
// The previous version redirected model/assets to raw.githubusercontent.com,
// which could leave Chrome with stale/broken resources.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    await self.registration.unregister();
  })());
});