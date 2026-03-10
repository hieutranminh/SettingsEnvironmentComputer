<template>
  <div class="release-detail-view">
    <div class="release-detail-view__header">
      <Button
        :label="$t('release.backToList')"
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        @click="goBack()"
      />
    </div>

    <Card>
      <template #title> {{ $t('release.releaseInfo') }} #{{ releaseNo }} </template>
      <template #content>
        <p class="release-detail-view__placeholder">
          {{ $t('release.detail') }} - Release {{ releaseNo }}
        </p>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useRouterNavigation } from '@/composables/useRouterNavigation'

const route = useRoute()
const { goBack } = useRouterNavigation()

const releaseNo = computed((): string => {
  return String(route.params.releaseNo ?? '')
})
</script>

<style scoped lang="scss">
.release-detail-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__header {
    display: flex;
    align-items: center;
  }

  &__placeholder {
    color: var(--p-text-muted-color);
  }
}
</style>
