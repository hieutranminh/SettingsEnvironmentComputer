import { ref, computed, readonly } from 'vue'

export interface FormField {
  name: string
  value: string | number | boolean
  valid: boolean
  invalid: boolean
  dirty: boolean
  touched: boolean
  errors: string[]
}

export interface FormState {
  valid: boolean
  invalid: boolean
  dirty: boolean
  touched: boolean
  submitted: boolean
  errors: string[]
  fields: Record<string, FormField>
}

const createInitialFormState = (): FormState => ({
  valid: true,
  invalid: false,
  dirty: false,
  touched: false,
  submitted: false,
  errors: [],
  fields: {},
})

const createField = (name: string, initialValue: string | number | boolean): FormField => ({
  name,
  value: initialValue,
  valid: true,
  invalid: false,
  dirty: false,
  touched: false,
  errors: [],
})

export const usePrimeVueForm = () => {
  const formState = ref<FormState>(createInitialFormState())

  const registerField = (name: string, initialValue: string | number | boolean = '') => {
    formState.value.fields[name] = createField(name, initialValue)
  }

  const updateField = (name: string, updates: Partial<FormField>) => {
    if (formState.value.fields[name]) {
      formState.value.fields[name] = { ...formState.value.fields[name], ...updates }
      updateFormState()
    }
  }

  const updateFormState = () => {
    const fields = Object.values(formState.value.fields)
    const allValid = fields.every((field) => field.valid)
    const anyDirty = fields.some((field) => field.dirty)
    const anyTouched = fields.some((field) => field.touched)
    const allErrors = fields.flatMap((field) => field.errors)

    formState.value.valid = allValid
    formState.value.invalid = !allValid
    formState.value.dirty = anyDirty
    formState.value.touched = anyTouched
    formState.value.errors = allErrors
  }

  const markAsSubmitted = () => {
    formState.value.submitted = true
  }

  const resetForm = () => {
    formState.value = createInitialFormState()
  }

  // Computed properties for easy access
  const isValid = computed(() => formState.value.valid)
  const isInvalid = computed(() => formState.value.invalid)
  const isDirty = computed(() => formState.value.dirty)
  const isTouched = computed(() => formState.value.touched)
  const isSubmitted = computed(() => formState.value.submitted)
  const errors = computed(() => formState.value.errors)

  return {
    formState: readonly(formState),
    registerField,
    updateField,
    markAsSubmitted,
    resetForm,
    isValid,
    isInvalid,
    isDirty,
    isTouched,
    isSubmitted,
    errors,
  }
}
