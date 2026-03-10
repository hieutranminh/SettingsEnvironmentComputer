# Hướng dẫn sử dụng Vee-Validate

## Tổng quan

Dự án đã được tích hợp thư viện **Vee-Validate** để xử lý form validation một cách mạnh mẽ và linh hoạt. Vee-Validate cung cấp các tính năng validation tiên tiến cho Vue 3 với TypeScript support.

## Cài đặt

Các package đã được cài đặt:

- `vee-validate`: Thư viện validation chính
- `@vee-validate/i18n`: Hỗ trợ đa ngôn ngữ
- `yup`: Schema validation (tùy chọn)

## Cấu trúc

### 1. Plugin Configuration (`src/plugins/vee-validate.ts`)

File này cấu hình Vee-Validate với:

- Ngôn ngữ tiếng Việt
- Các validation rules cơ bản
- Cấu hình validation mode

### 2. Composable (`src/composables/useValidation.ts`)

Cung cấp các composable để sử dụng validation:

- `useValidation()`: Composable chính
- `useSimpleForm()`: Composable đơn giản cho form validation

### 3. Components ví dụ

- `ValidationExample.vue`: Ví dụ sử dụng Vee-Validate trực tiếp
- `SimpleFormExample.vue`: Ví dụ sử dụng `useSimpleForm` composable

## Cách sử dụng

### 1. Sử dụng Vee-Validate trực tiếp

```vue
<template>
  <form @submit="onSubmit">
    <input v-model="email" type="email" />
    <span v-if="emailError">{{ emailError }}</span>

    <button type="submit">Gửi</button>
  </form>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { commonRules } from '@/plugins/vee-validate'

const { value: email, errorMessage: emailError } = useField('email', [
  commonRules.required,
  commonRules.email,
])

const onSubmit = () => {
  // Xử lý submit
}
</script>
```

### 2. Sử dụng useSimpleForm composable

```vue
<template>
  <form @submit="handleSubmit">
    <input :value="formData.name" @input="setField('name', $event.target.value)" />
    <span v-if="errors.name">{{ errors.name }}</span>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Đang xử lý...' : 'Gửi' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useSimpleForm, useValidation } from '@/composables/useValidation'

interface FormData {
  name: string
  email: string
}

const initialData: FormData = {
  name: '',
  email: '',
}

const { formData, errors, isSubmitting, setField, validateForm, setSubmitting } =
  useSimpleForm<FormData>(initialData)

const { createRules } = useValidation()

const validationSchema = {
  name: [createRules.required(), createRules.minLength(2)],
  email: [createRules.required(), createRules.email()],
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  setSubmitting(true)

  const isValid = await validateForm(validationSchema)
  if (isValid) {
    // Xử lý submit
  }

  setSubmitting(false)
}
</script>
```

## Validation Rules có sẵn

### Common Rules (`commonRules`)

```typescript
import { commonRules } from '@/plugins/vee-validate'

// Các rules có sẵn:
commonRules.required // Bắt buộc
commonRules.email // Email hợp lệ
commonRules.phone // Số điện thoại
commonRules.minLength(6) // Tối thiểu 6 ký tự
commonRules.maxLength(50) // Tối đa 50 ký tự
commonRules.numeric // Chỉ số
commonRules.url // URL hợp lệ
```

### Tạo Custom Rules

```typescript
// Rule đơn giản
const customRule = (value: string) => {
  if (value.length < 3) {
    return 'Tối thiểu 3 ký tự'
  }
  return true
}

// Rule với tham số
const minLength = (min: number) => (value: string) => {
  if (value.length < min) {
    return `Tối thiểu ${min} ký tự`
  }
  return true
}
```

## Validation Modes

Vee-Validate được cấu hình với các mode sau:

- `validateOnBlur`: true - Validate khi blur field
- `validateOnChange`: true - Validate khi thay đổi giá trị
- `validateOnInput`: false - Không validate khi đang nhập
- `validateOnModelUpdate`: true - Validate khi model update

## Đa ngôn ngữ

Hệ thống đã được cấu hình với ngôn ngữ tiếng Việt. Các thông báo lỗi sẽ hiển thị bằng tiếng Việt.

## Best Practices

1. **Sử dụng TypeScript**: Định nghĩa interface cho form data
2. **Tách validation schema**: Tách riêng validation rules để dễ quản lý
3. **Error handling**: Xử lý lỗi validation một cách graceful
4. **Loading states**: Sử dụng `isSubmitting` để hiển thị trạng thái loading
5. **Form reset**: Reset form sau khi submit thành công

## Ví dụ hoàn chỉnh

Xem các file ví dụ trong thư mục `src/components/`:

- `ValidationExample.vue`
- `SimpleFormExample.vue`

## Troubleshooting

### Lỗi thường gặp

1. **TypeScript errors**: Đảm bảo import đúng types
2. **Validation không hoạt động**: Kiểm tra cấu hình plugin
3. **Messages không hiển thị**: Kiểm tra cấu hình i18n

### Debug

```typescript
// Log validation errors
console.log('Validation errors:', errors)

// Log form data
console.log('Form data:', formData)
```

## Tài liệu tham khảo

- [Vee-Validate Documentation](https://vee-validate.logaretm.com/v4/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
