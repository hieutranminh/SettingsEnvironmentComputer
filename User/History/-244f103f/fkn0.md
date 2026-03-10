# Plan Refactor - AhaSoft Admin VueJS

## 📋 Tổng Quan

Dự án đang có cấu trúc tốt nhưng có một số điểm cần cải thiện để tăng tính maintainability, reusability và consistency.

---

## 🎯 Mục Tiêu Refactor

1. ✅ **Giảm code duplication** trong API classes
2. ✅ **Chuẩn hóa error handling** và response format
3. ✅ **Tạo base classes** để tái sử dụng
4. ✅ **Cải thiện type safety** với JSDoc comments
5. ✅ **Tối ưu hóa component patterns**
6. ✅ **Chuẩn hóa naming conventions**

---

## 🏗️ Cấu Trúc Refactor

### Phase 1: Core Infrastructure (Ưu tiên cao)
1. Tạo BaseApi class
2. Tạo ApiResponse standard
3. Cải thiện Http helper
4. Tạo composables/hooks

### Phase 2: API Layer Refactor (Ưu tiên trung bình)
1. Refactor existing API classes
2. Standardize field mapping
3. Add JSDoc documentation

### Phase 3: Component Layer (Ưu tiên thấp)
1. Extract common logic to mixins/composables
2. Standardize component patterns
3. Improve error handling

---

## 📝 Chi Tiết Từng Task

### ✅ Task 1: Tạo BaseApi Class

**File**: `src/api/base/base-api.js`

**Mục đích**: 
- Tập trung logic chung của tất cả API classes
- Giảm code duplication (constructor, result format, error handling)
- Chuẩn hóa response handling

**Nội dung**:
```javascript
/**
 * Base API Class
 * All API classes should extend from this
 */
export default class BaseApi {
  constructor() {
    this.http = new Http()
    this.result = this.createEmptyResult()
  }

  createEmptyResult() {
    return {
      is_ok: false,
      error_messages: [],
      data: {},
    }
  }

  resetResult() {
    this.result = this.createEmptyResult()
  }

  async handleApiCall(apiCall, options = {}) {
    try {
      const response = await apiCall()
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if (this.result.is_ok && options.processData) {
        this.result.data = options.processData(response.data.result)
      } else if (this.result.is_ok) {
        this.result.data = response.data.result
      }
    } catch (e) {
      return this.http.loadError(e)
    }
    return this.result
  }

  // Helper for list responses with pagination
  async handleListApiCall(apiCall, mapItemFunc) {
    return this.handleApiCall(apiCall, {
      processData: (result) => ({
        items: result.items.map(mapItemFunc),
        pagination: mapPagingFromApi(result.pagingInfo),
      }),
    })
  }

  // Helper for single item responses
  async handleSingleApiCall(apiCall, mapItemFunc) {
    return this.handleApiCall(apiCall, {
      processData: (result) => mapItemFunc(result),
    })
  }
}
```

**Impact**: 
- Giảm ~10-15 dòng code duplicate trong mỗi API class
- Có thể có ~22 API classes → tiết kiệm ~200-300 dòng code

---

### ✅ Task 2: Tạo ApiResponse Standard Type

**File**: `src/api/base/api-response.js`

**Mục đích**: 
- Định nghĩa rõ ràng response structure
- Giúp IDE autocomplete
- Document cho developers

**Nội dung**:
```javascript
/**
 * @typedef {Object} ApiResponse
 * @property {boolean} is_ok - Indicates if the API call was successful
 * @property {string[]} error_messages - Array of error messages if failed
 * @property {*} data - Response data (structure depends on endpoint)
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} items - Array of items
 * @property {PaginationInfo} pagination - Pagination information
 */

/**
 * @typedef {Object} PaginationInfo
 * @property {number} page_number - Current page number
 * @property {number} page_size - Items per page
 * @property {number} total_items - Total number of items
 * @property {number} total_pages - Total number of pages
 */

/**
 * Creates a standard API response object
 * @param {boolean} is_ok 
 * @param {*} data 
 * @param {string[]} error_messages 
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
 * @param {Array} items 
 * @param {PaginationInfo} pagination 
 * @returns {PaginatedResponse}
 */
export function createPaginatedResponse(items = [], pagination = {}) {
  return {
    items,
    pagination,
  }
}
```

