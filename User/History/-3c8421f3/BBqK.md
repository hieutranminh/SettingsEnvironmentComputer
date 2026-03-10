# Advanced Refactor Recommendations - Vue 3 Expert Analysis

## 🔍 Tổng Quan

Dự án đang sử dụng **Vue 2.6.12** với **@vue/composition-api** plugin (v1.6.2). Đây là một điểm tốt vì đã có Composition API, nhưng còn rất nhiều patterns cần cải thiện để code hiện đại hơn và maintainable hơn.

---

## 🚨 Critical Issues Cần Refactor Ngay

### 1. ❌ Template Slot Syntax (Deprecated)

**Issue**: Sử dụng `slot` và `slot-scope` syntax (Vue 2 old style)

**Current Code** (`user-command-history.vue`):
```vue
<template
  slot="registration_date"
  slot-scope="{ row }"
>
  {{ formatDateCol(row.registration_date) }}
</template>
```

**Problem**: 
- ❌ `slot` và `slot-scope` đã deprecated từ Vue 2.6
- ❌ Sẽ bị remove hoàn toàn trong Vue 3
- ❌ Không consistent với modern Vue patterns

**Should Be** (Vue 2.6+ / Vue 3 compatible):
```vue
<template #registration_date="{ row }">
  {{ formatDateCol(row.registration_date) }}
</template>

<!-- Or full syntax -->
<template v-slot:registration_date="{ row }">
  {{ formatDateCol(row.registration_date) }}
</template>
```

**Impact**: 
- 🔴 HIGH - Affects ~50+ components
- All view-table slot usage needs update
- Must fix before migrating to Vue 3

---

### 2. ❌ Component Registration với Snake_case

**Issue**: Mix của naming conventions

**Current Code**:
```javascript
components: {
  'view-table': view_table,  // kebab-case → snake_case variable
  'v-date-picker': DatePicker, // kebab-case → PascalCase variable
}
```

**Problem**:
- ❌ Inconsistent naming
- ❌ Hard to refactor
- ❌ Confusing for new developers

**Should Be**:
```javascript
// Option 1: PascalCase (Recommended for Vue 3)
import ViewTable from '../../components/common/view-table/view-table.vue'
import VDatePicker from '../../components/common/datepicker/datepicker.vue'

components: {
  ViewTable,
  VDatePicker,
}

// Usage in template: <ViewTable /> or <view-table />

// Option 2: kebab-case (Keep current for Vue 2)
import viewTable from '../../components/common/view-table/view-table.vue'
import vDatePicker from '../../components/common/datepicker/datepicker.vue'

components: {
  'view-table': viewTable,
  'v-date-picker': vDatePicker,
}
```

**Impact**:
- 🟡 MEDIUM - Affects all components
- Style inconsistency
- Should fix incrementally

---

### 3. ❌ Component Extends Pattern

**Issue**: Sử dụng `extends` thay vì mixins hoặc composables

**Current Code**:
```javascript
export default {
  extends: component_base,
  // ...
}
```

**Problems**:
- ❌ `extends` less explicit than mixins
- ❌ Hard to track what's coming from where
- ❌ Name collision issues
- ❌ Should use Composition API instead

**Should Be** (With Composition API):
```javascript
// composables/useComponentBase.js
import { computed } from '@vue/composition-api'
import { mapGetters } from 'vuex'

export function useComponentBase() {
  // Use composition-api plugin for Vue 2
  const store = this.$store // Access via this in Vue 2
  
  const userData = computed(() => store.getters['user/getUser'])
  const shopData = computed(() => store.getters['user/getShop'])
  
  const preLoader = (loading = true) => {
    store.dispatch('alert/setIsLoadingData', loading)
  }
  
  const showAlert = (messages, option) => {
    store.dispatch('alert/setAlertsData', messages)
    if (option) store.dispatch('alert/setOptionsData', option)
    // Show modal
  }
  
  return {
    userData,
    shopData,
    preLoader,
    showAlert,
  }
}
```

**Usage**:
```javascript
import { useComponentBase } from '@/composables/useComponentBase'

export default {
  setup() {
    const { userData, shopData, preLoader, showAlert } = useComponentBase()
    
    return {
      userData,
      shopData,
      preLoader,
      showAlert,
    }
  }
}
```

**Impact**:
- 🔴 HIGH - Central pattern used everywhere
- Better for Vue 3 migration
- More explicit and testable

---

### 4. ❌ Data Initialization Issues

**Issue**: Computed properties được call trong data initialization

**Current Code** (`user-command-history.vue`):
```javascript
data() {
  return {
    businessType: [{ 
      text: this.$t('general.all-select'),  // ❌ Accessing this.$t in data()
      value: options.admins_enums.all 
    }],
  }
}
```

