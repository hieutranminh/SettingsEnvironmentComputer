<template>
  <Card>
    <template #content>
      <DataTable
        :first="first"
        data-key="id"
        :value="issues"
        :loading="loading"
        :rows="rows"
        :rows-per-page-options="[10, 25, 50]"
        :paginator-template="PAGINATOR_TEMPLATE"
        :current-page-report-template="$t('myIssues.paginatorReport')"
        show-gridlines
        paginator
        striped-rows
        row-hover
        @page="onPage"
      >
        <Column field="issueNumber" :header="$t('myIssues.issueNo')" sortable class="col-issue-no">
          <template #body="{ data }">
            <a :href="data.webUrl" target="_blank" rel="noopener noreferrer" class="issue-link">
              #{{ data.issueNumber }}
            </a>
          </template>
        </Column>

        <Column field="title" :header="$t('myIssues.issue')" sortable class="col-title">
          <template #body="{ data }">
            <a
              :href="data.webUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="issue-title-link"
            >
              {{ data.title }}
            </a>

            <div class="issue-meta">
              <span class="issue-meta__created-by">
                {{ $t('myIssues.createdBy') }}
                <a
                  :href="data.author.webUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="issue-meta__author-link"
                >
                  {{ data.author.name }}
                </a>
              </span>
              <div class="issue-meta__assignees">
                <Avatar
                  v-for="assignee in data.assignees"
                  :key="assignee.id"
                  v-tooltip.right="
                    $t('myIssues.tooltipAssignedTo', {
                      name: assignee.name,
                      username: assignee.username,
                    })
                  "
                  :image="assignee.avatarUrl"
                  shape="circle"
                  class="issue-meta__assignee-avatar"
                />
              </div>
            </div>
          </template>
        </Column>

        <Column :header="$t('myIssues.status')" class="col-status">
          <template #body="{ data }">
            <Tag
              v-if="getIssueStatus(data)"
              :value="getIssueStatus(data)"
              :severity="getStatusSeverity(getIssueStatus(data))"
            />
            <span v-else class="text-muted">--</span>
          </template>
        </Column>

        <Column :header="$t('myIssues.actions')" class="col-action" :exportable="false">
          <template #body="{ data }">
            <div class="action-buttons">
              <Button
                v-tooltip.top="$t('myIssues.tooltipGenerateBranch')"
                :label="$t('myIssues.generateBranch')"
                size="small"
                severity="info"
                @click="emit('generateBranch', data)"
              />
              <Button
                v-tooltip.top="$t('myIssues.tooltipStartCoding')"
                :label="$t('myIssues.startCoding')"
                size="small"
                severity="success"
                @click="emit('startCoding', data)"
              />
              <Button
                v-tooltip.top="$t('myIssues.tooltipCreateMr')"
                :label="$t('myIssues.createMr')"
                size="small"
                severity="danger"
                @click="emit('createMr', data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <AppEmpty :title="$t('myIssues.noIssues')" :message="$t('myIssues.noIssuesMessage')" />
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { DataTablePageEvent } from 'primevue/datatable'

import type { StatusSeverity } from '@/constants/myIssues'
import { PAGINATOR_TEMPLATE, STATUS_SEVERITY_MAP, STATUS_VALUES } from '@/constants/myIssues'

import type { GitLabIssue } from '@/types/gitlab'

interface Props {
  issues: GitLabIssue[]
  loading: boolean
  first: number
}

defineProps<Props>()

const rows = ref(10)

const emit = defineEmits<{
  (event: 'update:first', value: number): void
  (event: 'generateBranch', issue: GitLabIssue): void
  (event: 'startCoding', issue: GitLabIssue): void
  (event: 'createMr', issue: GitLabIssue): void
}>()

const onPage = (event: DataTablePageEvent): void => {
  emit('update:first', event.first)
  rows.value = event.rows
}

const getIssueStatus = (issue: GitLabIssue): string | null => {
  return issue.labels.find((label) => STATUS_VALUES.has(label)) ?? null
}

const getStatusSeverity = (status: string | null): StatusSeverity | undefined => {
  if (status === null) {
    return undefined
  }
  return STATUS_SEVERITY_MAP[status] ?? 'secondary'
}
</script>

<style scoped lang="scss">
.issue-link {
  color: var(--p-primary-color);
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
}

.issue-title-link {
  color: var(--p-text-color);
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: var(--p-primary-color);
    text-decoration: underline;
  }
}

.issue-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.375rem;
  font-size: 0.85rem;
  flex-direction: column;

  &__created-by {
    color: var(--p-text-muted-color);
    white-space: nowrap;
  }

  &__author-link {
    color: var(--p-primary-color);
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__assignees {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

:deep(.col-issue-no) {
  width: 8rem;
  min-width: 8rem;
}

:deep(.col-title) {
  min-width: 20rem;
}

:deep(.col-status) {
  width: 8rem;
  min-width: 8rem;
}

:deep(.col-action) {
  width: 9rem;
  min-width: 9rem;
}
</style>