---

### ✅ Task 3: Tạo ApiMapper Utility

**File**: `src/api/base/api-mapper.js`

**Mục đích**: 
- Tách biệt mapping logic
- Reusable mapping functions
- Easier to test

**Nội dung**:
```javascript
/**
 * Base class for field mapping
 */
export class ApiMapper {
  /**
   * Convert snake_case to camelCase
   */
  static toCamelCase(obj) {
    const result = {}
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelKey] = obj[key]
    }
    return result
  }

  /**
   * Convert camelCase to snake_case
   */
  static toSnakeCase(obj) {
    const result = {}
    for (const key in obj) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      result[snakeKey] = obj[key]
    }
    return result
  }

  /**
   * Map array of objects
   */
  static mapArray(items, mapFunction) {
    return items.map(mapFunction)
  }

  /**
   * Create mapper with predefined field mappings
   */
  static createMapper(fieldMap) {
    return {
      toApi: (model) => {
        const result = {}
        for (const [frontendKey, apiKey] of Object.entries(fieldMap)) {
          if (model[frontendKey] !== undefined) {
            result[apiKey] = model[frontendKey]
          }
        }
        return result
      },
      fromApi: (model) => {
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
}
```

---

### ✅ Task 4: Refactor UserCommandHistoryApi với BaseApi

**File**: `src/api/solutions/user-command-history-api.js`

**Before**:
```javascript
export default class UserCommandHistoryApi {
  constructor() {
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {},
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
          items: [],
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
```

**After**:
```javascript
import BaseApi from '../base/base-api'
import { ApiMapper } from '../base/api-mapper'

// Define field mapping once
const FIELD_MAP = {
  function_type: 'functionType',
  command: 'command',
  result: 'result',
  failure_code: 'failureCode',
  failure_message: 'failureMessage',
  ai_model: 'aIModel',
  subscriber_number: 'subscriberNumber',
  subscriber_name: 'subscriberName',
  business_type_code: 'businessTypeCode',
  registration_date: 'registrationDate',
}

const mapper = ApiMapper.createMapper(FIELD_MAP)

export default class UserCommandHistoryApi extends BaseApi {
  /**
   * Map query to API format
   * @param {Object} model 
   * @returns {Object}
   */
  mapFieldToApi(model) {
    return {
      pageNumber: model.pageNumber,
      pageSize: model.pageSize,
      fromDateTS: model.fromDateTS,
      toDateTS: model.toDateTS,
      functionType: model.functionType,
      businessTypeCodes: model.businessTypeCodes,
      failureCode: model.failureCode,
      subscriberNumber: model.subscriberNumber,
      isViewFailedOnly: model.isViewFailedOnly,
    }
  }

  /**
   * Map API response to frontend format
   * @param {Object} model 
   * @returns {Object}
   */
  mapFieldFromApi(model) {
    return mapper.fromApi(model)
  }

  /**
   * Get user command history list
   * @param {Object} query - Query parameters
   * @returns {Promise<ApiResponse>}
   */
  async getUserCommandHistoryListAsync(query) {
    const data_send = this.mapFieldToApi(query)
    
    return this.handleListApiCall(
      () => this.http.post(url_list, data_send),
      (item) => this.mapFieldFromApi(item)
    )
  }
}
```

**Benefits**:
- Giảm từ 73 → ~50 dòng code
- Dễ đọc và maintain hơn
- Consistent với các API classes khác
- Ít error-prone hơn

---

### ✅ Task 5: Tạo useApiCall Composable

