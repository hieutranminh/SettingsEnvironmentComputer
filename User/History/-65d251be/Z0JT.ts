import { apiRead } from '@/services/api'
import type { SalesTypeReportRequest, SalesTypeReportResponse } from '@/types/sales-setup/SalesType'

export const salesSetupReadService = {
  /**
   * Fetches service sales by month report for a specific chain
   * @param request - The request payload containing service sales by month report request
   * @returns Promise with the service sales by month report response
   */
  getSalesTypeSetup: (request: SalesTypeReportRequest) => {
    return apiRead.post<SalesTypeReportResponse>('sales/SalesSetup/SalesTypeSetup', request)
  },
}
