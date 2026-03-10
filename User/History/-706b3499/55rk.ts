import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import removeConsole from 'vite-plugin-remove-console'

import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

// Environment mode type
type AppMode = 'development' | 'staging' | 'production'

/**
 * Vite configuration with environment-aware settings
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }): UserConfig => {
  const appMode = mode as AppMode
  const isDev = appMode === 'development'
  const isProd = appMode === 'production'
  const isStaging = appMode === 'staging'

  // Log current mode for debugging
  console.log(`\n🚀 Building for: ${appMode.toUpperCase()}\n`)

  return {
    plugins: [
      vue(),
      // Only enable devTools in development
      ...(isDev ? [vueDevTools()] : []),
      // Remove console.log and debugger in production/staging builds
      ...(isProd || isStaging ? [removeConsole()] : []),
      Components({
        resolvers: [PrimeVueResolver()],
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
      devSourcemap: isDev,
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
      // Enable source maps for staging (for debugging)
      sourcemap: isStaging ? true : false,
      // Minify for production and staging
      minify: isProd || isStaging ? 'esbuild' : false,
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
        },
      },
    },
    // Define global constants
    define: {
      __APP_MODE__: JSON.stringify(appMode),
      __DEV__: isDev,
      __PROD__: isProd,
      __STAGING__: isStaging,
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
  }
})
