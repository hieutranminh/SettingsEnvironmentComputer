const CACHE_NAME = 'ahasoft-plus'
const OFFLINE_URL = '/offline.html'
const NETWORK_TIMEOUT_MS = 15000
const RETRY_DELAY_MS = 2000
const MAX_RETRIES = 2

/**
 * @description Fetch with timeout to prevent hanging on slow network startup
 * @param {Request} request
 * @param {number} timeoutMs
 * @returns {Promise<Response>}
 */
function fetchWithTimeout(request, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Network request timeout'))
    }, timeoutMs)

    fetch(request)
      .then((response) => {
        clearTimeout(timeoutId)
        resolve(response)
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}

/**
 * @description Retry fetch with delay between attempts
 * @param {Request} request
 * @param {number} retries
 * @param {number} delayMs
 * @returns {Promise<Response>}
 */
function fetchWithRetry(request, retries, delayMs) {
  return fetchWithTimeout(request, NETWORK_TIMEOUT_MS).catch((error) => {
    if (retries > 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fetchWithRetry(request, retries - 1, delayMs))
        }, delayMs)
      })
    }
    throw error
  })
}

/**
 * @description Ensure offline page is cached, re-fetch if missing
 * @returns {Promise<Response|undefined>}
 */
async function getOfflinePage() {
  const cache = await caches.open(CACHE_NAME)
  let cachedResponse = await cache.match(OFFLINE_URL)

  // If cache is missing (e.g., browser cleared cache), try to re-fetch and cache it
  if (!cachedResponse) {
    try {
      const response = await fetch(OFFLINE_URL)
      if (response.ok) {
        await cache.put(OFFLINE_URL, response.clone())
        cachedResponse = response
      }
    } catch (e) {
      // Cannot fetch offline page, return undefined
      return undefined
    }
  }

  return cachedResponse
}

self.addEventListener('install', function (event) {
  /**
   * @description Using an update service worker to change the file name
   */
  self.skipWaiting()

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([OFFLINE_URL])
    }),
  )
})

self.addEventListener('activate', (event) => {
  // Do NOT call clients.claim() immediately
  // This prevents race conditions on Edge browser during initial load
  // The service worker will only control pages after they are refreshed
  // Also ensure cache exists on activation
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Verify offline page is cached, re-add if missing
      const cachedOffline = await cache.match(OFFLINE_URL)
      if (!cachedOffline) {
        try {
          await cache.add(OFFLINE_URL)
        } catch (e) {
          // Silently fail if cannot fetch offline page during activation
        }
      }
    }),
  )
})

self.addEventListener('fetch', function (event) {
  // Only handle navigation requests
  // This prevents race conditions and blank screen issues on Edge browser
  if (event.request.mode !== 'navigate') {
    return
  }

  // Network-first strategy with retry mechanism
  // This helps handle slow network initialization after browser startup (especially on Edge)
  event.respondWith(
    fetchWithRetry(event.request, MAX_RETRIES, RETRY_DELAY_MS)
      .then((response) => {
        // Successful network response
        return response
      })
      .catch(async () => {
        // All retries failed, serve offline page if available
        const offlinePage = await getOfflinePage()
        if (offlinePage) {
          return offlinePage
        }
        // If offline page is not available, return a basic error response
        return new Response('Unable to connect. Please check your internet connection and try again.', {
          status:     503,
          statusText: 'Service Unavailable',
          headers:    new Headers({'Content-Type': 'text/plain'}),
        })
      }),
  )
})
