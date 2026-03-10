import { computed, ref } from 'vue'

import { DEFAULT_PROJECT_ID } from '@/constants/myIssues'

import { gitlabApi } from '@/api/services/gitlab'

import type { GitLabIssue } from '@/types/gitlab'

export interface MyIssuesFilters {
  projectId: number | null
  releaseNumber: number | null
  region: string | null
  status: string | null
}

export function useMyIssues() {
  const issues = ref<GitLabIssue[]>([])
  const loadingIssues = ref(false)

  const filters = ref<MyIssuesFilters>({
    projectId: DEFAULT_PROJECT_ID,
    releaseNumber: null,
    region: null,
    status: null,
  })

  const filteredIssues = computed((): GitLabIssue[] => {
    return issues.value.filter((issue: GitLabIssue): boolean => {
      if (filters.value.status && !issue.labels.includes(filters.value.status)) {
        return false
      }

      return true
    })
  })

  async function fetchIssues(): Promise<void> {
    if (filters.value.projectId === null) {
      issues.value = []
      return
    }

    loadingIssues.value = true
    try {
      const response = await gitlabApi.getIssuesByUser({
        projectId: filters.value.projectId,
        issueState: 0,
      })
      if (!response.isOK) {
        const errorMsg = response.errorMessages[0]?.errorMessage ?? 'Failed to fetch issues'
        throw new Error(errorMsg)
      }
      issues.value = response.result?.issues ?? []
    } finally {
      loadingIssues.value = false
    }
  }

  function updateFilter<K extends keyof MyIssuesFilters>(key: K, value: MyIssuesFilters[K]): void {
    filters.value[key] = value
  }

  return {
    issues,
    loadingIssues,
    filters,
    filteredIssues,
    fetchIssues,
    updateFilter,
  }
}
