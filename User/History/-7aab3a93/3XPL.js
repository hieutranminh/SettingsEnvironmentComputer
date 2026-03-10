const CACHE_NAME = 'ahasoft-plus'

self.addEventListener('install', function (event) {
  /**
   * @description Using an update service worker to change the file name
   */
  self.skipWaiting()

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      const offlinePage = '/offline.html'
      cache.addAll([offlinePage])
    }),
  )
})

self.addEventListener('activate', (event) => {
  // Use waitUntil to delay claiming clients until activation is complete
  // This prevents race conditions on Edge browser during initial load
  event.waitUntil(
    caches.open(CACHE_NAME).then(() => {
      return self.clients.claim()
    }),
  )
})

self.addEventListener('fetch', function (event) {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Return the network response if successful
          return response
        })
        .catch(() => {
          // Only return cached offline page when network fails
          const offlinePage = '/offline.html'
          return caches.match(offlinePage)
        }),
    )
  }
})
