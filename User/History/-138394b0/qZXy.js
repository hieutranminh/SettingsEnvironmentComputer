import { createCmdHttp, createReadHttp, createAggrHttp } from 'Modules/api/http'

const cmdHttp = createCmdHttp()
const readHttp = createReadHttp()
const aggrHttp = createAggrHttp()

export const getAhaAISetup = (payload) => {
  return readHttp.post('admins/AhaAISetup/Shop', payload)
}

export const updateAhaAISetup = (payload) => {
  return cmdHttp.put('admins/AhaAISetup', payload)
}

export const getAhaAIBookingAgent = (payload) => {
  return aggrHttp.post('Agent/BookingAgent', payload)
}

export const getAhaAIServiceAndBookingItemAgent = (payload) => {
  return aggrHttp.post('Agent/ServiceAndBookingItemAgent', payload)
}

export const getAvailableTimes = (payload) => {
  return readHttp.post('bookings/Booking/SearchAvailableTimes/Live', payload)
}

export const getMessageAgent = (payload) => {
  return Promise.reject({
    response: {
      status: 500,
      data:   { message: 'Internal Server Error (Test)' },
    },
  })
  // return aggrHttp.post('Agent/MessageAgent', payload)
}
