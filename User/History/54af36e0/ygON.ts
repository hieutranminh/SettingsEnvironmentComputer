import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import { usePreset, definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import Material from '@primeuix/themes/material'
import Lara from '@primeuix/themes/lara'
import Nora from '@primeuix/themes/nora'

// Theme preset type
type ThemePresetType = typeof Aura | typeof Material | typeof Lara | typeof Nora

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

// Dark mode CSS selector
export const DARK_MODE_SELECTOR = '.app-dark'

interface ThemeConfig {
  preset: ThemePresetType
  options: {
    darkModeSelector: string
    cssLayer?: {
      name?: string
      order?: string
    }
  }
}

const getThemeConfig = (): ThemeConfig => {
  return {
    preset: Aura,
    options: {
      darkModeSelector: DARK_MODE_SELECTOR,
    },
  }
}

export function setupPrimeVue(app: App): void {
  app.use(PrimeVue, {
    theme: getThemeConfig(),
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

/**
 * Toggle dark mode by adding/removing the dark mode class
 * @param isDark - Whether to enable dark mode
 */
export function setDarkMode(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add('app-dark')
  } else {
    document.documentElement.classList.remove('app-dark')
  }
}
