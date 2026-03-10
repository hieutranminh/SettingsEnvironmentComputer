# Hướng Dẫn Sử Dụng Print Preview Module

## 🚀 Tổng Quan

Module Print Preview được xây dựng với Vue 3 hiện đại, sử dụng Composition API, TypeScript và functional programming. Module này cung cấp khả năng tạo báo cáo PDF và Excel với giao diện người dùng thân thiện.

## 📋 Các Tính Năng Chính

- ✅ **Vue 3 Composition API** - Sử dụng `<script setup>` và composables
- ✅ **TypeScript** - Type safety hoàn chỉnh
- ✅ **Pinia Setup Store** - Quản lý state hiện đại
- ✅ **Web Workers** - Xử lý nền không block UI
- ✅ **Modular Architecture** - Dễ mở rộng và bảo trì
- ✅ **Accessibility** - Hỗ trợ WCAG 2.1
- ✅ **Internationalization** - Đa ngôn ngữ

## 🛠️ Cách Sử Dụng

### 1. Cài Đặt và Import

```typescript
import { PrintPreview, PrintPreviewButton, usePrintPreview, WORKER_TYPES } from '@/modules/print-preview'
```

### 2. Sử Dụng Đơn Giản (PrintPreviewButton)

```vue
<template>
  <PrintPreviewButton
    :worker-type="WORKER_TYPES.SALES_HISTORY"
    :table-headers="tableHeaders"
    :report-headers="reportHeaders"
    :request-payload="requestPayload"
    button-text="Tạo Báo Cáo"
    @start="handleStart"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PrintPreviewButton, WORKER_TYPES } from '@/modules/print-preview'

const tableHeaders = ref([
  { key: 'date', label: 'Ngày', format: 'date' },
  { key: 'clientName', label: 'Tên Khách Hàng', format: 'text' },
  { key: 'amount', label: 'Số Tiền', format: 'currency' },
])

const reportHeaders = ref([{ title: 'Báo Cáo Doanh Thu', subtitle: 'Tháng 1/2024' }])

const requestPayload = ref({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
})

const handleStart = () => {
  console.log('Bắt đầu tạo báo cáo...')
}

const handleError = (error: string) => {
  console.error('Lỗi:', error)
}
</script>
```

### 3. Sử Dụng Composable (Nhiều Kiểm Soát Hơn)

```vue
<template>
  <div>
    <Button
      :loading="isWorkerProcessing"
      @click="generateReport"
    >
      {{ isWorkerProcessing ? 'Đang tạo...' : 'Tạo Báo Cáo' }}
    </Button>

    <div v-if="isWorkerProcessing">
      <ProgressBar :value="progressPercentage" />
      <span>Tiến trình: {{ progressPercentage }}%</span>
    </div>

    <div
      v-if="hasError"
      class="error"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePrintPreview, WORKER_TYPES } from '@/modules/print-preview'

const { isWorkerProcessing, progressPercentage, hasError, errorMessage, startPrintPreview } = usePrintPreview()

const generateReport = async () => {
  try {
    await startPrintPreview(WORKER_TYPES.SALES_HISTORY, tableHeaders, reportHeaders, requestPayload)
  } catch (error) {
    console.error('Lỗi tạo báo cáo:', error)
  }
}
</script>
```

### 4. Sử Dụng Component Đầy Đủ

```vue
<template>
  <PrintPreview
    :worker-type="WORKER_TYPES.SALES_HISTORY"
    :table-headers="tableHeaders"
    :report-headers="reportHeaders"
    :request-payload="requestPayload"
    :report-name="'Báo Cáo Doanh Thu'"
    @start="handleStart"
    @success="handleSuccess"
    @error="handleError"
    @download="handleDownload"
  >
    <template #print-content>
      <!-- Nội dung tùy chỉnh cho báo cáo -->
      <div class="custom-report">
        <h1>Báo Cáo Doanh Thu</h1>
        <table>
          <!-- Bảng dữ liệu -->
        </table>
      </div>
    </template>
  </PrintPreview>
</template>
```

## 📊 Các Loại Báo Cáo Hỗ Trợ

```typescript
// Các worker types có sẵn
const WORKER_TYPES = {
  SALES_HISTORY: 'sales-history',
  PRODUCTS: 'products',
  BOOKING_LIST: 'calendar-booking-list-summary',
  STOCK_STATUS: 'stock-status',
  TIME_CLOCK: 'time-clock',
  // ... và nhiều loại khác
}
```

## 🎨 Tùy Chỉnh Giao Diện

### Table Headers

```typescript
const tableHeaders = [
  {
    key: 'date',
    label: 'Ngày',
    format: 'date',
    width: 120,
    align: 'center',
  },
  {
    key: 'amount',
    label: 'Số Tiền',
    format: 'currency',
    width: 100,
    align: 'right',
  },
]
```

### Report Headers

