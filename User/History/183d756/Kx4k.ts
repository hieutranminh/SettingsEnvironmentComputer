/**
 * Interface for branch sales report data used in table display
 * @interface BranchSalesReportData
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
 * @interface ColumnConfig
 */
export interface ColumnConfig {
  field: keyof BranchSalesReportData
  headerKey: string
  headerClass: string
  bodyClass?: string
  footerClass?: string
  isAmount: boolean
  colspan?: number
  rowspan?: number
  customHeader?: string
  showInFooter?: boolean
}

/**
 * Table styling constants
 */
export const TABLE_STYLES = {
  SCROLL_HEIGHT: '600px',
  MIN_WIDTH: '100rem',
  CLASSES: {
    GRAY: 'bg-gray',
    YELLOW: 'bg-yellow',
    GREEN: 'bg-green',
    BORDER_BOTTOM_0: 'border-bottom-0',
    FIRST_COLUMN: 'first-column',
    TEXT_NO_WRAP: 'text-no-wrap',
    TEXT_BLUE: 'text-blue'
  }
} as const

/**
 * Column configuration for branch sales table
 * Defines all columns with their properties to eliminate code duplication
 */
export const BRANCH_SALES_COLUMNS: ColumnConfig[] = [
  // Branch column
  {
    field: 'branch',
    headerKey: 'branch-sales.label-branch',
    headerClass: TABLE_STYLES.CLASSES.GRAY,
    bodyClass: TABLE_STYLES.CLASSES.FIRST_COLUMN,
    footerClass: `${TABLE_STYLES.CLASSES.GRAY} ${TABLE_STYLES.CLASSES.FIRST_COLUMN}`,
    isAmount: false,
    rowspan: 2,
    showInFooter: true
  },
  
  // Service Sales (S1)
  {
    field: 'serviceSales',
    headerKey: 'branch-sales.label-sales',
    headerClass: TABLE_STYLES.CLASSES.GREEN,
    isAmount: true,
    customHeader: 'S1',
    showInFooter: true
  },
  
  // Service Prepaid Card Deduction
  {
    field: 'servicePrepaidCardDeduction',
    headerKey: 'branch-sales.label-prepaid-card-deduction',
    headerClass: TABLE_STYLES.CLASSES.YELLOW,
    isAmount: true,
    showInFooter: true
  },
  
  // Service Prepaid Service Deduction
  {
    field: 'servicePrepaidServiceDeduction',
    headerKey: 'branch-sales.label-prepaid-service-deduction',
    headerClass: TABLE_STYLES.CLASSES.YELLOW,
    isAmount: true,
    showInFooter: true
  },
  
  // Service Total (A)
  {
    field: 'serviceTotal',
    headerKey: 'branch-sales.label-total',
    headerClass: TABLE_STYLES.CLASSES.YELLOW,
    isAmount: true,
    customHeader: 'A',
    showInFooter: true
  },
  
  // Product Sales (S2)
  {
    field: 'productSales',
    headerKey: 'branch-sales.label-sales',
    headerClass: TABLE_STYLES.CLASSES.GREEN,
    isAmount: true,
    customHeader: 'S2',
    showInFooter: true
  },
  
  // Product Prepaid Card Deduction
  {
    field: 'productPrepaidCardDeduction',
    headerKey: 'branch-sales.label-prepaid-card-deduction',
    headerClass: TABLE_STYLES.CLASSES.YELLOW,
    isAmount: true,
    showInFooter: true
  },
  
  // Product Total (B)
  {
    field: 'productTotal',
    headerKey: 'branch-sales.label-total',
    headerClass: TABLE_STYLES.CLASSES.YELLOW,
    isAmount: true,
    customHeader: 'B',
    showInFooter: true
  },
  
  // Revenue Total (A + B)
  {
    field: 'revenueTotal',
    headerKey: 'branch-sales.label-revenue-total',
    headerClass: TABLE_STYLES.CLASSES.YELLOW,
    isAmount: true,
    rowspan: 2,
    customHeader: 'A + B',
    showInFooter: true
  },
  
  // Prepaid Card
  {
    field: 'prepaidCard',
    headerKey: 'branch-sales.label-prepaid-card',
    headerClass: TABLE_STYLES.CLASSES.GREEN,
    isAmount: true,
    showInFooter: true
  },
  
  // Prepaid Service
  {
    field: 'prepaidService',
    headerKey: 'branch-sales.label-prepaid-service',
    headerClass: TABLE_STYLES.CLASSES.GREEN,
    isAmount: true,
    showInFooter: true
  },
  
  // Prepaid Total (S3)
  {
    field: 'prepaidTotal',
    headerKey: 'branch-sales.label-total',
    headerClass: TABLE_STYLES.CLASSES.GREEN,
    isAmount: true,
    customHeader: 'S3',
    showInFooter: true
  },
  
  // Sales Total (S1 + S2 + S3)
  {
    field: 'salesTotal',
    headerKey: 'branch-sales.label-sales-total',
    headerClass: TABLE_STYLES.CLASSES.GREEN,
    isAmount: true,
    rowspan: 2,
    customHeader: 'S1 + S2 + S3',
    showInFooter: true
  },
  
  // Prepaid Goods Deduction Total
  {
    field: 'prepaidGoodsDeductionTotal',
    headerKey: 'branch-sales.label-prepaid-goods-deduction-total',
    headerClass: TABLE_STYLES.CLASSES.GRAY,
    isAmount: true,
    rowspan: 2,
    showInFooter: true
  },
  
  // Points Deduction
  {
    field: 'pointsDeduction',
    headerKey: 'branch-sales.label-points-deduction',
    headerClass: TABLE_STYLES.CLASSES.GRAY,
    isAmount: true,
    rowspan: 2,
    showInFooter: true
  }
] as const

/**
 * Header group configuration for complex table headers
 */
export const HEADER_GROUPS = [
  {
    key: 'service',
    labelKey: 'branch-sales.label-service',
    colspan: 4,
    headerClass: `${TABLE_STYLES.CLASSES.YELLOW} ${TABLE_STYLES.CLASSES.BORDER_BOTTOM_0}`
  },
  {
    key: 'product',
    labelKey: 'branch-sales.label-product',
    colspan: 3,
    headerClass: `${TABLE_STYLES.CLASSES.YELLOW} ${TABLE_STYLES.CLASSES.BORDER_BOTTOM_0}`
  },
  {
    key: 'prepaid-goods',
    labelKey: 'branch-sales.label-prepaid-goods-sales',
    colspan: 3,
    headerClass: `${TABLE_STYLES.CLASSES.GREEN} ${TABLE_STYLES.CLASSES.BORDER_BOTTOM_0}`
  }
] as const
