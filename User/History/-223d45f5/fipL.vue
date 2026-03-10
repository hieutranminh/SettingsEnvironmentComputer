<template>
  <aside class="app-sidebar">
    <Menu :model="menuItems" class="app-sidebar__menu">
      <template #item="{ item, props }">
        <RouterLink
          v-if="item.route"
          v-slot="{ href, navigate, isActive, isExactActive }"
          :to="item.route"
          custom
        >
          <a
            v-ripple
            :href="href"
            v-bind="props.action"
            class="app-sidebar__item"
            :class="{ 'app-sidebar__item--active': item.exact ? isExactActive : isActive }"
            @click="navigate"
          >
            <span :class="item.icon" class="app-sidebar__item-icon" />
            <span class="app-sidebar__item-label">{{ item.label }}</span>
          </a>
        </RouterLink>
        <a v-else v-ripple v-bind="props.action" class="app-sidebar__item">
          <span :class="item.icon" class="app-sidebar__item-icon" />
          <span class="app-sidebar__item-label">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { MenuItem } from 'primevue/menuitem'

import { useI18n } from '@/composables/useI18n'

import { sidebarNavigation } from '@/config/navigation'

const { t } = useI18n()

const menuItems = computed<MenuItem[]>(() =>
  sidebarNavigation.map((group) => ({
    label: t(group.labelKey).toUpperCase(),
    items: group.items.map((item) => ({
      label: t(item.labelKey),
      icon: item.icon,
      route: item.route,
    })),
  })),
)
</script>

<style scoped lang="scss">
.app-sidebar {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  :deep(.p-menu) {
    width: 100%;
    border: none;
    border-radius: 0;
    background: transparent;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: var(--p-border-radius);
    color: var(--p-text-color);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--p-content-hover-background);
    }

    &--active {
      color: var(--p-primary-color);
      font-weight: 600;
    }
  }

  &__item-icon {
    font-size: 1rem;
  }
}
</style>
