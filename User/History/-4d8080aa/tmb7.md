# Phân Tích Cấu Trúc Xử Lý API - Dự Án AhaSoft Admin

## 📋 Tổng Quan

Dự án sử dụng **Vue.js 2** với kiến trúc **CQRS-inspired** (Command Query Responsibility Segregation) để tách biệt các hoạt động đọc (Read) và ghi (Command). API được tổ chức theo mô hình **microservices** với nhiều service domains khác nhau.

---

## 🏗️ Kiến Trúc Tổng Thể

### 1. Cấu Trúc Thư Mục

```
src/
├── api/                          # API Layer - Xử lý HTTP requests
│   ├── admin-sales/             # Domain: Admin Sales
│   ├── boards/                  # Domain: Boards (Notice, Banner, etc)
│   ├── identities/              # Domain: Authentication & Authorization
│   ├── messages/                # Domain: Messaging
│   ├── shops/                   # Domain: Shop Management
│   ├── solutions/               # Domain: Solutions & AI
│   └── ...
│
├── helpers/                      # Utilities & Core Functions
│   ├── http.js                  # HTTP Client (Axios wrapper)
│   ├── api-url-generator.js    # URL Generator cho các services
│   ├── common.js                # Helper functions chung
│   └── ...
│
├── store/                        # Vuex State Management
│   ├── admin-sales/
│   ├── boards/
│   ├── solutions/
│   └── store.js                 # Root store
│
├── view-model/                   # Data Models & Validation
│   ├── admin-sales/
│   ├── shops/
│   ├── solutions/
│   ├── validator.js             # Validation logic
│   └── view-model.js            # Base ViewModel class
│
└── pages/                        # Vue Components/Pages
    └── solution/
        └── ai-setup.vue
```

---

## 🔑 Các Thành Phần Chính

### 1. **HTTP Helper** (`helpers/http.js`)

**Vai trò**: Wrapper xung quanh Axios, xử lý:
- Authentication headers (Bearer token)
- Request/Response interceptors
- Error handling centralized
- Maintenance mode detection
- File download
- Response time tracking

**Đặc điểm nổi bật**:
```javascript
// Tự động thêm Authorization header
getHeaders(multipart = false) {
  let api_token = store.getters['user/getUser']['api_token']
  if (api_token) {
    defaultHeaders = {
      'Authorization': `Bearer ${api_token}`,
      ...defaultHeaders,
    }
  }
  return defaultHeaders
}

// Xử lý lỗi tập trung
setError(error) {
  // Redirect to login nếu 401
  if(error.response.status == 401) {
    window.location = '/#/login'
  }
  // Format error response
  return response
}

// Map errors từ API với error codes
mapErrorsFromApi(api_errors) {
  // Convert API error format sang application format
  // Hỗ trợ error codes và formatting
}
```

**Interceptors**:
- ✅ Request interceptor: Tracking time, check SignalR connection
- ✅ Response interceptor: Calculate response time, handle maintenance mode (503, 522)
- ✅ Error interceptor: Handle 401, 503, 522 status codes

---

### 2. **API URL Generator** (`helpers/api-url-generator.js`)

**Vai trò**: Tạo URLs động cho các microservices dựa trên:
- Service type (Read/Command)
- API version
- Service name
- Environment variables

**Cấu trúc URL**:
```
{GATEWAY_URL}/api/{read|cmd}/v{version}/{service_name}/{endpoint}
```

**Ví dụ**:
```javascript
// Generate URL cho Admins service
getUrlReadAdmins(api_name, version = undefined) {
  if(version == undefined) version = process.env.ADMINS_READ_API_VERSION
  return this.getUrlRead(version, process.env.ADMINS_SERVICE_NAME) + '/' + api_name
}

// Sử dụng với SERVICE_TYPES constants
const url_read = getServiceUrl(SERVICE_TYPES.ADMINS.SOLUTION_READ, 1)
// Result: {GATEWAY}/api/read/v1/admins/Solution
```

**Service Types được hỗ trợ**:
- `ADMINS`: Shop, Solution, Menu, Country, BusinessType, ServiceType, etc.
- `IDENTITIES`: UserAccount, UserRole, Auth
- `ADMIN_SALES`: BaseFee, NetmoneyHistory, ShopUsage
- `MESSAGES`: TextMessage, TextSample, SendMessage
- `BOARDS`: Notice, Banner, Popup, ManualManagement
- `CLIENTS`: Client management
- `MIGRATIONS`: Data migrations
- `GOODS`: Goods/Service management
- `BOOKINGS`: Booking resources

---

### 3. **API Classes** (Pattern Example: `user-command-history-api.js`)

