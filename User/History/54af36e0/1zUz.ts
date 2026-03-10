import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import { usePreset, definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import Material from '@primeuix/themes/material'
import Lara from '@primeuix/themes/lara'
import Nora from '@primeuix/themes/nora'
import { generateColorPalette, isValidHexColor, type ColorPalette } from '@/utils/colorUtils'

// Available theme presets
export const THEME_PRESETS = {
  aura: Aura,
  material: Material,
  lara: Lara,
  nora: Nora,
} as const

export type ThemePresetName = keyof typeof THEME_PRESETS

// Available primary colors for customization
export const PRIMARY_COLORS = [
  'emerald',
  'green',
  'lime',
  'red',
  'orange',
  'amber',
  'yellow',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'custom', // Special value for custom hex color
] as const

export type PrimaryColorName = (typeof PRIMARY_COLORS)[number]

// Theme preferences storage key
export const THEME_STORAGE_KEY = 'app-theme-preferences'

// Theme preferences interface
export interface ThemePreferences {
  preset: ThemePresetName
  primaryColor: PrimaryColorName
  customHexColor?: string // Hex color when primaryColor is 'custom'
}

// Default theme preferences
export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  preset: 'aura',
  primaryColor: 'emerald',
}

/**
 * Load theme preferences from localStorage
 * @returns Saved preferences or defaults
 */
export function loadThemePreferences(): ThemePreferences {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as ThemePreferences
      // Validate that preset and primaryColor are valid
      if (parsed.preset in THEME_PRESETS && PRIMARY_COLORS.includes(parsed.primaryColor)) {
        // Validate custom hex color if using custom
        if (parsed.primaryColor === 'custom') {
          if (parsed.customHexColor && isValidHexColor(parsed.customHexColor)) {
            return parsed
          }
          // Invalid custom color, fall back to default
          return { ...DEFAULT_THEME_PREFERENCES }
        }
        return parsed
      }
    }
  } catch {
    // Ignore parse errors, return defaults
  }
  return { ...DEFAULT_THEME_PREFERENCES }
}

/**
 * Save theme preferences to localStorage
 */
export function saveThemePreferences(preferences: ThemePreferences): void {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences))
}

/**
 * Build primary color config from color name or custom palette
 */
function buildPrimaryColorConfig(
  primaryColor: PrimaryColorName,
  customHexColor?: string,
): Record<string, string> | null {
  if (primaryColor === 'custom' && customHexColor && isValidHexColor(customHexColor)) {
    const palette: ColorPalette = generateColorPalette(customHexColor)
    return {
      50: palette[50],
      100: palette[100],
      200: palette[200],
      300: palette[300],
      400: palette[400],
      500: palette[500],
      600: palette[600],
      700: palette[700],
      800: palette[800],
      900: palette[900],
      950: palette[950],
    }
  }

  if (primaryColor !== 'emerald' && primaryColor !== 'custom') {
    return {
      50: `{${primaryColor}.50}`,
      100: `{${primaryColor}.100}`,
      200: `{${primaryColor}.200}`,
      300: `{${primaryColor}.300}`,
      400: `{${primaryColor}.400}`,
      500: `{${primaryColor}.500}`,
      600: `{${primaryColor}.600}`,
      700: `{${primaryColor}.700}`,
      800: `{${primaryColor}.800}`,
      900: `{${primaryColor}.900}`,
      950: `{${primaryColor}.950}`,
    }
  }

  return null // Use default emerald
}

/**
 * Get initial theme config based on saved preferences
 */
const getInitialThemeConfig = (): { preset: unknown; options: { darkModeSelector: string } } => {
  const preferences = loadThemePreferences()
  const basePreset = THEME_PRESETS[preferences.preset]

  const options = {
    darkModeSelector: 'none', // Disable dark mode completely
  }

  const primaryConfig = buildPrimaryColorConfig(
    preferences.primaryColor,
    preferences.customHexColor,
  )

  if (primaryConfig) {
    return {
      preset: definePreset(basePreset, {
        semantic: {
          primary: primaryConfig,
        },
      }),
      options,
    }
  }

  return { preset: basePreset, options }
}

export function setupPrimeVue(app: App): void {
  app.use(PrimeVue, {
    theme: getInitialThemeConfig(),
  })
}

/**
 * Update theme preset dynamically
 * @param presetName - Name of the preset (aura, material, lara, nora)
 * @param primaryColor - Primary color name or 'custom'
 * @param customHexColor - Hex color when primaryColor is 'custom'
 */
export function updateThemePreset(
  presetName: ThemePresetName,
  primaryColor?: PrimaryColorName,
  customHexColor?: string,
): void {
  const basePreset = THEME_PRESETS[presetName]

  const primaryConfig = primaryColor ? buildPrimaryColorConfig(primaryColor, customHexColor) : null

  if (primaryConfig) {
    const customPreset = definePreset(basePreset, {
      semantic: {
        primary: primaryConfig,
      },
    })
    usePreset(customPreset)
  } else {
    usePreset(basePreset)
  }
}
