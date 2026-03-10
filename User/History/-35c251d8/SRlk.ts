import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

// Custom preset based on Aura with customizations
export const CustomPreset = definePreset(Aura, {
  semantic: {
    // Customize primary color palette (using blue instead of emerald)
    primary: {
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

    // Customize surface colors for different color schemes
    colorScheme: {
      light: {
        // Light mode surface colors
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
        // Customize form field hover behavior
        formField: {
          hoverBorderColor: '{primary.color}',
        },
      },
      dark: {
        // Dark mode surface colors
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}',
        },
        formField: {
          hoverBorderColor: '{primary.color}',
        },
      },
    },

    // Customize focus ring
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '1px',
    },
  },

  // Component-specific customizations
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            borderRadius: '8px',
            paddingX: '18px',
            paddingY: '18px',
          },
        },
        dark: {
          root: {
            borderRadius: '8px',
          },
        },
      },
    },
    card: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            color: '{surface.700}',
            borderRadius: '12px',
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
        dark: {
          root: {
            background: '{surface.900}',
            color: '{surface.0}',
            borderRadius: '12px',
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
  },
})
