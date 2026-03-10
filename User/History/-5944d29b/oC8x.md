# Vue 3 + PrimeVue V4 Print System Implementation

## Project Context

I'm building a production-level Vue 3 application with PrimeVue V4 that requires a comprehensive print system with the following requirements:

---

## Core Requirements

### 1. Print Preview Dialog

- A **single reusable Print Preview Dialog** used across all pages
- Shows **"Processing..."** state before displaying preview (regardless of API calls)
- Triggered by **Print** button on various screens
- Supports **Print**, **Download PDF**, and **Download Excel** functions

### 2. Print Types Support

- **Table Print**: Display data tables with pagination
- **Chart Print**: Print charts/graphs
- **Mixed Content**: Combination of charts, tables, and custom content
- **Free Content**: Custom HTML content with manual page breaks

### 3. Orientation Handling

- **Default orientation is always Landscape**
- (Optional) Allow user to override orientation manually in settings

### 4. Pagination Requirements

- Client-side pagination for large datasets
- Show page navigation: First, Previous, Next, Last, Go to page
- Display "Page X of Y"
- All data is loaded before pagination is applied

### 5. PDF Generation

- Use **jsPDF** for PDF generation
- **Manually draw tables** using `doc.text`, `doc.line`, and layout logic
- Support for **custom table headers** with `colspan` / `rowspan`-like behavior
- Support for **custom footers** and **multi-page tables**
- Charts and custom content rendered using **html2canvas**
- Handle page breaks manually
- Include **header/footer with page numbers**

---

## Technical Implementation

### File Structure

```
src/
├── components/
│   └── print/
│       ├── PrintPreviewDialog.vue       # Main dialog component
│       ├── PrintActions.vue             # Print/Download buttons
│       └── templates/                   # Print templates
│           ├── TablePrintTemplate.vue
│           ├── ChartPrintTemplate.vue
│           ├── MixedContentTemplate.vue
│           └── ContentPrintTemplate.vue
├── composables/
│   └── usePrint.js                      # Print logic & configuration
├── services/
│   └── printService.js                  # Manual PDF generation with jsPDF
└── stores/
    └── printStore.js                    # Print state management (Pinia)
```

---

### Key Features to Implement

#### 1. **Print Store (Pinia)**

- Manage dialog visibility
- Handle "processing" state
- Store print data and configuration
- Pagination state management

#### 2. **Print Service**

- **Generate PDFs with jsPDF manually**, using:
  - `doc.text`, `doc.rect`, `doc.line`, `doc.addImage`, etc.
  - Custom layout engine for tables (col/row merging)
- Chart rendering using `html2canvas`
- Mixed content layout handling
- Page break logic for long tables or sections
- Headers and footers (e.g. page numbers, report titles)

#### 3. **Print Composable**

- Default to landscape orientation (unless overridden)
- Detect orientation automatically if needed
- Print preview & PDF/Excel generation entry point

#### 4. **Print Templates**

- Components optimized for printable content
- Remove interactivity (e.g., buttons, input fields)
- Apply print-specific styles
- Control page breaks (`avoid`, `always`, `auto`)

---

### Example Usage

```ts
// In any component
const { openPrintPreview } = usePrint()

// For table print
openPrintPreview({
  title: 'Sales Report',
  printType: 'table',
  printData: salesData,
  content: TablePrintTemplate,
  sectionRef: sectionRef,
  enablePagination: true,
  rowsPerPage: 20,
})

// For mixed content
openPrintPreview({
  title: 'Client Report',
  printType: 'mixed',
  printSections: [
    { type: 'chart', element: chartRef.value },
    { type: 'table', data: tableData, columns: columns },
  ],
  sectionRef: sectionRef,
})
```

---

## Print Configuration Dialog

- Select **Page Size**: A4, A3, Letter, Legal
- **Orientation Toggle** (default = landscape)
- **Margin Settings**

---

## Export Formats

- **PDF** using `jsPDF` with full manual control
- **Excel** using `xlsx`
- **CSV** for basic text export

---

## Styling Requirements

- Print-friendly styles via `@media print`
- Page break control classes:
  - `.print-break-avoid`
  - `.print-break-always`
  - `.print-break-auto`
- Fixed headers/footers for long content
- Scaled layout to fit standard paper sizes (A4, Letter)

---

## Performance Considerations

- Lazy-load `jsPDF`, `html2canvas`, and `xlsx`
- Minimize DOM access and avoid reflow in preview
- Debounced rendering to avoid performance bottlenecks with large datasets
- Efficient pagination and column processing
