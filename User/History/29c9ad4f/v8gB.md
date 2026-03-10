# Hướng dẫn sử dụng ref của DataTable trong BranchSalesTable

## Cách truy cập ref của DataTable và DOM

### 1. Trong component BranchSalesTable (đã được cập nhật)

Component đã được cập nhật với:

- `ref="dataTableRef"` trên DataTable
- Khai báo `const dataTableRef = ref()`
- Các method để tương tác với DataTable
- Các method để truy cập DOM của DataTable
- `defineExpose()` để expose các method ra ngoài

### 2. Từ component cha (ví dụ: BranchSalesView)

```vue
<template>
  <div>
    <!-- Sử dụng component với ref -->
    <BranchSalesTable
      ref="branchSalesTableRef"
      :data="salesData"
      :pagingInfo="pagingInfo"
      @loadMore="handleLoadMore"
    />

    <!-- Các button để test -->
    <div class="controls">
      <Button
        label="Scroll to Top"
        @click="handleScrollToTop"
      />
      <Button
        label="Get Selected Rows"
        @click="handleGetSelectedRows"
      />
      <Button
        label="Clear Selection"
        @click="handleClearSelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BranchSalesTable from './partials/BranchSalesTable.vue'

// Ref để truy cập component con
const branchSalesTableRef = ref()

// Các method để tương tác với DataTable
const handleScrollToTop = (): void => {
  if (branchSalesTableRef.value) {
    branchSalesTableRef.value.scrollToTop()
  }
}

const handleGetSelectedRows = (): void => {
  if (branchSalesTableRef.value) {
    const selectedRows = branchSalesTableRef.value.getSelectedRows()
    console.log('Selected rows:', selectedRows)
  }
}

const handleClearSelection = (): void => {
  if (branchSalesTableRef.value) {
    branchSalesTableRef.value.clearSelection()
  }
}

// Truy cập trực tiếp vào ref của DataTable
const accessDataTableDirectly = (): void => {
  if (branchSalesTableRef.value?.dataTableRef) {
    const dataTable = branchSalesTableRef.value.dataTableRef
    console.log('DataTable instance:', dataTable)

    // Có thể gọi các method của PrimeVue DataTable
    // dataTable.scrollTo({ top: 0, behavior: 'smooth' })
    // dataTable.getSelection()
    // dataTable.clearSelection()
  }
}

// Truy cập DOM của DataTable
const accessDataTableDOM = (): void => {
  if (branchSalesTableRef.value) {
    // Lấy toàn bộ DOM của DataTable
    const tableDOM = branchSalesTableRef.value.getDataTableDOM()
    console.log('DataTable DOM:', tableDOM)

    // Lấy wrapper (phần scrollable)
    const wrapper = branchSalesTableRef.value.getDataTableWrapper()
    console.log('DataTable wrapper:', wrapper)

    // Lấy header
    const header = branchSalesTableRef.value.getDataTableHeader()
    console.log('DataTable header:', header)

    // Lấy body
    const body = branchSalesTableRef.value.getDataTableBody()
    console.log('DataTable body:', body)

    // Lấy footer
    const footer = branchSalesTableRef.value.getDataTableFooter()
    console.log('DataTable footer:', footer)

    // Lấy tất cả rows
    const rows = branchSalesTableRef.value.getDataTableRows()
    console.log('DataTable rows:', rows)

    // Lấy tất cả columns
    const columns = branchSalesTableRef.value.getDataTableColumns()
    console.log('DataTable columns:', columns)
  }
}
</script>
```

## Các method có sẵn từ PrimeVue DataTable

Khi bạn có ref của DataTable, bạn có thể truy cập các method sau:

## Các method để truy cập DOM của DataTable

Khi bạn có ref của component BranchSalesTable, bạn có thể truy cập DOM thông qua các method sau:

### DOM Access Methods

