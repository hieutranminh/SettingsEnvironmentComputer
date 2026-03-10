import { apiRead } from '@/services/api'
import type { ListResponse } from '@/types/ApiResponse'
import type {
  SalesTypeReportItem,
  SalesTypeReportRequest,
  SalesTypeReportResponse,
} from '@/types/sales-setup/SalesType'

export const salesSetupReadService = {
  /**
   * Fetches sales type setup
   * @param request - The request payload containing sales type setup request
   * @returns Promise with the sales type setup response
   */
  getSalesType: (request: SalesTypeReportRequest): Promise<SalesTypeReportResponse> => {
    return apiRead.post<ListResponse<SalesTypeReportItem>>('sales/SalesSetup/SalesType/Live', request)
  },
}
