# Print Preview Store Refactoring Plan

## Current State Analysis
- **File Size**: 1365 lines (TOO LARGE!)
- **Responsibilities**: PDF, Excel, Canvas, Text processing
- **Complexity**: High cognitive complexity with deep nesting
- **Maintainability**: Poor - difficult to modify or extend

## Target Architecture

### Module Structure
```
src/composables/print/
├── constants/
│   ├── dimensions.ts      # Page dimensions, margins
│   ├── styles.ts          # Font styles, colors
│   └── formats.ts         # File formats, MIME types
├── core/
│   ├── usePrintState.ts   # State management
│   └── usePrintConfig.ts  # Configuration
├── pdf/
│   ├── usePdfGenerator.ts # Main PDF logic
│   ├── usePdfHeader.ts    # Header generation
│   ├── usePdfTable.ts     # Table processing
│   ├── usePdfCanvas.ts    # Canvas processing
│   └── usePdfText.ts      # Text processing
├── excel/
│   ├── useExcelGenerator.ts  # Main Excel logic
│   ├── useExcelTable.ts      # Table processing
│   ├── useExcelCanvas.ts     # Canvas/Image processing
│   ├── useExcelText.ts       # Text processing
│   └── useExcelFormatting.ts # Rich text, styles
├── utils/
│   ├── htmlParser.ts      # HTML parsing utilities
│   ├── tableUtils.ts      # Table analysis
│   └── imageUtils.ts      # Image processing
└── index.ts               # Main export
```

## Refactoring Steps

### Step 1: Extract Constants (Priority: HIGH)
- Move all magic numbers to constants
- Create type-safe configuration objects
- Define clear interfaces

### Step 2: Split PDF Logic (Priority: HIGH)
- Extract PDF generation to separate composables
- Create pure functions for each section type
- Maximum 30 lines per function

### Step 3: Split Excel Logic (Priority: HIGH)
- Extract Excel generation to separate composables
- Separate formatting from data processing
- Create reusable cell processors

### Step 4: Create Utility Functions (Priority: MEDIUM)
- HTML parsing utilities
- Table structure analysis
- Image conversion helpers

### Step 5: Refactor State Management (Priority: MEDIUM)
- Simplify state structure
- Remove redundant computed properties
- Use proper TypeScript types

### Step 6: Implement Error Handling (Priority: LOW)
- Add proper error boundaries
- Create custom error types
- Implement retry logic

## Code Quality Goals
- ✅ No function > 30 lines
- ✅ Max nesting depth: 2 levels
- ✅ Pure functions where possible
- ✅ Clear separation of concerns
- ✅ Comprehensive type safety
- ✅ Unit testable components

## Migration Strategy
1. Create new module structure
2. Move logic piece by piece
3. Maintain backward compatibility
4. Add tests for each module
5. Deprecate old store gradually
