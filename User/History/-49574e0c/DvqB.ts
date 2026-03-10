import { computed, ref } from 'vue'

import { DEFAULT_PROJECT_ID } from '@/constants/myIssues'

import { gitlabApi } from '@/api/services/gitlab'

import type { MergeRequestItem } from '@/types/gitlab'

export interface MergeRequestsFilters {
  projectId: number | null
  search: string | null
}

export const useMergeRequests = () => {
  const mergeRequests = ref<MergeRequestItem[]>([])
  const loadingMergeRequests = ref(false)

  const filters = ref<MergeRequestsFilters>({
    projectId: DEFAULT_PROJECT_ID,
    search: null,
  })

  const filteredMergeRequests = computed((): MergeRequestItem[] => {
    return mergeRequests.value.filter((mr: MergeRequestItem): boolean => {
      if (filters.value.search) {
        const query = filters.value.search.toLowerCase()
        const matchesId = String(mr.mergeRequestId).includes(query)
        const matchesTitle = mr.title.toLowerCase().includes(query)
        if (!matchesId && !matchesTitle) {
          return false
        }
      }

      return true
    })
  })

  const fetchMergeRequests = async (): Promise<void> => {
    if (filters.value.projectId === null) {
      mergeRequests.value = []
      return
    }

    loadingMergeRequests.value = true
    try {
      const response = await gitlabApi.getMergeRequests({
        projectId: filters.value.projectId,
      })
      if (!response.isOK) {
        const errorMsg = response.errorMessages[0]?.errorMessage ?? 'Failed to fetch merge requests'
        throw new Error(errorMsg)
      }
      mergeRequests.value = response.result?.mergeRequests ?? []
    } finally {
      loadingMergeRequests.value = false
    }
  }

  const updateFilter = <K extends keyof MergeRequestsFilters>(
    key: K,
    value: MergeRequestsFilters[K],
  ): void => {
    filters.value[key] = value
  }

  return {
    mergeRequests,
    filteredMergeRequests,
    loadingMergeRequests,
    filters,
    fetchMergeRequests,
    updateFilter,
  }
}
