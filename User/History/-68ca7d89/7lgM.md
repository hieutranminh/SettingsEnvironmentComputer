# Print Preview Module

A modern Vue 3 print preview module built with Composition API, TypeScript, and functional programming principles.

## Features

- 🚀 Modern Vue 3 Composition API
- 📝 TypeScript support with full type safety
- 🔧 Functional programming approach
- 📊 Pinia setup store for state management
- 🧵 Web Worker support for background processing
- 📄 PDF and Excel generation
- 🎨 Modular and extensible architecture
- ♿ Accessibility features
- 🌍 Internationalization support

## Installation

The module is already included in the project. Import it in your components:

```typescript
import { PrintPreview, PrintPreviewButton, usePrintPreview, WORKER_TYPES } from '@/modules/print-preview'
```

## Quick Start

### Using the PrintPreviewButton Component

```vue
<template>
  <PrintPreviewButton
    :worker-type="WORKER_TYPES.SALES_HISTORY"
    :table-headers="tableHeaders"
    :report-headers="reportHeaders"
    :request-payload="requestPayload"
    :additional-options="additionalOptions"
    button-text="Generate Report"
    @start="handleStart"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PrintPreviewButton, WORKER_TYPES } from '@/modules/print-preview'
import type { TableHeader, ReportHeader } from '@/modules/print-preview'

const tableHeaders = ref<TableHeader[]>([
  { key: 'date', label: 'Date', format: 'date' },
  { key: 'clientName', label: 'Client Name', format: 'text' },
  { key: 'amount', label: 'Amount', format: 'currency' },
])

const reportHeaders = ref<ReportHeader[]>([{ title: 'Sales History Report', subtitle: 'Monthly Summary' }])

const requestPayload = ref({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
})

const additionalOptions = ref({
  includeTotals: true,
  groupBy: 'month',
})

const handleStart = () => {
  console.log('Print preview started')
}

const handleError = (error: string) => {
  console.error('Print preview error:', error)
}
</script>
```

### Using the usePrintPreview Composable

```vue
<template>
  <div>
    <Button @click="startPrint">Generate Report</Button>

    <PrintPreviewModal
      :report-name="'Sales Report'"
      @download="handleDownload"
    />
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue/button'
import { PrintPreviewModal, usePrintPreview, WORKER_TYPES } from '@/modules/print-preview'

const { startPrintPreview, isWorkerProcessing, progressPercentage, hasError, errorMessage } = usePrintPreview()

const startPrint = async () => {
  await startPrintPreview(WORKER_TYPES.SALES_HISTORY, tableHeaders, reportHeaders, requestPayload, additionalOptions)
}

const handleDownload = (type: 'pdf' | 'excel') => {
  console.log(`Downloading ${type} file`)
}
</script>
```

### Using the Full PrintPreview Component

```vue
<template>
  <PrintPreview
    :worker-type="WORKER_TYPES.SALES_HISTORY"
    :table-headers="tableHeaders"
    :report-headers="reportHeaders"
    :request-payload="requestPayload"
    :report-name="'Sales History Report'"
    @start="handleStart"
    @success="handleSuccess"
    @error="handleError"
    @download="handleDownload"
  >
    <template #print-content>
      <!-- Your print content here -->
      <div class="print-content">
        <h1>Sales History</h1>
        <table>
          <!-- Your table content -->
        </table>
      </div>
    </template>
  </PrintPreview>
</template>
```

## API Reference

### Components

#### PrintPreviewButton

A button component that triggers print preview generation.

**Props:**

- `workerType: WorkerType` - The type of report to generate
- `tableHeaders: TableHeader[]` - Table column definitions
- `reportHeaders: ReportHeader[]` - Report header information
- `requestPayload?: Record<string, any>` - API request payload
- `additionalOptions?: Record<string, any>` - Additional options
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'` - Button variant
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `icon?: string` - Button icon
- `buttonText?: string` - Button text

**Events:**

- `click` - Button clicked
- `start` - Print preview started
- `error` - Error occurred

#### PrintPreviewModal

A modal component that displays the print preview.

**Props:**

- `reportName?: string` - Name of the report

**Events:**

- `hide` - Modal hidden
- `retry` - Retry generation
- `download` - File download requested
- `print` - Print requested

#### PrintPreview

A complete print preview component that combines all functionality.

**Props:**

- `workerType: WorkerType` - The type of report to generate
- `tableHeaders: TableHeader[]` - Table column definitions
- `reportHeaders: ReportHeader[]` - Report header information
- `requestPayload?: Record<string, any>` - API request payload
- `additionalOptions?: Record<string, any>` - Additional options
- `reportName?: string` - Name of the report
- `autoStart?: boolean` - Auto-start generation

**Events:**

- `start` - Print preview started
- `success` - Generation successful
- `error` - Error occurred
- `download` - File download requested
- `print` - Print requested
- `modalHide` - Modal hidden

### Composables

#### usePrintPreview

Main composable for print preview functionality.

**Returns:**

- `startPrintPreview()` - Start print preview generation
- `handleSaveAsPdf()` - Save as PDF
- `handleSaveAsExcel()` - Save as Excel
- `showPrintPreviewModal()` - Show modal
- `hidePrintPreviewModal()` - Hide modal
- `isWorkerProcessing` - Processing state
- `progressPercentage` - Progress percentage
- `hasError` - Error state
- `errorMessage` - Error message
- `successMessage` - Success message

