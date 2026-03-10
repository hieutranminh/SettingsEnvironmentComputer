import path from 'node:path'
import { fileURLToPath } from 'node:url'

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import pluginImport from 'eslint-plugin-import'
import vitest from '@vitest/eslint-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  // 0) Ignore chung
  {
    ignores: ['**/dist/**', '**/node_modules/**', 'coverage/**', 'public/**', '**/*.d.ts', 'src/utils/fonts/**'],
  },

  // 1) Base JavaScript
  js.configs.recommended,

  // 2) Vue SFC (.vue)
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser, // cho <script lang="ts">
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        projectService: true, // TS-ESLint v8: thay cho parserOptions.project
      },
    },
    plugins: { vue: pluginVue },
    // preset flat của eslint-plugin-vue
    rules: {
      ...pluginVue.configs['flat/recommended'].rules, // preset Vue 3
      // Những rule Vue quan trọng trong production:
      'vue/no-mutating-props': 'error',
      'vue/no-unused-refs': 'warn',
      'vue/multi-word-component-names': ['warn', { ignores: ['index', 'default'] }],
      'vue/v-on-event-hyphenation': ['error', 'always', { ignore: ['update:modelValue'] }],
      // nếu dùng v-html, cân nhắc đặt warn (tùy dự án)
      // 'vue/no-v-html': 'warn',
    },
  },

  // 3) TypeScript (bao gồm <script> trong .vue)
  ...tseslint.configs.recommendedTypeChecked, // bật rule type-aware
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parserOptions: {
        projectService: true, // không cần chỉ định tsconfig thủ công
        tsconfigRootDir: __dirname,
      },
    },
    plugins: { import: pluginImport },
    rules: {
      // --- Core an toàn cho production
      'no-debugger': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'smart'],

      // --- TypeScript khuyến nghị mạnh
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: { attributes: false },
        },
      ],
      // Tùy đội ngũ: bật để chặt hơn
      // '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: false }],

      // --- Import hygiene
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
        },
      ],
    },
  },

  // 4) Test (Vitest)
  {
    files: ['**/*.{test,spec}.{ts,js,tsx}'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },

  // 5) File cấu hình / scripts (Node context)
  {
    files: ['vite.config.*', 'eslint.config.*', 'scripts/**/*.{ts,js,mjs,cjs}'],
    languageOptions: {
      sourceType: 'module',
      globals: { node: true },
    },
    rules: {
      // thường không cần quá khắt khe ở file config
    },
  },

  // 6) Tinh chỉnh theo thư mục dự án của bạn
  // Ví dụ: nới lỏng max-lines-per-function cho composables (thực tiễn với Vue)
  {
    files: ['src/composables/**/*.ts'],
    rules: {
      'max-lines-per-function': ['off'],
      // hoặc: ['warn', { max: 200, skipBlankLines: true, skipComments: true }]
    },
  },
)
