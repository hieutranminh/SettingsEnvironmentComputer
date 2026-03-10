import type { DateType } from '@/constants'

/**
 * Base interface for date range filter objects
 * All report filter interfaces that use date ranges should extend this interface
 */
export interface DateRangeFilterBase {
  /** Type of date filtering (DATE, MONTH, RANGE) */
  dateType: DateType
  
  /** Start date as Unix timestamp */
  fromDateTs: number
  
  /** End date as Unix timestamp */
  toDateTs: number
}

/**
 * Extended date range filter interface with common report properties
 * Includes shop and headquarter information commonly used in reports
 */
export interface DateRangeReportFilter extends DateRangeFilterBase {
  /** Target shop ID for the report */
  shopId: number
  
  /** Headquarter shop ID */
  headquarterShopId: number
  
  /** Whether this is a headquarter view */
  isHeadquarterView: boolean
}
