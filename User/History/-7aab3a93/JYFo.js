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
  // Do NOT call clients.claim() immediately
  // This prevents race conditions on Edge browser during initial load
  // The service worker will only control pages after they are refreshed
  event.waitUntil(caches.open(CACHE_NAME))
})

self.addEventListener('fetch', function (event) {
  // Only handle navigation requests when offline
  // This prevents race conditions and blank screen issues on Edge browser
  if (event.request.mode !== 'navigate') {
    return
  }

  // Check if browser is online - if yes, let browser handle normally (no intercept)
  // Only intercept when offline to show cached offline page
  if (navigator.onLine) {
    return
  }

  event.respondWith(caches.match('/offline.html'))
})
