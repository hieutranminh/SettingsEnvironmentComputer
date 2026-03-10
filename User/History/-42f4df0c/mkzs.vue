<template>
  <div class="release-view">
    <ReleaseFilter
      :selected-year="selectedYear"
      @update:selected-year="onYearChange"
      @create="onCreateRelease"
    />

    <ReleaseTable
      v-model:first="tableFirst"
      :releases="filteredReleases"
      :loading="false"
      @send="onSend"
      @details="onDetails"
      @edit="onEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { useRouterNavigation } from '@/composables/useRouterNavigation'

import { ROUTE_NAMES } from '@/constants'

import ReleaseFilter from './partials/ReleaseFilter.vue'
import type { ReleaseItem } from './partials/ReleaseTable.vue'
import ReleaseTable from './partials/ReleaseTable.vue'

const { navigateTo } = useRouterNavigation()

const selectedYear = ref(new Date().getFullYear())
const tableFirst = ref(0)

const dummyReleases: ReleaseItem[] = [
  { id: 1, releaseNo: 105, date: '2026-03-08' },
  { id: 2, releaseNo: 104, date: '2026-03-01' },
  { id: 3, releaseNo: 103, date: '2026-02-22' },
  { id: 4, releaseNo: 102, date: '2026-02-15' },
  { id: 5, releaseNo: 101, date: '2026-02-08' },
  { id: 6, releaseNo: 100, date: '2026-02-01' },
]

const filteredReleases = computed((): ReleaseItem[] => {
  return dummyReleases.filter((release) => {
    const releaseYear = new Date(release.date).getFullYear()
    return releaseYear === selectedYear.value
  })
})

const onYearChange = (value: number): void => {
  selectedYear.value = value
  tableFirst.value = 0
}

const onCreateRelease = (): void => {
  // Placeholder for create release action
}

const onSend = (_release: ReleaseItem): void => {
  // Placeholder for send action
}

const onDetails = (release: ReleaseItem): void => {
  void navigateTo(ROUTE_NAMES.RELEASE_DETAIL, { params: { releaseNo: String(release.releaseNo) } })
}

const onEdit = (_release: ReleaseItem): void => {
  // Placeholder for edit action
}
</script>

<style scoped lang="scss">
.release-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
