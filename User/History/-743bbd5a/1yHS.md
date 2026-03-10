# Migration Guide: Print Preview Store

## 📦 Cấu trúc mới

```
src/composables/print/
├── constants/              # Tất cả constants
│   ├── dimensions.ts      # Kích thước, margins
│   ├── styles.ts          # Colors, borders, fonts
│   └── formats.ts         # File formats, MIME types
├── utils/                 # Pure utility functions
│   ├── htmlParser.ts      # HTML to rich text
│   └── tableUtils.ts      # Table analysis
├── core/                  # Core functionality
│   └── usePrintState.ts   # State management
├── pdf/                   # PDF processing
│   ├── usePdfGenerator.ts # Main PDF logic
│   ├── usePdfHeader.ts    # Header generation
│   ├── usePdfTable.ts     # Table processing
│   ├── usePdfCanvas.ts    # Canvas/Chart processing
│   └── usePdfText.ts      # Text processing
└── index.ts               # Main export

```

## 🔄 Migration Steps

### Step 1: Update Imports

```typescript
// ❌ OLD
import { usePrintPreviewStore } from '@/stores/print-preview.store'

// ✅ NEW
import { usePrintPreview } from '@/composables/print'
// Or if you need the store directly:
import { usePrintPreviewStore } from '@/composables/print'
```

### Step 2: Update Usage

```typescript
// ❌ OLD - Class-based approach
const printStore = usePrintPreviewStore()
await printStore.openPrintPreview(sections, config)
printStore.downloadPdf('report')

// ✅ NEW - Functional approach
const printPreview = usePrintPreview()
await printPreview.open(sections, config)
printPreview.downloadPdf('report')
```

### Step 3: Update Custom Excel Handlers

```typescript
// ❌ OLD
const customHandler = () => {
  // Excel generation logic
}
await printStore.openPrintPreview(sections, config, customHandler)

// ✅ NEW - Same interface, cleaner implementation
const customHandler = async () => {
  // Excel generation logic
}
await printPreview.open(sections, config, customHandler)
```

## ⚡ Performance Improvements

### Tree Shaking

```typescript
// Import only what you need
import { usePdfGenerator } from '@/composables/print/pdf/usePdfGenerator'
import { SPACING } from '@/composables/print/constants'
```

### Lazy Loading

```typescript
// Load Excel module only when needed
const generateExcel = async () => {
  const { useExcelGenerator } = await import('@/composables/print/excel/useExcelGenerator')
  const { generate } = useExcelGenerator()
  return generate()
}
```

## 🧪 Testing

### Unit Testing Pure Functions

```typescript
// Easy to test pure functions
import { parseHtmlToRichText } from '@/composables/print/utils/htmlParser'

describe('htmlParser', () => {
  it('should parse bold tags', () => {
    const result = parseHtmlToRichText('<b>Bold</b> text')
    expect(result.isRichText).toBe(true)
    expect(result.richText).toHaveLength(2)
  })
})
```

### Mocking Composables

```typescript
// Mock individual composables
vi.mock('@/composables/print/pdf/usePdfGenerator', () => ({
  usePdfGenerator: () => ({
    generatePdf: vi.fn().mockResolvedValue(new Blob()),
  }),
}))
```

## 🔧 Customization

### Adding New Section Types

```typescript
// 1. Create new processor
// src/composables/print/pdf/usePdfCustomSection.ts
export const usePdfCustomSection = () => {
  const processCustom = async (pdf, section, startY) => {
    // Custom processing logic
    return newY
  }
  return { processCustom }
}

// 2. Update main generator
// src/composables/print/pdf/usePdfGenerator.ts
import { usePdfCustomSection } from './usePdfCustomSection'

const { processCustom } = usePdfCustomSection()

// Add to switch statement
case PRINT_TYPE.CUSTOM:
  return processCustom(pdf, section, currentY)
```

### Extending Constants

```typescript
// Add new constants without modifying existing files
// src/composables/print/constants/custom.ts
export const CUSTOM_DIMENSIONS = {
  SPECIAL_WIDTH: 800,
  SPECIAL_HEIGHT: 600,
} as const

// Import where needed
import { CUSTOM_DIMENSIONS } from '../constants/custom'
```

## 📝 Type Safety

### Better Type Inference

```typescript
// All functions have proper return types
const { generatePdf } = usePdfGenerator()
// generatePdf: (sections: PrintSection[], config?: PdfConfig) => Promise<Blob>
```

### Strict Constants

```typescript
// All constants are readonly
import { SPACING } from '@/composables/print/constants'
// SPACING.MARGIN.TOP = 60 // ❌ Error: Cannot assign to 'TOP' because it is a read-only property
```

## 🚨 Breaking Changes

1. **Store location changed**

   - From: `@/stores/print-preview.store.ts`
   - To: `@/composables/print/index.ts`

2. **Method names simplified**

   - `openPrintPreview` → `open`
   - `closePrintPreview` → `close`

3. **Excel generation temporarily unavailable**
   - Need to implement `useExcelGenerator` composables
   - Custom handlers still work

## 📊 Benefits Summary

| Aspect              | Before     | After                |
| ------------------- | ---------- | -------------------- |
| **Maintainability** | Hard       | Easy                 |
| **Testability**     | Complex    | Simple               |
| **Performance**     | Monolithic | Optimized            |
| **Type Safety**     | Partial    | Complete             |
| **Code Reuse**      | Limited    | Extensive            |
| **Bundle Size**     | Large      | Small (tree-shaking) |

## 🎯 Next Steps

1. **Complete Excel modules** - Port Excel logic to composables
2. **Add unit tests** - Test each composable independently
3. **Add integration tests** - Test complete workflows
4. **Performance monitoring** - Add metrics for generation time
5. **Error recovery** - Add retry mechanisms
6. **Caching** - Implement memoization for expensive operations
