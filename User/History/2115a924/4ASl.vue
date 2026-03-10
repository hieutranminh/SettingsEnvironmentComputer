<template>
  <div>
    <Drawer
      :blockScroll="true"
      :visible="menuStore.isShowDrawerMenu"
      position="right"
      :style="{ width: '100vw' }"
      @update:visible="$emit('update:visible', $event)"
    >
      <template #container="{ closeCallback }">
        <div class="drawer-menu">
          <!-- Header with User Info and Close Button -->
          <div class="drawer-menu__header">
            <div class="drawer-menu__user-info">
              <span class="drawer-menu__username">{{ authStore.user?.userID }}</span>
              <button class="drawer-menu__signout-btn" @click="onClickSignOut">
                {{ $t('user-accounts.sign-out') }}
              </button>
            </div>
            <button class="drawer-menu__close-btn" aria-label="Close menu" @click="closeCallback">
              <i class="pi pi-times" />
            </button>
          </div>

          <!-- Menu Content -->
          <div class="drawer-menu__content">
            <!-- BRANCH Section -->
            <div v-for="menu in MENU_DATA" :key="menu.code" class="drawer-menu__section">
              <div v-if="checkMenuRole(menuStore.menu, menu.code)" class="drawer-menu__section-header">
                <i :class="menu.text" />
                <span class="drawer-menu__section-title">{{ $t('menu.' + menu.text) }}</span>
              </div>
              <ul class="drawer-menu__submenu">
                <li class="drawer-menu__submenu-item">
                  <div
                    v-if="menu.submenu && checkMenuRole(menuStore.menu, menu.code)"
                    :class="menu.text"
                    class="menu-sub-wrap clearfix"
                  >
                    <div v-for="submenu in menu.submenu" :key="submenu.code">
                      <menu-sub-mobile :menuSub="submenu" @menuLink="onClickLink" @onClickLinkMenu="onClickLinkMenu" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
  <AlertConfirm
    ref="alertConfirmRef"
    :message="$t('user-accounts.do-you-really-want-to-sign-out?')"
    group="drawer-menu"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AlertConfirm from '@/components/common/AlertConfirm.vue'
import { useMenu } from '@/composables/useMenu'
import { MENU_CODE, ROUTE_NAMES } from '@/constants'
import { MENU_DATA } from '@/constants/menu'
import { useAuthStore } from '@/stores/auth/auth'
import { useAppStore } from '@/stores/common/app'
import { useMenuStore } from '@/stores/common/menu'
import { showContactChat } from '@/utils/common'

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// Constants
const VISIBLE_UPDATE_EVENT = 'update:visible'

// Helpers
const { checkMenuRole } = useMenu()
const authStore = useAuthStore()
const menuStore = useMenuStore()
const appStore = useAppStore()
const router = useRouter()

// Reactives
const alertConfirmRef = ref<InstanceType<typeof AlertConfirm> | null>(null)

// Methods
const onClickLink = (menuCode: string): void => {
  if (menuCode === MENU_CODE.SHQ_SUP_08) {
    showContactChat()
    return
  }

  appStore.setShowHelpCenterInfomation(true)
}

const onClickSignOut = async (): Promise<void> => {
  const isConfirmed = await alertConfirmRef.value?.open()
  if (isConfirmed) {
    emit(VISIBLE_UPDATE_EVENT, false)
    router.push({ name: ROUTE_NAMES.LOGIN })
  }
}

const onClickLinkMenu = (): void => {
  emit(VISIBLE_UPDATE_EVENT, false)
}
</script>

<style scoped lang="scss">
.drawer-menu {
  background-color: $green-navbar;
  height: 100vh;
  width: 100vw;
  color: $white;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--p-gray-600);
  }

  &__user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__username {
    font-weight: 600;
    font-size: 1rem;
  }

  &__signout-btn {
    background: transparent;
    border: 1px solid $white;
    color: $white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: $white;
      color: $green-navbar;
    }
  }

  &__close-btn {
    background: transparent;
    border: none;
    color: $white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
  }

  &__section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background-color: $green-navbar-dark;
    border-bottom: 1px solid var(--p-gray-600);
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;

    i {
      background-image: url('@/assets/images/navlist.png');
      width: 20px;
      height: 20px;

      &.setup {
        background-position: -1159px -6px;
      }

      &.branch-management {
        background-position: -550px -6px;
      }

      &.account {
        background-position: -1191px -6px;
      }

      &.boards {
        background-position: -6px -6px;
      }

      &.board {
        background-position: -935px -6px;
      }

      &.payment {
        background-position: -807px -6px;
      }
    }
  }

  &__submenu {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__link {
    display: block;
    padding: 0.75rem 1.5rem 0.75rem 3rem;
    color: $white;
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
}
</style>
