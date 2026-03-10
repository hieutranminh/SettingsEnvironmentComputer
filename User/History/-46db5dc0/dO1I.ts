/**
 * Type declarations for eslint-plugin-promise
 *
 * This module provides ESLint rules for working with Promises.
 * Since the original package doesn't include TypeScript declarations,
 * we provide a minimal declaration to satisfy TypeScript.
 */

declare module 'eslint-plugin-promise' {
  import type { ESLint } from 'eslint'

  const plugin: ESLint.Plugin
  export default plugin
}
