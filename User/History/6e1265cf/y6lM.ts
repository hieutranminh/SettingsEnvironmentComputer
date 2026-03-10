/**
 * Type declarations for vite-plugin-eslint
 * Giải quyết vấn đề TypeScript declaration missing
 */
declare module 'vite-plugin-eslint' {
  import type { Plugin } from 'vite'
  
  interface ESLintPluginOptions {
    /**
     * Files cần check ESLint
     */
    include?: string[]
    
    /**
     * Files bỏ qua ESLint
     */
    exclude?: string[]
    
    /**
     * Tắt cache ESLint
     */
    cache?: boolean
    
    /**
     * Hiển thị warnings
     */
    emitWarning?: boolean
    
    /**
     * Hiển thị errors
     */
    emitError?: boolean
    
    /**
     * Dừng build khi có error
     */
    failOnError?: boolean
    
    /**
     * Dừng build khi có warning
     */
    failOnWarning?: boolean
    
    /**
     * Overlay configuration
     */
    overlay?: {
      warnings?: boolean
      errors?: boolean
    }
    
    /**
     * ESLint formatter
     */
    formatter?: string
    
    /**
     * Path to ESLint
     */
    eslintPath?: string
    
    /**
     * Lint khi start
     */
    lintOnStart?: boolean
    
    /**
     * Auto fix
     */
    fix?: boolean
  }

  function eslintPlugin(options?: ESLintPluginOptions): Plugin
  export default eslintPlugin
}
