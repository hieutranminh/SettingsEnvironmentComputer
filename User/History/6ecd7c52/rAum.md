# Hướng dẫn Sử dụng Custom ESLint Rules

## 🚀 Cài đặt Nhanh

### 1. Cài đặt Dependencies

```bash
cd eslint-rules
pnpm install
```

### 2. Build Rules

```bash
pnpm build
```

### 3. Chạy Tests

```bash
pnpm test
```

## 📝 Sử dụng trong Dự án

### 1. Import Custom Rules

```typescript
// eslint.config.ts
import { customRules } from './eslint-rules'

export default [
  // ... other configs
  {
    files: ['**/*.vue', '**/*.ts'],
    plugins: {
      custom: {
        rules: customRules,
      },
    },
    rules: {
      'custom/enforce-handle-prefix': 'error',
      'custom/enforce-vue-composition-api': 'error',
      'custom/enforce-typescript-strict': 'error',
    },
  },
]
```

### 2. Chạy ESLint

```bash
# Lint tất cả files
pnpm lint

# Lint specific files
pnpm lint src/components/MyComponent.vue

# Fix auto-fixable issues
pnpm lint --fix
```

## 🎯 Các Rules Có Sẵn

### 1. `enforce-handle-prefix`

Enforce prefix "handle" cho event handlers.

**Ví dụ:**

```typescript
// ❌ Bad
const onClick = () => { ... }

// ✅ Good
const handleClick = () => { ... }
```

### 2. `enforce-vue-composition-api`

Enforce Vue 3 Composition API.

**Ví dụ:**

```vue
<!-- ❌ Bad -->
<script lang="ts">
export default {
  data() {
    return { message: 'Hello' }
  },
}
</script>

<!-- ✅ Good -->
<script setup lang="ts">
import { ref } from 'vue'
const message = ref('Hello')
</script>
```

### 3. `enforce-typescript-strict`

Enforce strict TypeScript patterns.

**Ví dụ:**

```typescript
// ❌ Bad
function getUser() {
  return user
}
interface User {
  name: string
}

// ✅ Good
function getUser(): User {
  return user
}
interface IUser {
  name: string
}
```

## 🔧 Tạo Rule Mới

### 1. Tạo File Rule

```typescript
// eslint-rules/my-rule.ts
import type { Rule } from 'eslint'

const myRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'My custom rule',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      myMessage: 'My error message',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    return {
      // Rule logic here
    }
  },
}

export default myRule
```

### 2. Export Rule

```typescript
// eslint-rules/index.ts
import myRule from './my-rule'

export const customRules = {
  'my-rule': myRule,
  // ... other rules
}
```

### 3. Sử dụng Rule

```typescript
// eslint.config.ts
rules: {
  'custom/my-rule': 'error',
}
```

## 🧪 Testing

### Chạy Tests

```bash
# Tất cả tests
pnpm test

# Specific test
pnpm test enforce-handle-prefix

# Watch mode
pnpm test --watch
```

### Tạo Test Mới

```typescript
// eslint-rules/__tests__/my-rule.test.ts
import { RuleTester } from 'eslint'
import myRule from '../my-rule'

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('my-rule', () => {
  ruleTester.run('my-rule', myRule, {
    valid: [
      // Valid cases
    ],
    invalid: [
      // Invalid cases
    ],
  })
})
```

## 📚 Tài liệu Tham khảo

- [ESLint Rule Development](https://eslint.org/docs/developer-guide/working-with-rules)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api/)
- [TypeScript ESLint](https://typescript-eslint.io/)