**File**: `src/composables/useApiCall.js`

**Mục đích**: 
- Tái sử dụng logic gọi API trong components
- Tự động handle loading state
- Tự động handle errors
- Support Vue 2 với @vue/composition-api

**Nội dung**:
```javascript
import { ref } from '@vue/composition-api'

/**
 * Composable for handling API calls
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Options
 * @returns {Object}
 */
export function useApiCall(apiFunction, options = {}) {
  const {
    immediate = false,
    onSuccess = null,
    onError = null,
    showLoader = true,
  } = options

  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const isSuccess = ref(false)

  /**
   * Execute the API call
   * @param  {...any} args - Arguments to pass to API function
   */
  async function execute(...args) {
    loading.value = true
    error.value = null
    isSuccess.value = false

    if (showLoader && window.$store) {
      window.$store.dispatch('alert/setIsLoadingData', true)
    }

    try {
      const result = await apiFunction(...args)

      if (result.is_ok) {
        data.value = result.data
        isSuccess.value = true
        if (onSuccess) {
          onSuccess(result.data)
        }
      } else {
        error.value = result.error_messages
        if (onError) {
          onError(result.error_messages)
        }
      }

      return result
    } catch (e) {
      error.value = [e.message]
      if (onError) {
        onError([e.message])
      }
      throw e
    } finally {
      loading.value = false
      if (showLoader && window.$store) {
        window.$store.dispatch('alert/setIsLoadingData', false)
      }
    }
  }

  // Auto execute if immediate
  if (immediate) {
    execute()
  }

  return {
    data,
    error,
    loading,
    isSuccess,
    execute,
  }
}

/**
 * Composable for handling list API calls with pagination
 */
export function useApiList(apiFunction, options = {}) {
  const {
    pageSize = 20,
    autoLoad = true,
  } = options

  const items = ref([])
  const pagination = ref({
    page_number: 1,
    page_size: pageSize,
    total_items: 0,
    total_pages: 1,
  })

  const filters = ref({})

  const { loading, error, execute } = useApiCall(
    async (filterParams) => {
      const query = {
        pageNumber: pagination.value.page_number,
        pageSize: pagination.value.page_size,
        ...filterParams,
      }
      return apiFunction(query)
    },
    {
      ...options,
      onSuccess: (data) => {
        items.value = data.items || []
        if (data.pagination) {
          pagination.value = data.pagination
        }
        if (options.onSuccess) {
          options.onSuccess(data)
        }
      },
    }
  )

  async function loadData(filterParams = {}) {
    filters.value = filterParams
    return execute(filterParams)
  }

  async function changePage(pageNumber) {
    pagination.value.page_number = pageNumber
    return execute(filters.value)
  }

  async function refresh() {
    return execute(filters.value)
  }

  if (autoLoad) {
    loadData()
  }

  return {
    items,
    pagination,
    filters,
    loading,
    error,
    loadData,
    changePage,
    refresh,
  }
}
```

---

### ✅ Task 6: Refactor user-command-history.vue Component

**File**: `src/pages/solution/user-command-history.vue`

**Improvements**:
1. Sử dụng composable thay vì manual state management
2. Tách logic thành computed properties
3. Giảm repetitive code
4. Better error handling

**Script section - BEFORE**: ~190 dòng

