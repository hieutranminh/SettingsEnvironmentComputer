<template>
  <div class="merge-requests-view">
    <MergeRequestsFilter
      :filters="filters"
      :project-options="projectOptions"
      :author-options="authorOptions"
      :loading-projects="gitlabStore.loadingProjects"
      @update:project-id="onProjectChange"
      @update:search="onClientFilterChange('search', $event)"
    />

    <MergeRequestsTable
      v-model:first="tableFirst"
      :merge-requests="filteredMergeRequests"
      :loading="loadingMergeRequests"
      @ai-review="onAiReview"
      @merge="onMerge"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'

import { useGitLabStore } from '@/stores/gitlab'

import { useAlert } from '@/composables/useAlert'
import { useI18n } from '@/composables/useI18n'

import type { MergeRequestItem } from '@/types/gitlab'

import type { MergeRequestsFilters } from './composables/useMergeRequests'
import { useMergeRequests } from './composables/useMergeRequests'
import MergeRequestsFilter from './partials/MergeRequestsFilter.vue'
import MergeRequestsTable from './partials/MergeRequestsTable.vue'

const { t } = useI18n()
const alert = useAlert()
const gitlabStore = useGitLabStore()
const { filteredMergeRequests, loadingMergeRequests, filters, fetchMergeRequests, updateFilter } =
  useMergeRequests()

const tableFirst = ref(0)

const projectOptions = computed(() =>
  gitlabStore.projects.map((project) => ({
    label: project.name,
    value: project.id,
  })),
)

onMounted(() => {
  if (filters.value.projectId !== null) {
    void fetchMergeRequests()
  }
})

const onProjectChange = (value: number | null): void => {
  tableFirst.value = 0
  updateFilter('projectId', value)
  void fetchMergeRequests()
}

const onClientFilterChange = <K extends keyof MergeRequestsFilters>(
  key: K,
  value: MergeRequestsFilters[K],
): void => {
  tableFirst.value = 0
  void nextTick(() => {
    updateFilter(key, value)
  })
}

const onAiReview = (_mr: MergeRequestItem): void => {
  alert.info(t('mergeRequests.title'), t('mergeRequests.pendingReview'))
}

const onMerge = (_mr: MergeRequestItem): void => {
  alert.info(t('mergeRequests.title'), t('mergeRequests.merge'))
}
</script>

<style scoped lang="scss">
.merge-requests-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
