import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { DISPLAY_ITEM_TYPE, PREPAID_SALES_COUNTING_TYPE } from '@/constants'

/**
 * Interface for display item type option
 */
export interface DisplayTypeOption {
  label: string
  value: number
}

/**
 * Interface for data items with multiple amount types
 */
export interface MultiAmountDataItem {
  serviceAmount?: number
  productAmount?: number
  prepaidCardAmount?: number
  prepaidServiceAmount?: number
  total?: number
}

/**
 * Configuration for display type selector
 */
export interface DisplayTypeSelectorConfig {
  prepaidSalesCountingType: number
  translationPrefix: string // e.g., 'sales-by-date' or 'sales-by-month'
}

/**
 * Composable for display type selector functionality
 * Shared between SalesByDate and SalesByMonth components
 * @param config Configuration for the selector
 * @returns Display type selector functionality
 *
 * Example usage:
 * const { displayItemType, displayItemTypeOptions, getAmountByType, getLabelByType } =
 *   useDisplayTypeSelector({ prepaidSalesCountingType: PREPAID_SALES_COUNTING_TYPE.SOLD, translationPrefix: 'sales-by-date' })
 */
export const useDisplayTypeSelector = (config: DisplayTypeSelectorConfig) => {
  const { t } = useI18n()
  const displayItemType = ref(DISPLAY_ITEM_TYPE.ALL)

  /**
   * Computed property for display item type options
   * Conditionally includes prepaid card options based on counting type
   * @returns Array of display type options with localized labels
   */
  const displayItemTypeOptions = computed((): DisplayTypeOption[] => {
    const baseOptions: DisplayTypeOption[] = [
      { label: t('general.all'), value: DISPLAY_ITEM_TYPE.ALL },
      { label: t(`${config.translationPrefix}.label-service`), value: DISPLAY_ITEM_TYPE.SERVICE },
      { label: t(`${config.translationPrefix}.label-product`), value: DISPLAY_ITEM_TYPE.PRODUCT },
    ]

    if (config.prepaidSalesCountingType === PREPAID_SALES_COUNTING_TYPE.SOLD) {
      baseOptions.push(
        { label: t(`${config.translationPrefix}.label-prepaid-card`), value: DISPLAY_ITEM_TYPE.PREPAID_CARD },
        { label: t(`${config.translationPrefix}.label-prepaid-service`), value: DISPLAY_ITEM_TYPE.PREPAID_SERVICE },
      )
    }

    return baseOptions
  })

  /**
   * Get localized label for display item type
   * @param type Display item type constant
   * @returns Localized label string for the specified type
   *
   * Example input: type = DISPLAY_ITEM_TYPE.SERVICE, translationPrefix = 'sales-by-date'
   * Expected output: 'Service'
   */
  const getLabelByType = (type: number): string => {
    const labelMap: Record<number, string> = {
      [DISPLAY_ITEM_TYPE.ALL]: t(`${config.translationPrefix}.label-total`),
      [DISPLAY_ITEM_TYPE.SERVICE]: t(`${config.translationPrefix}.label-service`),
      [DISPLAY_ITEM_TYPE.PRODUCT]: t(`${config.translationPrefix}.label-product`),
      [DISPLAY_ITEM_TYPE.PREPAID_CARD]: t(`${config.translationPrefix}.label-prepaid-card`),
      [DISPLAY_ITEM_TYPE.PREPAID_SERVICE]: t(`${config.translationPrefix}.label-prepaid-service`),
    }

    return labelMap[type] || t('general.all')
  }

  /**
   * Get amount value from item based on display item type
   * @param item Item containing different amount types
   * @param type Display item type constant
   * @returns Amount value for the specified type, defaults to 0
   *
   * Example input: item = { total: 1000, serviceAmount: 500 }, type = DISPLAY_ITEM_TYPE.SERVICE
   * Expected output: 500
   */
  const getAmountByType = <T extends MultiAmountDataItem>(item: T, type: number): number => {
    const typeMap: Record<number, keyof MultiAmountDataItem> = {
      [DISPLAY_ITEM_TYPE.ALL]: 'total',
      [DISPLAY_ITEM_TYPE.SERVICE]: 'serviceAmount',
      [DISPLAY_ITEM_TYPE.PRODUCT]: 'productAmount',
      [DISPLAY_ITEM_TYPE.PREPAID_CARD]: 'prepaidCardAmount',
      [DISPLAY_ITEM_TYPE.PREPAID_SERVICE]: 'prepaidServiceAmount',
    }

    const key = typeMap[type]
    return key ? ((item[key] as number) ?? 0) : 0
  }

  /**
   * Calculate totals across all data items for each amount type
   * @param data Array of data items
   * @returns Object containing totals for each amount type
   *
   * Example input: data = [{ serviceAmount: 100, total: 200 }, { serviceAmount: 50, total: 150 }]
   * Expected output: { serviceAmount: 150, total: 350, ... }
   */
  const calculateTotals = <T extends MultiAmountDataItem>(data: T[]) => {
    return data.reduce(
      (acc, item) => ({
        serviceAmount: acc.serviceAmount + (item.serviceAmount || 0),
        productAmount: acc.productAmount + (item.productAmount || 0),
        prepaidCardAmount: acc.prepaidCardAmount + (item.prepaidCardAmount || 0),
        prepaidServiceAmount: acc.prepaidServiceAmount + (item.prepaidServiceAmount || 0),
        total: acc.total + (item.total || 0),
      }),
      {
        serviceAmount: 0,
        productAmount: 0,
        prepaidCardAmount: 0,
        prepaidServiceAmount: 0,
        total: 0,
      },
    )
  }

  return {
    displayItemType,
    displayItemTypeOptions,
    getLabelByType,
    getAmountByType,
    calculateTotals,
  }
}
