<template>
  <div class="main-layout" :class="{ 'main-layout--sidebar-hidden': !layoutStore.sidebarVisible }">
    <AppHeader />
    <div class="main-layout__body">
      <AppSidebar />
      <div class="main-layout__backdrop" @click="layoutStore.toggleSidebar()" />
      <main class="main-layout__content">
        xxx
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

import { useLayoutStore } from '@/stores/layout'

import { useViewportInfo } from '@/composables/useViewportInfo'

const SIDEBAR_OPEN_CLASS = 'layout-sidebar-open'

const layoutStore = useLayoutStore()
const { isDesktop } = useViewportInfo()

layoutStore.setSidebarVisible(isDesktop.value)

watch(
  () => layoutStore.sidebarVisible,
  (visible) => {
    document.documentElement.classList.toggle(SIDEBAR_OPEN_CLASS, visible)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.documentElement.classList.remove(SIDEBAR_OPEN_CLASS)
})
</script>

<style scoped lang="scss">
.main-layout {
  --sidebar-width: 250px;
  --header-height: 60px;
  --layout-content-bg: var(--p-surface-50);

  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  &__body {
    display: flex;
    flex: 1;
    position: relative;
  }

  :deep(.app-sidebar) {
    width: var(--sidebar-width);
    min-width: var(--sidebar-width);
    position: sticky;
    top: var(--header-height);
    height: calc(100vh - var(--header-height));
    height: calc(100dvh - var(--header-height));
    background-color: var(--p-content-background);
    border-right: 1px solid var(--p-content-border-color);
    overflow: hidden;
    transition:
      width 0.3s ease,
      min-width 0.3s ease;
  }

  &--sidebar-hidden :deep(.app-sidebar) {
    width: 0;
    min-width: 0;
  }

  &__backdrop {
    display: none;
  }

  &__content {
    flex: 1;
    padding: 1.5rem;
    min-width: 0;
    background-color: var(--layout-content-bg);
  }
}

:global(.app-dark) .main-layout {
  --layout-content-bg: var(--p-surface-950);
}

@include respond-below(md) {
  :global(html.layout-sidebar-open) {
    overflow: hidden;
  }

  .main-layout {
    :deep(.app-sidebar) {
      position: fixed;
      top: var(--header-height);
      bottom: 0;
      left: 0;
      z-index: 99;
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      height: auto;
      overflow-y: auto;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      transform: translateX(0);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
      box-shadow: var(--p-overlay-navigation-shadow);
    }

    &--sidebar-hidden :deep(.app-sidebar) {
      transform: translateX(-100%);
      box-shadow: none;
    }

    &__backdrop {
      display: block;
      position: fixed;
      inset: 0;
      top: var(--header-height);
      z-index: 98;
      background-color: var(--p-mask-background);
      opacity: 1;
      transition: opacity 0.3s ease;
    }

    &--sidebar-hidden &__backdrop {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
