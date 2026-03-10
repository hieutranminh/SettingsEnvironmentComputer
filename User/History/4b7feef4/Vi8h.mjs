import path from 'path'
import { fileURLToPath } from 'url'

import pluginTs from '@typescript-eslint/eslint-plugin'
import pluginVitest from '@vitest/eslint-plugin'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'
import pluginImport from 'eslint-plugin-import'
import pluginSonarjs from 'eslint-plugin-sonarjs'
import pluginUnicorn from 'eslint-plugin-unicorn'
import pluginVue from 'eslint-plugin-vue'

// To allow more languages other than `ts` in `.vue` files,
// uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/*.min.js',
      '**/*.min.css',
      '**/*.d.ts',
      '**/*.generated.*',
      'vite.config.ts',
      'vitest.config.ts',
      'eslint.config.ts',
      'cypress.config.ts',
      'cypress/**',
      '**/__tests__/**',
      '**/*.spec.ts',
      '**/*.test.ts',
      'README.md',
      'CHANGELOG.md',
      '**/*.md',
      '.vscode/**',
      '.idea/**',
      '.prettierrc.json',
      '.stylelintrc.json',
      '.DS_Store',
      'Thumbs.db',
      '**/*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pids',
      '**/*.pid',
      '**/*.seed',
      '**/*.pid.lock',
      'coverage/**',
      '**/*.lcov',
      '.nyc_output',
      'node_modules/**',
      'jspm_packages/**',
      '.npm',
      '.eslintcache',
      '.rpt2_cache/**',
      '.rts2_cache_cjs/**',
      '.rts2_cache_es/**',
      '.rts2_cache_umd/**',
      '.node_repl_history',
      '**/*.tgz',
      '.yarn-integrity',
      '.env',
      '.env.test',
      '.env.production',
      '.cache',
      '.parcel-cache',
      '.next',
      '.nuxt',
      '.cache/**',
      'public',
      '.out',
      '.storybook-out',
      'tmp/**',
      'temp/**',
    ],
    plugins: {
      vue: pluginVue,
      import: pluginImport,
      sonarjs: pluginSonarjs,
      unicorn: pluginUnicorn,
      '@typescript-eslint': pluginTs,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.ts', '.d.ts', '.json', '.vue'],
        },
        alias: {
          map: [
            ['@', path.resolve(dirname, 'src')],
            ['assets', path.resolve(dirname, 'src/assets')],
            ['components', path.resolve(dirname, 'src/components')],
            ['router', path.resolve(dirname, 'src/router')],
            ['stores', path.resolve(dirname, 'src/stores')],
            ['views', path.resolve(dirname, 'src/views')],
          ],
          extensions: ['.js', '.ts', '.vue', '.json'],
        },
      },
    },
    rules: {
      // 1. Common rules for Vue projects
      // https://eslint.vuejs.org/rules/component-name-in-template-casing.html
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      // https://eslint.vuejs.org/rules/component-definition-name-casing.html
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      // https://eslint.vuejs.org/rules/component-options-name-casing.html
      'vue/component-options-name-casing': ['error', 'PascalCase'],
      // https://eslint.vuejs.org/rules/custom-event-name-casing.html
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      // https://eslint.vuejs.org/rules/define-macros-order.html
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits'],
        },
      ],
      // https://eslint.vuejs.org/rules/html-comment-content-spacing.html
      'vue/html-comment-content-spacing': ['error', 'always'],
      // https://eslint.vuejs.org/rules/no-unused-refs.html
      'vue/no-unused-refs': 'error',
      // https://eslint.vuejs.org/rules/padding-line-between-blocks.html
      'vue/padding-line-between-blocks': ['error', 'always'],
      // https://eslint.vuejs.org/rules/prefer-separate-static-class.html
      'vue/prefer-separate-static-class': 'error',
      // https://eslint.vuejs.org/rules/multi-word-component-names.html
      'vue/multi-word-component-names': 'off',
      // https://eslint.vuejs.org/rules/script-indent.html
      // 'vue/script-indent': ['error', 2, { baseIndent: 0 }],

      // Disabled Vue formatting rules - handled by Prettier
      'vue/no-spaces-around-equal-signs-in-attribute': 'off',
      'vue/mustache-interpolation-spacing': 'off',
      'vue/key-spacing': 'off',
      'vue/keyword-spacing': 'off',
      'vue/space-in-parens': 'off',
      'vue/space-infix-ops': 'off',

      // Vue attributes formatting rules
      // https://eslint.vuejs.org/rules/max-attributes-per-line.html
      // Disabled to avoid conflict with Prettier
      'vue/max-attributes-per-line': 'off',
      // Disabled to avoid conflict with Prettier
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-spacing': 'off',

      // Disabled formatting rules - handled by Prettier
      quotes: 'off',
      'comma-dangle': 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'no-trailing-spaces': 'off',
      'no-multiple-empty-lines': 'off',
      'space-before-blocks': 'off',
      'space-in-parens': 'off',
      'space-infix-ops': 'off',
      'keyword-spacing': 'off',
      'object-curly-newline': [
        'error',
        {
          ObjectExpression: { multiline: true, consistent: true },
          ObjectPattern: { multiline: true, consistent: true },
        },
      ],

      // Ternary and conditional formatting - allow inline ternary
      'multiline-ternary': 'off',
      'operator-linebreak': 'off', // Disabled - handled by Prettier
      indent: 'off',
      'newline-per-chained-call': 'off',

      // Vue template specific rules for ternary
      'vue/max-len': [
        'error',
        {
          code: 120,
          template: 120,
          tabWidth: 2,
          comments: 120,
          ignorePattern: '',
          ignoreComments: false,
          ignoreTrailingComments: false,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreHTMLAttributeValues: false,
          ignoreHTMLTextContents: false,
        },
      ],

      // 2. Limit line length to 120 characters
      // https://eslint.org/docs/latest/rules/max-len
      'max-len': [
        'error',
        {
          code: 200,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],

      // 3. Limit the number of lines in a file to 500 lines
      // https://eslint.org/docs/latest/rules/max-lines
      'max-lines': ['error', { max: 1000, skipBlankLines: true, skipComments: true }],

      // 4. Limit function length to 30 lines
      // https://eslint.org/docs/latest/rules/max-lines-per-function
      'max-lines-per-function': [
        'error',
        {
          max: 1000,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],

      // 5. Limit nesting depth (if, for, while) to 3 levels
      // https://eslint.org/docs/latest/rules/max-depth
      'max-depth': ['error', 3],

      // 6. Automatically suggest imports
      // https://eslint.org/docs/latest/rules/no-unresolved
      'import/no-unresolved': 'error',
      // https://eslint.org/docs/latest/rules/named
      'import/named': 'error',
      // https://eslint.org/docs/latest/rules/default
      'import/default': 'error',
      // https://eslint.org/docs/latest/rules/namespace
      'import/namespace': 'error',
      // https://eslint.org/docs/latest/rules/no-duplicates
      'import/no-duplicates': 'error',
      // https://eslint.org/docs/latest/rules/order
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // 7. Error when code is repetitive
      // https://rules.sonarsource.com/typescript/RSPEC-4506
      'sonarjs/cognitive-complexity': ['error', 15],
      // https://rules.sonarsource.com/typescript/RSPEC-4507
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      // https://rules.sonarsource.com/typescript/RSPEC-4508
      'sonarjs/no-identical-functions': 'error',

      // 6. Error when code smell
      // https://rules.sonarsource.com/typescript/RSPEC-4509
      'sonarjs/no-all-duplicated-branches': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4510
      'sonarjs/no-element-overwrite': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4511
      'sonarjs/no-extra-arguments': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4512
      'sonarjs/no-identical-expressions': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4513
      'sonarjs/no-one-iteration-loop': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4514
      'sonarjs/no-use-of-empty-return-value': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4515
      'sonarjs/non-existent-operator': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4516
      'sonarjs/prefer-immediate-return': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4517
      'sonarjs/prefer-object-literal': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4518
      'sonarjs/prefer-single-boolean-return': 'error',
      // https://rules.sonarsource.com/typescript/RSPEC-4519
      'sonarjs/prefer-while': 'error',

      // 8. Error when CSS smell (in Vue files)
      // Vue template rules
      // https://eslint.vuejs.org/rules/no-unused-vars.html
      'vue/no-unused-vars': 'error',
      // https://eslint.vuejs.org/rules/no-parsing-error.html
      'vue/no-parsing-error': 'error',
      // https://eslint.vuejs.org/rules/valid-template-root.html
      'vue/valid-template-root': 'error',
      // https://eslint.vuejs.org/rules/valid-v-for.html
      'vue/valid-v-for': 'error',
      // https://eslint.vuejs.org/rules/valid-v-if.html
      'vue/valid-v-if': 'error',
      // https://eslint.vuejs.org/rules/valid-v-model.html
      'vue/valid-v-model': 'error',
      // https://eslint.vuejs.org/rules/valid-v-on.html
      'vue/valid-v-on': 'error',
      // https://eslint.vuejs.org/rules/valid-v-show.html
      'vue/valid-v-show': 'error',
      // https://eslint.vuejs.org/rules/valid-v-slot.html
      'vue/valid-v-slot': 'error',

      // 9. Error when debug code exists in production
      // https://eslint.org/docs/latest/rules/no-console
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // https://eslint.org/docs/latest/rules/no-debugger
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // https://eslint.org/docs/latest/rules/no-alert
      'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // https://eslint.org/docs/latest/rules/no-eval
      'no-eval': 'error',
      // https://eslint.org/docs/latest/rules/no-implied-eval
      'no-implied-eval': 'error',
      // https://eslint.org/docs/latest/rules/no-new-func
      'no-new-func': 'error',
      // https://eslint.org/docs/latest/rules/no-script-url
      'no-script-url': 'error',

      // 10. Error when code is not optimized
      // https://eslint.org/docs/latest/rules/no-var
      'no-var': 'error',
      // https://eslint.org/docs/latest/rules/prefer-const
      'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: false }],
      // https://eslint.org/docs/latest/rules/prefer-arrow-callback
      'prefer-arrow-callback': 'error',
      // https://eslint.org/docs/latest/rules/prefer-template
      'prefer-template': 'error',
      // https://eslint.org/docs/latest/rules/prefer-destructuring
      'prefer-destructuring': [
        'error',
        {
          array: true,
          object: true,
        },
      ],
      // https://eslint.org/docs/latest/rules/no-useless-return
      'no-useless-return': 'error',
      // https://eslint.org/docs/latest/rules/no-useless-concat
      'no-useless-concat': 'error',
      // https://eslint.org/docs/latest/rules/no-useless-escape
      'no-useless-escape': 'error',
      // https://eslint.org/docs/latest/rules/no-useless-rename
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false, // enforce arrow functions to have an explicit return type
          allowTypedFunctionExpressions: true, // allow omission if the type is defined in an interface / type alias
          allowHigherOrderFunctions: true, // not required for functions that return another function
        },
      ],
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  // Final overrides to ensure our rules take precedence
  {
    rules: {},
  },
)
