import Http from '../../helpers/http'
import { mapPagingFromApi } from '../../helpers/common'

const url_read_base = process.env.INTEGRATION_ADMIN_GATEWAY_BASEURL + '/api/read/v1/admin/AISetup'
const url_list = url_read_base + '/UserCommandHistory'

export default class UserCommandHistoryApi {
  constructor() {
    this.http = new Http()
    this.result = {
      is_ok:          false,
      error_messages: [],
      data:           {},
    }
  }

  mapFieldToApi(model) {
    return {
      pageNumber:       model.pageNumber,
      pageSize:         model.pageSize,
      fromDateTS:       model.fromDateTS,
      toDateTS:         model.toDateTS,
      functionType:     model.functionType,
      businessTypeCode: model.businessTypeCode,
      failureCode:      model.failureCode,
      subscriberNumber: model.subscriberNumber,
    }
  }

  mapFieldFromApi(model) {
    return {
      function_type:      model.functionType,
      command:            model.command,
      result:             model.result,
      failure_code:       model.failureCode,
      failure_message:    model.failureMessage,
      ai_model:           model.aIModel,
      subscriber_number:  model.subscriberNumber,
      subscriber_name:    model.subscriberName,
      business_type_code: model.businessTypeCode,
    }
  }

  async getUserCommandHistoryListAsync(query) {
    const data_send = this.mapFieldToApi(query)

    try {
      const response = await this.http.post(url_list, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if (this.result.is_ok) {
        const mapData = {
          items:      [],
          pagination: {},
        }

        for (const item of response.data.result.items) {
          mapData.items.push(this.mapFieldFromApi(item))
        }

        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        this.result.data = mapData
      }
    } catch (e) {
      return this.http.loadError(e)
    }

    return this.result
  }
}

