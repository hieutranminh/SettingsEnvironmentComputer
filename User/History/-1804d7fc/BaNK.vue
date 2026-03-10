<template>
  <Card>
    <template #content>
      <DataTable
        data-key="id"
        :value="issues"
        :loading="loading"
        :rows="10"
        :rows-per-page-options="[10, 25, 50]"
        :paginator-template="PAGINATOR_TEMPLATE"
        :current-page-report-template="$t('myIssues.paginatorReport')"
        show-gridlines
        paginator
        striped-rows
        row-hover
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

        <Column :header="$t('myIssues.action')" class="col-action" :exportable="false">
          <template #body="{ data }">
            <div class="action-buttons">
              <Button
                v-tooltip.top="$t('myIssues.tooltipGenerateBranch')"
                icon="pi pi-code-branch"
                size="small"
                severity="info"
                text
                rounded
                @click="emit('generateBranch', data)"
              />
              <Button
                v-tooltip.top="$t('myIssues.tooltipStartCoding')"
                icon="pi pi-code"
                size="small"
                severity="success"
                text
                rounded
                @click="emit('startCoding', data)"
              />
              <Button
                v-tooltip.top="$t('myIssues.tooltipCreateMr')"
                icon="pi pi-send"
                size="small"
                severity="warn"
                text
                rounded
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
import type { StatusSeverity } from '@/constants/myIssues'
import { PAGINATOR_TEMPLATE, STATUS_SEVERITY_MAP, STATUS_VALUES } from '@/constants/myIssues'

import type { GitLabIssue } from '@/types/gitlab'

interface Props {
  issues: GitLabIssue[]
  loading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'generateBranch', issue: GitLabIssue): void
  (event: 'startCoding', issue: GitLabIssue): void
  (event: 'createMr', issue: GitLabIssue): void
}>()

function getIssueStatus(issue: GitLabIssue): string | null {
  return issue.labels.find((label) => STATUS_VALUES.has(label)) ?? null
}

function getStatusSeverity(status: string | null): StatusSeverity | undefined {
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

.action-buttons {
  display: flex;
  gap: 1rem;
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
