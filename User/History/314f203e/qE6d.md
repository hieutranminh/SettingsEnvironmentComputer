# Refactor Suggestions for usePdfGenerator.ts

## Current Issues:

1. **File too long (248 lines)** - Should be broken into smaller composables
2. **Too many responsibilities** in one composable
3. **Some hardcoded values** still present
4. **Function parameters** could be better organized

## Suggested Structure:

```typescript
// Core generator
usePdfGenerator.ts (50 lines)
├── usePdfConfig.ts (40 lines)      // Configuration management
├── usePdfContext.ts (30 lines)     // Context initialization & management
├── usePdfProcessor.ts (60 lines)   // Section processing logic
└── usePdfFinalizer.ts (30 lines)   // Document finalization

// Current structure:
usePdfGenerator.ts (248 lines) ❌
```

## 1. Extract Configuration Management:

**New file: `usePdfConfig.ts`**

```typescript
export const usePdfConfig = () => {
  const getDefaultConfig = (isLandscape: boolean): Required<PdfConfig> => ({ ... })
  const preparePdfConfig = (sections: PrintSection[], config?: PdfConfig) => ({ ... })
  const checkLandscapeOrientation = (sections: PrintSection[]): boolean => ({ ... })

  return {
    getDefaultConfig,
    preparePdfConfig,
    checkLandscapeOrientation,
  }
}
```

## 2. Extract Context Management:

**New file: `usePdfContext.ts`**

```typescript
export const usePdfContext = () => {
  const initializeContext = (pdf: jsPDF, config: Required<PdfConfig>) => ({ ... })
  const updateContext = (context: PdfProcessingContext, newY: number) => ({ ... })

  return {
    initializeContext,
    updateContext,
  }
}
```

## 3. Extract Processing Logic:

**New file: `usePdfProcessor.ts`**

```typescript
export const usePdfProcessor = () => {
  const processSectionsSequentially = async (params: ProcessingSectionsParams) => ({ ... })
  const processSectionByType = async (params: ProcessingSectionParams) => ({ ... })

  return {
    processSectionsSequentially,
    processSectionByType,
  }
}
```

## 4. Improve Parameter Organization:

```typescript
// Instead of many parameters
const processSection = async (
  pdf: jsPDF,
  section: PrintSection,
  config: Required<PdfConfig>,
  context: PdfProcessingContext,
): Promise<number>

// Use parameter object
interface ProcessSectionParams {
  pdf: jsPDF
  section: PrintSection
  config: Required<PdfConfig>
  context: PdfProcessingContext
}

const processSectionByType = async (params: ProcessSectionParams): Promise<number>
```

## 5. Remove Hardcoded Values:

```typescript
// Create constants file
export const PDF_OUTPUT_FORMATS = {
  BLOB: 'blob',
  DATA_URL: 'dataurlnewwindow',
  ARRAY_BUFFER: 'arraybuffer',
} as const

// Use in code
return pdf.output(PDF_OUTPUT_FORMATS.BLOB)
```

## 6. Enhanced Error Handling:

```typescript
export class PdfGenerationError extends Error {
  constructor(
    message: string,
    public readonly stage: 'config' | 'processing' | 'finalization',
    public readonly originalError?: Error,
  ) {
    super(message)
    this.name = 'PdfGenerationError'
  }
}
```

## Benefits of Refactor:

- ✅ **Smaller, focused files** (30-60 lines each)
- ✅ **Single responsibility** per composable
- ✅ **Better testability** - easier to unit test small functions
- ✅ **Improved maintainability** - easier to find and fix issues
- ✅ **Better reusability** - other composables can use specific parts
- ✅ **Cleaner imports** - import only what you need
