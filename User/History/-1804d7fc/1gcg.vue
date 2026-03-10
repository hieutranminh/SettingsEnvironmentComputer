<template>
  <DataTable
    :value="issues"
    data-key="id"
    :loading="loading"
    paginator
    :rows="10"
    :rows-per-page-options="[10, 25, 50]"
    striped-rows
    row-hover
    :paginator-template="PAGINATOR_TEMPLATE"
    current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
  >
    <Column field="issueNumber" header="Issue No" sortable :style="{ width: '8rem' }">
      <template #body="{ data }">
        <a :href="data.webUrl" target="_blank" rel="noopener noreferrer" class="issue-number-link">
          #{{ data.issueNumber }}
        </a>
      </template>
    </Column>

    <Column field="title" header="Issue" sortable />

    <Column header="Status" :style="{ width: '10rem' }">
      <template #body="{ data }">
        <Tag
          v-if="getIssueStatus(data)"
          :value="getIssueStatus(data)"
          :severity="getStatusSeverity(getIssueStatus(data))"
        />
        <span v-else class="text-muted">--</span>
      </template>
    </Column>

    <Column header="Action" :style="{ width: '16rem' }" :exportable="false">
      <template #body="{ data }">
        <div class="action-buttons">
          <Button
            v-tooltip.top="'Generate Branch'"
            label="Branch"
            icon="pi pi-code-branch"
            size="small"
            severity="info"
            outlined
            @click="emit('generateBranch', data)"
          />
          <Button
            v-tooltip.top="'Start Coding'"
            label="Code"
            icon="pi pi-code"
            size="small"
            severity="success"
            outlined
            @click="emit('startCoding', data)"
          />
          <Button
            v-tooltip.top="'Create MR'"
            label="MR"
            icon="pi pi-send"
            size="small"
            severity="warn"
            outlined
            @click="emit('createMR', data)"
          />
        </div>
      </template>
    </Column>

    <template #empty>
      <AppEmpty title="No issues" message="Select a project to view your assigned issues." />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { STATUS_OPTIONS } from '@/stores/myIssues'

import type { GitLabIssue } from '@/types/gitlab'

const PAGINATOR_TEMPLATE =
  'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'

const STATUS_VALUES = new Set(STATUS_OPTIONS.map((opt) => opt.value))

interface Props {
  issues: GitLabIssue[]
  loading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'generateBranch', issue: GitLabIssue): void
  (event: 'startCoding', issue: GitLabIssue): void
  (event: 'createMR', issue: GitLabIssue): void
}>()

function getIssueStatus(issue: GitLabIssue): string | null {
  return issue.labels.find((label) => STATUS_VALUES.has(label)) ?? null
}

function getStatusSeverity(
  status: string | null,
): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | undefined {
  switch (status) {
    case 'Todo':
      return 'info'
    case 'Verifying':
      return 'warn'
    case 'Merging':
      return 'success'
    default:
      return 'secondary'
  }
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
</style>
