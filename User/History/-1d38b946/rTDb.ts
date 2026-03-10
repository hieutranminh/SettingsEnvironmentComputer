// Track font loading status
let fontsLoadingPromise: Promise<void> | null = null
let fontsLoaded = false

/**
 * Create font files like this and import them as modules
 */
const loadFontModules = async (): Promise<void> => {
  await Promise.all([
    import('@/utils/fonts/NanumGothic-Regular-normal'),
    import('@/utils/fonts/NanumGothic-ExtraBold-bold'),
  ])
}

/**
 * Main font loading function with multiple strategies
 */
export const loadFonts = async (): Promise<boolean> => {
  if (fontsLoaded) return true

  if (fontsLoadingPromise) {
    await fontsLoadingPromise
    return fontsLoaded
  }

  fontsLoadingPromise = (async (): Promise<void> => {
    try {
      await loadFontModules()
      fontsLoaded = true
    } catch {
      fontsLoaded = false
    }
  })()

  await fontsLoadingPromise
  return fontsLoaded
}

/**
 * Simple approach: Just ensure fonts work without blocking
 */
export const ensureFontsReady = async (): Promise<void> => {
  await loadFonts()
}

/**
 * Synchronous font check for PDF generation
 * @returns True if fonts are loaded and ready
 */
export const areFontsReady = (): boolean => {
  return fontsLoaded
}

/**
 * Wait for fonts to be ready with timeout
 * @param timeoutMs - Maximum time to wait in milliseconds
 * @returns Promise that resolves when fonts are ready
 */
const DEFAULT_TIMEOUT = 5000
const POLL_INTERVAL = 100

export const waitForFonts = async (timeoutMs: number = DEFAULT_TIMEOUT): Promise<boolean> => {
  const startTime = Date.now()
  const timeout = timeoutMs || DEFAULT_TIMEOUT

  while (!fontsLoaded && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
  }

  return fontsLoaded
}

/**
 * For backward compatibility - non-blocking font initialization
 */
export const initializeFonts = (): void => {
  loadFonts()
}

// Auto-initialize fonts when module loads (non-blocking)
if (typeof window !== 'undefined') {
  initializeFonts()
}
