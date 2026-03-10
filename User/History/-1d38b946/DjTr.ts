import type { jsPDF } from 'jspdf'

// Font configuration type
interface FontConfig {
  name: string
  style: 'normal' | 'bold' | 'italic' | 'bolditalic'
  src: string
}

// Font registry
const FONT_CONFIGS: FontConfig[] = [
  {
    name: 'NanumGothic-Regular',
    style: 'normal',
    src: '/fonts/NanumGothic-Regular-normal.js',
  },
  {
    name: 'NanumGothic-ExtraBold',
    style: 'bold',
    src: '/fonts/NanumGothic-ExtraBold-bold.js',
  },
]

// Font constants
export const FONTS = {
  REGULAR: 'NanumGothic-Regular',
  BOLD: 'NanumGothic-ExtraBold',
} as const

// Track loaded fonts to avoid duplicate loading
const loadedFonts = new Set<string>()

/**
 * Dynamically loads a font script
 */
const loadFontScript = async (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (loadedFonts.has(src)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      loadedFonts.add(src)
      resolve()
    }
    script.onerror = () => reject(new Error(`Failed to load font: ${src}`))

    document.head.appendChild(script)
  })
}

/**
 * Loads all required fonts for PDF generation
 */
export const loadRequiredFonts = async (): Promise<void> => {
  try {
    const loadPromises = FONT_CONFIGS.map((font) => loadFontScript(font.src))
    await Promise.all(loadPromises)
    console.log('All fonts loaded successfully')
  } catch (error) {
    console.error('Font loading failed:', error)
    throw error
  }
}

/**
 * Ensures fonts are loaded before PDF operations
 */
export const withFontsLoaded = async <T>(operation: () => Promise<T>): Promise<T> => {
  await loadRequiredFonts()
  return operation()
}

/**
 * Alternative: Load fonts with base64 encoding (if you have font files)
 */
export const loadFontsFromBase64 = (pdf: jsPDF): void => {
  // Example implementation if you have base64 font data
  // This avoids external script loading entirely

  // pdf.addFileToVFS('NanumGothic-Regular.ttf', base64FontData)
  // pdf.addFont('NanumGothic-Regular.ttf', 'NanumGothic-Regular', 'normal')

  // For now, just ensure fonts are available
  try {
    pdf.setFont(FONTS.REGULAR, 'normal')
    pdf.setFont(FONTS.BOLD, 'bold')
  } catch (error) {
    console.warn('Custom fonts not available, falling back to default', error)
    // Fallback to default fonts
    pdf.setFont('helvetica', 'normal')
  }
}

/**
 * Safe font setter with fallback
 */
export const setFontSafely = (
  pdf: jsPDF,
  fontName: string,
  fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal',
): void => {
  try {
    pdf.setFont(fontName, fontStyle)
  } catch (error) {
    console.warn(`Font ${fontName} not available, using fallback`, error)
    // Fallback to built-in fonts
    const fallbackFont = fontStyle === 'bold' ? 'helvetica' : 'helvetica'
    pdf.setFont(fallbackFont, fontStyle)
  }
}

/**
 * Font utility for consistent font usage across PDF
 */
export const createFontUtils = (pdf: jsPDF) => ({
  setRegular: () => setFontSafely(pdf, FONTS.REGULAR, 'normal'),
  setBold: () => setFontSafely(pdf, FONTS.BOLD, 'bold'),
  setTitle: (size = 28) => {
    setFontSafely(pdf, FONTS.BOLD, 'bold')
    pdf.setFontSize(size)
  },
  setSubtitle: (size = 14) => {
    setFontSafely(pdf, FONTS.REGULAR, 'normal')
    pdf.setFontSize(size)
  },
  setBody: (size = 12) => {
    setFontSafely(pdf, FONTS.REGULAR, 'normal')
    pdf.setFontSize(size)
  },
})

/**
 * Preload fonts when module is imported (optional)
 */
let fontsInitialized = false
export const initializeFonts = async (): Promise<boolean> => {
  if (fontsInitialized) return true

  try {
    await loadRequiredFonts()
    fontsInitialized = true
    return true
  } catch (error) {
    console.error('Font initialization failed:', error)
    return false
  }
}
