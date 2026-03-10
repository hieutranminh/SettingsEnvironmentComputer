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

import enforceHandlePrefix from './enforce-handle-prefix'

/**
 * Custom ESLint Rules Collection
 *
 * This object contains all custom rules that can be used in eslint.config.ts
 * Each rule follows the ESLint rule format and provides specific functionality
 * for the Vue 3 + TypeScript project.
 */
export const customRules = {
  // Vue 3 specific rules
  'enforce-handle-prefix': enforceHandlePrefix,
}

/**
 * Export individual rules for direct import
 */
export { enforceHandlePrefix }

/**
 * Export default configuration for easy setup
 */
export default customRules