**Script section - AFTER**:
```javascript
<script>
import { ref, computed, onMounted } from '@vue/composition-api'
import DatePicker from '../../components/common/datepicker/datepicker'
import view_table from '../../components/common/view-table/view-table.vue'
import component_base from '../../components/common/component-base/component-base'
import modal_user_command_history_result from '../../components/solution/modal-user-command-history-result.vue'
import { FUNCTION_TYPE } from '../../config/constant'
import { options } from '../../helpers/options'
import { convertDateToTimezone, convertDateFromTimezoneToTimestamp } from '../../helpers/common'
import SolutionsDropdwonListApi from 'API/solutions/dropdown-list-api'
import UserCommandHistoryApi from 'API/solutions/user-command-history-api'
import { useApiList, useApiCall } from '../../composables/useApiCall'
import { formatDate, convertDateFromUtcToTimezone } from 'CommonHelpers'

export default {
  components: {
    'view-table': view_table,
    'v-date-picker': DatePicker,
    'modal-user-command-history-result': modal_user_command_history_result,
  },

  extends: component_base,

  setup(props, { root }) {
    // API instances
    const userCommandHistoryApi = new UserCommandHistoryApi()
    const dropdownListApi = new SolutionsDropdwonListApi()

    // Date filters
    const fromDate = ref(convertDateToTimezone(new Date()))
    const toDate = ref(convertDateToTimezone(new Date()))

    // Business type data
    const businessTypeResponse = ref([])

    // Modal data
    const currentResult = ref({})
    const modalUserCommandHistoryResultId = 'modal-user-command-history-result'

    // Initialize filters
    const initialFilters = {
      fromDateTS: convertDateFromTimezoneToTimestamp(fromDate.value),
      toDateTS: convertDateFromTimezoneToTimestamp(toDate.value),
      functionType: FUNCTION_TYPE.ALL,
      businessTypeCodes: '',
      failureCode: '',
      subscriberNumber: '',
      isViewFailedOnly: false,
    }

    // Use composable for list API
    const {
      items,
      pagination,
      filters,
      loading,
      error,
      loadData,
      changePage,
    } = useApiList(
      (query) => userCommandHistoryApi.getUserCommandHistoryListAsync(query),
      {
        pageSize: options.pagination.default,
        autoLoad: false,
      }
    )

    // Set initial filters
    Object.assign(filters.value, initialFilters)

    // Computed options
    const functionTypeOptions = computed(() => [
      { value: FUNCTION_TYPE.ALL, text: root.$t('general.all-select') },
      { value: FUNCTION_TYPE.BOOK, text: root.$t('user-command-history.label-option-book') },
      { value: FUNCTION_TYPE.CRM, text: root.$t('user-command-history.label-option-crm') },
      { value: FUNCTION_TYPE.MESSAGE, text: root.$t('user-command-history.label-option-message') },
      { value: FUNCTION_TYPE.REPORT, text: root.$t('user-command-history.label-option-report') },
    ])

    const businessTypeOptions = computed(() => {
      const defaultOptions = [
        { text: root.$t('general.all-select'), value: '' },
      ]
      return [
        ...defaultOptions,
        ...businessTypeResponse.value.map(item => ({
          value: item.id,
          text: item.name,
        })),
      ]
    })

    // Table configuration
    const table_data = computed(() => ({
      fields: [
        { field: 'registration_date', label: 'user-command-history.label-date', width: '8%', expand: true },
        { field: 'subscriber_number', label: 'user-command-history.label-subscriber-number', width: '8%' },
        { field: 'subscriber_name', label: 'user-command-history.label-subscriber-name', width: '8%' },
        { field: 'business_type_code', label: 'user-command-history.label-business-type', width: '8%', expand: true },
        { field: 'function_type', label: 'user-command-history.label-function', width: '8%', expand: true },
        { field: 'command', label: 'user-command-history.label-command', width: '44%', tdClass: 'tal' },
        { field: 'failure_code', label: 'user-command-history.label-failure-code', width: '8%' },
        { field: 'result', label: 'user-command-history.label-result', width: '8%', expand: true },
      ],
      rows: items.value,
      pagination: pagination.value,
      options: {
        pagination: true,
      },
      style: 'type-top',
    }))

    // Methods
    const onSearch = async () => {
      filters.value.pageNumber = 1
      await loadData(filters.value)
    }

    const onChangePage = (page_num) => {
      changePage(page_num)
    }

    const onChangeFromDate = () => {
      filters.value.fromDateTS = convertDateFromTimezoneToTimestamp(fromDate.value)
    }

    const onChangeToDate = () => {
      filters.value.toDateTS = convertDateFromTimezoneToTimestamp(toDate.value)
    }

    const getFunctionTypeText = (functionType) => {
      const option = functionTypeOptions.value.find(opt => opt.value === functionType)
      return option ? option.text : functionType
    }

    const getBusinessTypeText = (businessTypeCode) => {
      if (!businessTypeCode) {
        return root.$t('general.all-select')
      }
      const businessType = businessTypeResponse.value.find(item => item.id === businessTypeCode)
      return businessType ? businessType.name : businessTypeCode
    }

    const formatDateCol = (date) => {
      const shop_data = root.$store.getters['user/getShop']
      return formatDate(
        convertDateFromUtcToTimezone(date, shop_data.timezone),
        shop_data.format_date + ' HH:mm:ss'
      )
    }

    const onActionResult = (result) => {
      currentResult.value = JSON.parse(result)
      root.$root.$emit('bv::show::modal', modalUserCommandHistoryResultId)
    }

    // Load dropdown data
    const loadBusinessTypes = useApiCall(
      async () => {
        const shop_data = root.$store.getters['user/getShop']
        const payload = {
          item_types: [options.dropdown_list_type.business_type],
          country_code: shop_data.country,
          solution_id: shop_data.solution_id,
        }
        return dropdownListApi.getDropdownListAsync(payload)
      },
      {
        onSuccess: (data) => {
          businessTypeResponse.value = data.items[0].items
        },
        onError: (errors) => {
          root.$store.dispatch('alert/setAlertsData', errors)
          root.$root.$emit('bv::show::modal', 'alert-modal')
        },
      }
    )

    // Lifecycle
    onMounted(async () => {
      await loadBusinessTypes.execute()
      await loadData(filters.value)
    })

    return {
      // Data
      fromDate,
      toDate,
      filters,
      table_data,
      currentResult,
      modalUserCommandHistoryResultId,
      
      // Computed
      functionTypeOptions,
      businessTypeOptions,
      
      // Methods
      onSearch,
      onChangePage,
      onChangeFromDate,
      onChangeToDate,
      getFunctionTypeText,
      getBusinessTypeText,
      formatDateCol,
      onActionResult,
    }
  },
}
</script>
```

