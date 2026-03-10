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

  const createPrintConfig = (
    title: string,
    options: {
      subtitle?: string
      dateRange?: { from: string; to: string }
      customFields?: Array<{ label: string; value: string; position: 'left' | 'center' | 'right' }>
      orientation?: 'portrait' | 'landscape'
      exportType?: 'pdf' | 'excel' | 'both'
      customData?: Record<string, unknown>
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
    if (options.dateRange) {
      headerConfig.dateRange = options.dateRange
    }
    if (options.customFields) {
      headerConfig.customFields = options.customFields
    }

    return {
      header: headerConfig,
      page: pageConfig,
      exportType: options.exportType || 'both',
      customData: options.customData,
    }
  }

  const createBranchSalesConfig = (dateRange: { from: string; to: string }): PrintPreviewConfig => {
    return createPrintConfig('Branch Sales Reportx xxxxxxxxxxx xxxxxxxxx xx', {
      subtitle: 'Sales Summary by Branch xxxxxxx xxxxxxxx xxxxxxxx',
      dateRange,
      orientation: 'landscape',
      exportType: 'both',
    })
  }

  const createSalesHistoryConfig = (dateRange: { from: string; to: string }): PrintPreviewConfig => {
    return createPrintConfig('Sales History Report', {
      subtitle: 'Detailed Sales Transactions',
      dateRange,
      orientation: 'landscape',
      exportType: 'both',
    })
  }

  return {
    createDefaultPageConfig,
    createDefaultHeaderConfig,
    createPrintConfig,
    createBranchSalesConfig,
    createSalesHistoryConfig,
  }
}
