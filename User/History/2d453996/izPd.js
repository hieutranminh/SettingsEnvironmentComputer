import { getShopId } from 'CommonHelpers'
import { createCmdHttp, createReadHttp, createAggrHttp } from 'Modules/api/http'

const cmdHttp = createCmdHttp()
const aggrHttp = createAggrHttp()
const readHttp = createReadHttp()

export const moveBalance = async (payload) => {
  return await cmdHttp.post('/sales/BalanceMove', payload)
}

/**
 * @param {Object} payload
 * @param {Number} payload.shopId
 * @param {Number} payload.clientId
*/
export const getClientAccount = async (payload) => {
  return await readHttp.post('/sales/ClientAccounts/ClientAccounts/Live', {
    ...payload,
    shopId:       getShopId(),
    clientShopId: payload.shopId,
  })
}

/**
 * @param {Object} payload
 * @param {Number} payload.shopId
 * @param {Number} payload.clientId
 * @param {Number} payload.toDateTS
 * @param {Number} payload.pageSize
 * @param {Number} payload.fromDateTS
 * @param {Number} payload.pageNumber
 * @param {Number} payload.clientShopId
 * @param {Boolean} payload.includeDeleted
 */
export const getSalesHistoriesByClient = async (payload) => {
  return await readHttp.post('/sales/Sales/SalesHistoriesByClient/Live', payload)
}

/**
 * @param {Object} payload
 * @param {Number} payload.shopId
 * @param {Number} payload.staffId
 * @param {Number} payload.pageSize
 * @param {Number} payload.dateType
 * @param {Number} payload.toDateTS
 * @param {Number} payload.pageNumber
 * @param {Number} payload.fromDateTS
 * @param {Number} payload.clientShopId
 * @param {Boolean} payload.includeDeleted
 * @param {Boolean} payload.includeProduct
 * @param {Boolean} payload.includeService
 * @param {Number} payload.paymentMethodId
 * @param {String} payload.deductionTypeCode
 * @param {Boolean} payload.includePrepaidCard
 * @param {Boolean} payload.includeOutstanding
 * @param {Boolean} payload.includePrepaidService
 */
export const getSalesHistories = async (payload) => {
  return await readHttp.post('/sales/Sales/SalesHistories/Live', payload)
}

export const getLatestSalesHistories = async (payload) => {
  return await readHttp.post('/sales/Sales/LatestSalesHistories/Live', payload)
}

export const getClientPrepaidServices = async (payload) => {
  return await readHttp.post('/sales/ClientPrepaidService/ClientPrepaidServices/Live', payload)
}

export const getClientPrepaidCards = async (payload) => {
  return await readHttp.post('/sales/ClientPrepaidCard/ClientPrepaidCards/Live', payload)
}

export const updatePrepaidCardHistoryNote = async (payload) => {
  return await cmdHttp.put('/sales/ClientPrepaidCard/UpdatePrepaidCardHistoryNote', payload)
}

export const updatePrepaidServiceHistoryNote = async (payload) => {
  return await cmdHttp.put('/sales/ClientPrepaidService/UpdatePrepaidServiceHistoryNote', payload)
}

export const updateOutstandingHistoryNote = async (payload) => {
  return await cmdHttp.put(`/sales/OutstandingHistory/${payload.id}`, payload)
}

export const updateStaffsOnly = async (payload) => {
  return await cmdHttp.put('/sales/Sales/UpdateStaffsOnly', payload)
}

export const updateClientPrepaidCard = async (payload) => {
  return await cmdHttp.put('/sales/ClientPrepaidCard', payload)
}

export const updateClientPrepaidService = async (payload) => {
  return await cmdHttp.put('/sales/ClientPrepaidService', payload)
}

export const getSalesByBookingId = async (payload) => {
  return await readHttp.post('/sales/Sales/SalesByBookingId/Live', payload)
}

export const deleteSales = async (payload) => {
  return await cmdHttp.delete('/sales/Sales', { data: payload })
}

export const deleteCancellationFeeSales = async (payload) => {
  return await aggrHttp.delete(`/sales/DeleteCancellationFeeSales/${payload.salesNumber}`, { data: payload })
}

export const getClientAccountAndValidPrepaidGoods = async (payload) => {
  return await readHttp.post('/sales/ClientAccounts/ClientAccountAndValidPrepaidGoods/Live', payload)
}

export const getClientPrepaidCardHistories = async (payload) => {
  return await readHttp.post('/sales/ClientPrepaidCard/ClientPrepaidCardHistories/Live', payload)
}

export const getClientPrepaidServiceHistories = async (payload) => {
  return await readHttp.post('/sales/ClientPrepaidService/ClientPrepaidServiceHistories/Live', payload)
}

export const connectClientToSales = async (payload) => {
  return await cmdHttp.post('/sales/Sales/ConnectClient', payload)
}
/**
 * @param {Object} payload
 * @param {Number} payload.shopId
 * @param {Number} payload.pageSize
 * @param {Number} payload.pageNumber
 * @param {Number} payload.toDateTS
 * @param {Number} payload.fromDateTS
 * @param {Boolean} payload.includeDeleted
 */
export const getTodaySalesHistories = async (payload) => {
  return await readHttp.post('/sales/Sales/TodaySalesHistories/Live', payload)
}

export const deleteBalanceMoveByHistoryId = async (payload) => {
  return await cmdHttp.delete('/sales/BalanceMove/DeleteBalanceMoveByHistoryId', {
    data: payload,
  })
}

/**
 * @param {Object} payload
 * @param {Number} payload.shopId
 * @param {Number} payload.clientId
 * @param {Number} payload.pageSize
 * @param {Number} payload.pageNumber
 * @param {Number} payload.clientShopId
 */
export const getLoyaltyPointsHistories = async payload => {
  return await readHttp.post('sales/ClientHistory/LoyaltyPointHistories/Live', payload)
}

export const deleteSalesByPayAtSalon = async payload => {
  return await aggrHttp.delete('/Sales/DeleteSalesByPayAtSalon', {
    data: payload,
  })
}

export const getDraftDocument = async payload => {
  return await readHttp.post('/sales/DraftDocument/DraftDocument/Live', payload)
}

export const editNoteLoyaltyPointsHistory = async payload => {
  return await cmdHttp.put('sales/client/ChangeClientPointsHistory', payload)
}

/**
 * @param {Object} payload
 * @param {Number} payload.shopId
 * @param {Number} payload.status
 * @param {String} payload.salesNumber
 * @param {Number} payload.clientShopId
 */
export const getSalesLive = async payload => {
  return await readHttp.post('/sales/Sales/Sales/Live', payload)
}

/**
 * @param {Object} payload
 * @param {Number} payload.shopId
 * @param {String} payload.businessTypeName
 * @param {Number} payload.fromDateTS
 * @param {Number} payload.toDateTS
 */
export const getOperationalTrendAnalysisReportOverallRevenue = async payload => {
  return await aggrHttp.post('/sales/OperationalTrendAnalysisReportSaleWithAISetup', payload)
}
