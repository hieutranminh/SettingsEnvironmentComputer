import { apiRead } from '@/services/api'
import type { SalesTypeReportRequest, SalesTypeReportResponse } from '@/types/sales-setup/SalesType'

export const salesSetupReadService = {
  /**
   * Fetches sales type setup
   * @param request - The request payload containing sales type setup request
   * @returns Promise with the sales type setup response
   */
  getSalesType: (request: SalesTypeReportRequest) => {
    return apiRead.post<SalesTypeReportResponse>('sales/SalesSetup/SalesType/Live', request)
  },
}