**Problems**:
- ❌ `this` context might not be ready in data()
- ❌ Can cause undefined errors
- ❌ Anti-pattern in Vue

**Should Be**:
```javascript
data() {
  return {
    businessType: [],
  }
},

created() {
  // Initialize after component is created
  this.businessType = [{ 
    text: this.$t('general.all-select'),
    value: options.admins_enums.all 
  }]
}

// Or better, use computed:
computed: {
  defaultBusinessType() {
    return [{ 
      text: this.$t('general.all-select'),
      value: options.admins_enums.all 
    }]
  }
}
```

---

### 5. ❌ Unnecessary Data Properties

**Issue**: Unused data properties (`ai-setup.vue`)

**Current Code**:
```javascript
data() {
  return {
    functionTypeOptions: [],  // ❌ Never used
    aiModelOptions: [],       // ❌ Never used
  }
}
```

**Should**: Remove unused properties

---

### 6. ❌ Mutation of Props Pattern

**Issue**: V-model on computed without setter

**Current Code** (`select-options.vue`):
```javascript
data(){
  return {
    set: this.value,  // ❌ Copying prop to data
  }
},
computed: {
  select_data: {
    set(value) {
      this.set = value
    },
    get() {
      return this.set
    },
  },
}
```

**Problems**:
- ❌ Overly complex
- ❌ Not reactive to prop changes
- ❌ Anti-pattern

**Should Be**:
```javascript
// Option 1: Direct v-model with emit
<select
  :value="value"
  @change="$emit('change', $event.target.value)"
>

// Option 2: Computed with getter/setter
computed: {
  selectData: {
    get() {
      return this.value
    },
    set(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
```

---

### 7. ❌ Manual Pagination Calculation

**Issue**: Tính toán pagination thủ công

**Current Code**:
```javascript
this.table_data.pagination.total_pages = Math.ceil(
  this.table_data.pagination.total_items / this.table_data.pagination.page_size,
)
```

**Problem**:
- ❌ Should be in computed property
- ❌ Or done by backend/helper
- ❌ Duplicate logic

**Should Be**:
```javascript
// In computed
computed: {
  tablePagination() {
    const pagination = this.table_data.pagination
    return {
      ...pagination,
      total_pages: Math.ceil(pagination.total_items / pagination.page_size)
    }
  }
}

// Or in helper (common.js)
export function calculatePagination(pagination) {
  return {
    ...pagination,
    total_pages: Math.ceil(pagination.total_items / pagination.page_size)
  }
}
```

---

### 8. ❌ Creating API Instances in Methods

**Issue**: New API instance every method call

**Current Code**:
```javascript
async loadTableData() {
  const userCommandHistoryApi = new UserCommandHistoryApi()  // ❌ Every call
  const result = await userCommandHistoryApi.getUserCommandHistoryListAsync(this.filters)
}

async onLoadSelectBusinessType() {
  const dropdownListApi = new SolutionsDropdwonListApi()  // ❌ Every call
  const result = await dropdownListApi.getDropdownListAsync(payload)
}
```

**Problems**:
- ❌ Unnecessary object creation
- ❌ No instance reuse
- ❌ Harder to mock in tests

**Should Be**:
```javascript
// Option 1: Create once in created()
data() {
  return {
    userCommandHistoryApi: null,
    dropdownListApi: null,
  }
},

created() {
  this.userCommandHistoryApi = new UserCommandHistoryApi()
  this.dropdownListApi = new SolutionsDropdwonListApi()
}

// Option 2: Use API Factory (better)
import { apiFactory } from '@/api/api-factory'

created() {
  this.userCommandHistoryApi = apiFactory.getUserCommandHistoryApi()
  this.dropdownListApi = apiFactory.getDropdownListApi()
}

// Option 3: With Composition API (best)
setup() {
  const userCommandHistoryApi = apiFactory.getUserCommandHistoryApi()
  const dropdownListApi = apiFactory.getDropdownListApi()
  
  const loadTableData = async () => {
    const result = await userCommandHistoryApi.getUserCommandHistoryListAsync(filters.value)
    // ...
  }
  
  return { loadTableData }
}
```

---

### 9. ❌ Missing Await in onChangePage

**Issue**: Not awaiting async function

**Current Code**:
```javascript
onChangePage(page_num) {
  this.filters.pageNumber = page_num
  this.loadTableData()  // ❌ Not awaited
}
```

**Should Be**:
```javascript
async onChangePage(page_num) {
  this.filters.pageNumber = page_num
  await this.loadTableData()
}
```

---

### 10. ❌ v-html Usage (XSS Risk)

**Issue**: Using v-html without sanitization

**Current Code**:
```vue
<div v-html="$t('user-command-history.label-total-record', { total: table_data.pagination.total_items })" />
```

