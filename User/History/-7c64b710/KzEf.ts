/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vue i18n type declarations
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (typeof import('vue-i18n'))['t']
  }
}
