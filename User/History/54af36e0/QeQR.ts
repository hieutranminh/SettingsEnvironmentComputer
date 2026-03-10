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

// Available surface colors for customization
export const SURFACE_COLORS = ['slate', 'gray', 'zinc', 'neutral', 'stone'] as const

export type SurfaceColorName = (typeof SURFACE_COLORS)[number]

// Tailwind color hex values for preview swatches (500 shade)
export const COLOR_HEX_MAP: Record<string, string> = {
  emerald: '#10b981',
  green: '#22c55e',
  lime: '#84cc16',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
  slate: '#64748b',
  gray: '#6b7280',
  zinc: '#71717a',
  neutral: '#737373',
  stone: '#78716c',
  custom: '#000000',
}

// Dark mode class selector
export const DARK_MODE_SELECTOR = '.app-dark'

// Theme preferences storage key
export const THEME_STORAGE_KEY = 'app-theme-preferences'

// Theme preferences interface
export interface ThemePreferences {
  preset: ThemePresetName
  primaryColor: PrimaryColorName
  customHexColor?: string // Hex color when primaryColor is 'custom'
  surfaceColor: SurfaceColorName
  darkMode: boolean
}

// Default theme preferences
export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  preset: 'aura',
  primaryColor: 'emerald',
  surfaceColor: 'slate',
  darkMode: false,
}

/**
 * Load theme preferences from localStorage
 * @returns Saved preferences or defaults
 */
export function loadThemePreferences(): ThemePreferences {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ThemePreferences>
      const result: ThemePreferences = { ...DEFAULT_THEME_PREFERENCES }

      // Validate preset
      if (parsed.preset && parsed.preset in THEME_PRESETS) {
        result.preset = parsed.preset
      }

      // Validate primary color
      if (parsed.primaryColor && PRIMARY_COLORS.includes(parsed.primaryColor)) {
        result.primaryColor = parsed.primaryColor
        // Validate custom hex color if using custom
        if (parsed.primaryColor === 'custom') {
          if (parsed.customHexColor && isValidHexColor(parsed.customHexColor)) {
            result.customHexColor = parsed.customHexColor
          } else {
            result.primaryColor = 'emerald' // Fall back if custom color is invalid
          }
        }
      }

      // Validate surface color
      if (parsed.surfaceColor && SURFACE_COLORS.includes(parsed.surfaceColor)) {
        result.surfaceColor = parsed.surfaceColor
      }

      // Validate dark mode
      if (typeof parsed.darkMode === 'boolean') {
        result.darkMode = parsed.darkMode
      }

      return result
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
 * Build surface color palette from color name
 */
function buildSurfacePalette(surfaceColor: SurfaceColorName): Record<string, string> {
  return {
    0: '#ffffff',
    50: `{${surfaceColor}.50}`,
    100: `{${surfaceColor}.100}`,
    200: `{${surfaceColor}.200}`,
    300: `{${surfaceColor}.300}`,
    400: `{${surfaceColor}.400}`,
    500: `{${surfaceColor}.500}`,
    600: `{${surfaceColor}.600}`,
    700: `{${surfaceColor}.700}`,
    800: `{${surfaceColor}.800}`,
    900: `{${surfaceColor}.900}`,
    950: `{${surfaceColor}.950}`,
  }
}

/**
 * Build colorScheme config for surface colors
 * Surface colors need to be defined in colorScheme.light and colorScheme.dark
 */
function buildColorSchemeConfig(surfaceColor: SurfaceColorName): Record<string, unknown> | null {
  if (surfaceColor !== 'slate') {
    const surfacePalette = buildSurfacePalette(surfaceColor)
    return {
      light: {
        surface: surfacePalette,
      },
      dark: {
        surface: surfacePalette,
      },
    }
  }
  return null // Use default slate
}

/**
 * Apply dark mode by toggling class on document element
 */
export function setDarkMode(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add('app-dark')
  } else {
    document.documentElement.classList.remove('app-dark')
  }
}

/**
 * Get initial theme config based on saved preferences
 */
const getInitialThemeConfig = (): { preset: unknown; options: { darkModeSelector: string } } => {
  const preferences = loadThemePreferences()
  const basePreset = THEME_PRESETS[preferences.preset]

  const options = {
    darkModeSelector: DARK_MODE_SELECTOR,
  }

  const primaryConfig = buildPrimaryColorConfig(
    preferences.primaryColor,
    preferences.customHexColor,
  )
  const colorSchemeConfig = buildColorSchemeConfig(preferences.surfaceColor)

  const semanticConfig: Record<string, unknown> = {}
  if (primaryConfig) {
    semanticConfig.primary = primaryConfig
  }
  if (colorSchemeConfig) {
    semanticConfig.colorScheme = colorSchemeConfig
  }

  if (Object.keys(semanticConfig).length > 0) {
    return {
      preset: definePreset(basePreset, {
        semantic: semanticConfig,
      }),
      options,
    }
  }

  return { preset: basePreset, options }
}

export function setupPrimeVue(app: App): void {
  const preferences = loadThemePreferences()

  app.use(PrimeVue, {
    theme: getInitialThemeConfig(),
  })

  // Apply dark mode on startup
  if (preferences.darkMode) {
    setDarkMode(true)
  }
}

/**
 * Update theme preset dynamically
 * @param presetName - Name of the preset (aura, material, lara, nora)
 * @param primaryColor - Primary color name or 'custom'
 * @param customHexColor - Hex color when primaryColor is 'custom'
 * @param surfaceColor - Surface color name
 */
export function updateThemePreset(
  presetName: ThemePresetName,
  primaryColor?: PrimaryColorName,
  customHexColor?: string,
  surfaceColor?: SurfaceColorName,
): void {
  const basePreset = THEME_PRESETS[presetName]

  const primaryConfig = primaryColor ? buildPrimaryColorConfig(primaryColor, customHexColor) : null
  const colorSchemeConfig = surfaceColor ? buildColorSchemeConfig(surfaceColor) : null

  const semanticConfig: Record<string, unknown> = {}
  if (primaryConfig) {
    semanticConfig.primary = primaryConfig
  }
  if (colorSchemeConfig) {
    semanticConfig.colorScheme = colorSchemeConfig
  }

  if (Object.keys(semanticConfig).length > 0) {
    const customPreset = definePreset(basePreset, {
      semantic: semanticConfig,
    })
    usePreset(customPreset)
  } else {
    usePreset(basePreset)
  }
}