### Store

#### usePrintPreviewStore

Pinia store for print preview state management.

**State:**

- `pdfBlobUrl` - PDF blob URL
- `excelBlob` - Excel blob
- `isWorkerDone` - Worker completion state
- `isWorkerError` - Worker error state
- `isWorkerProcessing` - Processing state
- `progressPercentage` - Progress percentage
- `reportPrintDate` - Print date
- `isLandscapePrintContent` - Landscape orientation

**Actions:**

- `resetState()` - Reset all state
- `setWorker()` - Set worker instance
- `setProcessing()` - Set processing state
- `setProgress()` - Set progress percentage
- `setError()` - Set error state
- `setSuccess()` - Set success state
- `terminateWorker()` - Terminate worker

### Types

#### WorkerType

Available worker types for different report types:

```typescript
type WorkerType =
  | 'prepaid-card-summary'
  | 'prepaid-cards-by-client'
  | 'products'
  | 'prepaid-services-by-client'
  | 'loyalty-points-by-client'
  | 'receivings'
  | 'time-clock'
  | 'stock-status'
  | 'stock-history'
  | 'stock-adjustment'
  | 'stock-internal-use'
  | 'calendar-booking-list-summary'
  | 'calendar-booking-list-v2-summary'
  | 'prepaid-goods-sales'
  | 'sales-history'
  | 'booking-deposit-list'
  | 'booking-deposit-before-payment'
  | 'booking-deposit-payment-history'
  | 'staff-mismatch-history'
  | 'sales-transfer-staff-history'
  | 'sales-transfer-history'
```

#### TableHeader

Table column definition:

```typescript
interface TableHeader {
  key: string
  label: string
  width?: number
  align?: 'left' | 'center' | 'right'
  format?: 'text' | 'number' | 'date' | 'currency' | 'percentage'
}
```

#### ReportHeader

Report header information:

```typescript
interface ReportHeader {
  title: string
  subtitle?: string
  logo?: string
  date?: string
}
```

## Creating Custom Handlers

To create a custom handler for a new report type:

1. Create a new handler class extending `BaseHandler`:

```typescript
import { BaseHandler } from '@/modules/print-preview'
import { WORKER_TYPES } from '@/modules/print-preview'

export class CustomReportHandler extends BaseHandler {
  readonly type = 'custom-report'

  protected getStreamUrl(): string {
    return '/api/custom-report/stream'
  }

  protected getTableIntro(): string {
    return 'Custom Report'
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

  protected async generateFiles(
    data: any[],
    context: HandlerContext,
  ): Promise<{ pdfBlobUrl: string; excelBlob: Blob }> {
    // Implement PDF and Excel generation
    // Use libraries like jsPDF and ExcelJS
    return { pdfBlobUrl: '', excelBlob: new Blob() }
  }
}
```

2. Register the handler in the worker:

```typescript
// In print-preview.worker.ts
import { CustomReportHandler } from './worker-handlers/custom-report.handler'

handlers.set('custom-report', new CustomReportHandler())
```

3. Add the worker type to constants:

```typescript
// In print-preview.constants.ts
export const WORKER_TYPES = {
  // ... existing types
  CUSTOM_REPORT: 'custom-report',
} as const
```

## Migration from Old Mixin

To migrate from the old mixin-based approach:

1. Replace mixin usage with composable:

```typescript
// Old
export default {
  mixins: [printPreviewMixin('printContentRef')],
  // ...
}

// New
import { usePrintPreview } from '@/modules/print-preview'

export default {
  setup() {
    const { startPrintPreview, isWorkerProcessing } = usePrintPreview()
    return { startPrintPreview, isWorkerProcessing }
  },
}
```

2. Replace manual worker management:

```typescript
// Old
this.initPrintPreviewWorkerMixin()
this.postMessageToPrintPreviewWorkerMixin({...})

// New
await startPrintPreview(workerType, tableHeaders, reportHeaders, payload, options)
```

3. Replace state management:

```typescript
// Old
this.pdfBlobUrlMixin
this.isWorkerProcessing

// New
const { pdfBlobUrl, isWorkerProcessing } = usePrintPreview()
```

## Best Practices

1. **Use TypeScript**: Always define proper types for your data structures
2. **Error Handling**: Implement proper error handling and user feedback
3. **Progress Feedback**: Show progress to users during long operations
4. **Accessibility**: Ensure all components are accessible
5. **Testing**: Write tests for your custom handlers
6. **Performance**: Use workers for heavy operations
7. **Internationalization**: Support multiple languages

## Troubleshooting

### Common Issues

1. **Worker not supported**: Check if Web Workers are supported in the browser
2. **CORS errors**: Ensure proper CORS configuration for API calls
3. **Memory leaks**: Always terminate workers when done
4. **Large files**: Consider streaming for large datasets

### Debug Mode

Enable debug mode to see detailed logs:

```typescript
// In development
localStorage.setItem('print-preview-debug', 'true')
```

## Contributing

When contributing to this module:

1. Follow the existing code style and patterns
2. Add proper TypeScript types
3. Write tests for new functionality
4. Update documentation
5. Follow functional programming principles
6. Ensure accessibility compliance
