import { computed, type Ref } from 'vue'

/**
 * Generic type for model value objects
 * Ensures type safety without using 'any'
 */
type ModelValue = Record<string, unknown>

/**
 * Creates a two-way binding computed property for form models
 * Reduces code duplication when creating v-model bindings for form inputs
 *
 * @param props - Component props containing modelValue
 * @param emit - Component emit function
 * @param key - Key of the property in modelValue to bind
 * @param additionalUpdates - Additional properties to update when value changes
 * @returns Computed property with getter and setter for two-way binding
 *
 * @example
 * // Basic usage
 * const nameModel = useModelBinding(props, emit, 'name')
 *
 * // With additional updates
 * const branchShopIdsModel = useModelBinding(props, emit, 'branchShopIds', { branchName: '' })
 */
export const useModelBinding = <T extends ModelValue>(
  props: { modelValue: T },
  emit: (event: 'update:modelValue', value: T) => void,
  key: keyof T,
  additionalUpdates: Partial<T> = {},
) => {
  return computed({
    get: (): T[keyof T] => props.modelValue[key],
    set: (value: T[keyof T]): void => {
      emit('update:modelValue', {
        ...props.modelValue,
        ...additionalUpdates,
        [key]: value,
      })
    },
  })
}

/**
 * Creates a string-specific model binding for text inputs
 * Ensures type safety for string inputs like InputText
 * 
 * @param props - Component props containing modelValue
 * @param emit - Component emit function
 * @param key - Key of the property in modelValue to bind (must be string type)
 * @param additionalUpdates - Additional properties to update when value changes
 * @returns Computed property with getter and setter for string binding
 * 
 * @example
 * const nameModel = useStringModelBinding(props, emit, 'name')
 */
export const useStringModelBinding = <T extends ModelValue>(
  props: { modelValue: T },
  emit: (event: 'update:modelValue', value: T) => void,
  key: keyof T,
  additionalUpdates: Partial<T> = {},
) => {
  return computed({
    get: (): string => String(props.modelValue[key] || ''),
    set: (value: string): void => {
      emit('update:modelValue', {
        ...props.modelValue,
        ...additionalUpdates,
        [key]: value as T[keyof T],
      })
    },
  })
}

/**
 * Creates a number-specific model binding for numeric inputs
 * Ensures type safety for number inputs like InputNumber
 * 
 * @param props - Component props containing modelValue
 * @param emit - Component emit function
 * @param key - Key of the property in modelValue to bind (must be number type)
 * @param additionalUpdates - Additional properties to update when value changes
 * @returns Computed property with getter and setter for number binding
 * 
 * @example
 * const countModel = useNumberModelBinding(props, emit, 'count')
 */
export const useNumberModelBinding = <T extends ModelValue>(
  props: { modelValue: T },
  emit: (event: 'update:modelValue', value: T) => void,
  key: keyof T,
  additionalUpdates: Partial<T> = {},
) => {
  return computed({
    get: (): number => Number(props.modelValue[key]) || 0,
    set: (value: number): void => {
      emit('update:modelValue', {
        ...props.modelValue,
        ...additionalUpdates,
        [key]: value as T[keyof T],
      })
    },
  })
}

/**
 * Creates a boolean-specific model binding for checkbox inputs
 * Ensures type safety for boolean inputs like Checkbox
 * 
 * @param props - Component props containing modelValue
 * @param emit - Component emit function
 * @param key - Key of the property in modelValue to bind (must be boolean type)
 * @param additionalUpdates - Additional properties to update when value changes
 * @returns Computed property with getter and setter for boolean binding
 * 
 * @example
 * const isActiveModel = useBooleanModelBinding(props, emit, 'isActive')
 */
export const useBooleanModelBinding = <T extends ModelValue>(
  props: { modelValue: T },
  emit: (event: 'update:modelValue', value: T) => void,
  key: keyof T,
  additionalUpdates: Partial<T> = {},
) => {
  return computed({
    get: (): boolean => Boolean(props.modelValue[key]),
    set: (value: boolean): void => {
      emit('update:modelValue', {
        ...props.modelValue,
        ...additionalUpdates,
        [key]: value as T[keyof T],
      })
    },
  })
}
