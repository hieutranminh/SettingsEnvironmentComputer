import { createCmdHttp, createReadHttp, createAggrHttp } from 'Modules/api/http'

const cmdHttp = createCmdHttp()
const readHttp = createReadHttp()
const aggrHttp = createAggrHttp()

const uriBooking = '/bookings/Booking'

export const getBookingCalendarLive = async (payload) => {
  return await readHttp.post('/bookings/Booking/Calendar/Live', payload)
}

export const getToken = async (payload) => {
  return await cmdHttp.post('/bookings/Booking/getToken', payload)
}

export const getBookingsCalendar = async (payload) => {
  return await readHttp.post('/bookings/Booking/Calendar/Live', payload)
}

export const getAllCalendarSetups = async (payload) => {
  return await readHttp.post('/bookings/Booking/AllCalendarSetups/Live', payload)
}

export const getBookingList = async (payload) => {
  return await readHttp.post('/bookings/Booking/List/Live', payload)
}

export const getBookingHistoryByClient = async (payload) => {
  return await readHttp.post('/bookings/Booking/BookingHistoryByClient', payload)
}

export const getBookingItemsSetup = async (payload) => {
  return await readHttp.post('/bookings/BookingItemsSetup/Live', payload)
}
export const addBooking = async (payload) => {
  return await cmdHttp.post(uriBooking, payload)
}

export const updateBooking = async (payload) => {
  return await cmdHttp.put(uriBooking, payload)
}

export const updateBookingClient = async (payload) => {
  return await cmdHttp.put('/bookings/Booking/ConnectClient', payload)
}

export const updateBookingNaver = async (payload) => {
  return await aggrHttp.put('/Naver/UpdateBooking', payload)
}

/**
 * @typedef {Object} BOOKING_STATUS
 * @property {0} BOOKING_STATUS.ALL_NO_CANCELD
 * @property {1} BOOKING_STATUS.REQUESTED
 * @property {2} BOOKING_STATUS.COMPLETED
 * @property {3} BOOKING_STATUS.ARRIVED
 * @property {4} BOOKING_STATUS.CANCELED
 * @property {5} BOOKING_STATUS.NO_SHOW
 * @property {6} BOOKING_STATUS.CHECKED_OUT
 * @property {7} BOOKING_STATUS.NO_BOOKING
 * @property {8} BOOKING_STATUS.EXTERNAL_AUTO_CHECKED_OUT
 * @property {9} BOOKING_STATUS.EXTERNAL_CHECKED_OUT
 * @property {10} BOOKING_STATUS.PAYMENT_IN_PROGRESS
 * @param {Object} payload
 * @param {Number} payload.shopId
 * @param {Number} payload.bookingId
 * @param {String} payload.sessionToken
 * @param {String} payload.shopLocation
 * @param {BOOKING_STATUS} payload.status
 * @param {Number} payload.editedDateTimeTS
 */
export const updateBookingStatus = async (payload) => {
  return await cmdHttp.put('/bookings/Booking/UpdateStatus', payload)
}

export const cancelBooking = async (payload) => {
  return await cmdHttp.delete('/bookings/Booking/CancelRepeatBooking', { data: payload })
}

export const cancelBookingDepositPaid = async (payload) => {
  return await aggrHttp.delete('/Booking/CancelBooking', { data: payload })
}

export const noShowBookingDepositPaid = async (payload) => {
  return await aggrHttp.put('/Booking/NoShowBooking', payload)
}

export const addCancellationFeeSale = async (payload) => {
  return await aggrHttp.post('/Booking/AddCancellationFeeSales', payload)
}

export const deleteBookingCanceled = async (payload) => {
  return await cmdHttp.delete('/bookings/Booking', { data: payload })
}

export const changingWaitingToBooking = async (payload) => {
  return await cmdHttp.post('/bookings/Booking/ChangingWaitingToBooking', payload)
}

export const getUpcomingRepeatedBookingsLive = async (payload) => {
  return await readHttp.post('/bookings/Booking/UpcomingRepeatedBookings/Live', payload)
}

export const getBookingsSummaryByClient = async (payload) => {
  return await readHttp.post('/bookings/Booking/BookingsSummaryByClient', payload)
}

export const getBookingListToSendSms = async (payload) => {
  return await readHttp.post('/bookings/Booking/SendSms', payload)
}

export const getServicesAndBookingItems = async (payload) => {
  return await aggrHttp.post('/Booking/GetServicesAndBookingItems', payload)
}

export const updateNotes = async (payload) => {
  return await cmdHttp.post('/bookings/Booking/UpdateNotes', payload)
}

export const getBookingLive = async (payload) => {
  return await readHttp.post('/bookings/Booking/GetBooking/Live', payload)
}

export const getWaitingLive = async (payload) => {
  return await readHttp.post('/bookings/Waiting/Live', payload)
}

export const disconnectClientNaverBooking = async (payload) => {
  return cmdHttp.delete('/bookings/Booking/DisconnectClientFromNaver', { data: payload })
}

export const getBookingSendSms = async (payload) => {
  return readHttp.post('bookings/Booking/SendSms', payload)
}

/**
 * @param {Object} payload
 * @param {Number} payload.shopId
 * @param {String} payload.businessTypeName
 * @param {Number} payload.fromDateTS
 * @param {Number} payload.toDateTS
 * @param {Number} payload.language
 */
export const getOperationalTrendAnalysisReportBookingWithAISetup = async payload => {
  return await aggrHttp.post('/booking/OperationalTrendAnalysisReportBookingWithAISetup', payload)
}
