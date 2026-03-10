/**
 * Utility class for field mapping between frontend and API formats
 * 
 * Frontend typically uses snake_case
 * API typically uses camelCase or PascalCase
 */
export class ApiMapper {
  /**
   * Convert snake_case object keys to camelCase
   * @param {Object} obj - Object with snake_case keys
   * @returns {Object} Object with camelCase keys
   * @example
   * ApiMapper.toCamelCase({ user_name: 'John', user_id: 1 })
   * // Returns: { userName: 'John', userId: 1 }
   */
  static toCamelCase(obj) {
    if (!obj || typeof obj !== 'object') {
      return obj
    }

    const result = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        result[camelKey] = obj[key]
      }
    }
    return result
  }

  /**
   * Convert camelCase object keys to snake_case
   * @param {Object} obj - Object with camelCase keys
   * @returns {Object} Object with snake_case keys
   * @example
   * ApiMapper.toSnakeCase({ userName: 'John', userId: 1 })
   * // Returns: { user_name: 'John', user_id: 1 }
   */
  static toSnakeCase(obj) {
    if (!obj || typeof obj !== 'object') {
      return obj
    }

    const result = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        result[snakeKey] = obj[key]
      }
    }
    return result
  }

  /**
   * Map array of objects using provided mapping function
   * @param {Array} items - Array of items to map
   * @param {Function} mapFunction - Function to map each item
   * @returns {Array} Mapped array
   */
  static mapArray(items, mapFunction) {
    if (!Array.isArray(items)) {
      return []
    }
    return items.map(mapFunction)
  }

  /**
   * Create a mapper with predefined field mappings
   * @param {Object} fieldMap - Object mapping frontend keys to API keys
   * @returns {Object} Object with toApi and fromApi methods
   * @example
   * const mapper = ApiMapper.createMapper({
   *   user_name: 'userName',
   *   user_id: 'userId'
   * })
   * 
   * mapper.toApi({ user_name: 'John', user_id: 1 })
   * // Returns: { userName: 'John', userId: 1 }
   * 
   * mapper.fromApi({ userName: 'John', userId: 1 })
   * // Returns: { user_name: 'John', user_id: 1 }
   */
  static createMapper(fieldMap) {
    return {
      /**
       * Map from frontend format to API format
       * @param {Object} model - Frontend model
       * @returns {Object} API model
       */
      toApi: (model) => {
        if (!model) return {}
        
        const result = {}
        for (const [frontendKey, apiKey] of Object.entries(fieldMap)) {
          if (model[frontendKey] !== undefined) {
            result[apiKey] = model[frontendKey]
          }
        }
        return result
      },

      /**
       * Map from API format to frontend format
       * @param {Object} model - API model
       * @returns {Object} Frontend model
       */
      fromApi: (model) => {
        if (!model) return {}
        
        const result = {}
        for (const [frontendKey, apiKey] of Object.entries(fieldMap)) {
          if (model[apiKey] !== undefined) {
            result[frontendKey] = model[apiKey]
          }
        }
        return result
      },
    }
  }

  /**
   * Create a bidirectional mapper with custom functions
   * @param {Function} toApiFn - Function to map to API format
   * @param {Function} fromApiFn - Function to map from API format
   * @returns {Object} Object with toApi and fromApi methods
   */
  static createCustomMapper(toApiFn, fromApiFn) {
    return {
      toApi:   toApiFn,
      fromApi: fromApiFn,
    }
  }

  /**
   * Deep map object (handles nested objects)
   * @param {Object} obj - Object to map
   * @param {Function} keyTransform - Function to transform keys
   * @returns {Object} Mapped object
   */
  static deepMap(obj, keyTransform) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj
    }

    const result = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = keyTransform(key)
        const value = obj[key]

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          result[newKey] = this.deepMap(value, keyTransform)
        } else if (Array.isArray(value)) {
          result[newKey] = value.map(item => 
            (item && typeof item === 'object') ? this.deepMap(item, keyTransform) : item
          )
        } else {
          result[newKey] = value
        }
      }
    }
    return result
  }
}

/**
 * Helper to create a simple field map from an array of field pairs
 * @param {Array<[string, string]>} pairs - Array of [frontendKey, apiKey] pairs
 * @returns {Object} Field map object
 * @example
 * const fieldMap = createFieldMap([
 *   ['user_name', 'userName'],
 *   ['user_id', 'userId']
 * ])
 * // Returns: { user_name: 'userName', user_id: 'userId' }
 */
export function createFieldMap(pairs) {
  const map = {}
  for (const [frontendKey, apiKey] of pairs) {
    map[frontendKey] = apiKey
  }
  return map
}

