<template>
  <Card>
    <template #content>
      <li class="home-board">
        <div class="home-board-header">
          <h2
            class="home-board-head-title"
            @click="
              hasChain && isShowTextAlert ? handleTextAlert() : handleSetBoardPage(data.boardCode)
            "
          >
            {{ data.headTitle }}
          </h2>
        </div>

        <div
          class="home-board-content home-board-content--branch-board"
          :class="{
            'home-board-content--loading': isLoading,
            'home-board-content--not-in-use': isShowTextAlert,
          }"
        >
          <div v-if="hasChain && isShowTextAlert">
            {{ isNotInUseText }}
          </div>
          <template v-else>
            <div v-if="isLoading" class="loading-state">
              <div class="loading-skeleton" v-for="i in BOARD_LENGTH" :key="i"></div>
            </div>
            <template v-else>
              <dl class="home-board-list branch-board">
                <dd
                  v-for="item in data.items"
                  :key="item.boardId"
                  @click="onSetBoardViewPage(item, data.boardCode)"
                >
                  <label v-for="index in item.depth || 0" :key="index"> &nbsp; </label>
                  <label v-if="(item.depth || 0) > 0"> ▷ </label>
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useChainBoard } from '@/composables/boards/chain-board/useChainBoard'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'
import { BOARD_TYPE_OPTION } from '@/constants'
import { BOARD_ROUTES } from '@/constants/routeNames'
import { useChainStore } from '@/stores/common/chain'
import type { IChainBoard } from '@/types/boards/SystemNotice'

interface BoardData {
  headTitle: string
  items: IChainBoard[]
  boardCode: string
}

withDefaults(
  defineProps<{
    data?: BoardData
    isLoading?: boolean
    errorMessage?: string
  }>(),
  {
    data: () => ({
      headTitle: '',
      items: [] as IChainBoard[],
      boardCode: '',
    }),
    isLoading: false,
    errorMessage: '',
  },
)

// Constants
const BOARD_LENGTH = 5

// Composables
const router = useRouter()
const { t } = useTranslation()
const { showError } = useMessageDialog()
const chainStore = useChainStore()

// Computed
const hasChain = computed(() => {
  return (chainStore?.chainInfo?.chainId || 0) > 0
})

const isShowTextAlert = computed(() => {
  return isNotAllowBoardTypeOption.value
})

const isNotInUseText = computed(() => {
  return t('home.not-in-use')
})

const isChainBoardAlert = computed(() => {
  return t('home.branch-board-alert')
})

const isNotAllowBoardTypeOption = computed(() => {
  return boardTypeOption.value === BOARD_TYPE_OPTION.CREATE
})

const boardTypeOption = computed(() => {
  return chainStore.chainInfo?.boardType
})

// Methods
const handleTextAlert = (): void => {
  showError([isChainBoardAlert.value])
}

const handleSetBoardPage = (boardCode: string): void => {
  router.push({
    name: BOARD_ROUTES.BRANCH_BOARD,
    params: { board_code: boardCode },
  })
}

const { onSetBoardViewPage } = useChainBoard()
</script>

<style scoped lang="scss">
:deep(.p-card-body) {
  padding: 0;
}
.home-board {
  .home-board-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background: var(--p-gray-100);
    border-bottom: 1px solid var(--p-gray-200);
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
      background-color: var(--p-teal-500);
    }

    &:hover {
      color: var(--p-teal-600);
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
      color: var(--p-gray-500);
      font-size: 18px;
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .loading-skeleton {
    height: 1rem;
    background: linear-gradient(
      90deg,
      var(--p-gray-200) 25%,
      var(--p-gray-300) 50%,
      var(--p-gray-200) 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }

  .home-board-list {
    margin: 0;
    padding: 0;
    list-style: none;

    dd {
      cursor: pointer;
      padding: 0.5rem 0;
      transition: background-color 0.2s ease;
    }

    &.branch-board {
      dd {
        position: relative;
        text-indent: 15px;
        cursor: pointer;

        &::before {
          content: '';
          display: block;
          position: absolute;
          left: 0;
          top: 13px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--p-teal-400);
        }
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