- `getDataTableDOM()`: Lấy toàn bộ DOM element của DataTable
- `getDataTableWrapper()`: Lấy wrapper element (phần scrollable)
- `getDataTableHeader()`: Lấy header element của table
- `getDataTableBody()`: Lấy body element của table
- `getDataTableFooter()`: Lấy footer element của table
- `getDataTableRows()`: Lấy tất cả row elements
- `getDataTableColumns()`: Lấy tất cả column header elements

### Navigation & Scrolling

- `scrollTo(options)`: Scroll đến vị trí cụ thể
- `scrollToIndex(index)`: Scroll đến row có index cụ thể

### Selection

- `getSelection()`: Lấy danh sách các row đã được chọn
- `clearSelection()`: Xóa tất cả selection
- `selectRow(rowData)`: Chọn một row cụ thể
- `unselectRow(rowData)`: Bỏ chọn một row cụ thể

### Filtering & Sorting

- `filter(value, field, matchMode)`: Áp dụng filter
- `clearFilter()`: Xóa tất cả filter
- `sort(field, order)`: Sắp xếp theo field

### Export

- `exportCSV()`: Export dữ liệu ra CSV
- `exportExcel()`: Export dữ liệu ra Excel

## Ví dụ sử dụng nâng cao

```typescript
// Trong component cha
const handleExportData = (): void => {
  if (branchSalesTableRef.value?.dataTableRef) {
    const dataTable = branchSalesTableRef.value.dataTableRef

    // Export CSV
    dataTable.exportCSV()

    // Hoặc export Excel
    // dataTable.exportExcel()
  }
}

// Ví dụ sử dụng DOM để tùy chỉnh giao diện
const customizeTableAppearance = (): void => {
  if (branchSalesTableRef.value) {
    // Thêm class vào wrapper
    const wrapper = branchSalesTableRef.value.getDataTableWrapper()
    if (wrapper) {
      wrapper.classList.add('custom-wrapper')
    }

    // Thay đổi style của header
    const header = branchSalesTableRef.value.getDataTableHeader()
    if (header) {
      header.style.backgroundColor = '#f0f0f0'
    }

    // Thêm event listener vào rows
    const rows = branchSalesTableRef.value.getDataTableRows()
    if (rows) {
      rows.forEach((row, index) => {
        row.addEventListener('click', () => {
          console.log(`Clicked row ${index}`)
        })
      })
    }
  }
}

// Ví dụ lấy thông tin từ DOM
const getTableInfo = (): void => {
  if (branchSalesTableRef.value) {
    const rows = branchSalesTableRef.value.getDataTableRows()
    const columns = branchSalesTableRef.value.getDataTableColumns()

    console.log(`Table has ${rows?.length || 0} rows`)
    console.log(`Table has ${columns?.length || 0} columns`)

    // Lấy text content của từng row
    if (rows) {
      rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td')
        const rowData = Array.from(cells).map((cell) => cell.textContent?.trim())
        console.log(`Row ${index}:`, rowData)
      })
    }
  }
}

const handleFilterByBranch = (branchName: string): void => {
  if (branchSalesTableRef.value?.dataTableRef) {
    const dataTable = branchSalesTableRef.value.dataTableRef

    // Filter theo tên branch
    dataTable.filter(branchName, 'branch', 'contains')
  }
}

const handleSortBySales = (): void => {
  if (branchSalesTableRef.value?.dataTableRef) {
    const dataTable = branchSalesTableRef.value.dataTableRef

    // Sắp xếp theo sales total giảm dần
    dataTable.sort('salesTotal', -1)
  }
}
```

## Lưu ý quan trọng

1. **Type Safety**: Đảm bảo kiểm tra `dataTableRef.value` trước khi sử dụng
2. **Lifecycle**: Ref chỉ có sẵn sau khi component được mount
3. **Reactivity**: Ref sẽ tự động cập nhật khi component re-render
4. **Error Handling**: Luôn wrap các method call trong try-catch nếu cần thiết
