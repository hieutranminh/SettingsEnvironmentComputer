// useClientsByPeriodReport.ts
import { ref, computed, type Ref, type ComputedRef } from 'vue'

// Composables
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'

// Services
import { clientReportReadService } from '@/services/sales/client-report.read'

// Types
import type {
  ClientsByPeriodFilterInterface,
  ClientsByPeriodReportRequest,
  ClientsByPeriodReportResponse,
  ClientSummary,
  MemberSummary,
} from '@/types/client-report/ClientsByPeriod'

// Utils
import { extraErrorMessages } from '@/utils/common'

/**
 * (Optional) Khai báo type “tối thiểu” cho các composable phụ nếu file của bạn chưa export type.
 * Nếu các composable đó đã có type riêng, hãy import thay vì khai báo ở đây.
 */
type UseLoading = {
  isLoading: Ref<boolean>
  /** đặt true/false để bật/tắt loading */
  startLoading: (value: boolean) => void
}
type UseMessageDialog = {
  /** có thể nhận string | string[] tùy hiện thực của bạn */
  showError: (messages: string | string[]) => void
}

/**
 * Return type cho composable chính — giúp IntelliSense đầy đủ ở nơi sử dụng.
 */
export interface UseClientsByPeriodReport {
  // State
  filterData: Ref<ClientsByPeriodFilterInterface | null>
  reportData: Ref<ClientsByPeriodReportResponse | null>
  error: Ref<string | null>
  isLoading: Ref<boolean>

  // Computed
  clientSummary: ComputedRef<ClientSummary>
  memberSummary: ComputedRef<MemberSummary>

  // Methods
  buildRequestPayload: (filters: ClientsByPeriodFilterInterface) => ClientsByPeriodReportRequest
  fetchReport: (filters: ClientsByPeriodFilterInterface) => Promise<ClientsByPeriodReportResponse | null>
  clearReport: () => void
  refreshReport: (filters: ClientsByPeriodFilterInterface) => Promise<void>
}

/**
 * Composable: Clients By Period Report
 */
export function useClientsByPeriodReport(): UseClientsByPeriodReport {
  // State
  const filterData = ref<ClientsByPeriodFilterInterface | null>(null)
  const reportData = ref<ClientsByPeriodReportResponse | null>(null)
  const error = ref<string | null>(null)

  const { isLoading, startLoading } = useLoading() as UseLoading
  const { showError } = useMessageDialog() as UseMessageDialog

  // ===== Optional: giá trị mặc định an toàn cho computed (tránh as-cast) =====
  // Nếu bạn biết rõ shape của ClientSummary/MemberSummary, có thể đặt “EMPTY_*” tương ứng:
  // const EMPTY_CLIENT_SUMMARY: ClientSummary = { ... }
  // const EMPTY_MEMBER_SUMMARY: MemberSummary = { ... }

  // Computed
  const clientSummary = computed<ClientSummary>(() => {
    // @ts-expect-error: nếu thiếu shape, bạn có thể dùng assertion như hiện tại
    return (reportData.value?.result?.clientSummary ?? {}) as ClientSummary
    // hoặc nếu có EMPTY_CLIENT_SUMMARY:
    // return reportData.value?.result?.clientSummary ?? EMPTY_CLIENT_SUMMARY
  })

  const memberSummary = computed<MemberSummary>(() => {
    // @ts-expect-error
    return (reportData.value?.result?.memberSummary ?? {}) as MemberSummary
    // hoặc: return reportData.value?.result?.memberSummary ?? EMPTY_MEMBER_SUMMARY
  })

  /**
   * Convert ClientsByPeriodFilterInterface to ClientsByPeriodReportRequest
   */
  const buildRequestPayload = (filters: ClientsByPeriodFilterInterface): ClientsByPeriodReportRequest => {
    // Lưu snapshot filter (tránh drift reactivity nếu cần: { ...filters })
    filterData.value = filters

    return {
      dateType: filters.dateType,
      fromDateTs: filters.fromDateTs,
      toDateTs: filters.toDateTs,
      shopId: filters.shopId,
      headquarterShopId: filters.headquarterShopId,
      isHeadquarterView: filters.isHeadquarterView,
      chainId: filters.chainId,
    }
  }

  /**
   * Fetch clients by period report data
   */
  const fetchReport = async (
    filters: ClientsByPeriodFilterInterface,
  ): Promise<ClientsByPeriodReportResponse | null> => {
    try {
      startLoading(true)
      error.value = null

      const requestPayload = buildRequestPayload(filters)
      const response = await clientReportReadService.getClientsByPeriodReport(requestPayload)

      if (!response.isOK) {
        showError(response.errorMessages)
        return response
      }

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
   * Clear the current report data and error state
   */
  const clearReport = (): void => {
    reportData.value = null
    error.value = null
  }

  /**
   * Refresh the report with current filters
   */
  const refreshReport = async (filters: ClientsByPeriodFilterInterface): Promise<void> => {
    await fetchReport(filters)
  }

  return {
    // State
    filterData,
    reportData,
    error,
    isLoading,

    // Computed
    clientSummary,
    memberSummary,

    // Methods
    fetchReport,
    clearReport,
    refreshReport,
    buildRequestPayload,
  }
}
