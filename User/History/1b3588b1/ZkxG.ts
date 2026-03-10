import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { gitlabApi } from '@/api/services/gitlab'

import type { GitLabIssue, GitLabProject } from '@/types/gitlab'

export interface MyIssuesFilters {
  projectId: number | null
  releaseNumber: number | null
  region: string | null
  status: string | null
}

export const REGION_OPTIONS = [
  { label: 'VN', value: 'VN' },
  { label: 'KR', value: 'KR' },
] as const

export const STATUS_OPTIONS = [
  { label: 'Todo', value: 'Todo' },
  { label: 'Verifying', value: 'Verifying' },
  { label: 'Merging', value: 'Merging' },
] as const

export const useMyIssuesStore = defineStore('myIssues', () => {
  const projects = ref<GitLabProject[]>([])
  const issues = ref<GitLabIssue[]>([])
  const loadingProjects = ref(false)
  const loadingIssues = ref(false)

  const filters = ref<MyIssuesFilters>({
    projectId: null,
    releaseNumber: null,
    region: null,
    status: null,
  })

  const filteredIssues = computed((): GitLabIssue[] => {
    return issues.value.filter((issue: GitLabIssue): boolean => {
      if (filters.value.region && !issue.labels.includes(filters.value.region)) {
        return false
      }

      if (filters.value.status && !issue.labels.includes(filters.value.status)) {
        return false
      }

      if (filters.value.releaseNumber !== null && filters.value.releaseNumber !== undefined) {
        const milestoneRelease = issue.milestone?.releaseNumber
        if (!milestoneRelease || milestoneRelease !== String(filters.value.releaseNumber)) {
          return false
        }
      }

      return true
    })
  })

  async function fetchProjects(): Promise<void> {
    loadingProjects.value = true
    try {
      const response = await gitlabApi.getProjects()
      if (response.isOK && response.result) {
        projects.value = response.result.projects
      } else {
        const errorMsg = response.errorMessages[0]?.errorMessage ?? 'Failed to fetch projects'
        throw new Error(errorMsg)
      }
    } finally {
      loadingProjects.value = false
    }
  }

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
      if (response.isOK && response.result) {
        issues.value = response.result.issues
      } else {
        const errorMsg = response.errorMessages[0]?.errorMessage ?? 'Failed to fetch issues'
        throw new Error(errorMsg)
      }
    } finally {
      loadingIssues.value = false
    }
  }

  return {
    projects,
    issues,
    loadingProjects,
    loadingIssues,
    filters,
    filteredIssues,
    fetchProjects,
    fetchIssues,
  }
})
