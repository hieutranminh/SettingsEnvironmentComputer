import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import removeConsole from 'vite-plugin-remove-console'
import { checker } from 'vite-plugin-checker'

import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

// Modern sprite plugin compatible with Vite 7
import { iconsSpritesheet } from 'vite-plugin-icons-spritesheet'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // Remove console.log and debugger in production build
    removeConsole(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    // Modern sprite generator compatible with Vite 7
    iconsSpritesheet({
      inputDir: './src/assets/sprites/icons',
      outputDir: './src/assets/sprites/generated',
      fileName: 'sprite.svg',
      withTypes: true,
      typesOutputFile: './src/types/sprites.ts',
    }),
    eslint({
      include: ['src/**/*.{vue,js,ts,jsx,tsx}'],
      exclude: ['node_modules', 'dist'],
      cache: false,
      emitWarning: true,
      emitError: true,
      failOnError: false,
      failOnWarning: false,
      formatter: 'stylish',
      lintOnStart: true,
      fix: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8080,
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
})
