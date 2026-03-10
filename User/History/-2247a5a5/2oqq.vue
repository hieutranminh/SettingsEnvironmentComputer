<template>
  <div class="navbar-container">
    <div class="navbar-trigger" @click="onToggleMenu">
      <p class="navbar-trigger-text">({{ $t('menu.chain-management') }}) {{ shopData.shopName }}</p>
      <p class="menu-pc-trigger">
        <span v-if="true">{{ toggleLable }}</span>
        <span v-else>{{ $t('menu.toggle-show-menu') }}</span>
      </p>
    </div>

    <nav v-show="menuStore.isShowMenu" class="nav-bar">
      <div class="nav-bar-container">
        <ul class="menu-list clearfix">
          <template v-for="menu in MENU_DATA" :key="menu.code">
            <li
              v-if="checkMenuRole(menuStore.menu, menu.code)"
              :class="{ 'account-menu-mobile': menu.text === 'account' || menu.text === 'payment' }"
              class="menu-item"
              @mousedown="setActiveCode(menu.code)"
              @mouseenter="onMounseEnter(menu.code)"
              @mouseleave="setActiveCode('')"
            >
              <a v-if="checkMenuRole(menuStore.menu, menu.code)" class="menu-parent">
                {{ $t('menu.' + menu.text) }}
              </a>

              <div
                v-if="menu.submenu && !Object.values(menu.submenu).some((item) => item.submenu)"
                :style="{ display: activeCode === menu.code ? 'block' : 'none' }"
                class="menu-sub-wrap clearfix"
              >
                <div class="menu-sub">
                  <ul>
                    <li v-for="(menuSub, index) in menu.submenu" :key="menuSub.code + index" class="menu-sub-sub">
                      <div v-if="checkMenuRole(menuStore.menu, menuSub.code) && menuSub.link === null">
                        <a class="menu-sub-sub-link" @click="onClickLink(menuSub.code)">
                          <div class="menu-sub-sub-link">
                            <span><i :class="menuSub.text" /></span>
                            <span>{{ $t('menu.' + menuSub.text) }}</span>
                          </div>
                        </a>
                      </div>
                      <router-link
                        v-else-if="checkMenuRole(menuStore.menu, menuSub.code) && menuSub.link"
                        :to="menuSub.link"
                        @click="setActiveCode('')"
                      >
                        <div class="menu-sub-sub-link">
                          <span><i :class="menuSub.text" /></span>
                          <span>{{ $t('menu.' + menuSub.text) }}</span>
                        </div>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
              <template v-else>
                <div class="menu-sub-wrap clearfix">
                  <div
                    v-for="menuSub in menu.submenu"
                    :key="menuSub.code"
                    :style="{ display: activeCode === menu.code ? 'block' : 'none' }"
                    class="menu-sub"
                  >
                    <p>{{ $t('menu.' + menuSub.text) }}</p>
                    <ul>
                      <li v-for="menuSubLv2 in menuSub.submenu" :key="menuSubLv2.code" class="menu-sub-sub">
                        <template v-if="checkMenuRole(menuStore.menu, menuSubLv2.code) && menuSubLv2.link === null">
                          <a>
                            <div class="menu-sub-sub-link">
                              <span><i :class="menuSubLv2.text" /></span>
                              <span>{{ $t('menu.' + menuSubLv2.text) }}</span>
                            </div>
                          </a>
                        </template>
                        <router-link
                          v-else-if="checkMenuRole(menuStore.menu, menuSubLv2.code) && menuSubLv2.link"
                          :to="menuSubLv2.link"
                          @click="setActiveCode('')"
                        >
                          <div class="menu-sub-sub-link">
                            <span><i :class="menuSubLv2.text" /></span>
                            <span>{{ $t('menu.' + menuSubLv2.text) }}</span>
                          </div>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useAuth } from '@/composables/useAuth'
import { useMenu } from '@/composables/useMenu'
import { useTranslation } from '@/composables/useTranslation'
import { MENU_CODE } from '@/constants'
import { MENU_DATA } from '@/constants/menu'
import { useAppStore } from '@/stores/common/app'
import { useMenuStore } from '@/stores/common/menu'
import { showContactChat, showRemoteSupport } from '@/utils/common'

// State
const activeCode = ref<string>('')
const { checkMenuRole } = useMenu()
const { t } = useTranslation()
const { shopData } = useAuth()
const menuStore = useMenuStore()
const appStore = useAppStore()

