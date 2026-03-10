# Vue Composables Best Practices - Solution

## 🚨 **Vấn đề ban đầu:**

Bạn đúng khi nghi ngờ! Cách implement trước **chưa tuân theo Vue composables guidelines**:

```typescript
// ❌ WRONG - Mixing store & composable in same file (179 lines)
// src/composables/print/index.ts
export const usePrintPreviewStore = defineStore('printPreview', () => {
  // 179 lines of mixed logic
})
export const usePrintPreview = () => {
  // Wrapper around store
}
```

### Vi phạm guidelines:
- ❌ **File quá dài**: 179 lines > 150 lines limit
- ❌ **Mixing concerns**: Store + Composable logic
- ❌ **Wrong location**: Store nên ở `stores/` hoặc tách riêng
- ❌ **Not composable-first**: Wrapper thay vì pure composable

## ✅ **Giải pháp đúng chuẩn:**

### 1. **Clean Composable** (Recommended for new code)
```typescript
// src/composables/print/usePrintPreview.ts - 95 lines ✓
export const usePrintPreview = (): UsePrintPreviewReturn => {
  // Pure composable logic
  const printState = usePrintState()
  const { generatePdf } = usePdfGenerator()
  
  // Local state
  let pdfDocument: Blob | null = null
  
  const open = async (sections: PrintSection[], config?: PdfConfig) => {
    // Implementation using other composables
  }
  
  return {
    // State (readonly following Vue guidelines)
    isVisible: readonly(printState.isVisible),
    isLoading: readonly(printState.isLoading),
    error: readonly(printState.error),
    
    // Actions
    open,
    close,
    downloadPdf,
    downloadExcel,
  }
}
```

### 2. **Store for Backward Compatibility**
```typescript
// src/composables/print/store.ts - 75 lines ✓
export const usePrintPreviewStore = defineStore('printPreview', () => {
  // Delegates to composables
  const printState = usePrintState()
  const { generatePdf } = usePdfGenerator()
  
  // Store wraps composables for compatibility
  return {
    // Expose composable functionality
  }
})
```

### 3. **Clean Barrel Export**
```typescript
// src/composables/print/index.ts - 23 lines ✓
export { usePrintPreview } from './usePrintPreview' // Recommended
export { usePrintPreviewStore } from './store' // Backward compatibility
export { usePrintState } from './core/usePrintState'
export * from './constants'
```

## 📊 **So sánh:**

| Aspect | Before (Wrong) | After (Correct) |
|--------|----------------|-----------------|
| **File count** | 1 file (179 lines) | 3 files (<100 lines each) |
| **Compliance** | ❌ Violates guidelines | ✅ Follows Vue standards |
| **Testability** | ❌ Hard to test mixed logic | ✅ Easy to test pure functions |
| **Reusability** | ❌ Store-coupled | ✅ Composable-first |
| **Performance** | ❌ Always imports store | ✅ Tree-shaking friendly |

## 🔄 **Migration Path:**

### Option A: New Projects (Recommended)
```typescript
// Use clean composable directly
import { usePrintPreview } from '@/composables/print'

const printPreview = usePrintPreview()
await printPreview.open(sections, config)
```

### Option B: Legacy Projects
```typescript
// Keep using store (unchanged API)
import { usePrintPreviewStore } from '@/composables/print'

const printStore = usePrintPreviewStore()
await printStore.openPrintPreview(sections, config)
```

### Option C: Gradual Migration
```typescript
// Start with composable for new features
import { usePrintPreview } from '@/composables/print/usePrintPreview'

// Keep store for existing features
import { usePrintPreviewStore } from '@/composables/print/store'
```

## 🎯 **Benefits of Correct Approach:**

### 1. **Vue Guidelines Compliance**
- ✅ File size < 150 lines
- ✅ Pure composable functions
- ✅ Proper return pattern with readonly state
- ✅ Clear separation of concerns

### 2. **Better Architecture**
- ✅ Composable-first design
- ✅ Store wraps composables (not vice versa)
- ✅ Easy to test individual pieces
- ✅ Tree-shaking friendly

### 3. **Developer Experience**
- ✅ Clear API surface
- ✅ Predictable behavior
- ✅ Easy to understand and maintain
- ✅ Follows Vue ecosystem patterns

## 📚 **Vue Composables Guidelines Checklist:**

### ✅ **Naming & Structure**
- ✅ File: `usePrintPreview.ts` (camelCase with `use` prefix)
- ✅ Function: `usePrintPreview()` (camelCase with `use` prefix)
- ✅ Size: < 150 lines per composable

### ✅ **Return Pattern**
```typescript
return {
  // State (readonly)
  isVisible: readonly(state.isVisible),
  isLoading: readonly(state.isLoading),
  
  // Actions
  open,
  close,
}
```

### ✅ **Best Practices**
- ✅ Use `readonly()` for exposed reactive state
- ✅ Handle loading and error states
- ✅ Cleanup in proper lifecycle
- ✅ Unit testable

## 🚀 **Recommendation:**

**Use the new structure!** Nó tuân thủ đầy đủ Vue composables guidelines và provides:

1. **Clean architecture** - Tách biệt concerns rõ ràng
2. **Easy testing** - Pure functions dễ test
3. **Better performance** - Tree-shaking, no unnecessary deps
4. **Future-proof** - Follows Vue ecosystem standards
5. **Backward compatibility** - Store vẫn hoạt động cho legacy code

Cách cũ (store trong composables) là **anti-pattern** và không theo chuẩn Vue!
