# Composable Patterns

## Structure Template

```typescript
import { ref, computed, onUnmounted, type Ref, type ComputedRef } from 'vue'

// Return type interface - ALWAYS define explicitly
export interface UseFeatureReturn {
  // State (readonly where possible)
  data: Ref<DataType | null>
  loading: Readonly<Ref<boolean>>
  error: Readonly<Ref<Error | null>>

  // Computed
  isEmpty: ComputedRef<boolean>

  // Methods
  execute: (params: Params) => Promise<DataType | null>
  reset: () => void
}

// Options interface for configurable composables
export interface UseFeatureOptions {
  onSuccess?: (data: DataType) => void
  onError?: (error: Error) => void
  immediate?: boolean
}

export function useFeature(options: UseFeatureOptions = {}): UseFeatureReturn {
  // 1. Private state
  const data = ref<DataType | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // 2. Computed
  const isEmpty = computed((): boolean => data.value === null)

  // 3. Private functions (pure)
  function validateParams(params: Params): boolean {
    return params.id !== undefined
  }

  // 4. Public methods
  const execute = async (params: Params): Promise<DataType | null> => {
    if (!validateParams(params)) {
      throw new Error('Invalid params')
    }

    loading.value = true
    error.value = null

    try {
      const result = await fetchData(params)
      data.value = result
      options.onSuccess?.(result)
      return result
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Unknown error')
      error.value = e
      options.onError?.(e)
      return null
    } finally {
      loading.value = false
    }
  }

  const reset = (): void => {
    data.value = null
    loading.value = false
    error.value = null
  }

  // 5. Cleanup
  onUnmounted(() => {
    // Cancel pending requests, clear timers, etc.
  })

  // 6. Return typed object
  return {
    data,
    loading: readonly(loading),
    error: readonly(error),
    isEmpty,
    execute,
    reset,
  }
}
```

## Naming Conventions

| Pattern            | Example               | Use Case                |
| ------------------ | --------------------- | ----------------------- |
| `useXxx`           | `useApi`, `useAuth`   | General composables     |
| `useXxxStore`      | `useAuthStore`        | Pinia stores            |
| `useXxxInfo`       | `useViewportInfo`     | Read-only reactive info |
| `useXxxNavigation` | `useRouterNavigation` | Navigation helpers      |

## Common Patterns

### Data Fetching

```typescript
export function useUsers(): UseUsersReturn {
  const { data, loading, error, execute } = useApi<User[]>()

  const fetchUsers = async (): Promise<User[] | null> => {
    return execute(() => userApi.getAll())
  }

  const findById = computed(() => {
    return (id: string): User | undefined => {
      return data.value?.find((u) => u.id === id)
    }
  })

  return { users: data, loading, error, fetchUsers, findById }
}
```

### Form State

```typescript
export function useForm<T extends Record<string, unknown>>(initialValues: T): UseFormReturn<T> {
  const values = ref<T>({ ...initialValues }) as Ref<T>
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})

  const isDirty = computed((): boolean => {
    return JSON.stringify(values.value) !== JSON.stringify(initialValues)
  })

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]): void => {
    values.value[field] = value
    touched.value[field] = true
  }

  const reset = (): void => {
    values.value = { ...initialValues }
    errors.value = {}
    touched.value = {}
  }

  return { values, errors, touched, isDirty, setFieldValue, reset }
}
```

### Event Listeners

```typescript
export function useWindowResize(): UseWindowResizeReturn {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const handleResize = (): void => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    width: readonly(width),
    height: readonly(height),
  }
}
```

## Anti-Patterns

```typescript
// ❌ BAD: Returning tuple (hard to extend, unclear naming)
function useToggle(): [Ref<boolean>, () => void] {
  const value = ref(false)
  const toggle = () => {
    value.value = !value.value
  }
  return [value, toggle]
}

// ✅ GOOD: Returning object
function useToggle(): UseToggleReturn {
  const value = ref(false)
  const toggle = (): void => {
    value.value = !value.value
  }
  const setTrue = (): void => {
    value.value = true
  }
  const setFalse = (): void => {
    value.value = false
  }
  return { value, toggle, setTrue, setFalse }
}
```

```typescript
// ❌ BAD: No cleanup
function useInterval(callback: () => void, ms: number): void {
  setInterval(callback, ms) // Memory leak!
}

// ✅ GOOD: With cleanup
function useInterval(callback: () => void, ms: number): UseIntervalReturn {
  const id = ref<number | null>(null)

  const start = (): void => {
    if (id.value !== null) return
    id.value = window.setInterval(callback, ms)
  }

  const stop = (): void => {
    if (id.value === null) return
    clearInterval(id.value)
    id.value = null
  }

  onUnmounted(stop)

  return { start, stop, isRunning: computed(() => id.value !== null) }
}
```

```typescript
// ❌ BAD: No return type
export function useData() {
  // TypeScript infers, but explicit is better
}

// ✅ GOOD: Explicit return type
export function useData(): UseDataReturn {
  // Clear contract
}
```
