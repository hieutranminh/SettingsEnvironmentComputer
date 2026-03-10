import { apiRead } from '@/services/api'
import type {
  SalesByRepeatClientsReportRequest,
  SalesByRepeatClientsReportResponse,
  SalesByRepeatClientsReportResult,
} from '@/types/client-report/SalesByRepeatClients'

export const salesReportsReadService = {
  /**
   * Fetches sales by repeat clients report for a specific chain
   * @param request - The request payload containing sales by repeat clients report request
   * @returns Promise with the sales by repeat clients report response
   */
  getSalesByRepeatClientsReport: (
    request: SalesByRepeatClientsReportRequest,
  ): Promise<SalesByRepeatClientsReportResponse> => {
    return apiRead.post<SalesByRepeatClientsReportResult>('sales/ClientReport/GetSalesByRepeatClientsReport', request)
  },
}
