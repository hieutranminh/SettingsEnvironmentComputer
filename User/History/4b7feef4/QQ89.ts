/**
 * ESLint Configuration for Vue 3 + TypeScript Project
 *
 * This configuration provides comprehensive linting rules for:
 * - Vue 3 with Composition API and <script setup>
 * - TypeScript with strict type checking
 * - Modern JavaScript (ES2022+)
 * - Production-ready code quality standards
 *
 * @fileoverview ESLint configuration with Vue 3, TypeScript, and modern JS rules
 * @author Ahasoft Development Team
 * @version 2.0.0
 */

import path from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import pluginTs from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import pluginVueI18n from '@intlify/eslint-plugin-vue-i18n'
import promise from 'eslint-plugin-promise'

// Import custom rules
import { customRules } from './eslint-rules'

// Get current directory for path resolution
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default [
  // ============================================================================
  // 📁 FILE IGNORE PATTERNS
  // ============================================================================
  // Files and directories that should be excluded from linting
  {
    ignores: [
      // Build outputs
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',

      // Dependencies
      '**/node_modules/**',

      // Generated files
      '**/*.min.js',
      '**/*.d.ts',
      '**/components.d.ts',

      // Static assets
      'public/**',

      // IDE and editor files
      '.vscode/**',
      '.idea/**',

      // Font files (binary)
      'src/utils/fonts/**',

      // Custom rules
      'eslint-rules/**',
    ],
  },

  // ============================================================================
  // 🔧 BASE JAVASCRIPT CONFIGURATION
  // ============================================================================
  // Recommended JavaScript rules from ESLint
  js.configs.recommended,

  // ============================================================================
  // 🌐 VUE I18N CONFIGURATION
  // ============================================================================
  // Vue i18n recommended configuration
  ...pluginVueI18n.configs.recommended,

  // ============================================================================
  // 🎯 VUE 3 FILES CONFIGURATION
  // ============================================================================
  // Configuration for all .vue files in the project
  // Supports Vue 3 Composition API, <script setup>, and TypeScript
  {
    files: ['**/*.vue'],
    languageOptions: {
      // Use Vue parser for .vue files
      parser: vueParser,
      parserOptions: {
        // Use TypeScript parser for <script> blocks
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Enable additional language features
        ecmaFeatures: {
          jsx: false, // We use Vue templates, not JSX
        },
        extraFileExtensions: ['.vue'],
        projectService: true,
      },
      globals: {
        // ========================================
        // 🌐 BROWSER GLOBALS
        // ========================================
        // Core browser APIs
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',

        // DOM element types
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTableElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLButtonElement: 'readonly',

        // Event types
        Event: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        FocusEvent: 'readonly',
        InputEvent: 'readonly',

        // Browser APIs
        getComputedStyle: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',

        // Timers
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        // Console and debugging
        console: 'readonly',

        // Additional globals
        Image: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        File: 'readonly',

        // Node.js globals (for Vite)
        process: 'readonly',

        // Legacy browser APIs (use sparingly)
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
      },
    },
    plugins: {
      // Vue 3 plugin for Vue-specific rules
      vue: pluginVue,
      // TypeScript plugin for type checking
      '@typescript-eslint': pluginTs,
      // Promise plugin for promise rules
      promise,
      // Custom rules for the project
      custom: {
        rules: customRules,
      },
    },
    settings: {
      // ========================================
      // 🔗 PATH ALIAS RESOLUTION
      // ========================================
      // Configure path aliases for import resolution
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        alias: {
          map: [
            ['@', path.resolve(__dirname, 'src')],
            ['@components', path.resolve(__dirname, 'src/components')],
            ['@views', path.resolve(__dirname, 'src/views')],
            ['@composables', path.resolve(__dirname, 'src/composables')],
            ['@utils', path.resolve(__dirname, 'src/utils')],
            ['@types', path.resolve(__dirname, 'src/types')],
            ['@stores', path.resolve(__dirname, 'src/stores')],
            ['@services', path.resolve(__dirname, 'src/services')],
            ['@constants', path.resolve(__dirname, 'src/constants')],
            ['@assets', path.resolve(__dirname, 'src/assets')],
          ],
          extensions: ['.js', '.ts', '.vue', '.json'],
        },
      },
      // ========================================
      // 🌐 VUE I18N CONFIGURATION
      // ========================================
      // Configure Vue i18n plugin settings
      'vue-i18n': {
        // Base directory for locale files
        localeDir: 'src/locales/*.json',
        messageSyntaxVersion: '^9.0.0',
      },
    },
    rules: {
      // ========================================
      // 🔴 CRITICAL: Vue 3 Composition API Rules
      // ========================================
      // These rules are essential for Vue 3 Composition API and <script setup>

      /**
       * Enforce the order of Vue 3 macros in <script setup>
       *
       * Why: Prevents bugs and ensures consistent code structure
       * Order: defineOptions → defineProps → defineEmits → defineSlots
       *
       * Example:
       * ✅ Good:
       * <script setup>
       * defineOptions({ name: 'MyComponent' })
       * defineProps<{ title: string }>()
       * defineEmits<{ click: [id: number] }>()
       * </script>
       *
       * ❌ Bad:
       * <script setup>
       * defineEmits<{ click: [id: number] }>()
       * defineProps<{ title: string }>()
       * </script>
       */
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        },
      ],

      /**
       * Prevent using refs as operands in expressions
       *
       * Why: Refs need .value to access their content
       *
       * Example:
       * ❌ Bad: if (count) { ... }
       * ✅ Good: if (count.value) { ... }
       */
      'vue/no-ref-as-operand': 'error',

      /**
       * Prevent reactivity loss in setup props
       *
       * Why: Destructuring props can break reactivity
       *
       * Example:
       * ❌ Bad: const { title } = props
       * ✅ Good: const title = toRef(props, 'title')
       */
      'vue/no-setup-props-reactivity-loss': 'off',

      /**
       * Prevent using watch after await
       *
       * Why: Can cause memory leaks and unexpected behavior
       *
       * Example:
       * ❌ Bad:
       * async function setup() {
       *   await someAsyncOperation()
       *   watch(someRef, callback) // This can cause issues
       * }
       */
      'vue/no-watch-after-await': 'error',

      /**
       * Enforce importing from 'vue' instead of other packages
       *
       * Why: Ensures correct Vue 3 imports and tree-shaking
       *
       * Example:
       * ❌ Bad: import { ref } from '@vue/reactivity'
       * ✅ Good: import { ref } from 'vue'
       */
      'vue/prefer-import-from-vue': 'error',

      /**
       * Prevent using lifecycle hooks after await
       *
       * Why: Lifecycle hooks should be called synchronously
       *
       * Example:
       * ❌ Bad:
       * async function setup() {
       *   await someAsyncOperation()
       *   onMounted(() => {}) // This can cause issues
       * }
       */
      'vue/no-lifecycle-after-await': 'error',

      // ========================================
      // 🟡 IMPORTANT: Component Best Practices
      // ========================================
      // These rules enforce Vue style guide and best practices

      /**
       * Enforce PascalCase for component names in templates
       *
       * Why: Consistent with Vue style guide and HTML conventions
       *
       * Example:
       * ❌ Bad: <my-component />
       * ✅ Good: <MyComponent />
       */
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],

      /**
       * Enforce PascalCase for component definition names
       *
       * Why: Consistent naming convention
       *
       * Example:
       * ❌ Bad: const myComponent = defineComponent({})
       * ✅ Good: const MyComponent = defineComponent({})
       */
      'vue/component-definition-name-casing': ['error', 'PascalCase'],

      /**
       * Enforce camelCase for custom event names
       *
       * Why: Consistent with JavaScript naming conventions
       *
       * Example:
       * ❌ Bad: emit('my-event')
       * ✅ Good: emit('myEvent')
       */
      'vue/custom-event-name-casing': ['error', 'camelCase'],

      /**
       * Enforce camelCase for prop names
       *
       * Why: Consistent with JavaScript naming conventions
       *
       * Example:
       * ❌ Bad: defineProps<{ 'my-prop': string }>()
       * ✅ Good: defineProps<{ myProp: string }>()
       */
      'vue/prop-name-casing': ['error', 'camelCase'],

      /**
       * Require prop type definitions
       *
       * Why: Better type safety and documentation
       *
       * Example:
       * ❌ Bad: defineProps(['title'])
       * ✅ Good: defineProps<{ title: string }>()
       */
      'vue/require-prop-types': 'error',

      /**
       * Require default values for optional props
       *
       * Why: Prevents undefined prop values
       *
       * Example:
       * ❌ Bad: defineProps<{ title?: string }>()
       * ✅ Good: withDefaults(defineProps<{ title?: string }>(), { title: '' })
       */
      'vue/require-default-prop': 'error',

      /**
       * Require explicit emit declarations
       *
       * Why: Better type safety and documentation for Vue 3
       *
       * Example:
       * ❌ Bad: emit('click')
       * ✅ Good: defineEmits<{ click: [id: number] }>()
       */
      'vue/require-explicit-emits': 'error',

      /**
       * Prevent required props with default values
       *
       * Why: Required props shouldn't have defaults (logic error)
       *
       * Example:
       * ❌ Bad: defineProps<{ title: string }>() withDefaults({ title: '' })
       * ✅ Good: defineProps<{ title?: string }>() withDefaults({ title: '' })
       */
      'vue/no-required-prop-with-default': 'error',

      // ========================================
      // 🔒 SECURITY & TEMPLATE RULES
      // ========================================

      /**
       * Warn against using v-html
       *
       * Why: Can lead to XSS attacks if not properly sanitized
       *
       * Example:
       * ❌ Bad: <div v-html="userInput"></div>
       * ✅ Good: <div>{{ userInput }}</div>
       */
      'vue/no-v-html': 'warn',

      /**
       * Prevent target="_blank" without rel="noopener"
       *
       * Why: Security vulnerability (window.opener)
       *
       * Example:
       * ❌ Bad: <a href="..." target="_blank">Link</a>
       * ✅ Good: <a href="..." target="_blank" rel="noopener">Link</a>
       */
      'vue/no-template-target-blank': 'error',

      /**
       * Prevent unused template refs
       *
       * Why: Clean code and avoid memory leaks
       *
       * Example:
       * ❌ Bad: <template><div ref="unusedRef"></div></template>
       * ✅ Good: <template><div ref="usedRef"></div></template>
       */
      'vue/no-unused-refs': 'error',

      /**
       * Prevent unused template variables
       *
       * Why: Clean code and avoid confusion
       *
       * Example:
       * ❌ Bad: <template><div>{{ unusedVar }}</div></template>
       * ✅ Good: <template><div>{{ usedVar }}</div></template>
       */
      'vue/no-unused-vars': 'error',

      // ========================================
      // ⚡ PERFORMANCE RULES
      // ========================================

      /**
       * Prevent using v-if with v-for
       *
       * Why: Performance issue - v-if is checked for each iteration
       *
       * Example:
       * ❌ Bad: <div v-for="item in items" v-if="item.visible" :key="item.id">
       * ✅ Good: <template v-for="item in visibleItems" :key="item.id"><div>
       */
      'vue/no-use-v-if-with-v-for': 'error',

      /**
       * Require key attribute for v-for
       *
       * Why: Essential for Vue's reconciliation algorithm
       *
       * Example:
       * ❌ Bad: <div v-for="item in items">
       * ✅ Good: <div v-for="item in items" :key="item.id">
       */
      'vue/require-v-for-key': 'error',

      /**
       * Prevent unused components
       *
       * Why: Reduces bundle size and improves performance
       *
       * Example:
       * ❌ Bad: import UnusedComponent from './UnusedComponent.vue'
       * ✅ Good: import UsedComponent from './UsedComponent.vue'
       */
      'vue/no-unused-components': ['error', { ignoreWhenBindingPresent: true }],

      /**
       * Prevent mutating props
       *
       * Why: Props should be immutable in Vue
       *
       * Example:
       * ❌ Bad: props.title = 'new title'
       * ✅ Good: emit('update:title', 'new title')
       */
      'vue/no-mutating-props': 'error',

      // ========================================
      // 🔴 CRITICAL: Data Integrity
      // ========================================

      /**
       * Prevent duplicate keys in data/props
       *
       * Why: Duplicate keys can cause unexpected behavior
       *
       * Example:
       * ❌ Bad: { title: 'A', title: 'B' }
       * ✅ Good: { title: 'A', subtitle: 'B' }
       */
      'vue/no-dupe-keys': 'error',

      // ========================================
      // 🎨 CODE QUALITY & FORMATTING
      // ========================================

      /**
       * Require padding lines between blocks
       *
       * Why: Improves readability
       *
       * Example:
       * ❌ Bad:
       * <template>...</template>
       * <script>...</script>
       *
       * ✅ Good:
       * <template>...</template>
       *
       * <script>...</script>
       */
      'vue/padding-line-between-blocks': ['error', 'always'],

      /**
       * Enforce block order in Vue files
       *
       * Why: Consistent file structure
       * Order: template → script → style
       *
       * Example:
       * ❌ Bad: <script>...</script><template>...</template>
       * ✅ Good: <template>...</template><script>...</script>
       */
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],

      /**
       * Allow single-word component names
       *
       * Why: Some components like 'Home', 'About' are acceptable
       *
       * Example:
       * ✅ Good: <Home />, <About />
       */
      'vue/multi-word-component-names': 'off',

      /**
       * Prevent using inline style for HTML elements
       *
       * Why: Inline style makes styles difficult to manage and override
       *
       * Example:
       * ❌ Bad: <div style="color: red">
       * ✅ Good: <div class="red-text">
       */
      'vue/no-restricted-static-attribute': [
        'error',
        {
          key: 'style',
          // match native elements: div, span, p, button, ...
          element: '/^[a-z][a-z0-9-]*$/',
          message: 'Do not use inline style for HTML elements. Use class/CSS instead.',
        },
      ],

      /**
       * Prevent using inline style for HTML elements
       *
       * Why: Inline style makes styles difficult to manage and override
       *
       * Example:
       * ❌ Bad: <div :style="{ color: 'red' }">
       * ✅ Good: <div :style="computedStyle">
       */
      'vue/no-static-inline-styles': [
        'error',
        {
          allowBinding: false,
        },
      ],

      /**
       * Prevent bare strings in template
       *
       * Why: Bare strings are hard to understand and maintain
       *
       * Example:
       * ❌ Bad: <div>Hello World</div>
       * ✅ Good: <div>{{ 'Hello World' }}</div>
       */
      'vue/no-bare-strings-in-template': [
        'error',
        {
          // Allowlist for bare strings in template
          allowlist: [
            '(',
            ')',
            ',',
            '.',
            '&',
            '+',
            '-',
            '=',
            '*',
            '/',
            '#',
            '%',
            '!',
            '?',
            ':',
            '[',
            ']',
            '{',
            '}',
            '<',
            '>',
            '\u00b7', // middle dot
            '\u2022', // bullet
            '\u2010', // hyphen
            '\u2013', // en dash
            '\u2014', // em dash
            '\u2212', // minus sign
            '|',
            '~',
          ],
        },
      ],

      /**
       * Limit maximum number of parameters
       *
       * Why: Functions with too many parameters are hard to understand and use
       *
       * Configuration: max 4 parameters per function
       *
       * Example:
       * ❌ Bad: function processUser(name, email, age, address, phone, city, country)
       * ✅ Good: function processUser(userData: UserData)
       */
      'max-params': ['error', 4],

      /**
       * Disallow magic numbers
       *
       * Why: Magic numbers are hard to understand and maintain
       *
       * Example:
       * ❌ Bad: const total = 10 * 100
       * ✅ Good: const total = TOTAL_10 * PERCENTAGE_100
       */
      'no-magic-numbers': [
        'error',
        {
          ignore: [0, 1, -1], // Allow 0, 1, -1
          ignoreArrayIndexes: true, // Allow when making array indexes
          enforceConst: true, // Require assigning to const if needed
          detectObjects: true, // Detect magic number in object property
        },
      ],

      // ========================================
      // 📝 TYPESCRIPT INTEGRATION
      // ========================================
      /**
       * Disallow the use of 'any' type
       *
       * Why: 'any' defeats the purpose of TypeScript's type safety
       *
       * Example:
       * ❌ Bad: const data: any = fetchData()
       * ✅ Good: const data: UserData = fetchData()
       *
       * Exception: Only use 'any' in extreme cases with proper justification
       */
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * Require explicit function return types
       *
       * Why: Better type safety and documentation
       *
       * Example:
       * ❌ Bad: const handleClick = () => { ... }
       * ✅ Good: const handleClick = (): void => { ... }
       */
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false, // Require return types for arrow functions
          allowTypedFunctionExpressions: true, // Allow when function is already typed
          allowHigherOrderFunctions: true, // Allow for currying
          allowDirectConstAssertionInArrowFunctions: true, // Allow const assertions
          allowConciseArrowFunctionExpressionsStartingWithVoid: false, // Disallow void expressions
        },
      ],

      /**
       * Disallow unused variables
       *
       * Why: Unused variables indicate dead code and potential bugs
       *
       * Configuration:
       * - args: 'none' - Allow unused function parameters (useful for callbacks)
       * - ignoreRestSiblings: true - Ignore rest siblings in destructuring
       *
       * Example:
       * ❌ Bad: const unusedVar = 'hello'
       * ✅ Good: const usedVar = 'hello'; console.log(usedVar)
       */
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none', // Allow unused function parameters
          ignoreRestSiblings: true, // Ignore rest siblings in destructuring
        },
      ],

      '@typescript-eslint/no-misused-promises': ['error'],
      'promise/always-return': 'error',
      'promise/no-nesting': 'warn',

      // ========================================
      // ⚪ DISABLED: Formatting (Handled by Prettier)
      // ========================================
      // These rules are disabled because Prettier handles formatting
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/mustache-interpolation-spacing': 'off',

      // ========================================
      // 🌐 VUE I18N CONFIGURATION
      // ========================================
      // These rules are disabled because Vue i18n handles formatting
      '@intlify/vue-i18n/no-raw-text': [
        'error',
        {
          ignorePattern: '^[\\p{P}\\p{S}\\s]+$',
          ignoreText: ['.', ',', ':', ';', '!', '?', '©', '®', '▷'],
        },
      ],

      // ========================================
      // 🎯 CUSTOM RULES
      // ========================================

      'custom/require-actions-prefix': 'error',
    },
  },

  // ============================================================================
  // 📝 TYPESCRIPT FILES CONFIGURATION
  // ============================================================================
  // Configuration for all TypeScript files in the src/ directory
  // Enforces strict type checking and modern TypeScript best practices
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      // Use TypeScript parser for .ts/.tsx files
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Use app-specific TypeScript config for better type checking
        project: './tsconfig.app.json',
        // Enable additional language features
        ecmaFeatures: {
          jsx: true, // Support JSX in .tsx files
        },
      },
      globals: {
        // ========================================
        // 🌐 BROWSER GLOBALS
        // ========================================
        // Core browser APIs
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',

        // DOM element types
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTableElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLButtonElement: 'readonly',

        // Event types
        Event: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        FocusEvent: 'readonly',
        InputEvent: 'readonly',

        // Browser APIs
        getComputedStyle: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',

        // Timers
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        // Console and debugging
        console: 'readonly',

        // Additional globals
        Image: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        File: 'readonly',

        // Node.js globals (for Vite)
        process: 'readonly',

        // Legacy browser APIs (use sparingly)
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
      },
    },
    plugins: {
      // TypeScript ESLint plugin for type checking and TS-specific rules
      '@typescript-eslint': pluginTs,
      // Custom rules for the project
      custom: {
        rules: customRules,
      },
    },
    rules: {
      // ========================================
      // 🔴 CRITICAL: TypeScript Safety
      // ========================================
      // These rules ensure type safety and prevent common TypeScript pitfalls
      /**
       * Disallow the use of 'any' type
       *
       * Why: 'any' defeats the purpose of TypeScript's type safety
       *
       * Example:
       * ❌ Bad: const data: any = fetchData()
       * ✅ Good: const data: UserData = fetchData()
       *
       * Exception: Only use 'any' in extreme cases with proper justification
       */
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * Disallow unused variables
       *
       * Why: Unused variables indicate dead code and potential bugs
       *
       * Configuration:
       * - args: 'none' - Allow unused function parameters (useful for callbacks)
       * - ignoreRestSiblings: true - Ignore rest siblings in destructuring
       *
       * Example:
       * ❌ Bad: const unusedVar = 'hello'
       * ✅ Good: const usedVar = 'hello'; console.log(usedVar)
       */
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none', // Allow unused function parameters
          ignoreRestSiblings: true, // Ignore rest siblings in destructuring
        },
      ],

      /**
       * Enforce consistent type imports
       *
       * Why: Reduces bundle size and improves tree-shaking
       *
       * Configuration:
       * - prefer: 'type-imports' - Prefer type-only imports
       * - fixStyle: 'inline-type-imports' - Use inline type imports
       *
       * Example:
       * ❌ Bad: import { User, UserService } from './types'
       * ✅ Good: import type { User } from './types'; import { UserService } from './types'
       */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // ========================================
      // 🔴 CRITICAL: Function Return Types
      // ========================================
      // These rules enforce explicit return types for better type safety

      /**
       * Require explicit return types on functions
       *
       * Why: Makes function contracts explicit and catches type errors early
       *
       * Configuration:
       * - allowExpressions: false - Require return types for arrow functions
       * - allowTypedFunctionExpressions: true - Allow when function is already typed
       * - allowHigherOrderFunctions: true - Allow for currying and HOFs
       * - allowDirectConstAssertionInArrowFunctions: true - Allow const assertions
       * - allowConciseArrowFunctionExpressionsStartingWithVoid: false - Disallow void expressions
       * - allowFunctionsWithoutTypeParameters: false - Require type parameters for generics
       *
       * Example:
       * ❌ Bad: const add = (a: number, b: number) => a + b
       * ✅ Good: const add = (a: number, b: number): number => a + b
       */
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false, // Require return types for arrow functions
          allowTypedFunctionExpressions: true, // Allow when function is already typed
          allowHigherOrderFunctions: true, // Allow for currying and HOFs
          allowDirectConstAssertionInArrowFunctions: true, // Allow const assertions
          allowConciseArrowFunctionExpressionsStartingWithVoid: false, // Disallow void expressions
          allowFunctionsWithoutTypeParameters: false, // Require type parameters for generics
        },
      ],

      /**
       * Require explicit return types on module boundaries
       *
       * Why: Ensures exported functions have explicit return types
       *
       * Configuration:
       * - allowTypedFunctionExpressions: true - Allow when function is already typed
       * - allowHigherOrderFunctions: true - Allow for currying and HOFs
       * - allowDirectConstAssertionInArrowFunctions: true - Allow const assertions
       *
       * Example:
       * ❌ Bad: export const getUser = (id: string) => fetchUser(id)
       * ✅ Good: export const getUser = (id: string): Promise<User> => fetchUser(id)
       */
      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        {
          allowTypedFunctionExpressions: true, // Allow when function is already typed
          allowHigherOrderFunctions: true, // Allow for currying and HOFs
          allowDirectConstAssertionInArrowFunctions: true, // Allow const assertions
        },
      ],

      // ========================================
      // 🔴 CRITICAL: Naming Conventions
      // ========================================
      // These rules enforce consistent naming conventions

      /**
       * Enforce naming conventions for different types of identifiers
       *
       * Why: Consistent naming improves code readability and maintainability
       *
       * Conventions:
       * - Functions: camelCase (e.g., getUserData, handleClick)
       * - Variables: camelCase or UPPER_CASE (e.g., userName, API_URL)
       * - Types/Interfaces: PascalCase (e.g., UserData, ApiResponse)
       *
       * Example:
       * ❌ Bad: const UserData = { name: 'John' }
       * ✅ Good: const userData = { name: 'John' }
       * ✅ Good: const USER_DATA = { name: 'John' }
       * ✅ Good: interface UserData { name: string }
       */
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'function',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
      ],

      // ========================================
      // 🟡 IMPORTANT: Code Quality
      // ========================================
      // These rules improve code quality and prevent common mistakes

      /**
       * Warn against non-null assertions
       *
       * Why: Non-null assertions (!) can cause runtime errors if the value is null
       *
       * Example:
       * ❌ Bad: const user = getUser()! // Can cause runtime error
       * ✅ Good: const user = getUser(); if (!user) throw new Error('User not found')
       */
      '@typescript-eslint/no-non-null-assertion': 'warn',

      /**
       * Prefer optional chaining over logical AND
       *
       * Why: Optional chaining is more concise and safer
       *
       * Example:
       * ❌ Bad: user && user.profile && user.profile.name
       * ✅ Good: user?.profile?.name
       */
      '@typescript-eslint/prefer-optional-chain': 'error',

      /**
       * Prefer nullish coalescing over logical OR
       *
       * Why: Nullish coalescing only checks for null/undefined, not falsy values
       *
       * Example:
       * ❌ Bad: const name = user.name || 'Anonymous' // '' becomes 'Anonymous'
       * ✅ Good: const name = user.name ?? 'Anonymous' // Only null/undefined becomes 'Anonymous'
       */
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      /**
       * Disallow magic numbers
       *
       * Why: Magic numbers are hard to understand and maintain
       *
       * Example:
       * ❌ Bad: const total = 10 * 100
       * ✅ Good: const total = TOTAL_10 * PERCENTAGE_100
       */
      'no-magic-numbers': [
        'error',
        {
          ignore: [0, 1, -1], // Allow 0, 1, -1
          ignoreArrayIndexes: true, // Allow when making array indexes
          enforceConst: true, // Require assigning to const if needed
          detectObjects: true, // Detect magic number in object property
        },
      ],

      // ========================================
      // 🎯 CUSTOM RULES
      // ========================================
      // Custom rules specific to this project

      /**
       * Enforce handle prefix for event handlers
       *
       * Why: Consistent naming convention for event handlers
       *
       * Example:
       * ❌ Bad: const onClick = () => { ... }
       * ✅ Good: const handleClick = () => { ... }
       */
      'custom/max-lines-custom': 'error',
    },
  },

  // ============================================================================
  // ⚙️ NODE CONFIG FILES CONFIGURATION
  // ============================================================================
  // Configuration for build tool config files (Vite, Vitest, etc.)
  // These files run in Node.js environment and have different requirements
  {
    files: [
      'vite.config.ts',
      'vitest.config.ts',
      'cypress.config.ts',
      'playwright.config.ts',
      'tailwind.config.ts',
      'postcss.config.ts',
    ],
    languageOptions: {
      // Use TypeScript parser for config files
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Use node-specific TypeScript config for build tools
        project: './tsconfig.node.json',
      },
      globals: {
        // ========================================
        // 🖥️ NODE.JS GLOBALS
        // ========================================
        // Core Node.js globals
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        globalThis: 'readonly',

        // Node.js modules
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',

        // Additional globals
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    plugins: {
      // TypeScript ESLint plugin for type checking
      '@typescript-eslint': pluginTs,
    },
    rules: {
      // ========================================
      // 🔧 CONFIG FILE SPECIFIC RULES
      // ========================================
      // These rules are tailored for build configuration files

      /**
       * Disallow 'any' type in config files
       *
       * Why: Config files should be well-typed for better maintainability
       */
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * Allow unused variables in config files
       *
       * Why: Config files often have intentional unused imports for side effects
       *
       * Example:
       * ✅ Good: import 'vite-plugin-vue' // Side effect import
       */
      '@typescript-eslint/no-unused-vars': 'off',

      /**
       * Disable consistent type imports for config files
       *
       * Why: Config files typically don't need type-only imports
       */
      '@typescript-eslint/consistent-type-imports': 'off',

      /**
       * Allow console statements in config files
       *
       * Why: Config files may need to log information during build
       */
      'no-console': 'off',

      /**
       * Allow longer config files
       *
       * Why: Config files can be complex and lengthy
       */
      'max-lines': 'off',

      /**
       * Allow complex config files
       *
       * Why: Build configurations can be inherently complex
       */
      complexity: 'off',
    },
  },

  // ============================================================================
  // 📋 ESLint CONFIG FILE SPECIFIC
  // ============================================================================
  // Special configuration for this ESLint config file itself
  {
    files: ['eslint.config.ts'],
    languageOptions: {
      // Use TypeScript parser for this config file
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // No project reference for this config file
      },
    },
    plugins: {
      // TypeScript ESLint plugin for type checking
      '@typescript-eslint': pluginTs,
    },
    rules: {
      // ========================================
      // 🔧 ESLint CONFIG SPECIFIC RULES
      // ========================================
      // These rules are tailored for ESLint configuration files

      /**
       * Disallow 'any' type in ESLint config
       *
       * Why: ESLint config should be well-typed
       */
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * Allow unused variables in ESLint config
       *
       * Why: ESLint config may have intentional unused imports
       */
      '@typescript-eslint/no-unused-vars': 'off',

      /**
       * Disable consistent type imports for ESLint config
       *
       * Why: ESLint config typically doesn't need type-only imports
       */
      '@typescript-eslint/consistent-type-imports': 'off',

      /**
       * Allow console statements in ESLint config
       *
       * Why: ESLint config may need to log information
       */
      'no-console': 'off',

      /**
       * Allow longer ESLint config files
       *
       * Why: ESLint configs can be comprehensive and lengthy
       */
      'max-lines': 'off',

      /**
       * Allow complex ESLint config files
       *
       * Why: ESLint configurations can be inherently complex
       */
      complexity: 'off',
    },
  },

  // ============================================================================
  // 🚀 PRODUCTION-SPECIFIC RULES
  // ============================================================================
  // Global rules that apply to all JavaScript, TypeScript, and Vue files
  // These rules focus on production readiness, security, and code quality
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // ========================================
      // 🔒 SECURITY & PRODUCTION RULES
      // ========================================
      // These rules prevent security vulnerabilities and production issues

      /**
       * Warn against console statements
       *
       * Why: Console statements should be removed in production
       *
       * Configuration: 'warn' - Allows console during development but warns
       *
       * Example:
       * ❌ Bad: console.log('Debug info') // In production code
       * ✅ Good: // Use proper logging in production
       */
      'no-console': 'warn',

      /**
       * Disallow debugger statements
       *
       * Why: Debugger statements should never be in production code
       *
       * Example:
       * ❌ Bad: debugger; // In production code
       * ✅ Good: // Remove debugger statements before production
       */
      'no-debugger': 'error',

      /**
       * Disallow alert statements
       *
       * Why: Alert statements are not suitable for production applications
       *
       * Example:
       * ❌ Bad: alert('Error occurred')
       * ✅ Good: // Use proper error handling and user notifications
       */
      'no-alert': 'error',

      /**
       * Disallow eval() function
       *
       * Why: eval() can execute arbitrary code and is a security risk
       *
       * Example:
       * ❌ Bad: eval('console.log("Hello")')
       * ✅ Good: // Use proper parsing or alternative approaches
       */
      'no-eval': 'error',

      /**
       * Disallow implied eval
       *
       * Why: setTimeout/setInterval with string arguments use eval internally
       *
       * Example:
       * ❌ Bad: setTimeout('console.log("Hello")', 1000)
       * ✅ Good: setTimeout(() => console.log('Hello'), 1000)
       */
      'no-implied-eval': 'error',

      // ========================================
      // 🟡 IMPORTANT: Modern JavaScript
      // ========================================
      // These rules enforce modern JavaScript best practices

      /**
       * Disallow var declarations
       *
       * Why: Use let/const for better scoping and immutability
       *
       * Example:
       * ❌ Bad: var name = 'John'
       * ✅ Good: const name = 'John'
       */
      'no-var': 'error',

      /**
       * Prefer const over let when possible
       *
       * Why: const prevents accidental reassignment and improves code clarity
       *
       * Example:
       * ❌ Bad: let name = 'John'; name = 'Jane'
       * ✅ Good: const name = 'John'
       */
      'prefer-const': 'error',

      /**
       * Prefer template literals over string concatenation
       *
       * Why: Template literals are more readable and performant
       *
       * Example:
       * ❌ Bad: 'Hello ' + name + '!'
       * ✅ Good: `Hello ${name}!`
       */
      'prefer-template': 'error',

      /**
       * Prefer arrow functions over function expressions
       *
       * Why: Arrow functions are more concise and have lexical this binding
       *
       * Example:
       * ❌ Bad: array.map(function(item) { return item * 2 })
       * ✅ Good: array.map(item => item * 2)
       */
      'prefer-arrow-callback': 'error',

      /**
       * Disallow unnecessary return statements
       *
       * Why: Unnecessary returns add noise to the code
       *
       * Example:
       * ❌ Bad: function getName() { return; }
       * ✅ Good: function getName() { // no return needed }
       */
      'no-useless-return': 'error',

      // ========================================
      // 🔴 CRITICAL: Disable Conflicting Rules
      // ========================================
      // These rules are disabled to prevent conflicts with TypeScript rules

      /**
       * Disable no-unused-vars to avoid conflict with @typescript-eslint/no-unused-vars
       *
       * Why: TypeScript version provides better type-aware checking
       */
      'no-unused-vars': 'off',

      /**
       * Disable no-return-assign as requested
       *
       * Why: This rule can be overly restrictive in some cases
       */
      'no-return-assign': 'off',

      // ========================================
      // 🟢 CODE COMPLEXITY & QUALITY
      // ========================================
      // These rules enforce code quality and maintainability

      /**
       * Limit maximum nesting depth
       *
       * Why: Deep nesting makes code hard to read and maintain
       *
       * Configuration: max 2 levels of nesting
       *
       * Example:
       * ❌ Bad: if (a) { if (b) { if (c) { if (d) { ... } } } }
       * ✅ Good: if (a && b && c && d) { ... }
       */
      'max-depth': ['error', 2],

      /**
       * Limit maximum file length
       *
       * Why: Long files are hard to maintain and understand
       *
       * Configuration: max 500 lines per file
       *
       * Example:
       * ❌ Bad: 1000+ line file
       * ✅ Good: Split into smaller, focused files
       */
      'max-lines': [
        'error',
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      /**
       * Limit maximum lines per function
       *
       * Why: Long functions are hard to test and maintain
       *
       * Configuration: max 30 lines per function
       *
       * Example:
       * ❌ Bad: 100+ line function
       * ✅ Good: Split into smaller, focused functions
       */

      // Commented due to use custom rule
      // 'max-lines-per-function': [
      //   'error',
      //   {
      //     max: 30, // Maximum 30 lines per function
      //     skipComments: true, // Don't count comment lines
      //     skipBlankLines: true, // Don't count blank lines
      //   },
      // ],

      /**
       * Limit cyclomatic complexity
       *
       * Why: High complexity makes code hard to test and maintain
       *
       * Configuration: max complexity of 10
       *
       * Example:
       * ❌ Bad: Function with 15+ if/else statements
       * ✅ Good: Split complex logic into smaller functions
       */
      complexity: ['error', 10],

      /**
       * Limit maximum number of parameters
       *
       * Why: Functions with too many parameters are hard to understand and use
       *
       * Configuration: max 4 parameters per function
       *
       * Example:
       * ❌ Bad: function processUser(name, email, age, address, phone, city, country)
       * ✅ Good: function processUser(userData: UserData)
       */
      'max-params': ['error', 4],

      // ========================================
      // ⚪ DISABLED: Formatting Rules
      // ========================================
      // These rules are disabled because Prettier handles all formatting

      quotes: 'off', // Prettier handles quote style
      indent: 'off', // Prettier handles indentation
      'comma-dangle': 'off', // Prettier handles trailing commas
      semi: 'off', // Prettier handles semicolons
      'object-curly-spacing': 'off', // Prettier handles object spacing
      'array-bracket-spacing': 'off', // Prettier handles array spacing
      'space-before-blocks': 'off', // Prettier handles block spacing
      'keyword-spacing': 'off', // Prettier handles keyword spacing
    },
  },

  // ============================================================================
  // 🧪 TEST FILES CONFIGURATION
  // ============================================================================
  // Relaxed rules for test files to allow more flexibility during testing
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.js', '**/*.test.js'],
    rules: {
      // ========================================
      // 🧪 TEST-SPECIFIC RULE RELAXATIONS
      // ========================================
      // These rules are relaxed for test files to allow more flexibility

      /**
       * Allow 'any' type in tests (with warning)
       *
       * Why: Tests often need to mock or test edge cases with 'any' types
       *
       * Configuration: 'warn' - Still warns but doesn't error
       */
      '@typescript-eslint/no-explicit-any': 'warn',

      /**
       * Allow unsafe argument assignments in tests
       *
       * Why: Tests often need to pass invalid data to test error handling
       */
      '@typescript-eslint/no-unsafe-argument': 'off',

      /**
       * Allow unsafe assignments in tests
       *
       * Why: Tests often need to assign mock data with 'any' types
       */
      '@typescript-eslint/no-unsafe-assignment': 'off',

      /**
       * Allow unsafe function calls in tests
       *
       * Why: Tests often need to call mocked functions with 'any' types
       */
      '@typescript-eslint/no-unsafe-call': 'off',

      /**
       * Allow unsafe member access in tests
       *
       * Why: Tests often need to access properties of mocked objects
       */
      '@typescript-eslint/no-unsafe-member-access': 'off',

      /**
       * Allow unsafe returns in tests
       *
       * Why: Tests often need to return mock data with 'any' types
       */
      '@typescript-eslint/no-unsafe-return': 'off',

      /**
       * Disable explicit function return types in tests
       *
       * Why: Test functions are often simple and don't need explicit return types
       */
      '@typescript-eslint/explicit-function-return-type': 'off',

      /**
       * Disable explicit module boundary types in tests
       *
       * Why: Test modules don't need explicit return types
       */
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      /**
       * Allow longer test files
       *
       * Why: Test files can be comprehensive and lengthy
       */
      'max-lines': 'off',

      /**
       * Allow complex test files
       *
       * Why: Test files can be complex due to setup and teardown logic
       */
      complexity: 'off',
    },
  },

  // ============================================================================
  // 🔤 GLOBAL NAMING RULES
  // ============================================================================
  // Global rules that apply to all files for consistent naming
  {
    rules: {
      /**
       * Enforce minimum identifier length
       *
       * Why: Short identifiers like 'i', 'x', 'a' are not descriptive
       *
       * Configuration: minimum 2 characters, with exceptions for common short names
       *
       * Example:
       * ❌ Bad: const i = 0, x = 1, a = 2
       * ✅ Good: const index = 0, x = 1, a = 2
       *
       * Exceptions: 'i' (for loops), 't' (for tests), 'e' (for events)
       */
      'id-length': [
        'error',
        {
          min: 2,
          exceptions: ['_', 'i', 't', 'e'], // Allow these common short names
        },
      ],
    },
  },

  // ============================================================================
  // 📄 ESLint CONFIG FILE OVERRIDE
  // 📄 CONSTANTS FILE OVERRIDE
  // ============================================================================
  // Override max-lines rule for this config file
  {
    files: ['eslint.config.ts', 'src/constants/**/*.ts'],
    rules: {
      'max-lines': 'off', // Allow this config file to be longer than 500 lines
      'no-magic-numbers': 'off',
    },
  },
]
