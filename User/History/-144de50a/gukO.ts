/**
 * Custom ESLint Rule: enforce-vue-composition-api
 * 
 * This rule enforces the use of Vue 3 Composition API patterns and prevents
 * the use of deprecated Options API patterns in Vue components.
 * 
 * Examples:
 * ✅ Good: <script setup> with Composition API
 * ❌ Bad: <script> with Options API (data, methods, computed, etc.)
 * 
 * @fileoverview Custom rule to enforce Vue 3 Composition API usage
 * @author Ahasoft Development Team
 * @version 1.0.0
 */

import type { Rule } from 'eslint'

/**
 * Rule configuration interface
 */
interface RuleOptions {
  /** Whether to allow Options API in specific files */
  allowOptionsApiIn?: string[]
  /** Whether to enforce <script setup> syntax */
  enforceScriptSetup?: boolean
  /** Whether to check for deprecated Options API patterns */
  checkDeprecatedPatterns?: boolean
}

/**
 * Default rule options
 */
const defaultOptions: Required<RuleOptions> = {
  allowOptionsApiIn: [],
  enforceScriptSetup: true,
  checkDeprecatedPatterns: true,
}

/**
 * Check if a file should be excluded from the rule
 * 
 * @param filename - The filename to check
 * @param allowedFiles - Array of allowed file patterns
 * @returns True if the file should be excluded
 */
const isFileExcluded = (filename: string, allowedFiles: string[]): boolean => {
  return allowedFiles.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      return regex.test(filename)
    }
    return filename.includes(pattern)
  })
}

/**
 * Check if a Vue file uses <script setup> syntax
 * 
 * @param source - The source code of the file
 * @returns True if the file uses <script setup>
 */
const hasScriptSetup = (source: string): boolean => {
  return /<script\s+setup\b/.test(source)
}

/**
 * Check if a Vue file uses Options API patterns
 * 
 * @param source - The source code of the file
 * @returns True if the file uses Options API patterns
 */
const hasOptionsApiPatterns = (source: string): boolean => {
  const optionsApiPatterns = [
    /\bdata\s*\(\s*\)\s*\{/, // data() { ... }
    /\bmethods\s*:\s*\{/, // methods: { ... }
    /\bcomputed\s*:\s*\{/, // computed: { ... }
    /\bwatch\s*:\s*\{/, // watch: { ... }
    /\blifecycle\s*:\s*\{/, // lifecycle: { ... }
    /\bcreated\s*\(\s*\)/, // created()
    /\bmounted\s*\(\s*\)/, // mounted()
    /\bupdated\s*\(\s*\)/, // updated()
    /\bdestroyed\s*\(\s*\)/, // destroyed()
    /\bbeforeCreate\s*\(\s*\)/, // beforeCreate()
    /\bbeforeMount\s*\(\s*\)/, // beforeMount()
    /\bbeforeUpdate\s*\(\s*\)/, // beforeUpdate()
    /\bbeforeDestroy\s*\(\s*\)/, // beforeDestroy()
    /\bunmounted\s*\(\s*\)/, // unmounted()
    /\bbeforeUnmount\s*\(\s*\)/, // beforeUnmount()
  ]
  
  return optionsApiPatterns.some(pattern => pattern.test(source))
}

/**
 * Main rule implementation
 */
const enforceVueCompositionApiRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce Vue 3 Composition API usage and prevent Options API patterns',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/ahasoft/vue3-typescript-eslint-rules',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowOptionsApiIn: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
          enforceScriptSetup: { type: 'boolean' },
          checkDeprecatedPatterns: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      useCompositionApi: 'Vue files should use Composition API instead of Options API. Consider using <script setup> syntax.',
      useScriptSetup: 'Vue files should use <script setup> syntax for better Composition API experience.',
      avoidOptionsApi: 'Avoid using Options API patterns like {{pattern}}. Use Composition API instead.',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = { ...defaultOptions, ...context.options[0] }
    const { allowOptionsApiIn, enforceScriptSetup, checkDeprecatedPatterns } = options
    
    const filename = context.getFilename()
    const source = context.getSourceCode().getText()

    // Skip if file is excluded
    if (isFileExcluded(filename, allowOptionsApiIn)) {
      return {}
    }

    // Only check Vue files
    if (!filename.endsWith('.vue')) {
      return {}
    }

    // Check for <script setup> usage
    if (enforceScriptSetup && !hasScriptSetup(source)) {
      context.report({
        node: context.getSourceCode().ast,
        messageId: 'useScriptSetup',
      })
    }

    // Check for Options API patterns
    if (checkDeprecatedPatterns && hasOptionsApiPatterns(source)) {
      context.report({
        node: context.getSourceCode().ast,
        messageId: 'useCompositionApi',
      })
    }

    return {}
  },
}

export default enforceVueCompositionApiRule
