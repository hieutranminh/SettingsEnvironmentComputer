import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import removeConsole from 'vite-plugin-remove-console'
import { checker } from 'vite-plugin-checker'

import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

//

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // Remove console.log and debugger in production build
    removeConsole(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    //
    // TypeScript, ESLint, and Vue TypeScript checking in worker thread
    checker({
      vueTsc: {
        tsconfigPath: './tsconfig.app.json',
      },
      eslint: {
        lintCommand: 'eslint "./src/**/*.{vue,js,ts,jsx,tsx}" --config eslint.config.ts',
        dev: {
          logLevel: ['error', 'warning'],
          overrideConfig: {
            cache: true,
            cacheLocation: 'node_modules/.cache/eslint/',
          },
        },
        useFlatConfig: true,
      },
      stylelint: {
        lintCommand: 'stylelint "src/**/*.{css,scss,vue}" --custom-syntax postcss-html',
      },
      enableBuild: true, // Enable checking during build
      overlay: {
        initialIsOpen: false,
        position: 'tl',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8085,
    host: '0.0.0.0',
    // Ignore node_modules and dist directories
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/global-forwards" as *;
        `,
      },
    },
  },
  // Copy static files to dist
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
      },
    },
  },

  optimizeDeps: {
    include: [
      'primevue/badge',
      'primevue/button',
      'primevue/card',
      'primevue/chart',
      'primevue/checkbox',
      'primevue/column',
      'primevue/columngroup',
      'primevue/confirmdialog',
      'primevue/datatable',
      'primevue/datepicker',
      'primevue/dialog',
      'primevue/drawer',
      'primevue/dropdown',
      'primevue/dynamicdialog',
      'primevue/fileupload',
      'primevue/message',
      'primevue/multiselect',
      'primevue/password',
      'primevue/popover',
      'primevue/progressspinner',
      'primevue/radiobutton',
      'primevue/radiobuttongroup',
      'primevue/row',
      'primevue/select',
      'primevue/tabpanel',
      'primevue/tabview',
      'primevue/textarea',
      'primevue/toggleswitch',
      'primevue/tooltip',
      'primevue/divider',
      'primevue/tabs',
      'primevue/tablist',
      'primevue/tab',
      'primevue/paginator',
    ],
  },
})
