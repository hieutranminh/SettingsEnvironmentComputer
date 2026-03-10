import Http from '../../helpers/http'
import { mapPagingFromApi } from '../../helpers/common'

/**
 * Base API Class
 * All API classes should extend from this base class
 * to ensure consistent structure and reduce code duplication
 * 
 * @example
 * ```javascript
 * export default class MyApi extends BaseApi {
 *   async getListAsync(query) {
 *     return this.handleListApiCall(
 *       () => this.http.post(url, query),
 *       (item) => this.mapFieldFromApi(item)
 *     )
 *   }
 * }
 * ```
 */
export default class BaseApi {
  constructor() {
    this.http = new Http()
    this.result = this.createEmptyResult()
  }

  /**
   * Create an empty result object with standard structure
   * @returns {ApiResponse}
   */
  createEmptyResult() {
    return {
      is_ok:          false,
      error_messages: [],
      data:           {},
    }
  }

  /**
   * Reset result to empty state
   */
  resetResult() {
    this.result = this.createEmptyResult()
  }

  /**
   * Handle API call with consistent error handling
   * @param {Function} apiCall - Function that returns promise from axios
   * @param {Object} options - Configuration options
   * @param {Function} options.processData - Function to process successful response data
   * @param {*} options.action - Action identifier to attach to result
   * @returns {Promise<ApiResponse>}
   */
  async handleApiCall(apiCall, options = {}) {
    try {
      const response = await apiCall()
      
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if (this.result.is_ok) {
        if (options.processData) {
          this.result.data = options.processData(response.data.result)
        } else {
          this.result.data = response.data.result
        }
      }

      // Attach action if provided
      if (options.action !== undefined) {
        this.result.action = options.action
      }
    } catch (e) {
      return this.http.loadError(e)
    }

    return this.result
  }

  /**
   * Handle API call for list responses with pagination
   * @param {Function} apiCall - Function that returns promise from axios
   * @param {Function} mapItemFunc - Function to map each item in the list
   * @param {Object} options - Additional options
   * @returns {Promise<ApiResponse>}
   */
  async handleListApiCall(apiCall, mapItemFunc, options = {}) {
    return this.handleApiCall(apiCall, {
      ...options,
      processData: (result) => {
        const mappedData = {
          items:      [],
          pagination: {},
        }

        // Map items
        if (result.items) {
          for (const item of result.items) {
            mappedData.items.push(mapItemFunc(item))
          }
        }

        // Map pagination if exists
        if (result.pagingInfo) {
          mappedData.pagination = mapPagingFromApi(result.pagingInfo)
        }

        return mappedData
      },
    })
  }

  /**
   * Handle API call for single item responses
   * @param {Function} apiCall - Function that returns promise from axios
   * @param {Function} mapItemFunc - Function to map the item
   * @param {Object} options - Additional options
   * @returns {Promise<ApiResponse>}
   */
  async handleSingleApiCall(apiCall, mapItemFunc, options = {}) {
    return this.handleApiCall(apiCall, {
      ...options,
      processData: (result) => mapItemFunc(result),
    })
  }

  /**
   * Set result from response (legacy method for backward compatibility)
   * @deprecated Use handleSingleApiCall instead
   * @param {Object} response - Axios response
   * @param {Function} mapFunc - Optional mapping function
   */
  setResult(response, mapFunc = null) {
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if (response.data.isOK) {
      if (mapFunc) {
        this.result.data = mapFunc(response.data.result)
      } else {
        this.result.data = response.data.result
      }
    }
  }
}

