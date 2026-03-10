# Print Structure Refactor Plan

## Overview of Current State

The current print structure has several issues:
1. Type mismatch in `PrintPreviewOptions` - `workerType` vs `type` property
2. Mixed units (mm and pt) in configuration
3. Hardcoded header logic that's not reusable
4. No standardized data structure for handlers
5. Inconsistent configuration patterns

## Overview of Final State

After refactoring, the print structure will have:
1. Consistent type definitions with proper property names
2. All dimensions using pt (points) for consistency
3. Reusable header function with customization options
4. Standardized fake data structure for development/testing
5. Clean separation of concerns between configuration and implementation

## Files to Change

### 1. `src/types/print-preview.types.ts`
- Update `PrintPreviewOptions` to use `type` instead of `workerType`
- Add new interfaces for header customization
- Add standardized data structure interfaces

### 2. `src/constants/print-preview.constants.ts`
- Convert all dimensions from mm to pt
- Add new constants for header customization
- Add fake data constants for development

### 3. `src/workers/utils/pdf-utils.ts`
- Refactor `addPdfHeader` to be more reusable with customization options
- Add new utility functions for common header patterns
- Update to use pt units consistently

### 4. `src/workers/worker-handlers/branch-sales.handler.ts`
- Update to use new type structure
- Implement standardized fake data
- Use new header customization options

### 5. `src/views/branch/branch-sales/partials/BranchSalesHeader.vue`
- Fix type error by using correct property name
- Update to use new configuration structure

## Checklist

### Phase 1: Type System Updates
- [ ] Update `PrintPreviewOptions` interface to use `type` property
- [ ] Add `HeaderConfig` interface for customization
- [ ] Add `FakeDataConfig` interface for development data
- [ ] Update all related type imports

### Phase 2: Constants and Configuration
- [ ] Convert all dimensions from mm to pt in constants
- [ ] Add header customization constants
- [ ] Add fake data constants for branch sales
- [ ] Update configuration structure

### Phase 3: PDF Utilities Refactor
- [ ] Refactor `addPdfHeader` to accept customization options
- [ ] Add helper functions for common header patterns
- [ ] Update all functions to use pt units
- [ ] Add type safety for header configuration

### Phase 4: Handler Updates
- [ ] Update branch-sales handler to use new types
- [ ] Implement standardized fake data structure
- [ ] Use new header customization options
- [ ] Add proper error handling

### Phase 5: Component Updates
- [ ] Fix type error in BranchSalesHeader.vue
- [ ] Update to use new configuration structure
- [ ] Test the complete flow

### Phase 6: Testing and Validation
- [ ] Verify all type errors are resolved
- [ ] Test print preview functionality
- [ ] Validate PDF generation with new structure
- [ ] Ensure consistent behavior across different handlers
