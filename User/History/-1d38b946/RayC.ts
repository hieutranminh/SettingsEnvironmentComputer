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
 * For backward compatibility - non-blocking font initialization
 */
export const initializeFonts = (): void => {
  // Fire and forget - don't block app startup
  loadFonts()
}

// Auto-initialize fonts when module loads (non-blocking)
if (typeof window !== 'undefined') {
  initializeFonts()
}
