import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import { usePreset, definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import Material from '@primeuix/themes/material'
import Lara from '@primeuix/themes/lara'
import Nora from '@primeuix/themes/nora'

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
] as const

export type PrimaryColorName = (typeof PRIMARY_COLORS)[number]

// Theme preferences storage key
export const THEME_STORAGE_KEY = 'app-theme-preferences'

// Theme preferences interface
export interface ThemePreferences {
  preset: ThemePresetName
  primaryColor: PrimaryColorName
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
 * Get initial theme config based on saved preferences
 */
const getInitialThemeConfig = (): { preset: unknown } => {
  const preferences = loadThemePreferences()
  const basePreset = THEME_PRESETS[preferences.preset]

  if (preferences.primaryColor && preferences.primaryColor !== 'emerald') {
    return {
      preset: definePreset(basePreset, {
        semantic: {
          primary: {
            50: `{${preferences.primaryColor}.50}`,
            100: `{${preferences.primaryColor}.100}`,
            200: `{${preferences.primaryColor}.200}`,
            300: `{${preferences.primaryColor}.300}`,
            400: `{${preferences.primaryColor}.400}`,
            500: `{${preferences.primaryColor}.500}`,
            600: `{${preferences.primaryColor}.600}`,
            700: `{${preferences.primaryColor}.700}`,
            800: `{${preferences.primaryColor}.800}`,
            900: `{${preferences.primaryColor}.900}`,
            950: `{${preferences.primaryColor}.950}`,
          },
        },
      }),
    }
  }

  return { preset: basePreset }
}

export function setupPrimeVue(app: App): void {
  app.use(PrimeVue, {
    theme: getInitialThemeConfig(),
  })
}

/**
 * Update theme preset dynamically
 * @param presetName - Name of the preset (aura, material, lara, nora)
 * @param primaryColor - Optional primary color to apply
 */
export function updateThemePreset(
  presetName: ThemePresetName,
  primaryColor?: PrimaryColorName,
): void {
  const basePreset = THEME_PRESETS[presetName]

  if (primaryColor) {
    const customPreset = definePreset(basePreset, {
      semantic: {
        primary: {
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
        },
      },
    })
    usePreset(customPreset)
  } else {
    usePreset(basePreset)
  }
}