**Benefits**:
- Code ngắn gọn hơn (~30% reduction)
- Logic tách biệt rõ ràng
- Reusable composables
- Better type safety với JSDoc
- Dễ test hơn

---

### ✅ Task 7: Cải Thiện Http Helper

**File**: `src/helpers/http.js`

**Improvements**:
1. Add request/response logging trong development
2. Better error typing
3. Request retry mechanism
4. Request cancellation support

**Additions**:
```javascript
export default class Http {
  constructor() {
    this.cancelTokens = new Map()
  }

  /**
   * Create cancel token for request
   * @param {string} requestId 
   */
  createCancelToken(requestId) {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    this.cancelTokens.set(requestId, source)
    return source.token
  }

  /**
   * Cancel request by ID
   * @param {string} requestId 
   */
  cancelRequest(requestId) {
    const source = this.cancelTokens.get(requestId)
    if (source) {
      source.cancel('Request cancelled by user')
      this.cancelTokens.delete(requestId)
    }
  }

  /**
   * Post with retry support
   * @param {string} uri 
   * @param {*} data 
   * @param {Object} options 
   */
  async postWithRetry(uri, data, options = {}) {
    const { retries = 3, retryDelay = 1000 } = options
    
    for (let i = 0; i < retries; i++) {
      try {
        return await this.post(uri, data)
      } catch (error) {
        if (i === retries - 1) throw error
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
  }

  /**
   * Log request in development
   */
  logRequest(method, uri, data) {
    if (process.env.NODE_ENV === 'local') {
      console.group(`🌐 API ${method.toUpperCase()}: ${uri}`)
      console.log('Request data:', data)
      console.groupEnd()
    }
  }

  /**
   * Log response in development
   */
  logResponse(method, uri, response) {
    if (process.env.NODE_ENV === 'local') {
      console.group(`✅ API ${method.toUpperCase()}: ${uri}`)
      console.log('Response:', response.data)
      console.log('Time:', response.responseTime + 'ms')
      console.groupEnd()
    }
  }
}
```

