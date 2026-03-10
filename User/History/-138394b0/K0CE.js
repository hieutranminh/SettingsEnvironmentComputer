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
