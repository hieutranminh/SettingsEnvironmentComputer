# AutoTable Handling Improvements

## 1. 🚨 PRIORITY HIGH: Gộp logic header management

```typescript
/**
 * Centralized header management
 */
const ensurePageHeader = (
  pdf: jsPDF,
  config: Required<PdfConfig>,
  context: PdfProcessingContext,
  pageNumber?: number,
): void => {
  const currentPageNumber = pageNumber || pdf.getNumberOfPages()

  if (currentPageNumber > PAGE_NUMBERING.FIRST_PAGE_NUMBER && !context.pagesWithHeaders.has(currentPageNumber)) {
    addHeader(pdf, config, SPACING.MARGIN.TOP)
    context.pagesWithHeaders.add(currentPageNumber)
  }
}

// Usage in handlePageBreak:
const handlePageBreak = (pdf: jsPDF, config: Required<PdfConfig>, context: PdfProcessingContext): number => {
  pdf.addPage()
  ensurePageHeader(pdf, config, context)
  return context.headerEndPosition
}

// Usage in createPageDrawHandler:
const createPageDrawHandler =
  (config: Required<PdfConfig>, context: PdfProcessingContext) =>
  ({ doc }: { doc: jsPDF }) => {
    ensurePageHeader(doc, config, context)
  }
```

## 2. Tối ưu parameter passing với options object

```typescript
interface CreateTableConfigOptions {
  section: PrintSection
  tableElement: HTMLTableElement
  currentY: number
  context: PdfProcessingContext
  config: Required<PdfConfig>
}

const createTableConfig = (options: CreateTableConfigOptions) => {
  const { section, tableElement, currentY, context, config } = options

  const baseConfig = createTableBaseConfig(tableElement, currentY) // Remove unused section param
  const tableStyles = createTableStyles(section)
  const margins = createTableMargins(context)
  const pageDrawHandler = createPageDrawHandler(config, context)
  const optionalConfig = createOptionalTableConfig(section)

  return {
    ...baseConfig,
    ...tableStyles,
    ...margins,
    didDrawPage: pageDrawHandler,
    ...optionalConfig,
  }
}
```

## 3. Loại bỏ unused parameter

```typescript
// Before:
const createTableBaseConfig = (section: PrintSection, tableElement: HTMLTableElement, currentY: number)

// After:
const createTableBaseConfig = (tableElement: HTMLTableElement, currentY: number)
```

## 4. Cải thiện type safety cho alignment

```typescript
/**
 * Validates and returns proper text alignment
 */
const getValidAlignment = (alignment?: string): TextAlignment => {
  if (!alignment) return DEFAULT_ALIGNMENT

  const validAlignments: TextAlignment[] = ['left', 'center', 'right']
  return validAlignments.includes(alignment as TextAlignment) ? (alignment as TextAlignment) : DEFAULT_ALIGNMENT
}

// Usage:
const addTableTitle = (pdf, title, alignment, startY, pageWidth) => {
  if (!title) return startY

  pdf.setFontSize(PDF_FONT_SIZES.TABLE_TITLE)
  pdf.setFont(FONTS.BOLD, 'bold')

  const validAlignment = getValidAlignment(alignment)
  const xPosition = calculateTitlePosition(validAlignment, pageWidth)

  pdf.text(title, xPosition, startY, { align: validAlignment })
  return startY + SPACING.SECTION.AFTER_TITLE
}
```

## 5. Specific error types

```typescript
class AutoTableError extends Error {
  constructor(
    message: string,
    public operation: 'config' | 'render' | 'position',
    public cause?: Error,
  ) {
    super(`AutoTable ${operation} error: ${message}`)
    this.name = 'AutoTableError'
  }
}

// Usage:
try {
  const tableConfig = createTableConfig(options)
  autoTable(pdf, tableConfig)
} catch (error) {
  throw new AutoTableError('Failed to render table', 'render', error)
}
```

## 6. Cải thiện getFinalYPosition với logging

```typescript
const getFinalYPosition = (pdf: jsPDF, currentY: number, tableElement: HTMLTableElement): number => {
  // Primary method: Use autoTable's finalY
  if (pdf.lastAutoTable?.finalY) {
    return pdf.lastAutoTable.finalY
  }

  // Fallback: Log warning and estimate
  console.warn('AutoTable finalY not available, using estimation')
  const estimatedHeight = estimateTableHeight(tableElement)
  return currentY + estimatedHeight
}
```
