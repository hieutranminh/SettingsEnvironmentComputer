<template>
  <header class="app-header">
    <div class="app-header__left">
      <Button
        icon="pi pi-bars"
        text
        rounded
        severity="secondary"
        class="app-header__toggle"
        @click="layoutStore.toggleSidebar()"
      />
      <RouterLink to="/" class="app-header__logo">
        <img :src="logoAhasoft" :alt="$t('common.company')" class="app-header__logo-img" />
      </RouterLink>
    </div>

    <div class="app-header__right">
      <div class="app-header__user" @click="toggleUserMenu">
        <Avatar label="HT" shape="circle" />
        <span class="app-header__user-name">Hieu Tran</span>
        <i class="pi pi-chevron-down app-header__user-chevron" />
      </div>
      <Menu ref="userMenuRef" :model="userMenuItems" popup />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { MenuItem } from 'primevue/menuitem'

import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'

import { useRouterNavigation } from '@/composables/useRouterNavigation'

import { ROUTE_NAMES } from '@/constants'

import logoAhasoft from '@/assets/logo-ahasoft.svg'

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const { navigateTo } = useRouterNavigation()

const userMenuRef = ref()

const toggleUserMenu = (event: Event): void => {
  userMenuRef.value.toggle(event)
}

const handleLogout = async (): Promise<void> => {
  try {
    authStore.logout()
    await navigateTo(ROUTE_NAMES.LOGIN)
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const userMenuItems = ref<MenuItem[]>([
  {
    label: 'Profile',
    icon: 'pi pi-user',
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => void handleLogout(),
  },
])
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height, 60px);
  padding: 0 1.25rem;
  background-color: var(--p-content-background);
  border-bottom: 1px solid var(--p-content-border-color);
  position: sticky;
  top: 0;
  z-index: 100;

  &__left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__logo-img {
    height: 28px;
    width: auto;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.625rem;
    border-radius: var(--p-border-radius);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--p-content-hover-background);
    }
  }

  &__user-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-text-color);
  }

  &__user-chevron {
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
  }
}
</style>
