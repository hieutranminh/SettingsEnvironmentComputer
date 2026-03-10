# Print Preview Module - Modern Vue 3 Implementation Plan

## 1. Overview of Current State

The current implementation uses:
- Vue 2 Options API with mixins
- Global worker management
- Monolithic worker file with multiple report types
- Manual state management
- Legacy HTTP helpers and utilities

## 2. Overview of Final State

Modern Vue 3 implementation with:
- Composition API and `<script setup>`
- Functional programming approach
- Pinia setup stores for state management
- Modular worker handlers
- TypeScript for type safety
- Composable-based architecture
- Clean separation of concerns

## 3. Files to Change

### Core Module Structure
- Create `src/modules/print-preview/` directory structure
- Implement TypeScript interfaces and types
- Create composables for print preview logic
- Build modular worker handlers
- Implement Pinia setup store
- Create reusable Vue components

### Key Components
- `PrintPreview.vue` - Main print preview component
- `PrintPreviewModal.vue` - Modal wrapper
- `PrintPreviewButton.vue` - Trigger button component

### Composables
- `usePrintPreview.ts` - Main print preview logic
- `usePdfGenerator.ts` - PDF generation utilities
- `useExcelGenerator.ts` - Excel generation utilities

### Workers
- `print-preview.worker.ts` - Main worker file
- `base-handler.ts` - Base handler class
- Individual report handlers (sales-history, booking-list, etc.)

### Store
- `print-preview.store.ts` - Pinia setup store for state management

### Types and Utils
- TypeScript interfaces for all data structures
- Utility functions for formatting and generation
- Constants for configuration

## 4. Implementation Checklist

### Phase 1: Foundation
- [x] Create directory structure
- [x] Define TypeScript interfaces and types
- [x] Create constants file
- [x] Implement base utility functions

### Phase 2: Core Logic
- [x] Create Pinia setup store
- [x] Implement main composable (`usePrintPreview`)
- [x] Create PDF and Excel generator composables
- [x] Build base worker handler

### Phase 3: Worker System
- [x] Implement main worker file
- [x] Create modular worker handlers
- [x] Migrate existing report types to handlers
- [x] Add error handling and progress tracking

### Phase 4: Components
- [x] Create PrintPreview component
- [x] Implement PrintPreviewModal
- [x] Build PrintPreviewButton
- [x] Add accessibility features

### Phase 5: Integration
- [x] Test all report types
- [x] Verify error handling
- [x] Optimize performance
- [x] Add documentation

### Phase 6: Migration
- [ ] Update existing views to use new module
- [ ] Remove old mixin code
- [ ] Clean up legacy files
- [ ] Update imports throughout project 