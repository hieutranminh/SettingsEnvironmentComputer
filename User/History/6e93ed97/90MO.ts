import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo): string => {
          if (chunkInfo.name === 'background') return 'background/index.js'
          if (chunkInfo.name === 'content') return 'content/index.js'
          return 'popup/[name]-[hash].js'
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo): string => {
          const name = assetInfo.name || ''
          if (name.endsWith('.css')) {
            return 'popup/styles-[hash].css'
          }
          return 'assets/[name][extname]'
        },
      },
    },
    // Disable minification for easier debugging during development
    minify: false,
    // Generate source maps for debugging
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
})
