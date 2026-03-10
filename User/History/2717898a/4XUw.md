# usePdfText.ts Refactor Plan

## Current Issues

### 1. Hardcoded Values

- Line 74: `+ 10` should be constant
- Line 104: `+ 50` should be constant

### 2. Long Functions

- `processTextElement`: 30+ lines, does too many things
- Should be split into smaller functions

### 3. Too Many Parameters

- `processTextElement` has 7 parameters
- Should use object parameter or context pattern

### 4. Complex Logic

- Nested conditions and loops
- Hard to follow and maintain

## Refactor Strategy

### 1. Add Missing Constants

```typescript
const TEXT_PROCESSING = {
  AFTER_HEADER_SPACING: 10,
  MIN_SPACE_FOR_NEW_PAGE: 50,
} as const
```

### 2. Split Large Functions

Break `processTextElement` into:

- `calculateTextMetrics()`
- `checkPageBreakNeeded()`
- `renderTextLines()`

### 3. Use Context Objects

Instead of 7 parameters, use structured objects:

```typescript
interface TextRenderContext extends PdfProcessingContext {
  maxWidth: number
  pageHeight: number
  // ... other properties
}
```

### 4. Extract Page Management

Create dedicated functions:

- `shouldStartNewPage()`
- `addPageWithHeader()`

### 5. Simplify Control Flow

- Reduce nesting levels
- Use early returns
- Extract condition logic

## Benefits After Refactor

1. Easier to test individual functions
2. Better maintainability
3. Clearer code flow
4. Reduced cognitive complexity
5. Following single responsibility principle
