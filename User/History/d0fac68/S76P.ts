import { ref, computed, watch, type Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { DATE_TYPE, PAGINATION } from '@/constants'
import { getCurrentUnixTimestamp } from '@/utils/dateUtils'

// Types
type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]

export interface BaseFilter {
  pageSize: number
  pageNumber: number
}

export interface DateFilter extends BaseFilter {
  dateType: DateType
  fromDateTs: number
  toDateTs: number
}

export interface BranchSalesFilter extends DateFilter {
  isHeadquarterView: boolean
  headquarterShopId: number
  branchName: string
  branchShopIds: number[]
  branchGroupId: number
  customBranchTypeId: number
}

interface UseFilterOptions<T extends BaseFilter> {
  /** Initial filter values */
  initialFilters: T
  /** Debounce delay in milliseconds for filter changes */
  debounceMs?: number
  /** Callback function called when filters change */
  onFilterChange?: (filters: T) => void
  /** Whether to auto-trigger filter changes on initialization */
  autoTrigger?: boolean
}

interface UseFilterReturn<T extends BaseFilter> {
  /** Current filter state */
  filters: Ref<T>
  /** Debounced filter state (for API calls) */
  debouncedFilters: Ref<T>
  /** Whether filters have changed since last reset */
  hasChanges: Ref<boolean>
  /** Whether filters are currently being debounced */
  isDebouncing: Ref<boolean>
  /** Reset filters to initial values */
  resetFilters: () => void
  /** Update specific filter properties */
  updateFilters: (updates: Partial<T>) => void
  /** Update a single filter property */
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void
  /** Reset pagination to first page */
  resetPagination: () => void
  /** Go to next page */
  nextPage: () => void
  /** Go to previous page */
  previousPage: () => void
  /** Set page number */
  setPage: (page: number) => void
}

/**
 * Composable for managing filter state with debouncing and change tracking
 */
export function useFilter<T extends BaseFilter>(
  options: UseFilterOptions<T>
): UseFilterReturn<T> {
  const {
    initialFilters,
    debounceMs = 300,
    onFilterChange,
    autoTrigger = false,
  } = options

  // Filter state
  const filters = ref<T>({ ...initialFilters }) as Ref<T>
  const debouncedFilters = ref<T>({ ...initialFilters }) as Ref<T>
  const hasChanges = ref(false)
  const isDebouncing = ref(false)

  // Computed properties
  const currentPage = computed(() => filters.value.pageNumber)
  const pageSize = computed(() => filters.value.pageSize)

  // Debounced filter change handler
  const debouncedFilterChange = useDebounceFn(
    (newFilters: T) => {
      debouncedFilters.value = { ...newFilters }
      isDebouncing.value = false
      onFilterChange?.(newFilters)
    },
    debounceMs
  )

  // Watch for filter changes
  watch(
    filters,
    (newFilters) => {
      hasChanges.value = true
      isDebouncing.value = true
      debouncedFilterChange(newFilters)
    },
    { deep: true }
  )

  // Filter update methods
  const updateFilters = (updates: Partial<T>): void => {
    Object.assign(filters.value, updates)
  }

  const updateFilter = <K extends keyof T>(key: K, value: T[K]): void => {
    filters.value[key] = value
  }

  const resetFilters = (): void => {
    Object.assign(filters.value, initialFilters)
    hasChanges.value = false
  }

  // Pagination methods
  const resetPagination = (): void => {
    updateFilter('pageNumber', PAGINATION.DEFAULT_PAGE_NUMBER)
  }

  const nextPage = (): void => {
    updateFilter('pageNumber', currentPage.value + 1)
  }

  const previousPage = (): void => {
    if (currentPage.value > 1) {
      updateFilter('pageNumber', currentPage.value - 1)
    }
  }

  const setPage = (page: number): void => {
    if (page >= 1) {
      updateFilter('pageNumber', page)
    }
  }

  // Auto-trigger on mount if enabled
  if (autoTrigger) {
    onFilterChange?.(filters.value)
  }

  return {
    filters,
    debouncedFilters,
    hasChanges,
    isDebouncing,
    resetFilters,
    updateFilters,
    updateFilter,
    resetPagination,
    nextPage,
    previousPage,
    setPage,
  }
}

/**
 * Specialized composable for branch sales filters
 */
export function useBranchSalesFilter(
  options?: Partial<UseFilterOptions<BranchSalesFilter>>
) {
  const initialFilters: BranchSalesFilter = {
    dateType: DATE_TYPE.DATE,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
    fromDateTs: getCurrentUnixTimestamp(),
    toDateTs: getCurrentUnixTimestamp(),
    isHeadquarterView: true,
    headquarterShopId: 600649,
    branchName: '',
    branchShopIds: [],
    branchGroupId: -1,
    customBranchTypeId: -1,
  }

  const filterComposable = useFilter({
    initialFilters,
    debounceMs: 500, // Longer debounce for date filters
    ...options,
  })

  // Specialized methods for branch sales
  const updateDateRange = (fromDateTs: number, toDateTs: number): void => {
    filterComposable.updateFilters({ fromDateTs, toDateTs })
  }

  const updateDateType = (dateType: DateType): void => {
    filterComposable.updateFilter('dateType', dateType)
  }

  const updateBranchSelection = (branchShopIds: number[]): void => {
    filterComposable.updateFilter('branchShopIds', branchShopIds)
  }

  const updateBranchGroup = (branchGroupId: number): void => {
    filterComposable.updateFilter('branchGroupId', branchGroupId)
  }

  const updateCustomBranchType = (customBranchTypeId: number): void => {
    filterComposable.updateFilter('customBranchTypeId', customBranchTypeId)
  }

  return {
    ...filterComposable,
    updateDateRange,
    updateDateType,
    updateBranchSelection,
    updateBranchGroup,
    updateCustomBranchType,
  }
}