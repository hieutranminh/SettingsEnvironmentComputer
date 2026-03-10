/**
 * Custom ESLint Rules for Vue 3 + TypeScript Project
 *
 * This file exports all custom ESLint rules used in the project.
 * Each rule is designed to enforce specific coding standards and best practices.
 *
 * @fileoverview Custom ESLint rules configuration
 * @author Ahasoft Development Team
 * @version 1.0.0
 */

import maxLinesCustom from './max-lines-custom'
import requireActionsPrefix from './require-actions-prefix'
import requireSerializeForVHtml from './require-serialize-for-v-html'

/**
 * Custom ESLint Rules Collection
 *
 * This object contains all custom rules that can be used in eslint.config.ts
 * Each rule follows the ESLint rule format and provides specific functionality
 * for the Vue 3 + TypeScript project.
 */
export const customRules = {
  // Vue 3 specific rules
  'max-lines-custom': maxLinesCustom,
  'require-actions-prefix': requireActionsPrefix,
  'require-serialize-for-v-html': requireSerializeForVHtml,
}

/**
 * Export individual rules for direct import
 */
export { maxLinesCustom, requireActionsPrefix, requireSerializeForVHtml }

/**
 * Export default configuration for easy setup
 */
export default customRules