**Cấu trúc chuẩn**:
```javascript
export default class UserCommandHistoryApi {
  constructor() {
    this.http = new Http()
    this.result = {
      is_ok:          false,
      error_messages: [],
      data:           {},
    }
  }

  // Map từ frontend model sang API format
  mapFieldToApi(model) {
    return {
      pageNumber: model.pageNumber,
      fromDateTS: model.fromDateTS,
      // camelCase for API
    }
  }

  // Map từ API format sang frontend model
  mapFieldFromApi(model) {
    return {
      function_type: model.functionType,
      command:       model.command,
      // snake_case for frontend
    }
  }

  // Async method gọi API
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
```

**Patterns quan trọng**:
1. ✅ **Consistent Result Format**: Mọi API đều return `{ is_ok, error_messages, data }`
2. ✅ **Field Mapping**: Tách biệt frontend naming (snake_case) vs API naming (camelCase/PascalCase)
3. ✅ **Error Handling**: Try-catch với centralized error handling
4. ✅ **Stateless**: Mỗi instance mới của API class

---

### 4. **ViewModel Layer** (`view-model/`)

**Vai trò**: 
- Định nghĩa data structure cho từng entity
- Validation rules
- Data transformation logic

**Base ViewModel**:
```javascript
export default class ViewModel {
  constructor(){
    this.fields = {}
  }
  
  setFields(fields_data){
    this.fields = Object.assign(this.fields, fields_data)
  }
  
  getFields(){
    return this.fields
  }
  
  isValid(validations) {
    let validator_instance = new Validator()
    validator_instance.setModel(this.fields)
    return validator_instance.validate(validations)
  }
}
```

**Example - SolutionViewModel**:
```javascript
export default class SolutionViewModel extends ViewModel {
  constructor(){
    super()
    this.fields = {
      id:                '',
      name:              '',
      home_url:          null,
      start_page:        '',
      notes:             '',
      status:            STATUS.ACTIVE,
      registration_date: '',
      is_admin_solution: false,
    }
  }
  
  getValidations(){
    return {
      name: {
        label: 'solutions.name',
        rules: {
          require:   '',
          maxLength: { max_value: 50 },
        },
      },
      home_url: {
        label: 'solutions.home-url',
        rules: {
          url:       '',
          maxLength: { max_value: 250 },
        },
      },
    }
  }
  
  isValid(){
    return super.isValid(this.getValidations())
  }
}
```

---

### 5. **Vuex Store Pattern**

**Cấu trúc**:
```javascript
// State
const state = {
  solutions:       {},
  solution_action: {},
}

// Getters
const getters = {
  getSolutions(state){
    return state.solutions
  },
}

// Mutations (synchronous)
const mutations = {
  setSolutions(state, solutions){
    state.solutions = solutions
  },
  updateSolution(state, solution_edit){
    // Update item in array
  },
}

// Actions (asynchronous)
const actions = {
  async getSolutionsDataAsync({commit}, filter){
    let solution_api = new SolutionApi()
    let result = await solution_api.getSolutionsAsync(filter)
    commit('setSolutions', result)
  },
}
```

**Pattern**: 
- Actions gọi API classes
- Mutations update state
- Components dispatch actions, không trực tiếp mutate state

---

### 6. **Component Usage Pattern**

**Example từ `ai-setup.vue`**:
```javascript
export default {
  data() {
    return {
      table_data: {
        fields: [...],
        rows: [],
        pagination: {},
      }
    }
  },

  async created() {
    await this.loadTableData()
  },

  methods: {
    async loadTableData() {
      try {
        this.preLoader(true)

        // 1. Tạo API instance
        const aiSetupApi = new AISetupApi()
        
        // 2. Gọi API method
        const result = await aiSetupApi.getAISetupListAsync()

        // 3. Check kết quả
        if (!result.is_ok) {
          this.showAlert(result.error_messages)
          return
        }

        // 4. Assign data
        this.table_data.rows = result.data.items
      } catch (error) {
        this.showAlert([error.message])
      } finally {
        this.preLoader(false)
      }
    },
  },
}
```

**Pattern quan trọng**:
1. ✅ Loader hiển thị trước khi call API
2. ✅ Try-catch-finally để đảm bảo cleanup
3. ✅ Kiểm tra `result.is_ok` trước khi sử dụng data
4. ✅ Hiển thị error messages từ API

---

## 📊 Data Flow

