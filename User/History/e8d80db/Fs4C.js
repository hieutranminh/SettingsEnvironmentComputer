import BaseApi from '../base/base-api'
import { ApiMapper } from '../base/api-mapper'

const url_read_base = process.env.INTEGRATION_ADMIN_GATEWAY_BASEURL + '/api/read/v1/admins/AISetup'
const url_list = url_read_base + '/UserCommandHistory'

// Define field mapping for this API
const FIELD_MAP = {
  function_type:      'functionType',
  command:            'command',
  result:             'result',
  failure_code:       'failureCode',
  failure_message:    'failureMessage',
  ai_model:           'aIModel',
  subscriber_number:  'subscriberNumber',
  subscriber_name:    'subscriberName',
  business_type_code: 'businessTypeCode',
  registration_date:  'registrationDate',
}

const mapper = ApiMapper.createMapper(FIELD_MAP)

/**
 * User Command History API
 * Handles AI command history operations
 * @extends BaseApi
 */
export default class UserCommandHistoryApi extends BaseApi {
  /**
   * Map query parameters to API format
   * @param {Object} model - Query parameters
   * @returns {Object} API query parameters
   */
  mapFieldToApi(model) {
    return {
      pageNumber:        model.pageNumber,
      pageSize:          model.pageSize,
      fromDateTS:        model.fromDateTS,
      toDateTS:          model.toDateTS,
      functionType:      model.functionType,
      businessTypeCodes: model.businessTypeCodes,
      failureCode:       model.failureCode,
      subscriberNumber:  model.subscriberNumber,
      isViewFailedOnly:  model.isViewFailedOnly,
    }
  }

  /**
   * Map API response item to frontend format
   * @param {Object} model - API response item
   * @returns {Object} Frontend format item
   */
  mapFieldFromApi(model) {
    return mapper.fromApi(model)
  }

  /**
   * Get user command history list with pagination
   * @param {Object} query - Query parameters
   * @param {number} query.pageNumber - Page number
   * @param {number} query.pageSize - Page size
   * @param {number} query.fromDateTS - From date timestamp
   * @param {number} query.toDateTS - To date timestamp
   * @param {number} query.functionType - Function type filter
   * @param {string} query.businessTypeCodes - Business type codes filter
   * @param {string} query.failureCode - Failure code filter
   * @param {string} query.subscriberNumber - Subscriber number filter
   * @param {boolean} query.isViewFailedOnly - Show only failed records
   * @returns {Promise<ApiResponse>} Response with items array and pagination info
   */
  async getUserCommandHistoryListAsync(query) {
    const data_send = this.mapFieldToApi(query)

    return this.handleListApiCall(
      () => this.http.post(url_list, data_send),
      (item) => this.mapFieldFromApi(item)
    )
  }
}