**Problems**:
- ❌ XSS vulnerability if translation contains user input
- ❌ Unnecessary v-html for simple interpolation

**Should Be**:
```vue
<!-- Option 1: Simple interpolation -->
<div>{{ $t('user-command-history.label-total-record', { total: table_data.pagination.total_items }) }}</div>

<!-- Option 2: If HTML needed, sanitize first -->
<div v-html="sanitizeHtml($t('...'))" />
```

---

## 🔧 Medium Priority Refactors

### 11. Computed Properties vs Methods

**Issue**: Using methods where computed would be better

**Current Code**:
```javascript
methods: {
  getFunctionTypeText(functionType) {
    const option = this.functionTypeOptions.find(opt => opt.value === functionType)
    return option ? option.text : functionType
  }
}
```

**Problem**: Called multiple times in v-for, not cached

**Should Be**:
```javascript
computed: {
  functionTypeMap() {
    return this.functionTypeOptions.reduce((map, opt) => {
      map[opt.value] = opt.text
      return map
    }, {})
  }
}

// Usage in template:
{{ functionTypeMap[row.function_type] || row.function_type }}
```

---

### 12. Multiple API Calls in created()

**Issue**: Serial API calls

**Current Code**:
```javascript
async created() {
  await this.onLoadSelectBusinessType()
  await this.loadTableData()
}
```

**Should Be** (Parallel):
```javascript
async created() {
  await Promise.all([
    this.onLoadSelectBusinessType(),
    this.loadTableData()
  ])
}

// Or if loadTableData depends on businessType:
async created() {
  await this.onLoadSelectBusinessType()
  await this.loadTableData()  // Dependency - must be serial
}
```

---

### 13. JSON.parse trong Method

**Issue**: Parsing JSON mỗi lần

**Current Code**:
```javascript
onActionResult(result) {
  this.currentResult = JSON.parse(result)  // ❌ Can throw error
  this.showDialogById(this.modalUserCommandHistoryResultId)
}
```

**Should Be**:
```javascript
onActionResult(result) {
  try {
    this.currentResult = JSON.parse(result)
    this.showDialogById(this.modalUserCommandHistoryResultId)
  } catch (error) {
    console.error('Failed to parse result:', error)
    this.showAlert(['Invalid result format'])
  }
}
```

---

## 📊 Refactor Priorities & Checklist

### Phase 1: Critical - Must Fix Before Vue 3 Migration

- [ ] **1.1** Replace `slot` + `slot-scope` → `v-slot` hoặc `#` syntax
  - Files affected: ~50+ components using view-table
  - Estimated time: 4-6 hours
  - Can be automated with regex

- [ ] **1.2** Refactor `extends: component_base` → Composition API
  - Create `useComponentBase` composable
  - Gradually migrate components
  - Estimated time: 8-10 hours

- [ ] **1.3** Fix data initialization with `this.$t()`
  - Move to created() or computed
  - Files affected: ~20+ components
  - Estimated time: 2-3 hours

### Phase 2: High Priority - Improve Code Quality

- [ ] **2.1** Standardize component naming
  - Choose: PascalCase (recommended) or kebab-case
  - Update all imports and registrations
  - Estimated time: 6-8 hours

- [ ] **2.2** Implement API Factory pattern
  - Reuse API instances
  - Better for testing
  - Estimated time: 4-5 hours

- [ ] **2.3** Create composables for common logic
  - useApiCall (already planned)
  - useTableData
  - useFilters
  - usePagination
  - Estimated time: 8-10 hours

### Phase 3: Medium Priority - Performance & Best Practices

- [ ] **3.1** Convert methods to computed where applicable
  - Caching repeated calculations
  - Better performance
  - Estimated time: 3-4 hours

- [ ] **3.2** Add error boundaries
  - Graceful error handling
  - Better UX
  - Estimated time: 2-3 hours

- [ ] **3.3** Remove unused code
  - Dead code elimination
  - Reduce bundle size
  - Estimated time: 2-3 hours

---

## 🎯 Recommended Refactor Example

### Before (Current):
```vue
<template>
  <view-table :data="table_data">
    <template slot="registration_date" slot-scope="{ row }">
      {{ formatDateCol(row.registration_date) }}
    </template>
  </view-table>
</template>

<script>
import view_table from '../../components/common/view-table/view-table.vue'
import component_base from '../../components/common/component-base/component-base'
import UserCommandHistoryApi from 'API/solutions/user-command-history-api'

export default {
  components: {
    'view-table': view_table,
  },
  extends: component_base,
  
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
        const userCommandHistoryApi = new UserCommandHistoryApi()
        const result = await userCommandHistoryApi.getUserCommandHistoryListAsync(this.filters)
        
        if (!result.is_ok) {
          this.showAlert(result.error_messages)
          return
        }
        
        this.table_data.rows = result.data.items
        this.table_data.pagination = result.data.pagination
      } catch (error) {
        this.showAlert([error.message])
      } finally {
        this.preLoader(false)
      }
    },
    
    formatDateCol(date) {
      return formatDate(convertDateFromUtcToTimezone(date, this.shop_data.timezone))
    }
  }
}
</script>
```

