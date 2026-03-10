<template>
  <div class="navbar-container">
    <div class="navbar-trigger" @click="handleToggleMenu">
      <p class="navbar-trigger-text">({{ $t('menu.chain-management') }}) {{ shopData.shopName }}</p>
      <p class="menu-pc-trigger">
        <span v-if="true">{{ toggleLable }}</span>
        <span v-else>{{ $t('menu.toggle-show-menu') }}</span>
      </p>
    </div>

    <nav class="nav-bar" data-testid="nav-bar" v-show="menuStore.isShowMenu">
      <div class="nav-bar-container">
        <ul class="menu-list clearfix">
          <template v-for="menu in MENU_DATA" :key="menu.code">
            <li
              :class="{
                'account-menu-mobile': menu.text === 'account' || menu.text === 'payment',
              }"
              v-if="checkMenuRole(menuStore.menu, menu.code)"
              @mousedown="setActiveCode(menu.code)"
              @mouseenter="handleMounseEnter(menu.code)"
              @mouseleave="setActiveCode('')"
              class="menu-item"
              :data-testid="`menu-section-${menu.text}`"
            >
              <a v-if="checkMenuRole(menuStore.menu, menu.code)" class="menu-parent">
                {{ $t('menu.' + menu.text) }}
              </a>

              <div
                v-if="menu.submenu && !Object.values(menu.submenu).some((item) => item.submenu)"
                :style="{
                  display: activeCode === menu.code ? 'block' : 'none',
                }"
                class="menu-sub-wrap clearfix"
              >
                <div class="menu-sub">
                  <ul>
                    <li
                      v-for="(menuSub, index) in menu.submenu"
                      class="menu-sub-sub"
                      :key="menuSub.code + index"
                      @click="handleSetPageInfo(menuSub.link)"
                    >
                      <div
                        v-if="checkMenuRole(menuStore.menu, menuSub.code) && menuSub.link === null"
                      >
                        <a
                          class="menu-sub-sub-link"
                          :data-testid="`menu-link-${menuSub.text}`"
                          @click="handleClickLink(menuSub.code)"
                        >
                          <div class="menu-sub-sub-link">
                            <span><i :class="menuSub.text" /></span>
                            <span>{{ $t('menu.' + menuSub.text) }}</span>
                          </div>
                        </a>
                      </div>
                      <router-link
                        v-else-if="checkMenuRole(menuStore.menu, menuSub.code) && menuSub.link"
                        :to="isPreventClick(menuSub.link) ? '' : menuSub.link"
                        :data-testid="`menu-link-${menuSub.text}`"
                        @click="handleClick(menuSub.link)"
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
                    :style="{
                      display: activeCode === menu.code ? 'block' : 'none',
                    }"
                    class="menu-sub"
                  >
                    <p>{{ $t('menu.' + menuSub.text) }}</p>
                    <ul>
                      <li
                        v-for="menuSubLv2 in menuSub.submenu"
                        :key="menuSubLv2.code"
                        class="menu-sub-sub"
                      >
                        <template
                          v-if="
                            checkMenuRole(menuStore.menu, menuSubLv2.code) &&
                            menuSubLv2.link === null
                          "
                        >
                          <a :data-testid="`menu-link-${menuSubLv2.text}`">
                            <div class="menu-sub-sub-link">
                              <span><i :class="menuSubLv2.text" /></span>
                              <span>{{ $t('menu.' + menuSubLv2.text) }}</span>
                            </div>
                          </a>
                        </template>
                        <router-link
                          v-else-if="
                            checkMenuRole(menuStore.menu, menuSubLv2.code) && menuSubLv2.link
                          "
                          :to="menuSubLv2.link"
                          :data-testid="`menu-link-${menuSubLv2.text}`"
                          @click="handleClick(menuSubLv2.link)"
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
import { ref, computed } from 'vue'

import { useAuth } from '@/composables/useAuth'
import { useMenu } from '@/composables/useMenu'
import { useTranslation } from '@/composables/useTranslation'
import {
  BOARD_TYPE_OPTION,
  BOARD_TYPE_OPTIONS,
  LINK_TYPE,
  MENU_CODE,
  PAGINATION,
  SEARCH_BOARD_TYPE,
} from '@/constants'
import { MENU_DATA } from '@/constants/menu'
import { useAppStore } from '@/stores/common/app'
import { useMenuStore } from '@/stores/common/menu'
import { showContactChat, showRemoteSupport } from '@/utils/common'
import { useBoardStore } from '@/stores/board/board'
import { useChainStore } from '@/stores/common/chain'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useRoute } from 'vue-router'
// State
const activeCode = ref<string>('')
const { checkMenuRole } = useMenu()
const { t } = useTranslation()
const { shopData } = useAuth()
const menuStore = useMenuStore()
const appStore = useAppStore()
const boardStore = useBoardStore()
const chainStore = useChainStore()
const route = useRoute()
const { showError } = useMessageDialog()
// Computed
const toggleLable = computed(() => {
  return menuStore.isShowMenu ? t('menu.toggle-hide-menu') : t('menu.toggle-show-menu')
})