```typescript
const reportHeaders = [
  {
    title: 'Báo Cáo Doanh Thu',
    subtitle: 'Tháng 1/2024',
    logo: '/path/to/logo.png',
    date: '2024-01-31',
  },
]
```

## 🔧 Tạo Handler Tùy Chỉnh

```typescript
import { BaseHandler } from '@/modules/print-preview'

export class CustomReportHandler extends BaseHandler {
  readonly type = 'custom-report'

  protected getStreamUrl(): string {
    return '/api/custom-report/stream'
  }

  protected getTableIntro(): string {
    return 'Báo Cáo Tùy Chỉnh'
  }

  protected getTableRowItem(rowItem: any): Record<string, any> {
    return {
      id: rowItem.id,
      name: this.sanitizeText(rowItem.name),
      value: this.formatNumber(rowItem.value),
    }
  }

  protected isValidResponse(response: any): boolean {
    return response && response.success && Array.isArray(response.data)
  }

  protected isInvalidResponse(response: any): boolean {
    return response && response.success && response.data.length === 0
  }
}
```

## 📱 Responsive Design

Module tự động hỗ trợ responsive và mobile-friendly:

```scss
// Tự động điều chỉnh layout trên mobile
@media (width <= 768px) {
  .print-preview-modal {
    width: 95vw;
  }
}
```

## ♿ Accessibility

- Hỗ trợ keyboard navigation
- Screen reader friendly
- ARIA labels và roles
- Focus management
- High contrast support

## 🌍 Internationalization

```typescript
// Hỗ trợ đa ngôn ngữ
const { t } = useI18n()

const tableHeaders = [
  { key: 'date', label: t('common.date') },
  { key: 'amount', label: t('common.amount') },
]
```

## 🚨 Xử Lý Lỗi

```typescript
const handleError = (error: string) => {
  // Hiển thị thông báo lỗi
  showDialogAlert(error)

  // Log lỗi
  console.error('Print preview error:', error)

  // Gửi lỗi đến analytics
  analytics.track('print_preview_error', { error })
}
```

## 📈 Performance Tips

1. **Sử dụng Web Workers** - Không block UI
2. **Streaming Data** - Xử lý dữ liệu lớn
3. **Lazy Loading** - Chỉ load khi cần
4. **Memory Management** - Tự động cleanup
5. **Progress Tracking** - Hiển thị tiến trình

## 🔄 Migration từ Code Cũ

### Từ Mixin sang Composable

```typescript
// Cũ (Vue 2 + Mixin)
export default {
  mixins: [printPreviewMixin('printContentRef')],
  methods: {
    onClickPrint() {
      this.postMessageToPrintPreviewWorkerMixin({...})
    }
  }
}

// Mới (Vue 3 + Composable)
export default {
  setup() {
    const { startPrintPreview } = usePrintPreview()

    const handlePrint = async () => {
      await startPrintPreview(workerType, headers, payload)
    }

    return { handlePrint }
  }
}
```

## 🧪 Testing

```typescript
// Unit test example
import { mount } from '@vue/test-utils'
import { PrintPreviewButton } from '@/modules/print-preview'

test('should emit start event when clicked', async () => {
  const wrapper = mount(PrintPreviewButton, {
    props: {
      workerType: 'sales-history',
      tableHeaders: [],
      reportHeaders: [],
    },
  })

  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted('start')).toBeTruthy()
})
```

## 📚 API Reference

### PrintPreviewButton Props

| Prop             | Type                  | Required | Description         |
| ---------------- | --------------------- | -------- | ------------------- |
| `workerType`     | `WorkerType`          | ✅       | Loại báo cáo        |
| `tableHeaders`   | `TableHeader[]`       | ✅       | Headers cho bảng    |
| `reportHeaders`  | `ReportHeader[]`      | ✅       | Headers cho báo cáo |
| `requestPayload` | `Record<string, any>` | ❌       | Dữ liệu request     |
| `buttonText`     | `string`              | ❌       | Text cho button     |

### Events

| Event     | Payload  | Description            |
| --------- | -------- | ---------------------- |
| `start`   | -        | Bắt đầu tạo báo cáo    |
| `error`   | `string` | Có lỗi xảy ra          |
| `success` | -        | Tạo báo cáo thành công |

## 🆘 Troubleshooting

### Lỗi Thường Gặp

1. **Worker không được hỗ trợ**

   ```typescript
   if (typeof Worker === 'undefined') {
     // Fallback to main thread
   }
   ```

2. **CORS errors**

   - Kiểm tra cấu hình CORS trên server
   - Đảm bảo API endpoints đúng

3. **Memory leaks**

   - Luôn terminate worker khi done
   - Cleanup event listeners

4. **Large files**
   - Sử dụng streaming
   - Chunk data processing

## 📞 Support

Nếu gặp vấn đề, hãy:

1. Kiểm tra console logs
2. Xem documentation
3. Tạo issue với reproduction steps
4. Liên hệ team development

---

**Happy Coding! 🎉**
