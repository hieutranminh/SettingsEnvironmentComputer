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
        <img :src="logoGitlab" :alt="$t('auth.gitlab')" class="app-header__logo-img" />
        <span class="app-header__logo-text">GitLab Tool</span>
      </RouterLink>
    </div>

    <div class="app-header__right">
      <Button
        icon="pi pi-sign-out"
        text
        rounded
        severity="secondary"
        :loading="authStore.loading"
        :disabled="authStore.loading"
        @click="handleLogout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'

import { useRouterNavigation } from '@/composables/useRouterNavigation'

import { ROUTE_NAMES } from '@/constants'

import logoGitlab from '@/assets/logo-gitlab.png'

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const { navigateTo } = useRouterNavigation()

const handleLogout = async (): Promise<void> => {
  try {
    authStore.logout()
    await navigateTo(ROUTE_NAMES.LOGIN)
  } catch (error) {
    console.error('Logout error:', error)
  }
}
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

  &__logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--p-text-color);
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}
</style>
