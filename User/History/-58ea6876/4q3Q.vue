<template>
  <header class="app-header">
    <div class="app-header-container">
      <div class="app-header-left">
        <router-link to="/" class="app-header-logo-link">
          <div class="app-header-logo">
            <!-- Desktop Logo -->
            <img
              v-if="!isMobile"
              src="@/assets/images/applogo-ahaplus.png"
              class="app-header-logo-image"
            />
            <!-- Mobile Logo -->
            <div v-else class="app-header-logo-mobile">
              <img src="@/assets/images/logo_ahaplus.svg" />
            </div>
          </div>
        </router-link>
      </div>

      <div class="app-header-right">
        <!-- Mobile Menu Icon -->
        <div v-if="isMobile" class="app-header-menu-icon">
          <i @click="openDrawer" class="pi pi-bars app-header-menu-icon-symbol"></i>
        </div>

        <!-- Desktop Elements -->
        <template v-else>
          <div
            class="app-header-support-icon-badge"
            v-if="isShowRemoteSupport"
            @click="handleToggleRemoteSupport"
          >
            <RemoteSupportIcon />
          </div>
          <div class="app-header-chat-icon" @click="handleToggleChat">
            <i class="app-header-chat-icon-symbol">
              <img src="@/assets/images/iCon-naverTalk.png" />
            </i>
          </div>

          <!-- User section -->
          <div class="app-header-user-section">
            <div class="app-header-user-info" @click="handleToggle">
              <i class="pi pi-user app-header-user-icon"> </i>
              <span class="app-header-user-name">{{ authStore.user.userID }}</span>

              <i class="pi pi-chevron-down app-header-user-dropdown"></i>
            </div>
          </div>

          <PopoverMenu ref="popoverRef" />

          <Button @click="handleLogout" variant="text" class="logout-btn">
            <i class="pi pi-sign-out app-header-logout-icon"></i>
          </Button>
        </template>
      </div>
    </div>
    <NavigationBar v-if="!isMobile" />
    <DrawerMenu @update:visible="menuStore.toggleDrawerMenu($event)" />
    <AlertConfirm
      ref="alertConfirmRef"
      :message="$t('user-account.do-you-really-want-to-sign-out?')"
    />
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import AlertConfirm from '@/components/common/AlertConfirm.vue'
import DrawerMenu from '@/components/common/DrawerMenu.vue'
import type PopoverMenu from '@/components/common/PopoverMenu.vue'
import RemoteSupportIcon from '@/components/common/RemoteSupportIcon.vue'
import { useDevice } from '@/composables/useDevice'
import { COUNTRY_CODES, ROUTE_NAMES } from '@/constants'
import { MENU_DATA } from '@/constants/menu'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { useMenuStore } from '@/stores/common/menu'
import { useShopStore } from '@/stores/common/shop'
import type { IMenuItem } from '@/types/menu'
import { showContactChat, showRemoteSupport } from '@/utils/common'
import { useMessageDialog } from '@/composables/useMessageDialog'

// Helpers
const authStore = useAuthStore()
const router = useRouter()
const shopStore = useShopStore()
const menuStore = useMenuStore()
const { isMobile } = useDevice()
const { showError } = useMessageDialog()

// Reactives
const accountMenuOptions = ref<IMenuItem[]>([])
const paymentMenuOptions = ref<IMenuItem[]>([])
const popoverRef = ref<InstanceType<typeof PopoverMenu> | null>(null)
const alertConfirmRef = ref<InstanceType<typeof AlertConfirm> | null>(null)

// Computed
const isShowRemoteSupport = computed(() => {
  return !isMobile && authStore.shop.country === COUNTRY_CODES.KR
})

// Methods
const handleLogout = async (): Promise<void> => {
  const isConfirmed = await alertConfirmRef.value?.open()
  if (isConfirmed) {
    router.push({ name: ROUTE_NAMES.LOGIN })
  }
}

const handleToggleChat = (): void => {
  showContactChat()
}

const handleToggle = (event: Event): void => {
  popoverRef.value?.handleToggle(event)
}

const openDrawer = (): void => {
  menuStore.toggleDrawerMenu(true)
}

const handleToggleRemoteSupport = (): void => {
  showRemoteSupport()
}

// Lifecycle
onBeforeMount(async () => {
  accountMenuOptions.value = Object.values(MENU_DATA.account.submenu || {})
  paymentMenuOptions.value = Object.values(MENU_DATA.payment.submenu || {})

  const response = await shopStore.setMonthFeeInfoData({ shopId: authStore.shop.shopId })
  if (!response.isOK) {
    showError(response.errorMessages)
  }
})
</script>

<style scoped lang="scss">
@mixin transition($property: all) {
  transition: $property 0.2s ease;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
  background-color: $white;

  .app-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    margin: 0 auto;
  }

  .app-header-left {
    display: flex;
    align-items: center;
  }

  .app-header-logo {
    display: flex;
    align-items: center;

    .app-header-logo-link {
      text-decoration: none;
      display: flex;
      align-items: center;
    }

    .app-header-logo-image {
      height: 35px;
      width: auto;
    }

    .app-header-logo-mobile {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-weight: 700;
      font-size: 1.5rem;
    }
  }

  .app-header-right {
    display: flex;
    align-items: center;
    gap: 1rem;

    .logout-btn {
      color: var(--p-gray-600);
    }
  }

  .app-header-menu-icon {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
  }

  .app-header-chat-icon {
    width: 35px;
    height: 35px;
    background-color: $red-icon-chat;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .app-header-chat-icon-symbol {
      font-size: 0;
    }
  }

  .app-header-user-section {
    display: flex;
    align-items: center;
  }

  .app-header-user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .app-header-user-icon {
    color: var(--p-gray-500);
    font-size: 1rem;
  }

  .app-header-user-name {
    color: var(--p-gray-600);
    font-weight: 500;
    font-size: 0.875rem;
  }

  .app-header-user-dropdown {
    color: var(--p-gray-400);
    font-size: 12px;
  }
}

@media (width <= 768px) {
  .app-header {
    &-container {
      padding: 0.75rem 1rem;
    }

    &-logo-mobile {
      font-size: 1.25rem;
    }
  }
}
</style>
