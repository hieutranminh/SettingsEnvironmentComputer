<template>
  <div class="my-issues-view">
    <MyIssuesFilter
      :filters="filters"
      :project-options="projectOptions"
      :loading-projects="gitlabStore.loadingProjects"
      @update:project-id="onProjectChange"
      @update:search="updateFilter('search', $event)"
      @update:release-number="updateFilter('releaseNumber', $event)"
      @update:region="updateFilter('region', $event)"
      @update:status="updateFilter('status', $event)"
    />

    <MyIssuesTable
      :issues="filteredIssues"
      :loading="loadingIssues"
      @generate-branch="onGenerateBranch"
      @start-coding="onStartCoding"
      @create-mr="onCreateMr"
    />

    <GenerateBranchNameModal
      v-model:visible="branchModalVisible"
      :issue="selectedIssue"
      :release-number="filters.releaseNumber"
      :region="filters.region"
      @create-branch="onCreateBranchFromModal"
    />

    <CreateMergeRequestModal
      v-model:visible="mrModalVisible"
      :issue="selectedIssue"
      :source-branch-name="mrSourceBranch"
      @submit="onCreateMrFromModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useGitLabStore } from '@/stores/gitlab'

import { useAlert } from '@/composables/useAlert'
import { useI18n } from '@/composables/useI18n'

import { DOING_STATUS_LABEL } from '@/constants/myIssues'

import { gitlabApi } from '@/api/services/gitlab'
import type { CreateMrPayload } from '@/components/modals/CreateMergeRequestModal.vue'
import CreateMergeRequestModal from '@/components/modals/CreateMergeRequestModal.vue'
import GenerateBranchNameModal from '@/components/modals/GenerateBranchNameModal.vue'

import type { GitLabIssue } from '@/types/gitlab'

import { useMyIssues } from './composables/useMyIssues'
import MyIssuesFilter from './partials/MyIssuesFilter.vue'
import MyIssuesTable from './partials/MyIssuesTable.vue'

const { t } = useI18n()
const alert = useAlert()
const gitlabStore = useGitLabStore()
const { filters, filteredIssues, loadingIssues, fetchIssues, updateFilter, updateIssueStatus } =
  useMyIssues()

const branchModalVisible = ref(false)
const mrModalVisible = ref(false)
const mrSourceBranch = ref('')
const selectedIssue = ref<GitLabIssue | null>(null)

const projectOptions = computed(() =>
  gitlabStore.projects.map((project) => ({
    label: project.name,
    value: project.id,
  })),
)

onMounted(() => {
  if (filters.value.projectId !== null) {
    void fetchIssues()
  }
})

const onProjectChange = (value: number | null): void => {
  updateFilter('projectId', value)
  void fetchIssues()
}

const onGenerateBranch = (issue: GitLabIssue): void => {
  selectedIssue.value = issue
  branchModalVisible.value = true
}

const onStartCoding = async (issue: GitLabIssue): Promise<void> => {
  try {
    const response = await gitlabApi.startIssue({
      projectId: Number(issue.projectId),
      issueNumber: issue.issueNumber,
      projectPath: issue.webUrl,
    })

    if (!response.isOK) {
      const errorMessage = response.errorMessages[0]?.errorMessage ?? t('myIssues.startCodingError')
      alert.error(t('myIssues.title'), errorMessage)
      return
    }

    updateIssueStatus(issue.id, DOING_STATUS_LABEL)
    alert.success(t('myIssues.title'), t('myIssues.startCodingSuccess'))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : t('common.unexpectedError')
    alert.error(t('myIssues.title'), message)
  }
}

const onCreateMr = (issue: GitLabIssue): void => {
  selectedIssue.value = issue
  mrSourceBranch.value = ''
  mrModalVisible.value = true
}

const onCreateBranchFromModal = (payload: { branchName: string; basedBranch: string }): void => {
  mrSourceBranch.value = payload.branchName
}

const onCreateMrFromModal = (payload: CreateMrPayload): void => {
  // TODO: Integrate CreateMergeRequest API when endpoint is available
  console.warn('Create MR payload:', payload)
}
</script>

<style scoped lang="scss">
.my-issues-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
