# Column Visibility Demo for BranchSalesTable

## Overview

BranchSalesTable component đã được cập nhật để hỗ trợ ẩn/hiện cột động với việc tính toán lại `colspan` tự động.

## Cách sử dụng

### 1. Truyền danh sách cột ẩn qua props

```vue
<template>
  <BranchSalesTable
    :data="salesData"
    :pagingInfo="pagingInfo"
    :hiddenColumns="hiddenColumns"
    @loadMore="handleLoadMore"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hiddenColumns = ref<string[]>([
  'servicePrepaidCardDeduction',
  'servicePrepaidServiceDeduction',
  'productPrepaidCardDeduction',
])
</script>
```

### 2. Các cột có thể ẩn

```typescript
type ColumnName =
  | 'serviceSales'
  | 'servicePrepaidCardDeduction'
  | 'servicePrepaidServiceDeduction'
  | 'serviceTotal'
  | 'productSales'
  | 'productPrepaidCardDeduction'
  | 'productTotal'
  | 'revenueTotal'
  | 'prepaidCard'
  | 'prepaidService'
  | 'prepaidTotal'
  | 'salesTotal'
  | 'prepaidGoodsDeductionTotal'
  | 'pointsDeduction'
```

### 3. Tính năng tự động

- **Header colspan**: Tự động tính toán lại `colspan` cho các header nhóm
- **Column visibility**: Chỉ hiển thị các cột không bị ẩn
- **Footer totals**: Chỉ hiển thị tổng cho các cột hiện tại
- **Responsive**: Bảng tự động điều chỉnh layout

### 4. Ví dụ cụ thể

#### Ẩn tất cả cột deduction:

```typescript
const hiddenColumns = ref<string[]>([
  'servicePrepaidCardDeduction',
  'servicePrepaidServiceDeduction',
  'productPrepaidCardDeduction',
  'prepaidGoodsDeductionTotal',
  'pointsDeduction',
])
```

#### Ẩn cột Service:

```typescript
const hiddenColumns = ref<string[]>([
  'serviceSales',
  'servicePrepaidCardDeduction',
  'servicePrepaidServiceDeduction',
  'serviceTotal',
])
```

#### Ẩn cột Product:

```typescript
const hiddenColumns = ref<string[]>(['productSales', 'productPrepaidCardDeduction', 'productTotal'])
```

## Logic xử lý

### 1. Column Visibility Check

```typescript
const isColumnVisible = (columnName: string): boolean => {
  return !props.hiddenColumns?.includes(columnName)
}
```

### 2. Dynamic Colspan Calculation

```typescript
const getServiceColspan = computed((): number => {
  let count = 0
  if (isColumnVisible('serviceSales')) count++
  if (isColumnVisible('servicePrepaidCardDeduction')) count++
  if (isColumnVisible('servicePrepaidServiceDeduction')) count++
  if (isColumnVisible('serviceTotal')) count++
  return count
})
```

### 3. Conditional Rendering

```vue
<Column v-if="isColumnVisible('serviceSales')" field="serviceSales" headerClass="bg-green">
  <template #header>
    <p class="text-no-wrap">Sales (<span class="text-blue">S1</span>)</p>
  </template>
</Column>
```

## Lợi ích

1. **Flexibility**: Có thể ẩn/hiện bất kỳ cột nào
2. **Automatic Layout**: Colspan tự động điều chỉnh
3. **Consistent UI**: Header và footer luôn đồng bộ
4. **Performance**: Chỉ render các cột cần thiết
5. **Maintainable**: Dễ dàng thêm/xóa cột mới

## Lưu ý

- Cột "Branch" luôn hiển thị và không thể ẩn
- Khi ẩn tất cả cột trong một nhóm, header nhóm cũng sẽ bị ẩn
- Footer totals chỉ tính cho các cột hiện tại
- Responsive design được duy trì
