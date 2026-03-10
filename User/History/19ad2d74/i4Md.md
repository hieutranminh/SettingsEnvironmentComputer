# Print System Usage Guide

This document explains how to use the print functionality in the Vue 3 + PrimeVue application.

## Overview

The print system provides a comprehensive solution for printing and exporting data in various formats:

- **Print Preview Dialog**: A reusable dialog for previewing content before printing
- **PDF Generation**: Manual PDF creation using jsPDF with full control over layout
- **Excel Export**: Export data to Excel format using xlsx library
- **CSV Export**: Export data to CSV format
- **Multiple Content Types**: Support for tables, charts, mixed content, and custom HTML

## Quick Start

### 1. Import the Print Composable

```typescript
import { usePrint } from '@/composables/usePrint'
import type { PrintData, TableColumn } from '@/types/print'

const { openPrintPreview } = usePrint()
```

### 2. Basic Table Print

```typescript
const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
]

const columns: TableColumn[] = [
  { field: 'id', header: 'ID', width: 60, align: 'center' },
  { field: 'name', header: 'Name', width: 150 },
  { field: 'email', header: 'Email', width: 200 },
]

const handlePrint = () => {
  const printData: PrintData = {
    title: 'Employee Report',
    printType: 'table',
    printData: tableData,
    columns: columns,
    enablePagination: true,
    rowsPerPage: 20,
  }

  openPrintPreview(printData)
}
```

### 3. Chart Print

```typescript
const chartRef = ref<HTMLElement>()

const handlePrintChart = () => {
  const printData: PrintData = {
    title: 'Sales Chart Report',
    printType: 'chart',
    sectionRef: chartRef.value,
  }

  openPrintPreview(printData)
}
```

### 4. Mixed Content Print

```typescript
const handlePrintMixed = () => {
  const printData: PrintData = {
    title: 'Mixed Content Report',
    printType: 'mixed',
    printSections: [
      {
        type: 'chart',
        title: 'Sales Overview',
        element: chartRef.value,
      },
      {
        type: 'table',
        title: 'Product Sales',
        data: tableData,
        columns: columns,
      },
      {
        type: 'content',
        title: 'Custom Section',
        content: customElementRef.value,
      },
    ],
  }

  openPrintPreview(printData)
}
```

## Print Data Interface

```typescript
interface PrintData {
  title: string
  printType: 'table' | 'chart' | 'mixed' | 'content'
  printData?: any[]
  content?: any
  sectionRef?: any
  enablePagination?: boolean
  rowsPerPage?: number
  printSections?: PrintSection[]
  columns?: TableColumn[]
}
```

## Table Column Configuration

```typescript
interface TableColumn {
  field: string
  header: string
  width?: number
  align?: 'left' | 'center' | 'right'
  colspan?: number
  rowspan?: number
}
```

## Print Configuration

The print system supports various configuration options:

### Page Settings

- **Page Size**: A4, A3, Letter, Legal
- **Orientation**: Landscape (default), Portrait
- **Margins**: Top, Right, Bottom, Left (in mm)

### Default Configuration

```typescript
{
  pageSize: 'A4',
  orientation: 'landscape',
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }
}
```

## Features

### 1. Print Preview Dialog

- Shows "Processing..." state before displaying preview
- Real-time configuration changes
- Page navigation for paginated content
- Print, PDF, Excel, and CSV export options

### 2. Pagination

- Client-side pagination for large datasets
- Configurable rows per page
- Page navigation controls
- "Page X of Y" display

### 3. PDF Generation

- Manual table drawing with jsPDF
- Support for custom headers with colspan/rowspan
- Chart rendering using html2canvas
- Page break handling
- Headers and footers with page numbers

### 4. Export Formats

- **PDF**: Full control over layout and styling
- **Excel**: Structured data export
- **CSV**: Simple text-based export

## Usage Examples

### Example 1: Simple Table Print

```vue
<template>
  <div>
    <Button
      @click="handlePrint"
      label="Print Table"
    />
    <DataTable
      :value="data"
      :columns="columns"
    />
  </div>
</template>

<script setup>
import { usePrint } from '@/composables/usePrint'

const { openPrintPreview } = usePrint()

const handlePrint = () => {
  openPrintPreview({
    title: 'My Report',
    printType: 'table',
    printData: data.value,
    columns: columns,
  })
}
</script>
```

### Example 2: Chart with Table

```vue
<template>
  <div>
    <Button
      @click="handlePrint"
      label="Print Report"
    />
    <div ref="chartRef">
      <!-- Chart content -->
    </div>
    <DataTable
      :value="tableData"
      :columns="tableColumns"
    />
  </div>
</template>

<script setup>
const chartRef = ref()

const handlePrint = () => {
  openPrintPreview({
    title: 'Sales Report',
    printType: 'mixed',
    printSections: [
      {
        type: 'chart',
        title: 'Sales Chart',
        element: chartRef.value,
      },
      {
        type: 'table',
        title: 'Sales Data',
        data: tableData.value,
        columns: tableColumns,
      },
    ],
  })
}
</script>
```

## Best Practices

1. **Always provide a meaningful title** for your print data
2. **Use appropriate column widths** to ensure proper layout
3. **Enable pagination** for large datasets to improve performance
4. **Test print preview** before implementing in production
5. **Handle errors gracefully** when print operations fail

## Error Handling

The print system throws specific errors that should be handled:

```typescript
try {
  await openPrintPreview(printData)
} catch (error) {
  console.error('Print failed:', error)
  // Show user-friendly error message
}
```

## Performance Considerations

- Large datasets are automatically paginated
- Charts are rendered using html2canvas for better quality
- PDF generation is optimized for standard paper sizes
- Export operations are asynchronous to prevent UI blocking

## Customization

The print system is designed to be extensible. You can:

1. **Customize print templates** in `src/components/print/templates/`
2. **Modify PDF generation logic** in `src/services/printService.ts`
3. **Add new export formats** by extending the print service
4. **Customize styling** using CSS variables and print media queries

## Troubleshooting

### Common Issues

1. **Charts not rendering**: Ensure the chart element is properly referenced
2. **Table layout issues**: Check column widths and alignment settings
3. **PDF generation fails**: Verify that all required data is provided
4. **Print preview not showing**: Check that the PrintPreviewDialog is included in App.vue

### Debug Tips

- Use browser developer tools to inspect the print preview
- Check console for error messages during print operations
- Verify that all required dependencies are installed
- Test with different data sizes to ensure pagination works correctly
