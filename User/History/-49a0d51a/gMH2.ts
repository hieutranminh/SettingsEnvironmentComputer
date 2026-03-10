import { computed } from 'vue'
import type { BranchSalesTotalReportItem } from '@/types/sales-report/BranchSales'

/**
 * Interface for transformed branch sales data used in table display
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
 * Interface for summary totals calculation
 */
export interface BranchSalesSummaryTotals {
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
 * Composable for branch sales calculations and data transformations
 *
 * @param data - Array of branch sales data from API
 * @returns Computed properties for transformed data and calculations
 *
 * @example
 * ```typescript
 * const { transformedData, summaryTotals } = useBranchSalesCalculations(apiData)
 * ```
 */
export const useBranchSalesCalculations = (data: BranchSalesTotalReportItem[]) => {
  /**
   * Calculate service totals for a single item
   *
   * @param item - Branch sales item from API
   * @returns Service-related totals
   */
  const calculateServiceTotals = (item: BranchSalesTotalReportItem) => {
    const serviceSales = item.serviceSalesAmount
    const servicePrepaidCardDeduction = item.serviceBalanceDeductionAmount
    const servicePrepaidServiceDeduction = item.serviceDeductionAmount
    const serviceTotal = serviceSales + servicePrepaidCardDeduction + servicePrepaidServiceDeduction

    return {
      serviceSales,
      servicePrepaidCardDeduction,
      servicePrepaidServiceDeduction,
      serviceTotal,
    }
  }

  /**
   * Calculate product totals for a single item
   *
   * @param item - Branch sales item from API
   * @returns Product-related totals
   */
  const calculateProductTotals = (item: BranchSalesTotalReportItem) => {
    const productSales = item.productSalesAmount
    const productPrepaidCardDeduction = item.productBalanceDeductionAmount
    const productTotal = productSales + productPrepaidCardDeduction

    return {
      productSales,
      productPrepaidCardDeduction,
      productTotal,
    }
  }

  /**
   * Calculate prepaid goods totals for a single item
   *
   * @param item - Branch sales item from API
   * @returns Prepaid goods-related totals
   */
  const calculatePrepaidTotals = (item: BranchSalesTotalReportItem) => {
    const prepaidCard = item.prepaidCardSalesAmount
    const prepaidService = item.prepaidServicesSalesAmount
    const prepaidTotal = prepaidCard + prepaidService

    return {
      prepaidCard,
      prepaidService,
      prepaidTotal,
    }
  }

  /**
   * Transform API data to table display format
   *
   * @param item - Branch sales item from API
   * @returns Transformed data for table display
   */
  const transformItem = (item: BranchSalesTotalReportItem): BranchSalesReportData => {
    const serviceTotals = calculateServiceTotals(item)
    const productTotals = calculateProductTotals(item)
    const prepaidTotals = calculatePrepaidTotals(item)

    return {
      shopId: item.shopId,
      branch: item.shopName,
      ...serviceTotals,
      ...productTotals,
      ...prepaidTotals,
      revenueTotal: productTotals.productTotal + serviceTotals.serviceTotal,
      salesTotal: serviceTotals.serviceSales + productTotals.productSales + prepaidTotals.prepaidTotal,
      prepaidGoodsDeductionTotal: item.prepaidGoodsDeductionAmount,
      pointsDeduction: item.pointDeduction,
    }
  }

  /**
   * Calculate summary totals for all data
   *
   * @param transformedData - Array of transformed data
   * @returns Summary totals for footer display
   */
  const calculateSummaryTotals = (transformedData: BranchSalesReportData[]): BranchSalesSummaryTotals => {
    return transformedData.reduce(
      (acc, item) => ({
        serviceSales: acc.serviceSales + item.serviceSales,
        servicePrepaidCardDeduction: acc.servicePrepaidCardDeduction + item.servicePrepaidCardDeduction,
        servicePrepaidServiceDeduction: acc.servicePrepaidServiceDeduction + item.servicePrepaidServiceDeduction,
        serviceTotal: acc.serviceTotal + item.serviceTotal,
        productSales: acc.productSales + item.productSales,
        productPrepaidCardDeduction: acc.productPrepaidCardDeduction + item.productPrepaidCardDeduction,
        productTotal: acc.productTotal + item.productTotal,
        revenueTotal: acc.revenueTotal + item.revenueTotal,
        prepaidCard: acc.prepaidCard + item.prepaidCard,
        prepaidService: acc.prepaidService + item.prepaidService,
        prepaidTotal: acc.prepaidTotal + item.prepaidTotal,
        salesTotal: acc.salesTotal + item.salesTotal,
        prepaidGoodsDeductionTotal: acc.prepaidGoodsDeductionTotal + item.prepaidGoodsDeductionTotal,
        pointsDeduction: acc.pointsDeduction + item.pointsDeduction,
      }),
      {
        serviceSales: 0,
        servicePrepaidCardDeduction: 0,
        servicePrepaidServiceDeduction: 0,
        serviceTotal: 0,
        productSales: 0,
        productPrepaidCardDeduction: 0,
        productTotal: 0,
        revenueTotal: 0,
        prepaidCard: 0,
        prepaidService: 0,
        prepaidTotal: 0,
        salesTotal: 0,
        prepaidGoodsDeductionTotal: 0,
        pointsDeduction: 0,
      },
    )
  }

  /**
   * Transformed data for table display
   */
  const transformedData = computed<BranchSalesReportData[]>(() => {
    if (!data || data.length === 0) {
      return []
    }
    return data.map(transformItem)
  })

  /**
   * Summary totals for footer display
   */
  const summaryTotals = computed<BranchSalesSummaryTotals>(() => {
    return calculateSummaryTotals(transformedData.value)
  })

  return {
    transformedData,
    summaryTotals,
    calculateServiceTotals,
    calculateProductTotals,
    calculatePrepaidTotals,
    transformItem,
    calculateSummaryTotals,
  }
}
