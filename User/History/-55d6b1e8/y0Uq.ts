/**
 * Constants and configurations for Branch Sales Table
 */

export const BRANCH_SALES_TABLE_CONFIG = {
  MIN_WIDTH: '100rem',
  SCROLL_HEIGHT: '600px',
  DATA_KEY: 'branch-sales-table',
  TABLE_CLASS: 'branch-sales-table',
} as const

export const BRANCH_SALES_TABLE_STYLES = {
  HEADER_CLASSES: {
    GRAY: 'bg-gray',
    YELLOW: 'bg-yellow',
    GREEN: 'bg-green',
    BORDER_BOTTOM_0: 'border-bottom-0',
  },
  BODY_CLASSES: {
    FIRST_COLUMN: 'first-column',
  },
  TEXT_CLASSES: {
    BLUE: 'text-blue',
    NO_WRAP: 'text-no-wrap',
  },
} as const

/**
 * Column configuration for main table
 */
export const MAIN_TABLE_COLUMNS = [
  // Service columns
  {
    field: 'serviceSales',
    headerKey: 'branch-sales.label-sales',
    headerSuffix: '(S1)',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'servicePrepaidCardDeduction',
    headerKey: 'branch-sales.label-prepaid-card-deduction',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'servicePrepaidServiceDeduction',
    headerKey: 'branch-sales.label-prepaid-service-deduction',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'serviceTotal',
    headerKey: 'branch-sales.label-total',
    headerSuffix: '(A)',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Product columns
  {
    field: 'productSales',
    headerKey: 'branch-sales.label-sales',
    headerSuffix: '(S2)',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'productPrepaidCardDeduction',
    headerKey: 'branch-sales.label-prepaid-card-deduction',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'productTotal',
    headerKey: 'branch-sales.label-total',
    headerSuffix: '(B)',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Revenue total
  {
    field: 'revenueTotal',
    headerKey: 'branch-sales.label-revenue-total',
    headerSuffix: 'A + B',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Prepaid goods columns
  {
    field: 'prepaidCard',
    headerKey: 'branch-sales.label-prepaid-card',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'prepaidService',
    headerKey: 'branch-sales.label-prepaid-service',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'prepaidTotal',
    headerKey: 'branch-sales.label-total',
    headerSuffix: '(S3)',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Sales total
  {
    field: 'salesTotal',
    headerKey: 'branch-sales.label-sales-total',
    headerSuffix: 'S1 + S2 + S3',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Deduction columns
  {
    field: 'prepaidGoodsDeductionTotal',
    headerKey: 'branch-sales.label-prepaid-goods-deduction-total',
    headerClass: 'bg-gray',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'pointsDeduction',
    headerKey: 'branch-sales.label-points-deduction',
    headerClass: 'bg-gray',
    bodyClass: '',
    type: 'amount' as const,
  },
] as const

/**
 * Column configuration for print table (simplified layout)
 */
export const PRINT_TABLE_COLUMNS = [
  // Service columns
  {
    field: 'serviceSales',
    headerKey: 'branch-sales.label-sales',
    headerSuffix: '(S1)',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'servicePrepaidCardDeduction',
    headerKey: 'branch-sales.label-prepaid-card-deduction',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'servicePrepaidServiceDeduction',
    headerKey: 'branch-sales.label-prepaid-service-deduction',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Product columns
  {
    field: 'productSales',
    headerKey: 'branch-sales.label-sales',
    headerSuffix: '(S2)',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'productPrepaidCardDeduction',
    headerKey: 'branch-sales.label-prepaid-card-deduction',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Revenue total
  {
    field: 'revenueTotal',
    headerKey: 'branch-sales.label-revenue-total',
    headerSuffix: 'A + B',
    headerClass: 'bg-yellow',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Prepaid goods columns
  {
    field: 'prepaidCard',
    headerKey: 'branch-sales.label-prepaid-card',
    headerSuffix: '(S3)',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  {
    field: 'prepaidService',
    headerKey: 'branch-sales.label-prepaid-service',
    headerSuffix: '(S4)',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Sales total
  {
    field: 'salesTotal',
    headerKey: 'branch-sales.label-sales-total',
    headerSuffix: 'S1 + S2 + S3 + S4',
    headerClass: 'bg-green',
    bodyClass: '',
    type: 'amount' as const,
  },
  // Deduction columns
  {
    field: 'prepaidGoodsDeductionTotal',
    headerKey: 'branch-sales.label-prepaid-goods-deduction-total',
    headerClass: 'bg-gray',
    bodyClass: '',
    type: 'amount' as const,
  },
] as const

/**
 * Header group configuration for main table
 */
export const MAIN_TABLE_HEADER_GROUPS = [
  {
    label: 'branch-sales.label-service',
    colspan: 4,
    headerClass: 'bg-yellow border-bottom-0',
  },
  {
    label: 'branch-sales.label-product',
    colspan: 3,
    headerClass: 'bg-yellow border-bottom-0',
  },
  {
    label: 'branch-sales.label-prepaid-goods-sales',
    colspan: 3,
    headerClass: 'bg-green border-bottom-0',
  },
] as const

/**
 * Header group configuration for print table
 */
export const PRINT_TABLE_HEADER_GROUPS = [
  {
    label: 'branch-sales.label-service',
    suffix: '(A)',
    colspan: 3,
    headerClass: 'bg-yellow border-bottom-0',
  },
  {
    label: 'branch-sales.label-product',
    suffix: '(B)',
    colspan: 2,
    headerClass: 'bg-yellow border-bottom-0',
  },
  {
    label: 'branch-sales.label-prepaid-goods-sales',
    colspan: 2,
    headerClass: 'bg-green border-bottom-0',
  },
] as const
