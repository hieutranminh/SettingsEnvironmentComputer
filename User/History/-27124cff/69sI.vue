<template>
  <Card>
    <template #content>
      <li class="home-board">
        <div class="home-board-header">
          <h2
            class="home-board-head-title"
            @click="
              hasChain && isShowTextAlert
                ? handleTextAlert(data.boardCode)
                : handleSetBoardPage(data.boardCode)
            "
          >
            {{ data.headTitle }}
          </h2>
        </div>

        <div
          class="home-board-content home-board-content--notice"
          :class="{
            'home-board-content--error': isError,
            'home-board-content--loading': isLoading,
            'home-board-content--not-in-use': isShowTextAlert,
          }"
        >
          <div v-if="hasChain && isShowTextAlert">
            {{ isNotInUseText }}
          </div>
          <template v-else>
            <div v-if="isLoading" class="loading-state">
              <div class="loading-skeleton" v-for="i in 5" :key="i"></div>
            </div>
            <template v-else>
              <dl class="home-board-list">
                <dd
                  v-for="item in noticeData"
                  :key="item.noticeId"
                  @click="onSetBoardViewPage(item, data.boardCode)"
                >
                  {{ item.title }}
                </dd>
              </dl>
            </template>
          </template>
        </div>
      </li>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { cloneDeep, concat, uniqBy } from 'lodash'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useHeadquarterNotice } from '@/composables/boards/headquarter-notice/useHeadquarterNotice'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'
import {
  BOARD_ENUM,
  BOARD_TYPE_OPTION,
  NOTICE_LIMIT_DEFAULT,
  PAGINATION,
  SEARCH_BOARD_TYPE,
} from '@/constants'
import { BOARD_ROUTES } from '@/constants/routeNames'
import { useChainStore } from '@/stores/common/chain'
import type { IChainNotice } from '@/types/boards/SystemNotice'
import { useBoardStore } from '@/stores/board/board'

export interface BoardData {
  headTitle: string
  boardType: string
  items: IChainNotice[]
  postOnTopItem?: IChainNotice[]
  boardCode: string
}

interface Props {
  data: BoardData
  isLoading?: boolean
  isError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isError: false,
})

// Composables
const router = useRouter()
const { t } = useTranslation()
const { showError } = useMessageDialog()
const chainStore = useChainStore()
const boardStore = useBoardStore()

// Computed
const noticeData = computed(() => {
  const postOnNotices = cloneDeep(props.data.postOnTopItem || [])
  const notices = cloneDeep(props.data.items || [])
  const allNotices = uniqBy(concat(postOnNotices, notices), 'noticeId')

  const noticeLength = NOTICE_LIMIT_DEFAULT
  const { length } = allNotices
  if (length > noticeLength) {
    allNotices.splice(noticeLength, length - noticeLength)
  }

  return allNotices
})
const hasChain = computed(() => {
  return (chainStore?.chainInfo?.chainId || 0) > 0
})

const isShowTextAlert = computed(() => {
  return isNotAllowHqNoticeOption.value
})

const isNotInUseText = computed(() => {
  return t('home.not-in-use')
})

const isHqNoticeAlert = computed(() => {
  return t('home.hq-notice-alert')
})

const isChainBoardAlert = computed(() => {
  return t('home.branch-board-alert')
})

const hqNoticeOption = computed(() => {
  return chainStore?.chainInfo?.hqNoticeOption
})

const isNotAllowHqNoticeOption = computed(() => {
  return hqNoticeOption.value === BOARD_TYPE_OPTION.DONT_CREATE // DONT_CREATE
})

// Methods
const handleTextAlert = (boardCode: string): void => {
  let alertMessage = ''
  if (boardCode === BOARD_ENUM.BOARD_TYPE.CHN_NOTICE) {
    alertMessage = isHqNoticeAlert.value
  } else if (boardCode === BOARD_ENUM.BOARD_TYPE.CHN_BOARD) {
    alertMessage = isChainBoardAlert.value
  }
  showError([alertMessage])
}

const handleSetBoardPage = (boardCode: string): void => {
  boardStore.setPageFilter({
    searchType: SEARCH_BOARD_TYPE.TITLE,
    contents: null,
    pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
  })
  router.push({ name: BOARD_ROUTES.CHAIN_NOTICE, params: { type: boardCode } })
}

const { onSetBoardViewPage } = useHeadquarterNotice()
</script>

<style scoped lang="scss">
// Define SCSS color variables in camelCase at the top (if not already defined)
$pink400: var(--p-pink-400);
$gray100: var(--p-gray-100);
$gray200: var(--p-gray-200);
$gray300: var(--p-gray-300);
$gray400: var(--p-gray-400);
$gray500: var(--p-gray-500);

:deep(.p-card-body) {
  padding: 0;
}
.home-board {
  .home-board-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background: $gray100;
    border-bottom: 1px solid $gray200;
  }

  .home-board-head-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 30px;
      border-radius: 3px;
      background-color: $pink400;
    }

    &:hover {
      color: $pink400;
    }
  }

  .home-board-content {
    flex: 1;
    padding: 1.5rem;
    min-height: 209px;
    display: flex;
    flex-direction: column;

    &--loading {
      justify-content: center;
    }

    &--not-in-use {
      justify-content: center;
      align-items: center;
      color: $gray500;
      font-size: 18px;
    }
    &--notice {
      min-height: 190px;
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .loading-skeleton {
    height: 1rem;
    background: linear-gradient(90deg, $gray200 25%, $gray300 50%, $gray200 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }

  .home-board-list {
    margin: 0;
    padding: 0;
    list-style: none;

    dd {
      position: relative;
      text-indent: 15px;
      cursor: pointer;
      padding: 0.5rem 0;
      transition: background-color 0.2s ease;

      &::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 13px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: $pink400;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Responsive */
@media (width <= 768px) {
  .home-board {
    .home-board-header {
      padding: 0.75rem 1rem;
    }

    .home-board-content {
      padding: 1rem;
      min-height: 150px;
    }

    .home-board-head-title {
      font-size: 0.875rem;
    }
  }
}
</style>
