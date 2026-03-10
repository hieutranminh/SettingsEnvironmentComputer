<template>
  <div class="my-issues-view">
    <h2>My Issues</h2>

    <MyIssuesFilter />

    <MyIssuesTable
      :issues="store.filteredIssues"
      :loading="store.loadingIssues"
      @generate-branch="onGenerateBranch"
      @start-coding="onStartCoding"
      @create-m-r="onCreateMR"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { useMyIssuesStore } from '@/stores/myIssues'

import type { GitLabIssue } from '@/types/gitlab'

import MyIssuesFilter from './partials/MyIssuesFilter.vue'
import MyIssuesTable from './partials/MyIssuesTable.vue'

const store = useMyIssuesStore()

onMounted(() => {
  void store.fetchProjects()
})

function onGenerateBranch(issue: GitLabIssue): void {
  // TODO: Implement generate branch logic
  console.log('Generate Branch:', issue.issueNumber, issue.title)
}

function onStartCoding(issue: GitLabIssue): void {
  // TODO: Implement start coding logic
  console.log('Start Coding:', issue.issueNumber, issue.title)
}

function onCreateMR(issue: GitLabIssue): void {
  // TODO: Implement create MR logic
  console.log('Create MR:', issue.issueNumber, issue.title)
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
