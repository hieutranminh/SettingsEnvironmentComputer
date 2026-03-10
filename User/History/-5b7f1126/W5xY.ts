import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// CI environment detection for stricter rules in CI pipeline
const isCI = process.env.CI === 'true'

export default defineConfigWithVueTs(
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. FILE TARGETING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.git/**',
      '**/public/**',
      '**/*.config.*.timestamp-*',
      '**/components.d.ts',
      '**/auto-imports.d.ts',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. BASE PRESETS
  // ═══════════════════════════════════════════════════════════════════════════
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. SECURITY RULES (Always Error - Critical)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/security',
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. VUE 3 COMPOSITION API RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/vue-composition',
    rules: {
      // Enforce modern Vue 3 patterns
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/define-emits-declaration': ['error', 'type-based'],
      'vue/define-props-declaration': ['error', 'type-based'],

      // Prevent common reactivity mistakes
      'vue/no-setup-props-reactivity-loss': 'error',
      'vue/no-ref-as-operand': 'error',
      'vue/no-watch-after-await': 'error',

      // Component naming & structure
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['App', 'Index'],
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],

      // Template best practices
      'vue/no-unused-vars': 'error',
      'vue/no-v-html': 'warn',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/prefer-import-from-vue': 'error',

      // Disable Vue 2 specific rules (not applicable to Vue 3)
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-model-argument': 'off',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. TYPESCRIPT STRICT RULES (Always Error - Critical for type safety)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/typescript-strict',
    rules: {
      // Type imports - critical for bundle optimization
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],

      // Unused code detection
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Async/await safety - critical for preventing runtime errors
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      // Controlled ts-comments
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': false,
          'ts-nocheck': false,
          'ts-check': false,
        },
      ],

      // Exhaustive checks - prevent missing cases in switch statements
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. TYPESCRIPT SOFT RULES (Guidelines - Warn in dev, Error in CI)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/typescript-soft',
    rules: {
      // Type safety warnings - stricter in CI
      '@typescript-eslint/no-explicit-any': isCI ? 'error' : 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Modern syntax preferences
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',

      // Turn off - handled by TypeScript itself or too restrictive
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. CODE QUALITY RULES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'app/code-quality',
    rules: {
      // Production code - prevent debug artifacts
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-console': [
        isCI ? 'error' : 'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      // Modern JavaScript best practices
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-duplicate-imports': 'error',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. PRETTIER INTEGRATION (Skip formatting rules)
  // ═══════════════════════════════════════════════════════════════════════════
  skipFormatting,
)
