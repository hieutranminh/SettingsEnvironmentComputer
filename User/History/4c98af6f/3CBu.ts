import { ref, watch, readonly, type Ref, type DeepReadonly, type ComputedRef, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// Composables
import { useAuthStore } from '@/stores/auth/auth'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Constants
import {
  DATE_TYPE,
  FILTER_VALUES,
  REPORT_BY_TYPE_SALES_BY_ITEM,
  SALES_ITEM_TYPE,
  type DateType,
} from '@/constants'
import { ROUTE_NAMES } from '@/constants/routeNames'
// Utils
import {
  parseQueryNumber,
  parseQueryNumberNullable,
  parseQueryBoolean,
  parseQueryDateType,
} from '@/utils/queryParamHelpers'

/**
 * Interface for Sales Total By Branch filter parameters
 * Contains common fields from ISalesTotalRequest, ISalesTotalByStaffRequest, and ISalesTotalByItemRequest
 */
export interface ISalesTotalByBranchFilters {
  // Common fields
  dateType: DateType
  fromDateTs: number
  toDateTs: number
  headquarterShopId: number
  isHeadquarterView: boolean
  shopId: number

  // Optional fields (specific to certain interfaces)
  staffId: number | null // Used in ISalesTotalRequest and ISalesTotalByItemRequest
  isPointDeductionIncluded: boolean // Used in ISalesTotalByStaffRequest (default: true)
  reportByType: number // Used in ISalesTotalByItemRequest (not saved in query)
  salesItemType: number // Used in ISalesTotalByItemRequest to determine which API to call (saved in query)
  staffName?: string
}

/**
 * Configuration for which fields to include in URL query parameters
 */
interface IFilterConfig {
  includeInQuery: Array<keyof ISalesTotalByBranchFilters>
}

/**
 * Return type for useSalesTotalByBranchFilters composable
 */
interface IUseSalesTotalByBranchFiltersReturn {
  filters: DeepReadonly<Ref<ISalesTotalByBranchFilters>>
  sharedStaffName: Ref<string>
  displayedStaffName: ComputedRef<string>
  currentTabName: ComputedRef<string>
  dateRangeText: ComputedRef<string>
  refreshKey: Ref<number>
  isSalesByStaffPage: ComputedRef<boolean>
  isSalesTotalPage: ComputedRef<boolean>
  isSalesByItemPage: ComputedRef<boolean>
  isStaffAll: ComputedRef<boolean>
  handleUpdateFilters: (updates: Partial<ISalesTotalByBranchFilters>) => void
  handleSearch: () => void
  resetFilters: () => void
}

/**
 * Shared refresh key to trigger data refetch across all composable instances
 * This allows forcing a refresh without changing URL query parameters
 */
const refreshKey = ref(0)

/**
 * Shared filter state across all composable instances
 * This ensures that all components using this composable see the same filter values
 * State is always synced from URL query params on each composable initialization
 */
const sharedFilters = ref<ISalesTotalByBranchFilters>({
  dateType: DATE_TYPE.DATE,
  fromDateTs: 0,
  toDateTs: 0,
  headquarterShopId: 0,
  isHeadquarterView: true,
  shopId: 0,
  staffId: -1,
  isPointDeductionIncluded: true,
  reportByType: REPORT_BY_TYPE_SALES_BY_ITEM.CATEGORY,
  salesItemType: SALES_ITEM_TYPE.SERVICE,
})

let isSharedStateInitialized = false

/**
 * Temporary staff name that changes when user selects from dropdown
 * This is NOT displayed in the UI
 */
const sharedStaffName = ref<string>('')

/**
 * Displayed staff name that only updates after handleSearch is called
 * This is what gets shown in the UI (currentTabName, print headers, etc.)
 */
const displayedStaffName = ref<string>('')

/**
 * Get filter configuration based on current route
 * Determines which fields should be included in URL query parameters
 */
const getFilterConfigByRoute = (routeName: string | symbol | null | undefined): IFilterConfig => {
  // Common fields for all pages
  const commonFields: Array<keyof ISalesTotalByBranchFilters> = [
    'dateType',
    'fromDateTs',
    'toDateTs',
    'shopId',
  ]

  switch (routeName) {
    case ROUTE_NAMES.SALES_TOTAL:
      // Sales Total page: only common fields
      return {
        includeInQuery: [...commonFields],
      }

    case ROUTE_NAMES.SALES_BY_STAFF:
      // Sales By Staff page: common fields + staffId + isPointDeductionIncluded
      return {
        includeInQuery: [...commonFields, 'staffId', 'isPointDeductionIncluded'],
      }

    case ROUTE_NAMES.SALES_BY_ITEM:
      // Sales By Item page: common fields + staffId + salesItemType (reportByType excluded - always use default)
      return {
        includeInQuery: [...commonFields, 'staffId', 'salesItemType'],
      }

    default:
      // Default: include all common fields
      return {
        includeInQuery: [...commonFields],
      }
  }
}

export const useSalesTotalByBranchFilters = (): IUseSalesTotalByBranchFiltersReturn => {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { showError } = useMessageDialog()
  const { shop } = useAuthStore()

  /**
   * Get default filter values from auth store and constants
   */
  const getDefaultFilters = (): ISalesTotalByBranchFilters => {
    return {
      dateType: DATE_TYPE.DATE,
      fromDateTs: 0, // Will be set by initializeWithDefaultRange
      toDateTs: 0, // Will be set by initializeWithDefaultRange
      headquarterShopId: shop.shopId,
      isHeadquarterView: true,
      shopId: 0,
      staffId: -1,
      isPointDeductionIncluded: true,
      reportByType: REPORT_BY_TYPE_SALES_BY_ITEM.CATEGORY,
      salesItemType: SALES_ITEM_TYPE.SERVICE,
    }
  }

  /**
   * Initialize filters from URL query parameters or defaults
   *
   * @example
   * // URL: /sales-total-by-branch/sales-total?dateType=2&fromDateTs=1704067200
   * // Returns: { dateType: 2, fromDateTs: 1704067200, ... }
   */
  const initializeFiltersFromQuery = (): ISalesTotalByBranchFilters => {
    const defaults = getDefaultFilters()
    const salesItemType = parseQueryNumber(route.query.salesItemType, defaults.salesItemType)

    // Determine reportByType based on salesItemType:
    // Prepaid Service tab defaults to checked (SERVICE), others default to unchecked (CATEGORY)
    const reportByType =
      salesItemType === SALES_ITEM_TYPE.PREPAID_SERVICE
        ? REPORT_BY_TYPE_SALES_BY_ITEM.SERVICE
        : REPORT_BY_TYPE_SALES_BY_ITEM.CATEGORY

    return {
      dateType: parseQueryDateType(route.query.dateType, defaults.dateType),
      fromDateTs: parseQueryNumber(route.query.fromDateTs, defaults.fromDateTs),
      toDateTs: parseQueryNumber(route.query.toDateTs, defaults.toDateTs),
      headquarterShopId: parseQueryNumber(
        route.query.headquarterShopId,
        defaults.headquarterShopId,
      ),
      isHeadquarterView: parseQueryBoolean(
        route.query.isHeadquarterView,
        defaults.isHeadquarterView,
      ),
      shopId: parseQueryNumber(route.query.shopId, defaults.shopId),
      staffId: parseQueryNumberNullable(route.query.staffId) ?? defaults.staffId,
      isPointDeductionIncluded: parseQueryBoolean(
        route.query.isPointDeductionIncluded,
        defaults.isPointDeductionIncluded,
      ),
      reportByType,
      salesItemType,
    }
  }

  /**
   * Always sync shared filters from URL query params on composable initialization
   * This ensures the state is always in sync with the URL, regardless of navigation patterns
   */
  if (!isSharedStateInitialized) {
    sharedFilters.value = initializeFiltersFromQuery()

    const allStaffText = t('general.all')
    sharedStaffName.value = allStaffText
    displayedStaffName.value = allStaffText

    isSharedStateInitialized = true
  }

  // Use shared filters as the single source of truth
  const filters = sharedFilters

  // Integrate useDateRangeFilter for date range management
  const { dateRangeText, initializeWithDefaultRange, validateDateRange } = useDateRangeFilter(
    filters,
    {
      defaultDateType: DATE_TYPE.DATE,
      autoUpdateOnDateTypeChange: true,
    },
  )

  /**
   * Computed property for displayed staff name
   * Returns the staff name that should be shown in the UI after search
   *
   * @example
   * // When staffId is -1 (All)
   * // Returns: "전체" or "All"
   *
   * @example
   * // When specific staff is selected and searched
   * // Returns: "홍길동" (the staff's name)
   */
  const displayedStaffNameComputed = computed((): string => displayedStaffName.value)

  const currentTabName = computed((): string => {
    switch (route.name) {
      case ROUTE_NAMES.SALES_TOTAL:
        return t('sales-report.overall-sales')
      case ROUTE_NAMES.SALES_BY_STAFF:
        return isStaffAll.value
          ? t('sales-report.sales-by-staff')
          : t('sales-report.sales-by-dyanmic-staff', { staffName: displayedStaffName.value })
      case ROUTE_NAMES.SALES_BY_ITEM:
        return t('sales-report.sales-by-item')
      default:
        return t('sales-report.overall-sales')
    }
  })

  const isSalesByStaffPage = computed(() => route.name === ROUTE_NAMES.SALES_BY_STAFF)
  const isSalesTotalPage = computed(() => route.name === ROUTE_NAMES.SALES_TOTAL)
  const isSalesByItemPage = computed(() => route.name === ROUTE_NAMES.SALES_BY_ITEM)
  const isStaffAll = computed(() => filters.value.staffId === FILTER_VALUES.ALL)

  /**
   * Initialize date range if not present in query params
   * Shared logic for initial load and URL changes
   */
  const ensureDateRangeInitialized = (): void => {
    const hasDateQuery = route.query.fromDateTs && route.query.toDateTs
    if (!hasDateQuery) {
      initializeWithDefaultRange(filters.value.dateType)
    }
  }

  // Initialize on composable mount
  ensureDateRangeInitialized()

  /**
   * Update filter values (does not trigger URL update)
   * Use this for user input changes
   *
   * @param updates - Partial filter object with fields to update
   *
   * @example
   * handleUpdateFilters({ staffId: 123 })
   */
  const handleUpdateFilters = (updates: Partial<ISalesTotalByBranchFilters>): void => {
    filters.value = {
      ...filters.value,
      ...updates,
    }
  }

  /**
   * Build query object with specific config
   * Used by handleSearch to get fresh config
   */
  const buildQueryObjectWithConfig = (configToUse: IFilterConfig): Record<string, string> => {
    const query: Record<string, string> = {}

    // Add filter if it's in includeInQuery config and has a valid value
    const addIfExists = (key: keyof ISalesTotalByBranchFilters): void => {
      if (!configToUse.includeInQuery.includes(key)) {
        return
      }

      const value = filters.value[key]

      // Skip only if value is null or undefined
      if (value === null || value === undefined) {
        return
      }

      // For boolean values, always include them (true or false)
      if (typeof value === 'boolean') {
        query[key] = value.toString()
        return
      }

      // For numbers, skip only if value is 0 or negative (except staffId which can be -1)
      if (typeof value === 'number') {
        if (key === 'staffId' || value > 0) {
          query[key] = value.toString()
        }
        return
      }

      // For other values, add if truthy
      if (value) {
        query[key] = String(value)
      }
    }

    // Process all fields that might be included
    configToUse.includeInQuery.forEach((key) => {
      addIfExists(key)
    })

    return query
  }

  /**
   * Check if query parameters have changed compared to current URL
   */
  const hasQueryChanged = (newQuery: Record<string, string>): boolean => {
    const currentQuery = route.query
    return Object.keys({ ...newQuery, ...currentQuery }).some(
      (key) => newQuery[key] !== currentQuery[key],
    )
  }

  /**
   * Navigate to new URL with updated query parameters
   */
  const navigateWithQuery = (query: Record<string, string>): void => {
    router.push({
      path: route.path,
      query: query,
    })
  }

  /**
   * Apply filters to URL query parameters and trigger data refresh
   * This triggers child components to react to filter changes
   *
   * Strategy:
   * 1. Validate filters first
   * 2. Update URL query (always, even if same - for consistent state)
   * 3. Increment refreshKey to trigger data fetch
   * 4. Components watch refreshKey instead of route.query to avoid duplicate calls
   */
  const handleSearch = (): void => {
    // Step 1: Validate filters
    if (filters.value.dateType === DATE_TYPE.RANGE) {
      const validationResult = validateDateRange({
        checkToDateNotBeforeFromDate: true,
        checkExceedOneYearRange: true,
        checkExceedThreeMonthRange: isSalesByStaffPage.value,
      })
      if (!validationResult.isValid && validationResult.errorKey) {
        return showError(t(validationResult.errorKey))
      }
    }

    // Step 2: Update displayed staff name (only after search)
    // This "locks in" the staff name for UI display
    displayedStaffName.value = sharedStaffName.value

    // Step 3: Build query object
    const currentConfig = getFilterConfigByRoute(route.name)
    const query = buildQueryObjectWithConfig(currentConfig)

    // Step 4: Update URL if query changed
    if (hasQueryChanged(query)) {
      navigateWithQuery(query)
    }

    // Step 5: Always increment refreshKey to trigger data fetch
    // This ensures single source of truth for triggering API calls
    refreshKey.value++
  }

  /**
   * Watch for URL query changes (e.g., browser back/forward)
   * Syncs internal filter state with URL and ensures date range is initialized
   */
  watch(
    () => route.query,
    () => {
      filters.value = initializeFiltersFromQuery()
      ensureDateRangeInitialized()
    },
  )

  /**
   * Reset all filters to default values
   * Call this when navigating away from the page to clear state
   *
   * @example
   * // In component onUnmounted hook
   * onUnmounted(() => {
   *   resetFilters()
   * })
   */
  const resetFilters = (): void => {
    isSharedStateInitialized = false
    sharedStaffName.value = ''
    displayedStaffName.value = ''
    sharedFilters.value = {
      dateType: DATE_TYPE.DATE,
      fromDateTs: 0,
      toDateTs: 0,
      headquarterShopId: 0,
      isHeadquarterView: true,
      shopId: 0,
      staffId: -1,
      isPointDeductionIncluded: true,
      reportByType: REPORT_BY_TYPE_SALES_BY_ITEM.CATEGORY,
      salesItemType: SALES_ITEM_TYPE.SERVICE,
    }
  }

  return {
    filters: readonly(filters),
    sharedStaffName,
    displayedStaffName: displayedStaffNameComputed,
    currentTabName,
    dateRangeText,
    refreshKey,
    isSalesByStaffPage,
    isSalesTotalPage,
    isSalesByItemPage,
    isStaffAll,
    handleUpdateFilters,
    handleSearch,
    resetFilters,
  }
}
