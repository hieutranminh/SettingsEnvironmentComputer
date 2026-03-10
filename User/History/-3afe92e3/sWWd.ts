import { GRADIENTS, SPACE_BETWEEN_ALIGNMENT } from './constants'

// Specific dialog header gradients for different dialog types
export const dialogThemes = {
  default: GRADIENTS.teal,
  alert: GRADIENTS.red,
  success: GRADIENTS.green,
  warning: GRADIENTS.amber,
  info: GRADIENTS.blue,
} as const

// Helper function to create dialog PT with specific theme
export const createDialogPT = (
  theme: keyof typeof dialogThemes = 'default',
  footerAlignment: 'center' | 'left' | 'right' | 'space-between' = 'center',
): Record<string, unknown> => ({
  root: {
    style: {
      width: '700px',
      maxWidth: '95vw',
      margin: '0 auto',
    },
    class: 'responsive-dialog-root',
  },
  header: {
    style: {
      background: dialogThemes[theme],
      color: 'white',
      borderRadius: '11px 11px 0 0',
      padding: '4px 8px 4px 16px',
      margin: '-1.5px -.9px 16px -.8px',
    },
  },
  title: {
    style: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'white',
    },
  },
  closeButton: {
    style: {
      color: 'white',
    },
  },
  content: {
    style: {
      // The code affects the UI of the print section
      // maxHeight: 'calc(90vh - 140px)', // Account for header and footer
      // height: 'auto',
      // overflowY: 'auto',
      // padding: '15px',
    },
    class: 'responsive-dialog-content',
  },
  footer: {
    style: {
      display: 'flex',
      justifyContent: footerAlignment,
      alignItems: 'center',
      gap: '8px',
      padding: '16px 20px',
    },
  },
})

// Pre-made dialog PT configs for easy use
export const dialogPTConfigs = {
  default: createDialogPT('default'),
  alert: createDialogPT('alert'),
  success: createDialogPT('success'),
  warning: createDialogPT('warning'),
  info: createDialogPT('info'),

  // Configs with different footer alignments
  defaultRight: createDialogPT('default', 'right'),
  alertRight: createDialogPT('alert', 'right'),
  successRight: createDialogPT('success', 'right'),
  warningRight: createDialogPT('warning', 'right'),
  infoRight: createDialogPT('info', 'right'),

  defaultSpaceBetween: createDialogPT('default', SPACE_BETWEEN_ALIGNMENT),
  alertSpaceBetween: createDialogPT('alert', SPACE_BETWEEN_ALIGNMENT),
  successSpaceBetween: createDialogPT('success', SPACE_BETWEEN_ALIGNMENT),
  warningSpaceBetween: createDialogPT('warning', SPACE_BETWEEN_ALIGNMENT),
  infoSpaceBetween: createDialogPT('info', SPACE_BETWEEN_ALIGNMENT),
}

// Essential dialog overrides only - inherit PrimeVue defaults
export const dialogOverrides = {
  '.responsive-dialog-root': {
    width: '700px',
    maxWidth: '95vw',
  },

  // Mobile responsive
  '@media screen and (max-width: 768px)': {
    '.responsive-dialog-root': {
      width: '100%',
    },
  },
}
