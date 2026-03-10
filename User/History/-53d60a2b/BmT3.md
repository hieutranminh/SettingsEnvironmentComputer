---
name: vue-clean-code
description: Clean code guidelines for Vue 3, Pinia, TypeScript production projects. Use when writing, reviewing, or refactoring Vue components, Pinia stores, composables, TypeScript utilities, or API services. Applies to code style, naming conventions, component structure, state management, error handling, and maintainability.
---

# Vue Clean Code Guidelines

Production-grade clean code patterns for Vue 3 + Pinia + TypeScript projects.

## Core Principles

1. **Single Responsibility** - Each unit (component, composable, store, function) does ONE thing well
2. **Explicit over Implicit** - No magic values, no hidden state mutations
3. **Type Safety First** - Strict typing everywhere, no `any` unless absolutely necessary
4. **Immutability** - Prefer readonly/const, never mutate input parameters
5. **Fail Fast** - Raise errors immediately, never silently ignore

## Component Guidelines

### File Structure

Follow this order in `.vue` files:

```vue
<template>
  <!-- Template first -->
</template>

<script setup lang="ts">
// 1. Imports (external → internal → types)
// 2. defineOptions
// 3. Type definitions (local interfaces/types)
// 4. Props definition
// 5. Emits definition
// 6. Composables/stores
// 7. Refs and reactive state
// 8. Computed properties
// 9. Watchers
// 10. Functions (pure functions first, then handlers)
// 11. Lifecycle hooks
</script>

<style scoped>
/* Scoped styles last */
</style>
```

### Naming Conventions

| Type               | Convention                          | Example                                        |
| ------------------ | ----------------------------------- | ---------------------------------------------- |
| Components         | PascalCase                          | `UserProfile.vue`, `DatePickerField.vue`       |
| Composables        | camelCase with `use` prefix         | `useApi`, `useAuth`                            |
| Stores             | camelCase with `use` + `Store`      | `useAuthStore`, `useUserStore`                 |
| Props interface    | `Props`                             | `interface Props { ... }`                      |
| Emits              | `event: 'eventName'`                | `(event: 'update:modelValue', value: T): void` |
| Handlers           | `handle` prefix                     | `handleClick`, `handleSubmit`                  |
| Boolean props/vars | `is`, `has`, `can`, `should` prefix | `isLoading`, `hasError`, `canEdit`             |
| Computed getters   | noun form                           | `fullName`, `displayValue`, `isAuthenticated`  |

### Props Best Practices

```typescript
// ✅ GOOD: Explicit types, no default values in withDefaults for objects
interface Props {
  modelValue: string
  items: Item[]
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'medium',
})

// ❌ BAD: Generic types, magic strings
const props = defineProps({
  value: Object,
  type: String,
})
```

### Emits Best Practices

```typescript
// ✅ GOOD: Typed emits with payload types
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'submit', data: FormData): void
  (event: 'cancel'): void
}>()

// ❌ BAD: Untyped emits
const emit = defineEmits(['update', 'submit'])
```

## Composable Guidelines

See [references/composables.md](references/composables.md) for detailed patterns.

Key rules:

1. Return typed object, not tuple
2. Use explicit return type annotation
3. Keep state private, expose via readonly refs
4. Handle cleanup in `onUnmounted`

## Pinia Store Guidelines

See [references/pinia-stores.md](references/pinia-stores.md) for detailed patterns.

Key rules:

1. Use Composition API style (`setup()` function)
2. Group: State → Computed → Actions
3. Never mutate state directly from components
4. Use actions for all state changes
5. Keep stores focused - split if >200 lines

## TypeScript Guidelines

See [references/typescript.md](references/typescript.md) for detailed patterns.

Key rules:

1. Strict mode enabled
2. Explicit return types on all functions
3. Use `interface` for object shapes, `type` for unions/aliases
4. Never use `any` - use `unknown` and narrow
5. Prefer discriminated unions for complex states

## Error Handling

```typescript
// ✅ GOOD: Explicit error handling
const execute = async (): Promise<Result> => {
  try {
    const response = await api.call()
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`API failed: ${error.message}`)
    }
    throw error
  }
}

// ❌ BAD: Silent failure
const execute = async () => {
  try {
    return await api.call()
  } catch {
    return null // Silent failure!
  }
}
```

## Anti-Patterns to Avoid

1. **Giant components** (>300 lines) → Extract composables or child components
2. **Props drilling** (>2 levels) → Use provide/inject or store
3. **Direct DOM manipulation** → Use refs and Vue reactivity
4. **Business logic in templates** → Move to computed or methods
5. **Watchers with side effects** → Use explicit handlers
6. **Mutating props** → Emit events to parent
7. **Any types** → Define proper interfaces
8. **Magic strings/numbers** → Use constants
9. **Default parameter values** → Pass all parameters explicitly

## Code Review Checklist

Before submitting code, verify:

- [ ] All functions have explicit return types
- [ ] Props are properly typed with interface
- [ ] No `any` types (search for `: any`)
- [ ] Error handling is explicit (no empty catch blocks)
- [ ] Boolean variables use `is/has/can/should` prefix
- [ ] Handlers use `handle` prefix
- [ ] Component follows file structure order
- [ ] No magic strings/numbers (use constants)
- [ ] Store actions for all state changes
- [ ] Composables return typed objects