---

### ✅ Task 8: Tạo Constants cho Error Codes

**File**: `src/config/error-codes.js`

**Mục đích**: 
- Centralize error codes
- Easier to reference
- Better documentation

**Nội dung**:
```javascript
/**
 * API Error Codes
 */
export const ERROR_CODES = {
  // Common errors
  UNAUTHORIZED: 'E401',
  FORBIDDEN: 'E403',
  NOT_FOUND: 'E404',
  VALIDATION_ERROR: 'E422',
  SERVER_ERROR: 'E500',

  // Business logic errors
  MMT12C: 'MMT12C', // Message error
  MSA22C: 'MSA22C', // Sales error
  MPS07C: 'MPS07C', // Payment error
  MPC06C: 'MPC06C', // Client error

  // Add more as needed
}

/**
 * Error messages mapping
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: 'general.error-unauthorized',
  [ERROR_CODES.FORBIDDEN]: 'general.error-forbidden',
  [ERROR_CODES.NOT_FOUND]: 'general.error-not-found',
  [ERROR_CODES.SERVER_ERROR]: 'general.error-server',
}

/**
 * Get error message key by code
 * @param {string} code 
 * @returns {string}
 */
export function getErrorMessageKey(code) {
  return ERROR_MESSAGES[code] || 'general.error-unknown'
}
```

---

### ✅ Task 9: Tạo API Factory

**File**: `src/api/api-factory.js`

**Mục đích**: 
- Centralized API instance creation
- Easier dependency injection
- Better for testing

**Nội dung**:
```javascript
// Import all API classes
import UserCommandHistoryApi from './solutions/user-command-history-api'
import AISetupApi from './solutions/ai-setup-api'
import SolutionApi from './solutions/solution-api'
import ShopApi from './shops/shop-api'
// ... import others

/**
 * API Factory
 * Centralized API instance creation
 */
class ApiFactory {
  constructor() {
    this._instances = new Map()
  }

  /**
   * Get or create API instance
   * @param {string} apiName 
   * @param {Function} ApiClass 
   */
  getInstance(apiName, ApiClass) {
    if (!this._instances.has(apiName)) {
      this._instances.set(apiName, new ApiClass())
    }
    return this._instances.get(apiName)
  }

  // Convenience methods
  getUserCommandHistoryApi() {
    return this.getInstance('userCommandHistory', UserCommandHistoryApi)
  }

  getAISetupApi() {
    return this.getInstance('aiSetup', AISetupApi)
  }

  getSolutionApi() {
    return this.getInstance('solution', SolutionApi)
  }

  getShopApi() {
    return this.getInstance('shop', ShopApi)
  }

  // Add more as needed...

  /**
   * Clear all instances (useful for testing)
   */
  clearInstances() {
    this._instances.clear()
  }
}

// Export singleton instance
export const apiFactory = new ApiFactory()

// Also export class for testing
export { ApiFactory }
```

**Usage in components**:
```javascript
import { apiFactory } from '@/api/api-factory'

// Instead of:
const userCommandHistoryApi = new UserCommandHistoryApi()

// Use:
const userCommandHistoryApi = apiFactory.getUserCommandHistoryApi()
```

---

### ✅ Task 10: Standardize Component Naming

**Current Issues**:
- Mix của kebab-case và snake_case
- `view_table` vs `view-table`
- `component_base` vs `component-base`

