# Print Preview Store Refactoring Plan

## 🔍 Current State Analysis

### Major Issues Identified

1. **Monolithic Design**: Single store handles PDF generation, Excel export, canvas processing, table handling, and state management (1299 lines)
2. **Function Length**: Multiple functions exceed 50-100 lines (downloadExcel: 145 lines, processTableSection: 110 lines)
3. **Hard-coded Values**: Magic numbers throughout (50, 25, 20, 40, colors, font sizes)
4. **ESLint Violations**: Disabled complexity rules indicate deep structural issues
5. **Deep Nesting**: Complex nested conditionals and loops
6. **Code Duplication**: Repeated patterns for error handling, styling, and alignment
7. **Poor Separation of Concerns**: Business logic mixed with presentation logic

### Compliance Assessment

- ❌ **Standards**: Violates SOLID principles, especially SRP
- ❌ **Patterns**: Not following composition pattern, too monolithic
- ❌ **Maintainability**: Hard to modify without affecting other features
- ❌ **Upgradeability**: Tightly coupled components make upgrades risky
- ❌ **Readability**: Functions too long, complex logic flows

## 🎯 Target State

### Proposed Architecture

```
src/
├── composables/
│   ├── usePrintPreview.ts          # Main orchestrator (state only)
│   ├── usePdfGenerator.ts          # PDF generation logic
│   └── useExcelExporter.ts         # Excel export logic
├── services/
│   ├── pdf/
│   │   ├── pdf.service.ts          # Main PDF service
│   │   ├── pdf-header.service.ts   # Header generation
│   │   ├── pdf-table.service.ts    # Table processing
│   │   ├── pdf-canvas.service.ts   # Canvas processing
│   │   └── pdf-text.service.ts     # Text processing
│   ├── excel/
│   │   ├── excel.service.ts        # Main Excel service
│   │   ├── excel-table.service.ts  # Table to Excel
│   │   ├── excel-canvas.service.ts # Canvas to Excel
│   │   └── excel-text.service.ts   # Text to Excel
├── constants/
│   ├── print.constants.ts          # All hardcoded values
│   └── pdf.constants.ts            # PDF specific constants
└── types/
    ├── print.types.ts              # Enhanced type definitions
    └── pdf.types.ts                # PDF specific types
```

## 📋 Implementation Tasks

### Phase 1: Extract Constants and Types

- [ ] Create `constants/print.constants.ts` with all magic numbers
- [ ] Create `constants/pdf.constants.ts` with PDF configuration
- [ ] Enhance type definitions in `types/print.types.ts`
- [ ] Create specific error types

### Phase 2: Create Service Layer

- [ ] Implement `services/pdf/pdf.service.ts` as main PDF orchestrator
- [ ] Create `services/pdf/pdf-header.service.ts` for header generation
- [ ] Create `services/pdf/pdf-table.service.ts` for table processing
- [ ] Create `services/pdf/pdf-canvas.service.ts` for canvas processing
- [ ] Create `services/pdf/pdf-text.service.ts` for text processing

### Phase 3: Excel Services

- [ ] Implement `services/excel/excel.service.ts` as main Excel orchestrator
- [ ] Create `services/excel/excel-table.service.ts` for table conversion
- [ ] Create `services/excel/excel-canvas.service.ts` for canvas conversion
- [ ] Create `services/excel/excel-text.service.ts` for text conversion

### Phase 4: Refactor Composables

- [ ] Refactor `usePrintPreview.ts` to only handle state management
- [ ] Create `usePdfGenerator.ts` composable using PDF services
- [ ] Create `useExcelExporter.ts` composable using Excel services
- [ ] Remove business logic from store, keep only state

### Phase 5: Error Handling & Validation

- [ ] Implement standardized error handling pattern
- [ ] Add input validation for all public methods
- [ ] Create error recovery mechanisms
- [ ] Add proper logging

### Phase 6: Testing & Documentation

- [ ] Create unit tests for each service
- [ ] Add integration tests for composables
- [ ] Update documentation with new architecture
- [ ] Performance testing for large documents

## 🔧 Key Improvements

### Code Quality

- Functions will be &lt; 30 lines each
- Single responsibility per service/composable
- No hardcoded values (all in constants)
- Proper error handling and types

### Maintainability

- Modular architecture for easy feature updates
- Clear separation between PDF and Excel logic
- Service-based architecture for testability
- Composables follow Vue 3 best practices

### Performance

- Lazy loading of heavy dependencies
- Memory cleanup for large documents
- Optimized processing pipelines
- Caching for repeated operations

## ⚠️ Implementation Notes

### Breaking Changes

- Public API will remain the same
- Internal restructuring only
- No changes to component usage

### Migration Strategy

1. Implement new services alongside existing store
2. Gradually migrate functionality
3. Update tests incrementally
4. Remove old code only after full validation

### Risk Mitigation

- Maintain backward compatibility
- Thorough testing at each phase
- Feature flags for rollback capability
- Performance monitoring during migration
