import Http from '../../helpers/http'
import { mapPagingFromApi } from '../../helpers/common'

const url_read_base = process.env.INTEGRATION_ADMIN_GATEWAY_BASEURL + '/api/read/v1/admins/AISetup'
const url_list = url_read_base + '/UserCommandHistory'

export default class UserCommandHistoryApi {
  constructor() {
    this.http = new Http()
    this.result = {
      isOK:          false,
      errorMessages: [],
      data:          {},
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

  async getUserCommandHistoryListAsync(query) {
    const data_send = this.mapFieldToApi(query)

    try {
      const response = await this.http.post(url_list, data_send)
      console.log('response', response)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if (this.result.is_ok) {
        const mapData = {
          items:      [],
          pagination: {},
        }

        for (const item of response.data.result.items) {
          mapData.items.push(item)
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

