import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
// Build configuration type
interface BuildConfigInfo {
  sourcemap: boolean | 'hidden'
  minify: boolean
  cssSourcemap: boolean
}

// Build configuration based on mode
const getBuildConfig = (mode: string): BuildConfigInfo => {
  const isLocalhostOrDev = mode === 'localhost' || mode === 'development'
  const isProdOrStaging = mode === 'production' || mode === 'staging'

  return {
    sourcemap: mode === 'staging' ? 'hidden' : !isProdOrStaging,
    minify: isProdOrStaging,
    cssSourcemap: isLocalhostOrDev,
  }
}

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '')

  // Determine if devtools should be enabled
  const enableDevTools = mode === 'localhost' || mode === 'development'

  // Get build configuration
  const buildConfig = getBuildConfig(mode)

  return {
    plugins: [
      vue(),
      // Only enable devtools in local/development modes
      ...(enableDevTools ? [vueDevTools()] : []),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
      // Only enable checker in non-production builds
      ...(mode !== 'production'
        ? [
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
          ]
        : []),
    ],
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __BUILD_CONFIG__: JSON.stringify(buildConfig),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      // Enable source maps in dev mode to see which file styles come from in devtools
      devSourcemap: enableDevTools,
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `@use "@/assets/scss/mixins.scss" as *;`,
        },
      },
    },
    build: {
      // Production optimizations
      sourcemap: buildConfig.sourcemap,
      // Minification settings based on environment
      minify: buildConfig.minify ? 'esbuild' : false,
      // Chunk size warning
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            primevue: ['primevue'],
            utils: ['luxon', 'axios'],
          },
        },
      },
    },
    server: {
      port: parseInt(env.VITE_DEV_PORT ?? '8080', 10),
      // Proxy configuration for localhost development
      proxy:
        mode === 'localhost'
          ? {
              '/api': {
                target: env.VITE_API_BASE_URL ?? 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, ''),
              },
            }
          : undefined,
    },
    preview: {
      port: parseInt(env.VITE_PREVIEW_PORT ?? '8000', 10),
    },
    optimizeDeps: {
      // Pre-bundle PrimeVue components and other lazy-loaded dependencies
      // to prevent page reload when switching between async components
      include: [
        // PrimeVue components used in async-loaded examples
        'primevue/divider',
        'primevue/progressspinner',
        'primevue/checkbox',
        'primevue/editor',
        'primevue/toggleswitch',
        'primevue/textarea',
        'primevue/multiselect',
        'primevue/radiobutton',
        'primevue/inputmask',
        'primevue/iconfield',
        'primevue/inputicon',
        'primevue/tag',
        'primevue/usetoast',
        'primevue/useconfirm',
        'primevue/datepicker',
        // Third-party dependencies used in examples
        'vue-currency-input',
        'quill',
      ],
    },
  }
})
