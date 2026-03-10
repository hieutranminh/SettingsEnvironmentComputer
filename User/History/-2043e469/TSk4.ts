import { ref, readonly } from 'vue'
import { useField, useForm } from 'vee-validate'
import type { FieldContext } from 'vee-validate'
import { commonRules } from '@/plugins/vee-validate'

export interface ValidationRule {
  (value: unknown): true | string
}

export interface FormField {
  name: string
  value: unknown
  rules?: ValidationRule[]
}

export function useValidation() {
  /**
   * Tạo một field với validation
   */
  const createField = (name: string, rules: ValidationRule[] = []) => {
    return useField(name, rules)
  }

  /**
   * Tạo form với multiple fields
   */
  const createForm = (fields: FormField[]) => {
    const initialValues: Record<string, unknown> = {}
    const validationSchema: Record<string, ValidationRule[]> = {}

    fields.forEach((field) => {
      initialValues[field.name] = field.value
      if (field.rules) {
        validationSchema[field.name] = field.rules
      }
    })

    return useForm({
      initialValues,
      validationSchema,
    })
  }

  /**
   * Validate một giá trị với rules
   */
  const validateValue = async (value: unknown, rules: ValidationRule[]): Promise<string | null> => {
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        return result
      }
    }
    return null
  }

  /**
   * Validate form data
   */
  const validateForm = async (
    formData: Record<string, unknown>,
    schema: Record<string, ValidationRule[]>,
  ) => {
    const errors: Record<string, string> = {}

    for (const [fieldName, rules] of Object.entries(schema)) {
      const error = await validateValue(formData[fieldName], rules)
      if (error) {
        errors[fieldName] = error
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  /**
   * Tạo validation rules cho các trường hợp phổ biến
   */
  const createRules = {
    required: () => commonRules.required,
    email: () => commonRules.email,
    phone: () => commonRules.phone,
    minLength: (min: number) => commonRules.minLength(min),
    maxLength: (max: number) => commonRules.maxLength(max),
    numeric: () => commonRules.numeric,
    url: () => commonRules.url,
    confirmed: (fieldName: string) => (value: string) => {
      // This would need to be implemented with form context
      return true
    },
    custom: (validator: ValidationRule) => validator,
  }

  return {
    createField,
    createForm,
    validateValue,
    validateForm,
    createRules,
    commonRules,
  }
}

/**
 * Composable để tạo form validation đơn giản
 */
export function useSimpleForm<T extends Record<string, unknown>>(initialData: T) {
  const formData = ref<T>({ ...initialData })
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const isSubmitting = ref(false)

  const setField = (field: keyof T, value: unknown) => {
    formData.value[field] = value
    // Clear error when user starts typing
    if (errors.value[field]) {
      delete errors.value[field]
    }
  }

  const setError = (field: keyof T, message: string) => {
    errors.value[field] = message
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const validateField = async (field: keyof T, rules: ValidationRule[]) => {
    const error = await validateValue(formData.value[field], rules)
    if (error) {
      setError(field, error)
      return false
    }
    return true
  }

  const validateForm = async (schema: Record<keyof T, ValidationRule[]>) => {
    clearErrors()
    let isValid = true

    for (const [field, rules] of Object.entries(schema)) {
      const fieldValid = await validateField(field as keyof T, rules)
      if (!fieldValid) {
        isValid = false
      }
    }

    return isValid
  }

  return {
    formData: readonly(formData),
    errors: readonly(errors),
    isSubmitting: readonly(isSubmitting),
    setField,
    setError,
    clearErrors,
    validateField,
    validateForm,
    setSubmitting: (value: boolean) => (isSubmitting.value = value),
  }
}