**Chuẩn hóa**:
```javascript
// ❌ Bad - Inconsistent
import view_table from '../../components/common/view-table/view-table.vue'
import component_base from '../../components/common/component-base/component-base'

components: {
  'view-table': view_table,
}

// ✅ Good - Consistent
import ViewTable from '../../components/common/view-table/view-table.vue'
import ComponentBase from '../../components/common/component-base/component-base.vue'

components: {
  ViewTable,
}

// Or with kebab-case (preferred for Vue 2)
import viewTable from '../../components/common/view-table/view-table.vue'
import componentBase from '../../components/common/component-base/component-base.vue'

components: {
  'view-table': viewTable,
}
```

---

## 📊 Checklist Implementation

### Phase 1: Core Infrastructure

- [ ] 1.1. Tạo `src/api/base/` folder
- [ ] 1.2. Implement `BaseApi` class
- [ ] 1.3. Implement `ApiResponse` types
- [ ] 1.4. Implement `ApiMapper` utility
- [ ] 1.5. Add JSDoc comments
- [ ] 1.6. Tạo unit tests cho base classes
- [ ] 1.7. Update `src/helpers/http.js` với improvements
- [ ] 1.8. Tạo `src/composables/` folder
- [ ] 1.9. Implement `useApiCall` composable
- [ ] 1.10. Implement `useApiList` composable

### Phase 2: API Layer Refactor

- [ ] 2.1. Refactor `UserCommandHistoryApi` → extend BaseApi
- [ ] 2.2. Refactor `AISetupApi` → extend BaseApi
- [ ] 2.3. Refactor `SolutionApi` → extend BaseApi
- [ ] 2.4. Refactor các API classes khác (20+ files)
- [ ] 2.5. Chuẩn hóa field mapping patterns
- [ ] 2.6. Add JSDoc comments cho tất cả methods
- [ ] 2.7. Tạo `error-codes.js` constants
- [ ] 2.8. Implement `ApiFactory`
- [ ] 2.9. Update imports trong components

### Phase 3: Component Layer

- [ ] 3.1. Refactor `user-command-history.vue` với composables
- [ ] 3.2. Refactor `ai-setup.vue` với composables
- [ ] 3.3. Chuẩn hóa component naming
- [ ] 3.4. Extract common logic to mixins
- [ ] 3.5. Standardize error handling
- [ ] 3.6. Add loading states consistently

### Phase 4: Testing & Documentation

- [ ] 4.1. Write unit tests cho BaseApi
- [ ] 4.2. Write unit tests cho composables
- [ ] 4.3. Write integration tests cho refactored APIs
- [ ] 4.4. Update documentation
- [ ] 4.5. Add migration guide
- [ ] 4.6. Code review

---

## 🎯 Ưu Tiên Thực Hiện

### Priority 1 (Làm ngay - Impact cao, Effort thấp)
1. ✅ Task 1: Tạo BaseApi class
2. ✅ Task 2: Tạo ApiResponse types
3. ✅ Task 4: Refactor 1-2 API classes làm example
4. ✅ Task 10: Standardize naming

**Estimated Time**: 4-6 hours
**Impact**: High - Giảm 20-30% duplicate code

### Priority 2 (Làm tiếp theo - Impact trung bình, Effort trung bình)
1. ✅ Task 5: Tạo useApiCall composable
2. ✅ Task 6: Refactor 1-2 components làm example
3. ✅ Task 7: Cải thiện Http helper
4. ✅ Task 8: Tạo error codes constants

**Estimated Time**: 6-8 hours
**Impact**: Medium - Cải thiện developer experience

### Priority 3 (Làm sau - Impact thấp, Effort cao)
1. ✅ Task 9: API Factory
2. ⏳ Refactor tất cả remaining API classes
3. ⏳ Refactor tất cả remaining components
4. ⏳ Write comprehensive tests

**Estimated Time**: 20-30 hours
**Impact**: Low-Medium - Long term maintainability

---

## 📈 Metrics & Goals

