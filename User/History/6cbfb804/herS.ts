import { computed, type Ref } from 'vue'

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
export const useModelBinding = <T extends Record<string, any>>(
  props: { modelValue: T },
  emit: (event: 'update:modelValue', value: T) => void,
  key: keyof T,
  additionalUpdates: Partial<T> = {}
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
