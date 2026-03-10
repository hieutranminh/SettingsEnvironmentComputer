import { computed, ref } from 'vue'

import {
  DEFAULT_PROJECT_ID,
  DOING_STATUS_LABEL,
  REGION_OPTIONS,
  STATUS_VALUES,
} from '@/constants/myIssues'
import { APP_STORAGE_KEYS } from '@/constants/storageKeys'

import { gitlabApi } from '@/api/services/gitlab'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/utils/storageUtils'

import type { GitLabIssue } from '@/types/gitlab'

export interface MyIssuesFilters {
  projectId: number | null
  search: string | null
  releaseNumber: number | null
  region: string | null
  status: string | null
}

export const useMyIssues = () => {
  const issues = ref<GitLabIssue[]>([])
  const loadingIssues = ref(false)

  const filters = ref<MyIssuesFilters>({
    projectId:
      getLocalStorageItem<number>(APP_STORAGE_KEYS.SELECTED_PROJECT_ID) ?? DEFAULT_PROJECT_ID,
    search: null,
    releaseNumber: 0,
    region: REGION_OPTIONS[0].value,
    status: null,
  })

  const filteredIssues = computed((): GitLabIssue[] => {
    return issues.value.filter((issue: GitLabIssue): boolean => {
      if (filters.value.search) {
        const query = filters.value.search.toLowerCase()
        const matchesNumber = String(issue.issueNumber).includes(query)
        const matchesTitle = issue.title.toLowerCase().includes(query)
        if (!matchesNumber && !matchesTitle) {
          return false
        }
      }

      if (filters.value.status && !issue.labels.includes(filters.value.status)) {
        return false
      }

      return true
    })
  })

  const fetchIssues = async (): Promise<void> => {
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

  const updateFilter = <K extends keyof MyIssuesFilters>(
    key: K,
    value: MyIssuesFilters[K],
  ): void => {
    filters.value[key] = value
    if (key === 'projectId') {
      if (value === null) {
        removeLocalStorageItem(APP_STORAGE_KEYS.SELECTED_PROJECT_ID)
      } else {
        setLocalStorageItem(APP_STORAGE_KEYS.SELECTED_PROJECT_ID, value)
      }
    }
  }

  const updateIssueStatus = (issueId: number, newStatus: string): void => {
    const issue = issues.value.find((i) => i.id === issueId)
    if (!issue) {
      return
    }
    issue.labels = [...issue.labels.filter((label) => !STATUS_VALUES.has(label)), newStatus]
  }

  const startIssue = async (issue: GitLabIssue): Promise<void> => {
    const response = await gitlabApi.startIssue({
      projectId: Number(issue.projectId),
      issueNumber: issue.issueNumber,
      projectPath: issue.webUrl,
    })

    if (!response.isOK) {
      const errorMsg = response.errorMessages[0]?.errorMessage ?? 'Failed to start issue'
      throw new Error(errorMsg)
    }

    updateIssueStatus(issue.id, DOING_STATUS_LABEL)
  }

  return {
    issues,
    loadingIssues,
    filters,
    filteredIssues,
    fetchIssues,
    updateFilter,
    updateIssueStatus,
    startIssue,
  }
}