### Code Quality Metrics
- **Reduce code duplication**: Target 30% reduction in API layer
- **Increase test coverage**: From 0% → 60%
- **Improve type safety**: 100% JSDoc coverage for public APIs
- **Reduce avg. component lines**: From ~250 → ~150 lines

### Developer Experience
- **Faster feature development**: 20-30% faster API integration
- **Less bugs**: Standardized patterns = fewer mistakes
- **Easier onboarding**: Clear patterns to follow
- **Better IDE support**: JSDoc enables autocomplete

---

## 🚨 Risks & Mitigation

### Risk 1: Breaking Changes
**Mitigation**: 
- Implement incrementally
- Keep old code alongside new code
- Create feature flags
- Thorough testing

### Risk 2: Learning Curve
**Mitigation**:
- Comprehensive documentation
- Example implementations
- Pair programming sessions
- Code review guidelines

### Risk 3: Time Investment
**Mitigation**:
- Prioritize high-impact changes
- Refactor opportunistically (when touching files)
- Don't refactor everything at once
- Measure benefits after each phase

---

## 📚 File Structure Sau Refactor

```
src/
├── api/
│   ├── base/
│   │   ├── base-api.js          ✨ NEW
│   │   ├── api-response.js      ✨ NEW
│   │   └── api-mapper.js        ✨ NEW
│   ├── api-factory.js           ✨ NEW
│   ├── admin-sales/
│   │   └── *.js                 🔄 REFACTORED
│   ├── solutions/
│   │   └── *.js                 🔄 REFACTORED
│   └── ...
│
├── composables/                 ✨ NEW FOLDER
│   ├── useApiCall.js           ✨ NEW
│   ├── useApiList.js           ✨ NEW
│   └── useForm.js              ✨ NEW (future)
│
├── config/
│   ├── error-codes.js          ✨ NEW
│   └── constant.js             ✅ EXISTING
│
├── helpers/
│   ├── http.js                 🔄 ENHANCED
│   ├── api-url-generator.js   ✅ EXISTING
│   └── common.js               ✅ EXISTING
│
└── pages/
    └── solution/
        ├── user-command-history.vue  🔄 REFACTORED
        └── ai-setup.vue              🔄 REFACTORED
```

---

## 💡 Best Practices Sau Refactor

### 1. Creating New API Class
```javascript
import BaseApi from '../base/base-api'

export default class MyNewApi extends BaseApi {
  async getListAsync(query) {
    return this.handleListApiCall(
      () => this.http.post(url, this.mapToApi(query)),
      (item) => this.mapFromApi(item)
    )
  }
}
```

### 2. Using API in Component
```javascript
import { useApiList } from '@/composables/useApiCall'
import { apiFactory } from '@/api/api-factory'

setup() {
  const api = apiFactory.getMyNewApi()
  
  const { items, loading, loadData } = useApiList(
    (query) => api.getListAsync(query)
  )
  
  return { items, loading, loadData }
}
```

### 3. Error Handling
```javascript
const { execute } = useApiCall(apiFunction, {
  onError: (errors) => {
    // Auto show alert
    showAlert(errors)
  }
})
```

---

## 📝 Documentation Updates Needed

1. **API Development Guide**: How to create new API classes
2. **Component Development Guide**: How to use composables
3. **Migration Guide**: How to migrate old code to new patterns
4. **Testing Guide**: How to test APIs and composables
5. **Architecture Decision Record**: Why we made these changes

---

## 🎓 Kết Luận

Refactor plan này sẽ:
- ✅ Giảm code duplication đáng kể
- ✅ Cải thiện maintainability
- ✅ Tăng developer productivity
- ✅ Tạo foundation tốt cho future development
- ✅ Dễ dàng onboard developers mới

**Khuyến nghị**: Bắt đầu với Priority 1 tasks, implement từng task một, test kỹ, rồi mới chuyển sang Priority 2.

---

**Created**: 2025-11-03
**Status**: Pending Implementation
**Owner**: Development Team

