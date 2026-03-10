# usePdfTable.ts Improvement Suggestions

## 1. Tách hàm createTableConfig thành các helper functions nhỏ hơn

```typescript
// Thay vì 1 hàm 50 lines, tách thành:
const createTableBaseConfig = (section: PrintSection, tableElement: HTMLTableElement, currentY: number) => ({
  html: tableElement,
  tableWidth: 'auto' as const,
  rowPageBreak: 'avoid' as const,
  theme: 'grid' as const,
  showFoot: 'lastPage' as const,
  startY: currentY,
})

const createTableStyles = (section: PrintSection) => ({
  headStyles: {
    ...PDF_TABLE_STYLES.headStyles,
    ...(section.tableStyles?.headStyles || {}),
  },
  footStyles: {
    ...PDF_TABLE_STYLES.footStyles,
    ...(section.tableStyles?.footStyles || {}),
  },
  styles: {
    font: FONTS.REGULAR,
    ...PDF_TABLE_STYLES.styles,
    ...(section.tableStyles?.styles || {}),
  },
})

const createTableMargins = (context: PdfProcessingContext) => ({
  margin: {
    left: SPACING.MARGIN.LEFT,
    right: SPACING.MARGIN.RIGHT,
    top: context.headerEndPosition,
  },
})
```

## 2. Định nghĩa proper types thay vì type casting

```typescript
// Thay vì:
const align = (alignment || 'left') as 'left' | 'center' | 'right'

// Nên:
type TextAlignment = 'left' | 'center' | 'right'
const DEFAULT_ALIGNMENT: TextAlignment = 'left'
const align: TextAlignment = (alignment as TextAlignment) || DEFAULT_ALIGNMENT
```

## 3. Thêm constants cho magic numbers

```typescript
const PAGE_NUMBERING = {
  FIRST_PAGE_NUMBER: 1,
  HEADER_SKIP_FIRST_PAGE: false,
} as const
```

## 4. Tối ưu parameter passing bằng options object

```typescript
interface TableTitleOptions {
  title?: string
  alignment?: TextAlignment
  startY: number
  pageWidth: number
}

const addTableTitle = (pdf: jsPDF, options: TableTitleOptions): number => {
  const { title, alignment, startY, pageWidth } = options
  // ...
}
```

## 5. Cải thiện error handling với specific error types

```typescript
class PdfTableError extends Error {
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(`PDF Table Error: ${message}`)
    this.name = 'PdfTableError'
  }
}

// Usage:
throw new PdfTableError('Failed to process table', error)
```

## 6. Tách logic didDrawPage thành separate function

```typescript
const handlePageDraw =
  (config: Required<PdfConfig>, context: PdfProcessingContext) =>
  ({ doc }: { doc: jsPDF }) => {
    const pageNumber = doc.getNumberOfPages()
    if (pageNumber > PAGE_NUMBERING.FIRST_PAGE_NUMBER && !context.pagesWithHeaders.has(pageNumber)) {
      addHeader(doc, config, SPACING.MARGIN.TOP)
      context.pagesWithHeaders.add(pageNumber)
    }
  }
```
