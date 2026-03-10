import BaseApi from '../base/base-api'
import { ApiMapper } from '../base/api-mapper'

const url_read_base = process.env.INTEGRATION_ADMIN_GATEWAY_BASEURL + '/api/read/v1/admins/AISetup'
const url_list = url_read_base + '/List'

// Define field mapping for this API
const FIELD_MAP = {
  id:            'id',
  function_type: 'functionType',
  ai_model:      'aiModel',
  prompt:        'prompt',
}

const mapper = ApiMapper.createMapper(FIELD_MAP)

/**
 * AI Setup API
 * Handles AI configuration and setup operations
 * @extends BaseApi
 */
export default class AISetupApi extends BaseApi {
  /**
   * Map API response item to frontend format
   * @param {Object} model - API response item
   * @returns {Object} Frontend format item
   */
  mapFieldFromApi(model) {
    return mapper.fromApi(model)
  }

  /**
   * Get AI setup list
   * @returns {Promise<ApiResponse>} Response with items array
   */
  async getAISetupListAsync() {
    return this.handleApiCall(
      () => this.http.post(url_list, {}),
      {
        processData: (result) => ({
          items: result.items.map(item => this.mapFieldFromApi(item)),
        }),
      }
    )
  }
}

