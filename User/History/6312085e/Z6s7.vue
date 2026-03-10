<template>
  <div class="merge-requests-view">
    <MergeRequestsFilter
      :filters="filters"
      :project-options="projectOptions"
      :loading-projects="gitlabStore.loadingProjects"
      @update:project-id="onProjectChange"
      @update:search="onClientFilterChange('search', $event)"
    />

    <MergeRequestsTable
      v-model:first="tableFirst"
      :merge-requests="filteredMergeRequests"
      :loading="loadingMergeRequests"
      @merge="onMerge"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'

import { useGitLabStore } from '@/stores/gitlab'

import { useAlert } from '@/composables/useAlert'
import { useI18n } from '@/composables/useI18n'

import { extractApiErrorMessages } from '@/api/interceptors/utils/errorUtils'
import { gitlabApi } from '@/api/services/gitlab'

import type { MergeRequestsFilters } from './composables/useMergeRequests'
import { useMergeRequests } from './composables/useMergeRequests'
import MergeRequestsFilter from './partials/MergeRequestsFilter.vue'
import type { MergeEmitPayload } from './partials/MergeRequestsTable.vue'
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

const currentProjectName = computed((): string => {
  if (filters.value.projectId === null) {
    return ''
  }
  return gitlabStore.projects.find((p) => p.id === filters.value.projectId)?.name ?? ''
})

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

const onMerge = async (payload: MergeEmitPayload): Promise<void> => {
  if (filters.value.projectId === null) {
    return
  }

  const { mergeRequest, squash } = payload

  try {
    const response = await gitlabApi.mergeBranch({
      projectId: filters.value.projectId,
      mergeRequestId: mergeRequest.mergeRequestId,
      title: mergeRequest.title,
      sourceBranch: mergeRequest.sourceBranch,
      targetBranch: mergeRequest.targetBranch,
      assignee: mergeRequest.assignee,
      approvedBy: (mergeRequest.approvedBy ?? []).length > 0,
      projectPath: mergeRequest.webUrl,
      projectName: currentProjectName.value,
      squash,
    })

    if (!response.isOK) {
      alert.showErrorDialog({ errors: response.errorMessages })
      return
    }

    alert.success(t('mergeRequests.title'), t('mergeRequests.mergeSuccess'))
    void fetchMergeRequests()
  } catch (error: unknown) {
    const apiErrors = extractApiErrorMessages(error)
    if (apiErrors.length > 0) {
      alert.showErrorDialog({ errors: apiErrors })
    } else {
      const message = error instanceof Error ? error.message : t('common.unexpectedError')
      alert.error(t('mergeRequests.title'), message)
    }
  }
}
</script>

<style scoped lang="scss">
.merge-requests-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
