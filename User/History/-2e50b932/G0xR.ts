/**
 * Type declaration for vite-plugin-eslint
 * This fixes the TypeScript declaration issue with vite-plugin-eslint@1.8.1
 */
declare module 'vite-plugin-eslint' {
  import { Plugin } from 'vite'
  
  interface ESLintPluginOptions {
    /** ESLint configuration file path */
    configFile?: string
    /** ESLint configuration object */
    config?: any
    /** Files to include for linting */
    include?: string | string[]
    /** Files to exclude from linting */
    exclude?: string | string[]
    /** ESLint formatter */
    formatter?: string
    /** Whether to fail on error */
    failOnError?: boolean
    /** Whether to fail on warning */
    failOnWarning?: boolean
    /** Whether to emit warnings */
    emitWarning?: boolean
    /** Whether to emit errors */
    emitError?: boolean
    /** Whether to fix errors automatically */
    fix?: boolean
    /** Cache configuration */
    cache?: boolean | string
    /** ESLint options */
    eslintPath?: string
    /** Whether to lint on save */
    lintOnStart?: boolean
    /** Whether to use ESLint class */
    useEslintrc?: boolean
    /** Additional options */
    [key: string]: any
  }

  /**
   * Creates a Vite plugin for ESLint integration
   * @param options - ESLint plugin configuration options
   * @returns Vite plugin instance
   * 
   * @example
   * ```typescript
   * import eslint from 'vite-plugin-eslint'
   * 
   * export default defineConfig({
   *   plugins: [
   *     eslint({
   *       failOnError: false,
   *       failOnWarning: false
   *     })
   *   ]
   * })
   * ```
   */
  function eslint(options?: ESLintPluginOptions): Plugin
  
  export default eslint
}
