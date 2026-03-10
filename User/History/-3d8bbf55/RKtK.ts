import { DEFAULT_PRINT_CONFIG } from '@/constants/print-preview.constants'
import type { PrintHeaderConfig, PrintPageConfig, PrintPreviewConfig } from '@/types/print-preview.types'

export function usePrintConfig() {
  const createDefaultPageConfig = (): PrintPageConfig => {
    return {
      orientation: 'portrait',
      paperSize: 'A4',
      margins: {
        top: DEFAULT_PRINT_CONFIG.MARGINS.TOP,
        bottom: DEFAULT_PRINT_CONFIG.MARGINS.BOTTOM,
        left: DEFAULT_PRINT_CONFIG.MARGINS.LEFT,
        right: DEFAULT_PRINT_CONFIG.MARGINS.RIGHT,
      },
      font: {
        family: DEFAULT_PRINT_CONFIG.FONT.FAMILY,
        size: DEFAULT_PRINT_CONFIG.FONT.SIZE.BODY,
        color: DEFAULT_PRINT_CONFIG.FONT.COLOR,
      },
      spacing: {
        section: DEFAULT_PRINT_CONFIG.SPACING.SECTION,
        line: DEFAULT_PRINT_CONFIG.SPACING.LINE,
      },
    }
  }

  const createDefaultHeaderConfig = (title: string): PrintHeaderConfig => {
    return {
      title,
      showCurrentDate: true,
      showPageNumber: true,
    }
  }

  // Simplified function to create config with minimal parameters
  const createConfig = (
    title: string,
    dateRange?: { from: string; to: string },
    options: {
      subtitle?: string
      orientation?: 'portrait' | 'landscape'
      exportType?: 'pdf' | 'excel' | 'both'
      customFields?: Array<{ label: string; value: string; position: 'left' | 'center' | 'right' }>
    } = {},
  ): PrintPreviewConfig => {
    const pageConfig = createDefaultPageConfig()
    if (options.orientation) {
      pageConfig.orientation = options.orientation
    }

    const headerConfig = createDefaultHeaderConfig(title)
    if (options.subtitle) {
      headerConfig.subtitle = options.subtitle
    }
    if (dateRange) {
      headerConfig.dateRange = dateRange
    }
    if (options.customFields) {
      headerConfig.customFields = options.customFields
    }

    return {
      header: headerConfig,
      page: pageConfig,
      exportType: options.exportType || 'both',
    }
  }

  // Quick config creators for common scenarios
  const createBasicConfig = (title: string, dateRange?: { from: string; to: string }): PrintPreviewConfig => {
    return createConfig(title, dateRange)
  }

  const createLandscapeConfig = (title: string, dateRange?: { from: string; to: string }): PrintPreviewConfig => {
    return createConfig(title, dateRange, { orientation: 'landscape' })
  }

  return {
    createDefaultPageConfig,
    createDefaultHeaderConfig,
    createConfig,
    createBasicConfig,
    createLandscapeConfig,
  }
}
