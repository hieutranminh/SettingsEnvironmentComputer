import { apiRead } from '@/services/api'
import type {
  SalesTypeReportRequest,
  SalesTypeReportResponse,
  SalesTypeReportResult,
} from '@/types/sales-setup/SalesType'

export const salesSetupReadService = {
  /**
   * Fetches service sales by month report for a specific chain
   * @param request - The request payload containing service sales by month report request
   * @returns Promise with the service sales by month report response
   */
  getSalesTypeSetup: (request: SalesTypeReportRequest): Promise<SalesTypeReportResponse> => {
    return apiRead.post<SalesTypeReportResult>('sales/SalesSetup/SalesTypeSetup', request)
  },
}
