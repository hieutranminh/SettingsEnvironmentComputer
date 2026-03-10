/**
 * @typedef {Object} ApiResponse
 * @property {boolean} is_ok - Indicates if the API call was successful
 * @property {string[]} error_messages - Array of error messages if failed
 * @property {*} data - Response data (structure depends on endpoint)
 * @property {*} [action] - Optional action identifier
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} items - Array of items
 * @property {PaginationInfo} pagination - Pagination information
 */

/**
 * @typedef {Object} PaginationInfo
 * @property {number} page_number - Current page number (1-based)
 * @property {number} page_size - Number of items per page
 * @property {number} total_items - Total number of items across all pages
 * @property {number} total_pages - Total number of pages
 */

/**
 * Creates a standard API response object
 * @param {boolean} is_ok - Success status
 * @param {*} data - Response data
 * @param {string[]} error_messages - Error messages array
 * @returns {ApiResponse}
 */
export function createApiResponse(is_ok = false, data = {}, error_messages = []) {
  return {
    is_ok,
    error_messages,
    data,
  }
}

/**
 * Creates a standard paginated response
 * @param {Array} items - Array of items
 * @param {PaginationInfo} pagination - Pagination info
 * @returns {PaginatedResponse}
 */
export function createPaginatedResponse(items = [], pagination = {}) {
  return {
    items,
    pagination,
  }
}

/**
 * Creates empty pagination info
 * @param {number} page_size - Default page size
 * @returns {PaginationInfo}
 */
export function createEmptyPagination(page_size = 20) {
  return {
    page_number: 1,
    page_size:   page_size,
    total_items: 0,
    total_pages: 1,
  }
}

/**
 * Check if response is successful
 * @param {ApiResponse} response 
 * @returns {boolean}
 */
export function isApiSuccess(response) {
  return response && response.is_ok === true
}

/**
 * Check if response has errors
 * @param {ApiResponse} response 
 * @returns {boolean}
 */
export function hasApiErrors(response) {
  return response && (!response.is_ok || (response.error_messages && response.error_messages.length > 0))
}

/**
 * Get error messages from response
 * @param {ApiResponse} response 
 * @returns {string[]}
 */
export function getApiErrors(response) {
  return (response && response.error_messages) || []
}

/**
 * Get data from response safely
 * @param {ApiResponse} response 
 * @param {*} defaultValue - Default value if no data
 * @returns {*}
 */
export function getApiData(response, defaultValue = null) {
  return (response && response.is_ok && response.data) || defaultValue
}

