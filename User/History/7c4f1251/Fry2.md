# Vue 3 Enterprise Application

A modern Vue 3.5+ enterprise application built with TypeScript, using Composition API and plugin-based architecture.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test:unit
```

## 🏗️ Architecture

### Plugin-First Architecture

This project follows a **plugin-first architecture** where ALL external libraries, services, and integrations are placed in the `src/plugins/` directory.

### Key Principles

- **External libraries MUST go in `src/plugins/`** - This includes API services, HTTP clients, UI libraries, etc.
- **Composition API** - Always use `<script setup>` syntax
- **TypeScript** - Strict typing throughout the application
- **Accessibility** - WCAG 2.1 compliant components
- **Error Handling** - Explicit error handling, never silent failures

## 📁 Project Structure

```
src/
├── plugins/           # 🚨 ALL external libraries go here
│   ├── api.ts        # API service plugin
│   ├── constants.ts  # Constants plugin
│   └── index.ts      # Plugin management
├── components/        # Vue components
│   ├── common/        # Reusable base components
│   ├── forms/         # Form components
│   ├── modals/        # Modal components
│   └── layout/        # Layout components
├── composables/       # Reusable reactive logic
├── stores/           # Pinia state management
├── utils/            # Pure utility functions
├── types/            # TypeScript definitions
├── constants/        # Application constants
├── locales/          # i18n translations
└── views/            # Page components
```

## 🛠️ Technology Stack

- **Vue 3.5+** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **SCSS** - Advanced CSS preprocessing
- **Vitest** - Unit testing
- **ESLint + Prettier** - Code quality

## 💻 Development Guidelines

### Component Structure

```vue
<template>
  <div class="component-name">
    <!-- Template content -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
interface Props {
  title: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

// Emits
interface Emits {
  (e: 'update', value: string): void
}

const emit = defineEmits<Emits>()

// Reactive data
const isLoading = ref(false)

// Computed
const isDisabled = computed(() => props.disabled || isLoading.value)

// Methods
const handleClick = (): void => {
  if (isDisabled.value) return
  emit('update', 'new value')
}
</script>

<style scoped lang="scss">
.component-name {
  // Styles here
}
</style>
```

### Plugin Development

```typescript
import type { App } from 'vue'

class MyService {
  // Service implementation
}

export const myService = new MyService()

export default {
  install: (app: App) => {
    app.provide('myService', myService)
    app.config.globalProperties.$myService = myService
  },
}
```

## 📝 Coding Standards

### File Naming

- **Components**: `UserProfile.vue` (PascalCase)
- **Pages/Views**: `HomePage.vue` (PascalCase)
- **Composables**: `useAuth.ts` (camelCase with `use` prefix)
- **Utils**: `formatDate.ts` (camelCase)
- **Types**: `User.ts` (PascalCase)
- **Constants**: `API_ENDPOINTS.ts` (SCREAMING_SNAKE_CASE)

### Function Naming

- Event functions: `handleClick`, `handleKeyDown`, `handleSubmit`
- Use consts instead of functions: `const toggle = () =>`
- Use early returns for better readability

### Error Handling

- **Always raise errors explicitly, never silently ignore**
- Use specific error types with clear messages
- Log errors with context before raising

## 🎨 Styling

- **SCSS** for advanced CSS preprocessing
- **BEM methodology** for CSS class naming
- **CSS custom properties** for theming
- **Responsive design** with mobile-first approach
- **Accessibility compliance** (WCAG 2.1)

## 🔒 Security & Performance

- Input validation for all user inputs
- XSS prevention through content sanitization
- Lazy loading for routes and components
- Bundle size optimization
- Performance monitoring

## 🧪 Testing

- **Unit tests** for components and utilities
- **Integration tests** for component interactions
- **Vitest** as the testing framework
- **Vue Test Utils** for component testing

## 📚 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test:unit    # Run unit tests
pnpm lint         # Lint and fix code
pnpm format       # Format code with Prettier
pnpm type-check   # Run TypeScript type checking
```

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Vue 3 Enterprise App
```

## 🤝 Contributing

1. Follow the coding standards outlined in `.cursorrules`
2. Write tests for new features
3. Ensure accessibility compliance
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License.

---

**Remember**: ALL external libraries and services MUST be placed in `src/plugins/` directory!