const hasChain = computed(() => {
  return chainStore.chainInfo?.chainId || 0 > 0
})

const isNotAllowBoardTypeOption = computed(() => {
  return chainStore.chainInfo?.boardType === BOARD_TYPE_OPTIONS.DONT_CREATE
})

const isNotAllowHqNoticeOption = computed(() => {
  return chainStore.chainInfo?.hqNoticeOption === BOARD_TYPE_OPTION.DONT_CREATE
})

// Function
const setActiveCode = (code: string): void => {
  activeCode.value = code
}

const isChainNotice = (link: string): boolean => {
  return link === LINK_TYPE.CHN_NOTICE
}

const isChainBoard = (link: string): boolean => {
  return link === LINK_TYPE.CHN_BOARD
}

const handleMounseEnter = (code: string): void => {
  activeCode.value = code
}

const handleToggleMenu = (): void => {
  menuStore.toggleMenu()
}

const handleClick = async (path: string): Promise<void> => {
  // setActiveCode('')
  // if (route.path === path) {
  //   appStore.setRouteViewKey(appStore.routeViewKey + 1)
  // }
}

const handleClickLink = (menuCode: string): void => {
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
      break
    default: {
      appStore.setRouteViewKey(appStore.routeViewKey + 1)
    }
  }
}

const handleSetPageInfo = (link: string | null): void => {
  if (!link) return
  const isChnNotice = isChainNotice(link)
  const isChnBoard = isChainBoard(link)
  if (link === LINK_TYPE.SYS_NOTICE || link === LINK_TYPE.SYS_BOARD || isChnBoard || isChnNotice) {
    if (!hasChain.value) {
      boardStore.setPageFilter({
        searchType: SEARCH_BOARD_TYPE.TITLE,
        contents: null,
        pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
      })
    }

    if (isChnNotice && isNotAllowHqNoticeOption.value) {
      showError(t('home.hq-notice-alert'))
      return
    }

    if (isChnBoard && isNotAllowBoardTypeOption.value) {
      showError(t('home.branch-board-alert'))
    }
  } else if (link === LINK_TYPE.POPUPS) {
    boardStore.setPageFilter({
      searchType: SEARCH_BOARD_TYPE.TITLE,
      contents: null,
      pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
    })
  }
}
const isPreventClick = (link: string): boolean => {
  return (
    (isChainBoard(link) && isNotAllowBoardTypeOption.value) ||
    (isChainNotice(link) && isNotAllowHqNoticeOption.value)
  )
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
      padding: 0 10px;
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

                      &.branch-prepaid-goods {
                        background-position: 1px 0;
                      }

                      &.prepaid-cards {
                        background-position: -958px 0;
                      }

                      &.package {
                        background-position: -990px 0;
                      }

                      &.product {
                        background-position: -1021px 2px;
                      }

                      &.product-category {
                        background-position: -1054px 0;
                      }

                      &.setup-chain-logo {
                        background-position: 1px 0;
                      }

                      &.head-notice {
                        background-position: -1218px 2px;
                      }

                      &.branch-board {
                        background-position: -1252px 2px;
                      }

                      &.popup-management {
                        background-position: -1218px 2px;
                      }

                      &.system-notice {
                        background-position: -1218px 2px;
                      }

                      &.remote-support {
                        background-position: -926px 0;
                      }

                      &.branch-sales {
                        // background-position: -94px 0;
                        background-image: url('/nav/nav-icon-branch01.png');
                        background-repeat: no-repeat;
                        background-position: center;
                      }

                      &.report {
                        background-position: -1314px 0;
                      }

                      &.sales-total-by-branch {
                        background-image: url('/nav/nav-icon-branch02.png');
                        background-repeat: no-repeat;
                        background-position: center;
                      }

                      &.report-by-branch {
                        background-image: url('/nav/nav-icon-branch03.png');
                        background-repeat: no-repeat;
                        background-position: center;
                      }

                      &.branches {
                        background-image: url('/nav/nav-icon-branch04.png');
                        background-repeat: no-repeat;
                        background-position: center;
                      }

                      &.remote-support {
                        width: 32px;
                        height: 32px;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-image: url('@/assets/images/menu-remote-support.png');
                      }
                      &.contact-chat {
                        width: 32px;
                        height: 32px;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-image: url('@/assets/images/icon-chat.png');
                      }
                      &.help-center-information {
                        width: 32px;
                        height: 32px;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-image: url('@/assets/images/iCon-menu.png');
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
