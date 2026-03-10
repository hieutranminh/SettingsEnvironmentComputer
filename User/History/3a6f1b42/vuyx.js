import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_read = getServiceUrl(SERVICE_TYPES.ADMINS.BUSINESS_TYPE_READ, 1) // Read API URL, Version
const url_command = getServiceUrl(SERVICE_TYPES.ADMINS.BUSINESS_TYPE_CMD, 1) // Command API URL, Version

let url_change_order_no = url_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO
let url_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class BusinessTypeApi {
  constructor(){
    this.http = new Http()
    this.result = {
      is_ok:          false,
      error_messages: [],
      data:           {},
    }
  }

  mapFieldToApi(model){
    return {
      businessTypeId:   model.id,
      businessTypeCode: model.code,
      codeName:         model.code_name,
      status:           model.status,
      orderNo:          model.order_no,
    }
  }

  mapFieldFromApi(model){
    return {
      id:        model.businessTypeId,
      code:      model.businessTypeCode,
      code_name: model.codeName,
      status:    model.status,
      order_no:  model.orderNo,
    }
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getBusinessTypeAsync(query) {
    let data_send = {
      status:           query.status,
      businessTypeCode: query.business_type_code,
    }

    try {
      const response = await this.http.post(url_read, data_send)
      this.result.action = query.action
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getBusinessTypesAsync(query) {
    let data_send = {
      status: query,
    }

    try {
      const response = await this.http.post(url_list, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapFieldFromApi(response.data.result.items[item]))
        }
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async createBusinessTypeAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateBusinessTypeAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.put(url_command, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateBusinessTypeOrderNoAsync(data) {
    let data_send = {
      oldPositionId: data.old_position_id,
      newPositionId: data.new_position_id,
    }

    try {
      const response = await this.http.post(url_change_order_no, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}
