<template>
  <DataTable
    data-key="id"
    :value="issues"
    :loading="loading"
    :rows="10"
    :rows-per-page-options="[10, 25, 50]"
    :paginator-template="PAGINATOR_TEMPLATE"
    :current-page-report-template="$t('myIssues.paginatorReport')"
    paginator
    striped-rows
    row-hover
  >
    <Column field="issueNumber" :header="$t('myIssues.issueNo')" sortable class="col-issue-no">
      <template #body="{ data }">
        <a :href="data.webUrl" target="_blank" rel="noopener noreferrer" class="issue-number-link">
          #{{ data.issueNumber }}
        </a>
      </template>
    </Column>

    <Column field="title" :header="$t('myIssues.issue')" sortable />

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
            :label="$t('myIssues.generateBranch')"
            icon="pi pi-code-branch"
            size="small"
            severity="info"
            outlined
            @click="emit('generateBranch', data)"
          />
          <Button
            v-tooltip.top="$t('myIssues.tooltipStartCoding')"
            :label="$t('myIssues.startCoding')"
            icon="pi pi-code"
            size="small"
            severity="success"
            outlined
            @click="emit('startCoding', data)"
          />
          <Button
            v-tooltip.top="$t('myIssues.tooltipCreateMr')"
            :label="$t('myIssues.createMr')"
            icon="pi pi-send"
            size="small"
            severity="warn"
            outlined
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
.issue-number-link {
  color: var(--p-primary-color);
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
}

.action-buttons {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

:deep(.col-issue-no) {
  width: 8rem;
}

:deep(.col-status) {
  width: 10rem;
}

:deep(.col-action) {
  width: 16rem;
}
</style>
