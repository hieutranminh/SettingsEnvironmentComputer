// services/fontService.ts
import { jsPDF } from 'jspdf'

import { FONT_CONFIG, type FontConfig } from '@/config/fonts'

// ================================
// FUNCTIONAL APPROACH
// ================================

// State management
let isInitialized = false
let initPromise: Promise<void> | null = null

// Core utilities
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

const addFontToJsPDF = (fontConfig: FontConfig, base64Font: string): void => {
  const fileName = `${fontConfig.name}.ttf`

  // Add to VFS
  jsPDF.API.addFileToVFS(fileName, base64Font)

  // Register font
  jsPDF.API.addFont(fileName, fontConfig.name, fontConfig.weight)
}

// Font loading functions
const loadSingleFont = async (fontConfig: FontConfig): Promise<void> => {
  try {
    const response = await fetch(fontConfig.path)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const fontData = await response.arrayBuffer()
    const base64Font = arrayBufferToBase64(fontData)
    addFontToJsPDF(fontConfig, base64Font)
  } catch (error) {
    console.error(`Failed to load font ${fontConfig.name}:`, error)
    // Don't throw - allow other fonts to load
  }
}

const loadAllFonts = async (): Promise<void> => {
  const loadPromises = FONT_CONFIG.map(loadSingleFont)
  await Promise.all(loadPromises)
}

// Public API
export const initializeFonts = async (): Promise<void> => {
  if (isInitialized) {
    return Promise.resolve()
  }

  if (initPromise) {
    return initPromise
  }

  initPromise = loadAllFonts()
  await initPromise
  isInitialized = true
}

export const isFontsInitialized = (): boolean => isInitialized

// ================================
// ENHANCED FUNCTIONAL VERSION
// ================================

// With better composition and error handling
type FontLoadResult = {
  success: boolean
  fontName: string
  error?: string
}

const createFontLoader = (fontConfig: FontConfig) => async (): Promise<FontLoadResult> => {
  try {
    const response = await fetch(fontConfig.path)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const fontData = await response.arrayBuffer()
    const base64Font = arrayBufferToBase64(fontData)
    addFontToJsPDF(fontConfig, base64Font)

    return {
      success: true,
      fontName: fontConfig.name,
    }
  } catch (error) {
    return {
      success: false,
      fontName: fontConfig.name,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const initializeFontsWithResults = async (): Promise<FontLoadResult[]> => {
  if (isInitialized) {
    return []
  }

  const fontLoaders = FONT_CONFIG.map(createFontLoader)
  const results = await Promise.all(fontLoaders.map((loader) => loader()))

  const failedFonts = results.filter((r) => !r.success)
  if (failedFonts.length > 0) {
    console.warn('Some fonts failed to load:', failedFonts)
  }

  isInitialized = true
  return results
}
