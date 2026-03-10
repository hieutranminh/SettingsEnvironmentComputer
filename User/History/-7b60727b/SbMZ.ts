export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = []

  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('This field is required')
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return { isValid: errors.length === 0, errors }
  }

  // Min length validation
  if (rules.minLength && value.toString().length < rules.minLength) {
    errors.push(`Minimum ${rules.minLength} characters required`)
  }

  // Max length validation
  if (rules.maxLength && value.toString().length > rules.maxLength) {
    errors.push(`Maximum ${rules.maxLength} characters allowed`)
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    errors.push('Invalid format')
  }

  // Custom validation
  if (rules.custom) {
    const customResult = rules.custom(value)
    if (customResult !== true) {
      errors.push(typeof customResult === 'string' ? customResult : 'Invalid value')
    }
  }

  return { isValid: errors.length === 0, errors }
}

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return { isValid: errors.length === 0, errors }
}

export const validateForm = (data: Record<string, any>, rules: Record<string, ValidationRule>): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    results[field] = validateField(data[field], fieldRules)
  }

  return results
}
