import type { ValidationRule } from '@/types'
import { VALIDATION_RULES } from '@/constants'

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Validate a single field
export const validateField = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = []

  for (const rule of rules) {
    const isValid = validateRule(value, rule)
    if (!isValid) {
      errors.push(rule.message)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validate a single rule
const validateRule = (value: any, rule: ValidationRule): boolean => {
  switch (rule.type) {
    case 'required':
      return value !== null && value !== undefined && value !== ''

    case 'email':
      return VALIDATION_RULES.EMAIL.test(String(value))

    case 'min':
      if (typeof value === 'string') {
        return value.length >= (rule.value || 0)
      }
      if (typeof value === 'number') {
        return value >= (rule.value || 0)
      }
      return true

    case 'max':
      if (typeof value === 'string') {
        return value.length <= (rule.value || 0)
      }
      if (typeof value === 'number') {
        return value <= (rule.value || 0)
      }
      return true

    case 'pattern':
      if (rule.value instanceof RegExp) {
        return rule.value.test(String(value))
      }
      return true

    default:
      return true
  }
}

// Validate form data
export const validateForm = (data: Record<string, any>, fieldRules: Record<string, ValidationRule[]>): ValidationResult => {
  const errors: string[] = []

  for (const [fieldName, rules] of Object.entries(fieldRules)) {
    const value = data[fieldName]
    const fieldValidation = validateField(value, rules)

    if (!fieldValidation.isValid) {
      errors.push(...fieldValidation.errors.map(error => `${fieldName}: ${error}`))
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Common validation rules
export const commonValidations = {
  required: (message = 'This field is required'): ValidationRule => ({
    type: 'required',
    message
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    type: 'email',
    message
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    type: 'min',
    value: min,
    message: message || `Minimum length is ${min} characters`
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    type: 'max',
    value: max,
    message: message || `Maximum length is ${max} characters`
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    type: 'pattern',
    value: regex,
    message
  })
}

// Predefined validation sets
export const validationSets = {
  name: [
    commonValidations.required(),
    commonValidations.minLength(VALIDATION_RULES.NAME_MIN_LENGTH),
    commonValidations.maxLength(VALIDATION_RULES.NAME_MAX_LENGTH)
  ],

  email: [
    commonValidations.required(),
    commonValidations.email()
  ],

  password: [
    commonValidations.required(),
    commonValidations.minLength(VALIDATION_RULES.PASSWORD_MIN_LENGTH, 'Password must be at least 8 characters long')
  ],

  confirmPassword: (passwordField: string) => [
    commonValidations.required(),
    {
      type: 'pattern',
      value: new RegExp(`^${passwordField}$`),
      message: 'Passwords do not match'
    }
  ]
}
