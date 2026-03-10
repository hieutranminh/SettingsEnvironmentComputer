<template>
  <div class="my-issues-view">
    <h2>{{ $t('myIssues.title') }}</h2>

    <MyIssuesFilter
      :filters="filters"
      :project-options="projectOptions"
      :loading-projects="gitlabStore.loadingProjects"
      @update:project-id="onProjectChange"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useGitLabStore } from '@/stores/gitlab'

import type { GitLabIssue } from '@/types/gitlab'

import { useMyIssues } from './composables/useMyIssues'
import MyIssuesFilter from './partials/MyIssuesFilter.vue'
import MyIssuesTable from './partials/MyIssuesTable.vue'

const gitlabStore = useGitLabStore()
const { filters, filteredIssues, loadingIssues, fetchIssues, updateFilter } = useMyIssues()

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

function onProjectChange(value: number | null): void {
  updateFilter('projectId', value)
  void fetchIssues()
}

function onGenerateBranch(issue: GitLabIssue): void {
  // TODO: Implement generate branch logic
  console.warn('Generate Branch not implemented:', issue.issueNumber, issue.title)
}

function onStartCoding(issue: GitLabIssue): void {
  // TODO: Implement start coding logic
  console.warn('Start Coding not implemented:', issue.issueNumber, issue.title)
}

function onCreateMr(issue: GitLabIssue): void {
  // TODO: Implement create MR logic
  console.warn('Create MR not implemented:', issue.issueNumber, issue.title)
}
</script>

<style scoped lang="scss">
.my-issues-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h2 {
    margin: 0;
    color: var(--p-text-color);
  }
}
</style>
