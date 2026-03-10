import { computed } from 'vue'
import { BRANCH_SALES_TABLE } from '@/constants'

/**
 * Interface for branch sales report data
 * Maps to the API response structure
 */
export interface BranchSalesReportData {
  shopId: number
  branch: string
  serviceSales: number
  servicePrepaidCardDeduction: number
  servicePrepaidServiceDeduction: number
  serviceTotal: number
  productSales: number
  productPrepaidCardDeduction: number
  productTotal: number
  revenueTotal: number
  prepaidCard: number
  prepaidService: number
  prepaidTotal: number
  salesTotal: number
  prepaidGoodsDeductionTotal: number
  pointsDeduction: number
}

/**
 * Column configuration for branch sales table
 */
export interface ColumnConfig {
  field: keyof BranchSalesReportData
  headerKey: string
  headerClass: string
  bodyClass?: string
  footerClass: string
  isFirstColumn?: boolean
  customHeader?: {
    template: string
    variables?: Record<string, string>
  }
}

/**
 * Composable for branch sales table configuration and logic
 *
 * @returns Object containing table configuration and computed properties
 *
 * @example
 * ```typescript
 * const { columnConfigs, headerConfigs, footerConfigs } = useBranchSalesTable()
 * ```
 */
export const useBranchSalesTable = () => {
  /**
   * Column configurations for the table body
   * Defines field mapping, styling, and display properties for each column
   */
  const columnConfigs = computed<ColumnConfig[]>(() => [
    {
      field: 'branch',
      headerKey: 'branch-sales.label-branch',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GRAY,
      bodyClass: BRANCH_SALES_TABLE.CSS_CLASSES.BODY.FIRST_COLUMN,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GRAY,
      isFirstColumn: true,
    },
    {
      field: 'serviceSales',
      headerKey: 'branch-sales.label-sales',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      customHeader: {
        template: '{{ $t("branch-sales.label-sales") }} (<span class="text-blue">S1</span>)',
      },
    },
    {
      field: 'servicePrepaidCardDeduction',
      headerKey: 'branch-sales.label-prepaid-card-deduction',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
    },
    {
      field: 'servicePrepaidServiceDeduction',
      headerKey: 'branch-sales.label-prepaid-service-deduction',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
    },
    {
      field: 'serviceTotal',
      headerKey: 'branch-sales.label-total',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      customHeader: {
        template: '{{ $t("branch-sales.label-total") }} (A)',
      },
    },
    {
      field: 'productSales',
      headerKey: 'branch-sales.label-sales',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      customHeader: {
        template: '{{ $t("branch-sales.label-sales") }} (<span class="text-blue">S2</span>)',
      },
    },
    {
      field: 'productPrepaidCardDeduction',
      headerKey: 'branch-sales.label-prepaid-card-deduction',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
    },
    {
      field: 'productTotal',
      headerKey: 'branch-sales.label-total',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      customHeader: {
        template: '{{ $t("branch-sales.label-total") }} (B)',
      },
    },
    {
      field: 'revenueTotal',
      headerKey: 'branch-sales.label-revenue-total',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW,
      customHeader: {
        template: '{{ $t("branch-sales.label-revenue-total") }} <br /> (<span class="text-no-wrap">A + B</span>)',
      },
    },
    {
      field: 'prepaidCard',
      headerKey: 'branch-sales.label-prepaid-card',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
    },
    {
      field: 'prepaidService',
      headerKey: 'branch-sales.label-prepaid-service',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
    },
    {
      field: 'prepaidTotal',
      headerKey: 'branch-sales.label-total',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
      customHeader: {
        template: '{{ $t("branch-sales.label-total") }} (<span class="text-blue">S3</span>)',
      },
    },
    {
      field: 'salesTotal',
      headerKey: 'branch-sales.label-sales-total',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN,
      customHeader: {
        template:
          '{{ $t("branch-sales.label-sales-total") }} <br /> (<span class="text-blue text-no-wrap">S1 + S2 + S3</span>)',
      },
    },
    {
      field: 'prepaidGoodsDeductionTotal',
      headerKey: 'branch-sales.label-prepaid-goods-deduction-total',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GRAY,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GRAY,
    },
    {
      field: 'pointsDeduction',
      headerKey: 'branch-sales.label-points-deduction',
      headerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GRAY,
      footerClass: BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GRAY,
    },
  ])

  /**
   * Header group configurations for the table
   * Defines the structure and styling of header groups
   */
  const headerConfigs = computed(() => ({
    service: {
      colspan: BRANCH_SALES_TABLE.COLUMN_GROUPS.SERVICE.COLSPAN,
      label: BRANCH_SALES_TABLE.COLUMN_GROUPS.SERVICE.LABEL,
      headerClass: `${BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW} ${BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.BORDER_BOTTOM_0}`,
    },
    product: {
      colspan: BRANCH_SALES_TABLE.COLUMN_GROUPS.PRODUCT.COLSPAN,
      label: BRANCH_SALES_TABLE.COLUMN_GROUPS.PRODUCT.LABEL,
      headerClass: `${BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.YELLOW} ${BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.BORDER_BOTTOM_0}`,
    },
    prepaidGoods: {
      colspan: BRANCH_SALES_TABLE.COLUMN_GROUPS.PREPAID_GOODS.COLSPAN,
      label: BRANCH_SALES_TABLE.COLUMN_GROUPS.PREPAID_GOODS.LABEL,
      headerClass: `${BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GREEN} ${BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.BORDER_BOTTOM_0}`,
    },
  }))

  /**
   * Footer configuration for the totals row
   * Defines styling and content for the footer
   */
  const footerConfigs = computed(() => ({
    totalsLabel: 'general.totals',
    firstColumnClass: `${BRANCH_SALES_TABLE.CSS_CLASSES.HEADER.GRAY} ${BRANCH_SALES_TABLE.CSS_CLASSES.BODY.FIRST_COLUMN}`,
  }))

  return {
    columnConfigs,
    headerConfigs,
    footerConfigs,
  }
}
