import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    checker({
      typescript: {
        buildMode: true,
        tsconfigPath: './tsconfig.app.json',
      },
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint .',
      },
      overlay: {
        initialIsOpen: true,
        position: 'br',
        badgeStyle:
          'margin: 0; padding: 8px; background: #ef4444; color: white; border-radius: 8px 0 0 0;',
      },
      enableBuild: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    // Enable source maps in dev mode to see which file styles come from in devtools
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern',
        additionalData: `@use "@/assets/scss/mixins.scss" as *;`,
      },
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies to prevent page reload during development
    // when lazy-loaded components import new dependencies
    // NOTE: This only affects DEV mode, not production build
    include: [
      // PrimeVue composables (commonly lazy-discovered)
      'primevue/usetoast',
      'primevue/useconfirm',
      // Third-party dependencies used in async components
      'vue-currency-input',
      'quill',
    ],
  },
})
