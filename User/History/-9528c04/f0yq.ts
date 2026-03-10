import { apiRead } from '@/services/api'
import type {
  PrepaidGoodsRepurchaseReportRequest,
  PrepaidGoodsRepurchaseReportResponse,
  PrepaidGoodsRepurchaseReportResult,
} from '@/types/client-report/PrepaidGoodsRepurchase'
import type {
  SalesByRepeatClientsReportRequest,
  SalesByRepeatClientsReportResponse,
  SalesByRepeatClientsReportResult,
} from '@/types/client-report/SalesByRepeatClients'

export const clientReportReadService = {
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

  /**
   * Fetches prepaid goods repurchase report for a specific chain
   * @param request - The request payload containing prepaid goods repurchase report request
   * @returns Promise with the prepaid goods repurchase report response
   */
  getPrepaidGoodsRepurchaseReport: (
    request: PrepaidGoodsRepurchaseReportRequest,
  ): Promise<PrepaidGoodsRepurchaseReportResponse> => {
    return apiRead.post<PrepaidGoodsRepurchaseReportResult>('sales/ClientReport/GetSalesByRepeatClientsReport', request)
  },
}