// Computed
const toggleLable = computed(() => {
  return menuStore.isShowMenu ? t('menu.toggle-hide-menu') : t('menu.toggle-show-menu')
})

// Function
const setActiveCode = (code: string): void => {
  activeCode.value = code
}

const onMounseEnter = (code: string): void => {
  activeCode.value = code
}

const onToggleMenu = (): void => {
  menuStore.toggleMenu()
}

const onClickLink = (menuCode: string): void => {
  switch (menuCode) {
    case MENU_CODE.SHQ_SUP_07:
      showRemoteSupport()
      setActiveCode('')
      return
    case MENU_CODE.SHQ_SUP_08:
      showContactChat()
      setActiveCode('')
      return
    case MENU_CODE.SHQ_SUP_09:
      appStore.setShowHelpCenterInfomation(true)
      setActiveCode('')

    default:
  }
}
</script>

<style lang="scss" scoped>
.navbar-container {
  .navbar-trigger {
    background-color: $black;
    color: $white;
    position: relative;
    line-height: 30px;
    cursor: pointer;

    @media (width <= 768px) {
      display: none;
    }

    .navbar-trigger-text {
      padding-left: 48px;
    }

    .menu-pc-trigger {
      position: absolute;
      height: 40px;
      right: 25%;
      top: -20px;
      border-radius: 5px;
      text-align: center;
      cursor: pointer;
      background-color: $black;

      @media (width <= 1600px) {
        right: 5%;
        top: 0;
        background: transparent;
      }
    }
  }

  .nav-bar {
    background: $green-navbar;
    width: 100%;
    position: relative;

    .nav-bar-container {
      padding-left: 3%;

      .menu-list {
        display: flex;
        align-items: center;

        .account-menu-mobile {
          display: none;
        }

        li.menu-item {
          position: relative;

          @media (width <= 1366px) {
            width: 12.5%;
            text-align: center;
            box-sizing: border-box;
          }

          .menu-parent {
            display: block;
            text-align: center;
            text-transform: uppercase;
            width: 160px;

            @media (width < 1366px) {
              width: 100%;
              text-align: center;
            }
          }

          a {
            line-height: 45px;
            box-sizing: border-box;
            color: $white;
            transition: 0.3s;
            cursor: pointer;

            @media (width <= 1366px) {
              width: 100%;
              text-align: center;
            }

            &:hover {
              background-color: $green-navbar-dark;
            }
          }

          .menu-sub-wrap {
            position: absolute;
            top: 45px;
            left: 0;

            border-radius: 0 0 5px 5px;
            z-index: 100;
            background-color: $green-navbar-dark;
            width: max-content;

            .menu-sub {
              float: left;
              text-align: left;

              padding: 15px 30px;
              margin-right: 15px;

              @media (width < 1198.99px) {
                margin-right: 0;
              }

              .menu-sub-sub {
                .menu-sub-sub-link {
                  display: flex;
                  align-items: center;
                  gap: 20px;

                  span:first-child {
                    display: inline-block;

                    width: 35px;
                    height: 35px;

                    border-radius: 50%;
                    background-color: $white;

                    i {
                      width: 35px;
                      height: 35px;
                      background-image: url('@/assets/images/navlist.png');
                      display: inline-block;

                      &.services {
                        background-position: -926px 0;
                      }

                      &.prepaid-cards {
                        background-position: -958px 0;
                      }

                      &.package {
                        background-position: -990px 0;
                      }

                      &.product {
                        background-position: -1021px 0;
                      }

                      &.product-category {
                        background-position: -1053px 0;
                      }

                      &.head-notice {
                        background-position: -1218px 0;
                      }

                      &.branch-board {
                        background-position: -1252px 0;
                      }

                      &.popup-management {
                        background-position: -1218px 0;
                      }

                      &.system-notice {
                        background-position: -1218px 0;
                      }

                      &.remote-support {
                        background-position: -926px 0;
                      }

                      &.branch-sales {
                        background-position: -94px 0;
                      }

                      &.report {
                        background-position: -1314px 0;
                      }

                      &.sales-total-by-branch {
                        background-position: -63px 0;
                      }

                      &.report-by-branch {
                        background-position: -192px 0;
                      }

                      &.branches {
                        background-position: -128px 0;
                      }
                    }
                  }
                }
              }

              p {
                font-size: 16px;
                margin-bottom: 10px;
                color: $white;
                text-transform: uppercase;
                display: inline-block;
                border-bottom: 3px double $white;
              }
            }
          }
        }
      }
    }
  }
}
</style>
