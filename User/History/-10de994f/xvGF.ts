import { jsPDF } from 'jspdf'

// Import font files
import NanumGothicRegular from '../fonts/NanumGothic-Regular-normal.js'
import NanumGothicBold from '../fonts/NanumGothic-Bold-bold.js'

export interface FontConfig {
  name: string
  style: 'normal' | 'bold' | 'italic' | 'bolditalic'
  weight: 'normal' | 'bold'
  file: any // Font file content
}

export const AVAILABLE_FONTS: FontConfig[] = [
  {
    name: 'NanumGothic',
    style: 'normal',
    weight: 'normal',
    file: NanumGothicRegular,
  },
  {
    name: 'NanumGothic',
    style: 'bold',
    weight: 'bold',
    file: NanumGothicBold,
  },
]

/**
 * Add fonts to jsPDF document
 * @param doc - jsPDF document instance
 * @param fonts - Array of font configurations to add
 */
export const addFontsToDocument = (doc: jsPDF, fonts: FontConfig[] = AVAILABLE_FONTS): void => {
  fonts.forEach((font) => {
    try {
      doc.addFont(font.file, font.name, font.style)
      console.log(`Font ${font.name} (${font.style}) added successfully`)
    } catch (error) {
      console.warn(`Failed to add font ${font.name} (${font.style}):`, error)
    }
  })
}

/**
 * Set font with fallback options
 * @param doc - jsPDF document instance
 * @param fontName - Primary font name
 * @param fontStyle - Font style
 * @param fallbackFont - Fallback font name (default: 'helvetica')
 */
export const setFontWithFallback = (
  doc: jsPDF,
  fontName: string,
  fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal',
  fallbackFont: string = 'helvetica',
): void => {
  try {
    // Check if font is available
    const availableFonts = doc.getFontList()
    const fontKey = `${fontName}-${fontStyle}`

    if (availableFonts[fontKey]) {
      doc.setFont(fontName, fontStyle)
    } else {
      console.warn(`Font ${fontKey} not available, using fallback: ${fallbackFont}`)
      doc.setFont(fallbackFont, fontStyle)
    }
  } catch (error) {
    console.warn(`Error setting font ${fontName}:`, error)
    doc.setFont(fallbackFont, fontStyle)
  }
}

/**
 * Get available fonts in the document
 * @param doc - jsPDF document instance
 * @returns Object with available fonts
 */
export const getAvailableFonts = (doc: jsPDF): Record<string, any> => {
  return doc.getFontList()
}

/**
 * Check if a specific font is available
 * @param doc - jsPDF document instance
 * @param fontName - Font name to check
 * @param fontStyle - Font style to check
 * @returns Boolean indicating if font is available
 */
export const isFontAvailable = (
  doc: jsPDF,
  fontName: string,
  fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal',
): boolean => {
  try {
    const availableFonts = doc.getFontList()
    const fontKey = `${fontName}-${fontStyle}`
    return !!availableFonts[fontKey]
  } catch (error) {
    return false
  }
}
