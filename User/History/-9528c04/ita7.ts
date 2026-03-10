import { apiRead } from '@/services/api'
import type {
  ClientsByPeriodReportRequest,
  ClientsByPeriodReportResponse,
  ClientsByPeriodReportResult,
} from '@/types/client-report/ClientsByPeriod'
import type {
  NewClientRepeatReportRequest,
  NewClientRepeatReportResult,
  NewClientRepeatReportResponse,
} from '@/types/client-report/NewClientsRepeat'
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

  /**
   * Fetches clients by period report for a specific chain
   * @param request - The request payload containing clients by period report request
   * @returns Promise with the clients by period report response
   */
  getClientsByPeriodReport: (request: ClientsByPeriodReportRequest): Promise<ClientsByPeriodReportResponse> => {
    return apiRead.post<ClientsByPeriodReportResult>('sales/ClientReport/GetClientsByPeriodReport', request)
  },

  /**
   * Fetches new client repeat report for a specific chain
   * @param request - The request payload containing new client repeat report request
   * @returns Promise with the new client repeat report response
   */
  getNewClientRepeatReport: (request: NewClientRepeatReportRequest): Promise<NewClientRepeatReportResponse> => {
    return apiRead.post<NewClientRepeatReportResult>('sales/ClientReport/GetNewClientRepeatReport', request)
  },
}
