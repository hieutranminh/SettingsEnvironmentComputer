import { createCmdHttp, createReadHttp } from 'Modules/api/http'

const cmdHttp = createCmdHttp()
const readHttp = createReadHttp()

export const getAhaAISetup = (payload) => {
  return readHttp.post('admins/AhaAISetup/Shop', payload)
}

export const updateAhaAISetup = (payload) => {
  return cmdHttp.put('admins/AhaAISetup', payload)
}
