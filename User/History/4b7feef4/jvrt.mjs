import path from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import pluginTs from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default [
  // ===== 1. IGNORE PATTERNS (QUAN TRỌNG) =====
  // Chỉ giữ những folder thực sự cần ignore
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.min.js',
      '**/*.d.ts',
      'public/**',
      '.vscode/**',
      'coverage/**',
      'src/utils/fonts/**',
    ],
  },

  // ===== 2. BASE JAVASCRIPT CONFIG =====
  js.configs.recommended,

  // ===== 3. VUE 3 FILES CONFIG (QUAN TRỌNG NHẤT) =====
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': pluginTs,
    },
    settings: {
      // Path alias resolution - QUAN TRỌNG cho import
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        alias: {
          map: [['@', path.resolve(__dirname, 'src')]],
          extensions: ['.js', '.ts', '.vue', '.json'],
        },
      },
    },
    rules: {
      // ========================================
      // 🔴 CRITICAL: Vue 3 Composition API Rules
      // ========================================

      // Thứ tự defineProps/defineEmits - tránh bugs
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        },
      ],

      // Script setup rules - QUAN TRỌNG cho Vue 3
      'vue/no-ref-as-operand': 'error', // Tránh lỗi .value
      'vue/no-setup-props-reactivity-loss': 'error', // Tránh mất reactivity (tên rule đã đổi)
      'vue/no-watch-after-await': 'error', // Tránh memory leaks
      'vue/prefer-import-from-vue': 'error', // Import đúng từ 'vue'
      'vue/no-lifecycle-after-await': 'error', // Tránh lỗi lifecycle hooks

      // ========================================
      // 🟡 IMPORTANT: Component Best Practices
      // ========================================

      // Naming conventions - chuẩn Vue style guide
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/prop-name-casing': ['error', 'camelCase'],

      // Component quality
      'vue/require-prop-types': 'error', // Bắt buộc định nghĩa prop types
      'vue/require-default-prop': 'error', // Default values cho optional props
      'vue/require-explicit-emits': 'error', // Khai báo explicit emits (Vue 3)
      'vue/no-required-prop-with-default': 'error', // Logic error

      // Template best practices
      'vue/no-v-html': 'warn', // XSS prevention
      'vue/no-template-target-blank': 'error', // Security
      'vue/no-unused-refs': 'error', // Clean code

      // Performance rules - QUAN TRỌNG cho production
      'vue/no-use-v-if-with-v-for': 'error', // Performance issue
      'vue/require-v-for-key': 'error', // React reconciliation
      'vue/no-unused-components': 'error', // Bundle size
      'vue/no-mutating-props': 'error', // Unidirectional data flow

      // ========================================
      // 🟢 GOOD TO HAVE: Code Quality
      // ========================================

      'vue/padding-line-between-blocks': ['error', 'always'], // Readability
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ], // Consistency
      'vue/multi-word-component-names': 'off', // Có thể tắt nếu dùng single-word

      // ========================================
      // ⚪ DISABLED: Formatting (Prettier xử lý)
      // ========================================
      'vue/max-attributes-per-line': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/mustache-interpolation-spacing': 'off',
    },
  },

  // ===== 4. TYPESCRIPT FILES CONFIG (SRC FOLDER) =====
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.app.json', // Use app tsconfig for src files
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {
      // ========================================
      // 🔴 CRITICAL: TypeScript Safety
      // ========================================

      '@typescript-eslint/no-explicit-any': 'error', // Type safety
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Cho phép _unusedVar
          varsIgnorePattern: '^_',
        },
      ],

      // Type imports - giảm bundle size
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // ========================================
      // 🟡 IMPORTANT: Code Quality
      // ========================================

      '@typescript-eslint/no-non-null-assertion': 'warn', // Avoid !
      '@typescript-eslint/prefer-optional-chain': 'error', // ?. instead of &&
      '@typescript-eslint/prefer-nullish-coalescing': 'error', // ?? instead of ||

      // Return types cho các functions phức tạp
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true, // Cho phép arrow functions đơn giản
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
    },
  },

  // ===== NODE CONFIG FILES (vite.config.ts, etc.) =====
  {
    files: ['vite.config.ts', 'vitest.config.ts', 'cypress.config.ts', 'playwright.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.node.json', // Use node tsconfig for build tools
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'off', // Config files may have intentional unused imports
      '@typescript-eslint/consistent-type-imports': 'off', // Not needed for config files
      'no-console': 'off', // Allow console in config files
      'max-lines': 'off', // Config files can be longer
      complexity: 'off', // Config files can be complex
    },
  },

  // ===== ESLint CONFIG FILE SPECIFIC =====
  {
    files: ['eslint.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // No project reference for config file
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'off', // Config files may have intentional unused imports
      '@typescript-eslint/consistent-type-imports': 'off', // Not needed for config files
      'no-console': 'off', // Allow console in config files
      'max-lines': 'off', // Config files can be longer
      complexity: 'off', // Config files can be complex
    },
  },

  // ===== 5. PRODUCTION-SPECIFIC RULES =====
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      // ========================================
      // 🔴 CRITICAL: Security & Production
      // ========================================

      'no-console': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error', // Security
      'no-implied-eval': 'error', // Security

      // ========================================
      // 🟡 IMPORTANT: Modern JavaScript
      // ========================================

      'no-var': 'error', // Use let/const
      'prefer-const': 'error', // Immutability
      'prefer-template': 'error', // Template literals
      'prefer-arrow-callback': 'error', // Arrow functions
      'no-useless-return': 'error', // Clean code

      // ========================================
      // 🟢 GOOD TO HAVE: Code Complexity
      // ========================================

      'max-depth': ['error', 4], // Nested blocks
      'max-lines': ['error', 500], // File size
      complexity: ['error', 10], // Cyclomatic complexity

      // ========================================
      // ⚪ DISABLED: Formatting
      // ========================================

      // Prettier xử lý tất cả formatting
      quotes: 'off',
      indent: 'off',
      'comma-dangle': 'off',
      semi: 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'space-before-blocks': 'off',
      'keyword-spacing': 'off',
    },
  },

  // ===== 6. TEST FILES - Relaxed Rules =====
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // OK trong tests
      '@typescript-eslint/explicit-function-return-type': 'off',
      'max-lines': 'off', // Test files có thể dài
    },
  },
]