### Read Operation (Query)
```
┌──────────────┐
│  Component   │
│  (Vue)       │
└──────┬───────┘
       │ 1. Create API instance
       │ 2. Call async method
       ▼
┌──────────────┐
│  API Class   │
│  (solution-  │
│   api.js)    │
└──────┬───────┘
       │ 3. mapFieldToApi()
       │ 4. http.post()
       ▼
┌──────────────┐
│  Http Helper │
│  (http.js)   │
└──────┬───────┘
       │ 5. Add auth headers
       │ 6. Axios request
       ▼
┌──────────────┐
│  Backend API │
│  Gateway     │
└──────┬───────┘
       │ 7. Response
       ▼
┌──────────────┐
│  API Class   │
└──────┬───────┘
       │ 8. mapFieldFromApi()
       │ 9. Format result
       ▼
┌──────────────┐
│  Component   │
│  (Update UI) │
└──────────────┘
```

### Write Operation (Command)
```
Component → API Class → mapFieldToApi() 
  → Http Helper → Backend Gateway
  → Response → mapFieldFromApi() 
  → Update Store (if needed) → Component
```

---

## 🎯 Design Patterns Được Sử Dụng

### 1. **Repository Pattern**
- API classes đóng vai trò như repositories
- Tách biệt data access logic khỏi business logic
- Mỗi domain có API class riêng

### 2. **Adapter Pattern**
- `mapFieldToApi()` và `mapFieldFromApi()` 
- Convert giữa frontend format và API format
- Tách biệt external API contract khỏi internal data structure

### 3. **Factory Pattern**
- `api-url-generator.js` tạo URLs động
- Dựa trên service types và environments

### 4. **Singleton Pattern**
- Http helper instance được tái sử dụng
- Store instance duy nhất trong app

### 5. **Command Pattern**
- Vuex actions như commands
- Encapsulate requests as objects

---

## ✅ Ưu Điểm Của Kiến Trúc

### 1. **Separation of Concerns**
- API layer tách biệt hoàn toàn khỏi UI
- Clear boundaries giữa các layers
- Dễ test từng layer độc lập

### 2. **Consistency**
- Chuẩn hóa cách xử lý API responses
- Consistent error handling
- Standard result format: `{ is_ok, error_messages, data }`

### 3. **Maintainability**
- Dễ dàng thay đổi API endpoint (chỉ sửa url generator)
- Field mapping tập trung (không scatter trong components)
- Centralized error handling

### 4. **Scalability**
- Dễ thêm services mới
- Hỗ trợ multiple API versions
- Microservices-ready architecture

### 5. **Type Safety & Validation**
- ViewModel layer với validation rules
- Field mapping đảm bảo data integrity
- Validator tập trung

### 6. **Developer Experience**
- Clear patterns để follow
- Dễ onboard developers mới
- Code có thể predict được

---

## ⚠️ Một Số Điểm Cần Lưu Ý

### 1. **Naming Convention Mixing**
- Frontend: `snake_case` (e.g., `function_type`)
- API: `camelCase` hoặc `PascalCase` (e.g., `functionType`, `FunctionType`)
- **Cần mapping layer để convert**

### 2. **Error Handling**
```javascript
// API có thể trả về errors theo nhiều formats:
{
  errorCode: "MMT12C",
  errorMessage: "...",
  errorValues: [...]
}

// Hoặc simple string array
["Error message 1", "Error message 2"]
```

### 3. **Response Format**
```javascript
// Standard API response
{
  isOK: true/false,
  errorMessages: [],
  result: {
    items: [],
    pagingInfo: {
      pageNumber: 1,
      pageSize: 20,
      totalItems: 100
    }
  }
}
```

### 4. **Axios Interceptors**
- Request interceptor: Tracking time, check app version
- Response interceptor: Handle maintenance mode
- Error interceptor: Auto-redirect on 401

### 5. **State Management Flow**
```
Component → Action (API call) → Mutation → State Update → Component Re-render
```

---

## 🔧 Các Helper Functions Quan Trọng

### Common Helpers (`helpers/common.js`)

```javascript
// Pagination mapping
mapPagingFromApi(paging)
mapPagingToApi(query)

// Date/Time handling
formatDate(date, str_format)
convertDateToTimeStamp(date, is_convert_timezone, has_hours)
convertDateFromTimezoneToTimestamp(d, zone_from, has_hours)
convertTimeStampToDate(timestamp, is_convert_timezone)

// Data validation
nullToZero(data)
nullOrEmpty(data)
nullOrEmptyOrZero(data)

// Formatting
formatMoney(num, decimal_count = 2)
formatSize(size)
formatKRMobileAndPhoneNumber(phoneNumber)

// Object comparison
equalObject(object_1, object_2) // Using lodash _.isEqual
```

---

## 📝 Best Practices Được Áp Dụng

