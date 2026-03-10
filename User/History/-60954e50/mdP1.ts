import { configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n'
import vi from '@vee-validate/i18n/dist/locale/vi.json'

// Cấu hình vee-validate
configure({
  // Cấu hình ngôn ngữ tiếng Việt
  generateMessage: localize('vi', {
    messages: {
      ...vi.messages,
      required: 'Trường này là bắt buộc',
      email: 'Email không hợp lệ',
      min: 'Giá trị phải có ít nhất {length} ký tự',
      max: 'Giá trị không được vượt quá {length} ký tự',
      numeric: 'Giá trị phải là số',
      alpha: 'Chỉ cho phép chữ cái',
      alpha_num: 'Chỉ cho phép chữ cái và số',
      confirmed: 'Giá trị không khớp',
      url: 'URL không hợp lệ',
      phone: 'Số điện thoại không hợp lệ',
    },
  }),
  // Cấu hình validation mode
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
})

// Export các validation rules thường dùng
export const commonRules = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Trường này là bắt buộc'
    }
    return true
  },
  email: (value: string) => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Email không hợp lệ'
    }
    return true
  },
  phone: (value: string) => {
    if (!value) return true
    const phoneRegex = /^[0-9+\-\s()]+$/
    if (!phoneRegex.test(value)) {
      return 'Số điện thoại không hợp lệ'
    }
    return true
  },
  minLength: (min: number) => (value: string) => {
    if (!value) return true
    if (value.length < min) {
      return `Tối thiểu ${min} ký tự`
    }
    return true
  },
  maxLength: (max: number) => (value: string) => {
    if (!value) return true
    if (value.length > max) {
      return `Tối đa ${max} ký tự`
    }
    return true
  },
  numeric: (value: string) => {
    if (!value) return true
    if (!/^\d+$/.test(value)) {
      return 'Chỉ cho phép số'
    }
    return true
  },
  url: (value: string) => {
    if (!value) return true
    try {
      new URL(value)
      return true
    } catch {
      return 'URL không hợp lệ'
    }
  },
}
