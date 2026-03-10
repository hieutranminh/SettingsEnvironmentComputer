import { updatePreset, updatePrimaryPalette, updateSurfacePalette, $dt } from '@primeuix/themes'

// Predefined color palettes
export const colorPalettes = {
  blue: {
    50: '{blue.50}',
    100: '{blue.100}',
    200: '{blue.200}',
    300: '{blue.300}',
    400: '{blue.400}',
    500: '{blue.500}',
    600: '{blue.600}',
    700: '{blue.700}',
    800: '{blue.800}',
    900: '{blue.900}',
    950: '{blue.950}',
  },
  emerald: {
    50: '{emerald.50}',
    100: '{emerald.100}',
    200: '{emerald.200}',
    300: '{emerald.300}',
    400: '{emerald.400}',
    500: '{emerald.500}',
    600: '{emerald.600}',
    700: '{emerald.700}',
    800: '{emerald.800}',
    900: '{emerald.900}',
    950: '{emerald.950}',
  },
  purple: {
    50: '{purple.50}',
    100: '{purple.100}',
    200: '{purple.200}',
    300: '{purple.300}',
    400: '{purple.400}',
    500: '{purple.500}',
    600: '{purple.600}',
    700: '{purple.700}',
    800: '{purple.800}',
    900: '{purple.900}',
    950: '{purple.950}',
  },
  rose: {
    50: '{rose.50}',
    100: '{rose.100}',
    200: '{rose.200}',
    300: '{rose.300}',
    400: '{rose.400}',
    500: '{rose.500}',
    600: '{rose.600}',
    700: '{rose.700}',
    800: '{rose.800}',
    900: '{rose.900}',
    950: '{rose.950}',
  },
}

// Change primary color theme
export const changePrimaryColor = (colorName: keyof typeof colorPalettes): void => {
  updatePrimaryPalette(colorPalettes[colorName])
}

// Change surface colors
export const changeSurfaceTheme = (lightSurface: string, darkSurface: string): void => {
  updateSurfacePalette({
    50: `{${lightSurface}.50}`,
    100: `{${lightSurface}.100}`,
    200: `{${lightSurface}.200}`,
    300: `{${lightSurface}.300}`,
    400: `{${lightSurface}.400}`,
    500: `{${lightSurface}.500}`,
    600: `{${lightSurface}.600}`,
    700: `{${lightSurface}.700}`,
    800: `{${lightSurface}.800}`,
    900: `{${lightSurface}.900}`,
    950: `{${lightSurface}.950}`,
  })
}

// Apply preset theme variations
export const applyThemeVariation = (variation: 'default' | 'compact' | 'material'): void => {
  switch (variation) {
    case 'compact':
      updatePreset({
        semantic: {
          focusRing: {
            width: '1px',
            offset: '0px',
          },
        },
        components: {
          button: {
            colorScheme: {
              light: {
                root: {
                  borderRadius: '4px',
                  paddingX: '0.75rem',
                  paddingY: '0.5rem',
                },
              },
              dark: {
                root: {
                  borderRadius: '4px',
                  paddingX: '0.75rem',
                  paddingY: '0.5rem',
                },
              },
            },
          },
        },
      })
      break

    case 'material':
      updatePreset({
        semantic: {
          focusRing: {
            width: '2px',
            style: 'solid',
            offset: '2px',
          },
        },
        components: {
          button: {
            colorScheme: {
              light: {
                root: {
                  borderRadius: '4px',
                },
              },
              dark: {
                root: {
                  borderRadius: '4px',
                },
              },
            },
          },
        },
      })
      break

    default:
      // Default theme - reset to base
      break
  }
}

// Get design token value
export const getDesignToken = (tokenPath: string): unknown => {
  return $dt(tokenPath)
}
