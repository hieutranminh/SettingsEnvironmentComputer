import { ref, computed, type ComputedRef, type Ref } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Services
import { goodsReadService } from '@/services/goods/goods.read'
import { goodsCmdService } from '@/services/goods/goods.cmd'
// Types
import type {
  IProductsCategoriesItem,
  IProductsCategoriesRequest,
  IProductsCategoriesResponse,
  IProductsCategoriesChangeOrderPayload,
} from '@/types/goods/ProductsCategories'
// Utils
import { extraErrorMessages } from '@/utils/common'
// Constants
import { PAGINATION } from '@/constants'

export interface IUseProductsCategoriesReturn {
  savedFilters: Ref<IProductsCategoriesRequest | null>
  reportData: Ref<IProductsCategoriesResponse | null>
  items: ComputedRef<IProductsCategoriesItem[]>
  totalItems: ComputedRef<number>
  currentPage: ComputedRef<number>
  pageSize: ComputedRef<number>
  totalPages: ComputedRef<number>
  hasNextPage: ComputedRef<boolean>
  hasPrevPage: ComputedRef<boolean>
  fetchData: (filters: IProductsCategoriesRequest) => Promise<IProductsCategoriesResponse | null>
  changeOrder: (payload: IProductsCategoriesChangeOrderPayload) => Promise<boolean>
  clearData: () => void
  refreshData: (filters: IProductsCategoriesRequest) => Promise<void>
  buildRequestPayload: (filters: IProductsCategoriesRequest) => IProductsCategoriesRequest
  goToPage: (pageNumber: number, filters: IProductsCategoriesRequest) => Promise<void>
  nextPage: (filters: IProductsCategoriesRequest) => Promise<void>
  prevPage: (filters: IProductsCategoriesRequest) => Promise<void>
}

/**
 * Composable for managing products categories report data and operations
 * Provides reactive state and methods for fetching and managing products categories report data
 * @returns Object containing reactive state and methods for products categories report operations
 */
export const useProductsCategories = (): IUseProductsCategoriesReturn => {
  // State
  const savedFilters = ref<IProductsCategoriesRequest | null>(null)
  const reportData = ref<IProductsCategoriesResponse | null>(null)
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()

  // Computed
  const items = computed<IProductsCategoriesItem[]>(() => reportData.value?.result?.items ?? [])
  const totalItems = computed<number>(() => reportData.value?.result?.pagingInfo?.totalItems ?? 0)
  const currentPage = computed<number>(() => reportData.value?.result?.pagingInfo?.pageNumber ?? 1)
  const pageSize = computed<number>(
    () => reportData.value?.result?.pagingInfo?.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE_MAX,
  )
  const totalPages = computed<number>(() => Math.ceil(totalItems.value / pageSize.value))
  const hasNextPage = computed<boolean>(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed<boolean>(() => currentPage.value > 1)

  /**
   * Convert ProductsCategoriesRequest to ProductsCategoriesRequest
   * @param filters - The filters from ProductsCategoriesView
   * @returns The request payload for the API
   */
  const buildRequestPayload = (filters: IProductsCategoriesRequest): IProductsCategoriesRequest => {
    return {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      shopId: filters.shopId,
      status: filters.status,
    }
  }

  /**
   * Fetch products categories report data
   * @param filters - The filters from ProductsCategoriesView
   * @returns Promise containing the report data
   */
  const fetchData = async (
    filters: IProductsCategoriesRequest,
  ): Promise<IProductsCategoriesResponse | null> => {
    try {
      startLoading(true)

      const requestPayload = buildRequestPayload(filters)
      const response = await goodsReadService.getProductsCategories(requestPayload)

      if (!response.isOK) {
        showError(response.errorMessages)
        return response
      }

      savedFilters.value = requestPayload
      reportData.value = response
      return response
    } catch (err: unknown) {
      const errorMessage = extraErrorMessages(err)
      showError(errorMessage)
      return null
    } finally {
      startLoading(false)
    }
  }

  /**
   * Change the order of products categories via drag and drop
   * @param payload - Object containing shopId, oldPositionId, and newPositionId
   * @returns Promise<boolean> - true if successful, false otherwise
   *
   * @example
   * const success = await changeOrder({
   *   shopId: 123,
   *   oldPositionId: 1,
   *   newPositionId: 3
   * })
   * if (success) {
   *   // Refresh data to show new order
   * }
   */
  const changeOrder = async (payload: IProductsCategoriesChangeOrderPayload): Promise<boolean> => {
    try {
      startLoading(true)

      const response = await goodsCmdService.dragdropProductsCategories(payload)

      if (!response?.isOK) {
        showError(response.errorMessages)
        return false
      }

      return true
    } catch (err: unknown) {
      const errorMessage = extraErrorMessages(err)
      showError(errorMessage)
      return false
    } finally {
      startLoading(false)
    }
  }

  /**
   * Clear the current report data and error state
   */
  const clearData = (): void => {
    reportData.value = null
  }

  /**
   * Refresh the report with current filters
   * @param filters - The current filters
   */
  const refreshData = async (filters: IProductsCategoriesRequest): Promise<void> => {
    await fetchData(filters)
  }

  /**
   * Navigate to a specific page
   * @param pageNumber - The page number to navigate to
   * @param filters - The current filters
   */
  const goToPage = async (pageNumber: number, filters: IProductsCategoriesRequest): Promise<void> => {
    if (pageNumber < 1 || pageNumber > totalPages.value) return

    const updatedFilters = { ...filters, pageNumber }
    await fetchData(updatedFilters)
  }

  /**
   * Navigate to the next page
   * @param filters - The current filters
   */
  const nextPage = async (filters: IProductsCategoriesRequest): Promise<void> => {
    if (!hasNextPage.value) return

    const updatedFilters = { ...filters, pageNumber: currentPage.value + 1 }
    await fetchData(updatedFilters)
  }

  /**
   * Navigate to the previous page
   * @param filters - The current filters
   */
  const prevPage = async (filters: IProductsCategoriesRequest): Promise<void> => {
    if (!hasPrevPage.value) return

    const updatedFilters = { ...filters, pageNumber: currentPage.value - 1 }
    await fetchData(updatedFilters)
  }

  return {
    // State
    savedFilters,
    reportData,

    // Computed
    items,
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,

    // Methods
    fetchData,
    changeOrder,
    clearData,
    refreshData,
    buildRequestPayload,
    goToPage,
    nextPage,
    prevPage,
  }
}
