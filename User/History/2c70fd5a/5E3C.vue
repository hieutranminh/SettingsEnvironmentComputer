<template>
  <main>
    <section class="content home-page">
      <div class="inner">
        <article class="row-info">
          <ul class="cf">
            <SystemNotice :data="systemNoticeInfo" :is-loading="isLoading" class="board-item" />
            <BannerBoard :data="bannerBoardInfo" :is-loading="isLoading" class="board-item" />

            <HeadquarterNotice
              :data="headquarterNoticeInfo"
              :is-loading="isLoading"
              class="board-item"
            />
            <ChainBoard :data="chainBoardInfo" :is-loading="isLoading" class="board-item" />
          </ul>
        </article>
      </div>
    </section>
  </main>

  <HomeSystemModal v-model:visible="isShowSystemPopup" :popup-info="popupInfo" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

import { useBoard } from '@/composables/boards/useBoard'
import SystemNotice from '@/views/board/ahasoft-notice/SystemNotice.vue'
import ChainBoard from '@/views/board/branch-board/BranchBoard.vue'
import HeadquarterNotice from '@/views/board/headquarter-notice/HeadquarterNotice.vue'
import BannerBoard from '@/views/board/banner-board/BannerBoard.vue'

// Composables
const {
  loadBoardData,
  systemNoticeInfo,
  headquarterNoticeInfo,
  chainBoardInfo,
  bannerBoardInfo,
  isLoading,
  isShowSystemPopup,
  popupInfo,
} = useBoard()

// Visibility change handler
const handleVisibilityChange = (): void => {
  if (document.visibilityState === 'visible') {
    loadBoardData(true)
  }
}

// Lifecycle
onMounted(async () => {
  await loadBoardData(false)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped lang="scss">
.content {
  .inner {
    width: 100%;

    .row-info {
      ul {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        gap: 2rem;
        list-style: none;
        padding: 0;
        margin: 0;

        @media (width <= 991.99px) {
          gap: 1rem;
        }

        @include mobile {
          /* Unify board item heights on mobile */
          --home-board-mobile-height: 210px;
          gap: 10px;
          flex-direction: column;
        }

        .board-item {
          width: 40%;
          overflow: auto;

          @media (width <= 991.99px) {
            width: 49%;
          }

          @media (width <= 767.99px) {
            width: 100%;
          }

          @include mobile {
            width: 100%;

            /* Force equal heights for inner board content */
            :deep(.home-board .home-board-content),
            :deep(.banner-board .banner-board-content) {
              height: var(--home-board-mobile-height);
              min-height: var(--home-board-mobile-height);

              overflow: auto;
            }
            :deep(.home-board-content--notice),
            :deep(.home-board-content--branch-board) {
              height: 190px !important;
              min-height: 190px !important;

              overflow: auto;
            }
          }
        }
      }
    }
  }
}
</style>
