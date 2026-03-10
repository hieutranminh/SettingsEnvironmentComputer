# Vue Composables

This directory contains reusable Vue 3 composables following the project's guidelines.

## useModelBinding

A collection of composables for creating type-safe two-way data bindings in Vue components.

### Features

- ✅ **Type Safety**: No `any` types, full TypeScript support
- ✅ **Reusable**: Works with any object type
- ✅ **Flexible**: Supports additional updates when values change
- ✅ **Performance**: Uses Vue's computed properties
- ✅ **Tested**: Comprehensive unit tests

### Available Composables

#### `useModelBinding<T>(props, emit, key, additionalUpdates?)`

Generic model binding for any property type.

```typescript
const nameModel = useModelBinding(props, emit, 'name')
const itemsModel = useModelBinding(props, emit, 'items', { isDirty: true })
```

#### `useStringModelBinding<T>(props, emit, key, additionalUpdates?)`

String-specific binding for text inputs.

```typescript
const nameModel = useStringModelBinding(props, emit, 'name')
// Always returns string, handles undefined/null gracefully
```

#### `useNumberModelBinding<T>(props, emit, key, additionalUpdates?)`

Number-specific binding for numeric inputs.

```typescript
const countModel = useNumberModelBinding(props, emit, 'count')
// Always returns number, handles undefined/null gracefully
```

#### `useBooleanModelBinding<T>(props, emit, key, additionalUpdates?)`

Boolean-specific binding for checkboxes.

```typescript
const isActiveModel = useBooleanModelBinding(props, emit, 'isActive')
// Always returns boolean, handles undefined/null gracefully
```

### Usage Examples

#### Basic Form Component

```vue
<template>
  <div>
    <InputText v-model="nameModel" placeholder="Enter name" />
    <InputNumber v-model="ageModel" />
    <Checkbox v-model="isActiveModel" label="Active" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: {
    name: string
    age: number
    isActive: boolean
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: Props['modelValue']]
}>()

// Type-safe model bindings
const nameModel = useStringModelBinding(props, emit, 'name')
const ageModel = useNumberModelBinding(props, emit, 'age')
const isActiveModel = useBooleanModelBinding(props, emit, 'isActive')
</script>
```

#### With Additional Updates

```vue
<script setup lang="ts">
// When name changes, also clear the description
const nameModel = useStringModelBinding(props, emit, 'name', { description: '' })

// When items change, also set isDirty to true
const itemsModel = useModelBinding(props, emit, 'items', { isDirty: true })
</script>
```

### Type Safety

All composables are fully typed and work with any object type:

```typescript
interface UserForm {
  name: string
  email: string
  age: number
  isActive: boolean
  preferences: string[]
}

// All of these work with UserForm interface
const nameModel = useStringModelBinding(props, emit, 'name')
const emailModel = useStringModelBinding(props, emit, 'email')
const ageModel = useNumberModelBinding(props, emit, 'age')
const isActiveModel = useBooleanModelBinding(props, emit, 'isActive')
const preferencesModel = useModelBinding(props, emit, 'preferences')
```

### Benefits

1. **Reduces Code Duplication**: No need to write repetitive computed properties
2. **Type Safety**: Full TypeScript support without `any` types
3. **Consistency**: Standardized approach across all form components
4. **Maintainability**: Centralized logic for model bindings
5. **Performance**: Uses Vue's computed properties for optimal reactivity

### Migration from Manual Computed Properties

**Before:**
```typescript
const nameModel = computed({
  get: () => props.modelValue.name,
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      name: value,
    })
  },
})
```

**After:**
```typescript
const nameModel = useStringModelBinding(props, emit, 'name')
```

### Testing

The composables include comprehensive unit tests. Run tests with:

```bash
npm run test src/composables/__tests__/useModelBinding.test.ts
```
