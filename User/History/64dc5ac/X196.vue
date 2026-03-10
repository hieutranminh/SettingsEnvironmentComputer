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
        <Column field="title" :header="$t('mergeRequests.mergeTitle')" sortable class="col-title">
          <template #body="{ data }">
            <a :href="data.webUrl" target="_blank" rel="noopener noreferrer" class="mr-title-link">
              {{ data.title }}
            </a>
            <div class="mr-meta">
              <span class="mr-meta__info">MR ID: {{ data.mergeRequestId }}</span>
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
            <div class="branch-flow">
              <Tag :value="truncateBranch(data.sourceBranch)" severity="warn" />
              <i class="pi pi-arrow-right branch-flow__arrow" />
              <Tag :value="data.targetBranch" severity="success" />
            </div>
          </template>
        </Column>

        <Column :header="$t('mergeRequests.people')" class="col-people">
          <template #body="{ data }">
            <div class="mr-people">
              <div class="mr-people__row">
                <Avatar :image="data.author.avatarUrl" shape="circle" class="mr-people__avatar" />
                <div class="mr-people__info">
                  <span class="mr-people__name">{{ data.author.name }}</span>
                  <span class="mr-people__role">{{ $t('mergeRequests.author') }}</span>
                </div>
              </div>
              <div v-if="data.assignee" class="mr-people__row">
                <Avatar
                  :label="getInitials(data.assignee)"
                  shape="circle"
                  class="mr-people__avatar"
                />
                <div class="mr-people__info">
                  <span class="mr-people__name">{{ data.assignee }}</span>
                  <span class="mr-people__role">{{ $t('mergeRequests.assignee') }}</span>
                </div>
              </div>
            </div>
          </template>
        </Column>

        <Column :header="$t('mergeRequests.reviews')" class="col-reviews">
          <template #body="{ data }">
            <div v-if="data.approvedBy && data.approvedBy.length > 0" class="mr-people">
              <div v-for="approver in data.approvedBy" :key="approver.id" class="mr-people__row">
                <Avatar :image="approver.avatarUrl" shape="circle" class="mr-people__avatar" />
                <div class="mr-people__info">
                  <span class="mr-people__name">{{ approver.name }}</span>
                  <span class="mr-people__role">{{ $t('mergeRequests.approved') }}</span>
                </div>
              </div>
            </div>
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

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<style scoped lang="scss">
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

.branch-flow {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;

  &__arrow {
    color: var(--p-text-muted-color);
    font-size: 0.75rem;
  }
}

.mr-people {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__avatar {
    width: 28px !important;
    height: 28px !important;
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__name {
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__role {
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
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

:deep(.col-title) {
  min-width: 22rem;
}

:deep(.col-people) {
  width: 12rem;
  min-width: 12rem;
}

:deep(.col-reviews) {
  width: 9rem;
  min-width: 9rem;
}

:deep(.col-action) {
  width: 12rem;
  min-width: 12rem;
}
</style>
