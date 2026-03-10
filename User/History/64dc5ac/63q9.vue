<template>
  <Card>
    <template #content>
      <DataTable
        :first="first"
        data-key="id"
        :value="mergeRequests"
        :loading="loading"
        :rows="rows"
        :rows-per-page-options="[10, 25, 50]"
        :paginator-template="PAGINATOR_TEMPLATE"
        :current-page-report-template="$t('mergeRequests.paginatorReport')"
        show-gridlines
        paginator
        striped-rows
        row-hover
        @page="onPage"
      >
        <Column field="mergeRequestId" :header="$t('mergeRequests.id')" sortable class="col-id">
          <template #body="{ data }">
            <a :href="data.webUrl" target="_blank" rel="noopener noreferrer" class="mr-id-link">
              #{{ data.mergeRequestId }}
            </a>
          </template>
        </Column>

        <Column field="title" :header="$t('mergeRequests.mergeTitle')" sortable class="col-title">
          <template #body="{ data }">
            <a :href="data.webUrl" target="_blank" rel="noopener noreferrer" class="mr-title-link">
              {{ data.title }}
            </a>
            <div class="mr-meta">
              <span class="mr-meta__info"> MR ID: {{ data.mergeRequestId }} </span>
              <Tag
                v-if="data.milestone"
                :value="data.milestone.title"
                severity="info"
                class="mr-meta__milestone"
              />
              <span class="mr-meta__updated">
                {{ $t('mergeRequests.updatedAgo', { date: formatDate(data.updatedAt) }) }}
              </span>
            </div>
          </template>
        </Column>

        <Column :header="$t('mergeRequests.author')" class="col-author">
          <template #body="{ data }">
            <div class="mr-author">
              <Avatar :image="data.author.avatarUrl" shape="circle" class="mr-author__avatar" />
              <span class="mr-author__name">{{ data.author.name }}</span>
            </div>
          </template>
        </Column>

        <Column :header="$t('mergeRequests.sourceBranchFlow')" class="col-branch-flow">
          <template #body="{ data }">
            <div class="branch-flow">
              <Tag :value="truncateBranch(data.sourceBranch)" severity="warn" />
              <i class="pi pi-arrow-right branch-flow__arrow" />
              <Tag :value="data.targetBranch" severity="success" />
            </div>
          </template>
        </Column>

        <Column :header="$t('mergeRequests.assignee')" class="col-assignee">
          <template #body="{ data }">
            <span v-if="data.assignee" class="mr-assignee-name">{{ data.assignee }}</span>
            <span v-else class="text-muted">--</span>
          </template>
        </Column>

        <Column :header="$t('mergeRequests.action')" class="col-action" :exportable="false">
          <template #body="{ data }">
            <div class="action-buttons">
              <Button
                v-tooltip.top="$t('mergeRequests.aiReview')"
                :label="$t('mergeRequests.aiReview')"
                size="small"
                severity="info"
                outlined
                @click="emit('aiReview', data)"
              />
              <Button
                v-tooltip.top="$t('mergeRequests.merge')"
                :label="$t('mergeRequests.merge')"
                size="small"
                severity="success"
                @click="emit('merge', data)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <AppEmpty
            :title="$t('mergeRequests.noMergeRequests')"
            :message="$t('mergeRequests.noMergeRequestsMessage')"
          />
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { DateTime } from 'luxon'
import type { DataTablePageEvent } from 'primevue/datatable'

import { PAGINATOR_TEMPLATE } from '@/constants/myIssues'

import type { MergeRequestItem } from '@/types/gitlab'

interface Props {
  mergeRequests: MergeRequestItem[]
  loading: boolean
  first: number
}

defineProps<Props>()

const rows = ref(10)

const emit = defineEmits<{
  (event: 'update:first', value: number): void
  (event: 'aiReview', mr: MergeRequestItem): void
  (event: 'merge', mr: MergeRequestItem): void
}>()

const onPage = (event: DataTablePageEvent): void => {
  emit('update:first', event.first)
  rows.value = event.rows
}

const MAX_BRANCH_LENGTH = 20

const truncateBranch = (branch: string): string => {
  if (branch.length <= MAX_BRANCH_LENGTH) {
    return branch
  }
  return `${branch.slice(0, MAX_BRANCH_LENGTH)}...`
}

const formatDate = (dateStr: string): string => {
  const dt = DateTime.fromISO(dateStr)
  const diff = dt.diffNow('days').days
  const absDays = Math.abs(Math.floor(diff))

  if (absDays === 0) {
    return 'today'
  }
  if (absDays === 1) {
    return '1 day ago'
  }
  return `${absDays} days ago`
}
</script>

<style scoped lang="scss">
.mr-id-link {
  color: var(--p-primary-color);
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
}

.mr-title-link {
  color: var(--p-text-color);
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: var(--p-primary-color);
    text-decoration: underline;
  }
}

.mr-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.375rem;
  font-size: 0.85rem;
  align-items: center;
  flex-wrap: wrap;

  &__info {
    color: var(--p-text-muted-color);
    white-space: nowrap;
  }

  &__updated {
    color: var(--p-text-muted-color);
    white-space: nowrap;
  }
}

.mr-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__avatar {
    width: 28px !important;
    height: 28px !important;
  }

  &__name {
    font-size: 0.875rem;
    white-space: nowrap;
  }
}

.mr-assignee-name {
  font-size: 0.875rem;
}

.branch-flow {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;

  &__arrow {
    color: var(--p-text-muted-color);
    font-size: 0.75rem;
  }
}

.mr-reviews {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &__avatars {
    display: flex;
    gap: 0.25rem;
  }

  &__avatar {
    width: 24px !important;
    height: 24px !important;
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.text-muted {
  color: var(--p-text-muted-color);
}

:deep(.col-id) {
  width: 5rem;
  min-width: 5rem;
}

:deep(.col-title) {
  min-width: 18rem;
}

:deep(.col-author) {
  width: 10rem;
  min-width: 10rem;
}

:deep(.col-branch-flow) {
  width: 16rem;
  min-width: 16rem;
}

:deep(.col-assignee) {
  width: 8rem;
  min-width: 8rem;
}

:deep(.col-reviews) {
  width: 10rem;
  min-width: 10rem;
}

:deep(.col-action) {
  width: 12rem;
  min-width: 12rem;
}
</style>