### 1. **API Classes**
```javascript
// ✅ Good
export default class ShopApi {
  constructor(){
    this.http = new Http()
    this.result = { is_ok: false, error_messages: [], data: {} }
  }

  async getShopsAsync(query) {
    try {
      const data_send = this.mapListFieldToApi(query)
      const response = await this.http.post(url_list, data_send)
      
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        // Process data
      }
    } catch(e) {
      return this.http.loadError(e)
    }
    return this.result
  }
}
```

### 2. **Component API Usage**
```javascript
// ✅ Good
async loadData() {
  try {
    this.preLoader(true)
    
    const api = new ShopApi()
    const result = await api.getShopsAsync(this.query)
    
    if (!result.is_ok) {
      this.showAlert(result.error_messages)
      return
    }
    
    this.items = result.data.items
  } catch (error) {
    this.showAlert([error.message])
  } finally {
    this.preLoader(false)
  }
}
```

### 3. **Field Mapping**
```javascript
// Always map fields explicitly
mapFieldToApi(model) {
  return {
    shopId:    model.shop_id,
    shopName:  model.shop_name,
    // Explicit mapping
  }
}

mapFieldFromApi(model) {
  return {
    shop_id:   model.shopId,
    shop_name: model.shopName,
    // Explicit mapping
  }
}
```

---

## 🚀 Khuyến Nghị

### 1. **Khi Thêm API Mới**
1. Tạo API class trong folder domain phù hợp (`src/api/{domain}/`)
2. Extend từ base pattern với constructor, result format
3. Implement `mapFieldToApi()` và `mapFieldFromApi()`
4. Sử dụng `getServiceUrl()` để generate URLs
5. Follow async/await pattern với try-catch
6. Return consistent result format

### 2. **Khi Sử Dụng API Trong Component**
1. Import API class
2. Wrap trong try-catch-finally
3. Show loader trước khi call
4. Check `result.is_ok` trước khi xử lý data
5. Handle errors properly với `showAlert()`
6. Hide loader trong finally block

### 3. **Khi Cần Validation**
1. Tạo ViewModel class cho entity
2. Define validation rules trong `getValidations()`
3. Sử dụng `isValid()` trước khi submit

### 4. **Khi Làm Việc Với State**
1. Prefer Vuex actions cho API calls có scope rộng
2. Direct API calls trong component cho local data
3. Always commit mutations, không directly mutate state
4. Use getters để access state

---

## 📚 Tech Stack

- **Frontend Framework**: Vue.js 2.6.12
- **State Management**: Vuex 3.0.1
- **HTTP Client**: Axios 0.21.4
- **Routing**: Vue Router 3.0.2
- **Date/Time**: Moment.js 2.24.0 + Moment Timezone 0.5.25
- **Utilities**: Lodash 4.17.21
- **Real-time**: SignalR (@microsoft/signalr 5.0.17)
- **Build Tool**: Webpack 5
- **Package Manager**: npm

---

## 📖 Tài Liệu Tham Khảo

### Environment Variables (`.env` files)
- `INTEGRATION_ADMIN_GATEWAY_BASEURL`: Base URL cho API gateway
- `ADMINS_SERVICE_NAME`: Service name cho Admins domain
- `ADMINS_READ_API_VERSION`: Version cho Read API
- `ADMINS_CMD_API_VERSION`: Version cho Command API
- (Tương tự cho các services khác)

### Key Files To Reference
- `src/helpers/http.js`: HTTP client implementation
- `src/helpers/api-url-generator.js`: URL generation logic
- `src/helpers/common.js`: Common utilities
- `src/config/constant.js`: Constants & enums
- `src/view-model/view-model.js`: Base ViewModel
- `src/view-model/validator.js`: Validation logic

---

## 🎓 Kết Luận

Dự án sử dụng một kiến trúc **layered architecture** rõ ràng với:
- **API Layer**: Xử lý HTTP communication
- **ViewModel Layer**: Data modeling & validation  
- **Store Layer**: State management
- **Component Layer**: UI logic

Pattern này mang lại:
- ✅ High maintainability
- ✅ Clear separation of concerns
- ✅ Easy to test
- ✅ Scalable for microservices
- ✅ Consistent code style across the project

**Đặc điểm nổi bật**: 
- CQRS-inspired với Read/Command separation
- Field mapping layer để tách biệt frontend/backend contracts
- Centralized error handling
- Consistent result format
- Strong validation with ViewModel pattern

---

**Tài liệu này được tạo bởi**: AI Analysis
**Ngày**: 2025-11-03
**Dự án**: AhaSoft Integration Admin (Vue.js)