### After (Refactored with Composition API):
```vue
<template>
  <ViewTable :data="tableData">
    <template #registration_date="{ row }">
      {{ formatDateColumn(row.registration_date) }}
    </template>
  </ViewTable>
</template>

<script>
import { ref, computed, onMounted } from '@vue/composition-api'
import ViewTable from '@/components/common/view-table/view-table.vue'
import { useComponentBase } from '@/composables/useComponentBase'
import { useApiList } from '@/composables/useApiList'
import { useFormatters } from '@/composables/useFormatters'
import { apiFactory } from '@/api/api-factory'

export default {
  components: { ViewTable },
  
  setup() {
    // Composables
    const { shopData } = useComponentBase()
    const { formatDateWithTimezone } = useFormatters()
    
    // API
    const api = apiFactory.getUserCommandHistoryApi()
    
    // State with composable
    const {
      items,
      pagination,
      loading,
      loadData,
      changePage,
    } = useApiList(
      (query) => api.getUserCommandHistoryListAsync(query),
      { autoLoad: true }
    )
    
    // Table configuration
    const tableData = computed(() => ({
      fields: [
        { field: 'registration_date', label: 'user-command-history.label-date' },
        // ...
      ],
      rows: items.value,
      pagination: pagination.value,
      options: { pagination: true },
    }))
    
    // Methods
    const formatDateColumn = (date) => {
      return formatDateWithTimezone(date, shopData.value.timezone)
    }
    
    return {
      tableData,
      formatDateColumn,
      changePage,
    }
  }
}
</script>
```

**Benefits**:
- ✅ Modern Vue 3-ready syntax
- ✅ Reusable composables
- ✅ Better type inference
- ✅ Easier to test
- ✅ Less boilerplate
- ✅ More maintainable

---

## 🚀 Migration Strategy

### Step 1: Fix Critical Issues (2-3 weeks)
1. Update all slot syntax
2. Create core composables
3. Fix data initialization issues

### Step 2: Gradual Migration (4-6 weeks)
1. Convert 2-3 pages as examples
2. Document patterns
3. Team training
4. Continue with remaining pages

### Step 3: Cleanup (1-2 weeks)
1. Remove deprecated patterns
2. Update documentation
3. Final testing

---

## 📈 Expected Improvements

### Code Quality
- **Before**: Mixed patterns, hard to maintain
- **After**: Consistent, modern patterns

### Performance
- **Before**: Multiple API instances, no caching
- **After**: Reused instances, computed caching

### Developer Experience
- **Before**: Hard to understand extends chain
- **After**: Explicit composables, easy to trace

### Bundle Size
- **Before**: ~2.5MB (estimated)
- **After**: ~2.2MB (-12% estimated)

### Test Coverage
- **Before**: 0%
- **After Target**: 60%+

---

## 🛠️ Tools & Scripts Needed

### 1. Slot Syntax Migration Script
```javascript
// migrate-slots.js
const fs = require('fs')
const glob = require('glob')

glob('src/**/*.vue', (err, files) => {
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8')
    
    // Replace slot="name" with #name or v-slot:name
    content = content.replace(
      /slot="([^"]+)"\s+slot-scope="([^"]+)"/g,
      '#$1="$2"'
    )
    
    fs.writeFileSync(file, content)
  })
})
```

### 2. Component Import Standardizer
```javascript
// standardize-imports.js
// Script to convert imports to PascalCase
```

### 3. ESLint Rules
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Enforce no deprecated slot syntax
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/no-deprecated-slot-scope-attribute': 'error',
    
    // Enforce component name casing
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    
    // Enforce v-slot shorthand
    'vue/v-slot-style': ['error', 'shorthand'],
  }
}
```

---

## 📝 Conclusion

Dự án đang có foundation tốt nhưng cần **significant refactoring** để:
1. ✅ Chuẩn bị cho Vue 3 migration
2. ✅ Improve code quality và maintainability
3. ✅ Better developer experience
4. ✅ Reduce technical debt

**Recommended Approach**: 
- Start with critical issues (slot syntax, extends pattern)
- Gradually introduce composables
- Maintain backward compatibility during migration
- Comprehensive testing at each phase

**Estimated Total Effort**: 8-12 weeks for full refactor với 1-2 developers

---

**Created**: 2025-11-03
**Analyst**: AI Vue 3 Expert
**Status**: Ready for Implementation

