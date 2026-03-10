<template>
  <Card>
    <template #content>
      <div class="mr-filter">
        <div class="mr-filter__field">
          <SelectField
            :model-value="filters.projectId"
            name="projectName"
            :label="$t('mergeRequests.projectName')"
            :options="projectOptions"
            :placeholder="$t('mergeRequests.selectProject')"
            :loading="loadingProjects"
            filter
            show-clear
            @update:model-value="onProjectChange"
          />
        </div>

        <div class="mr-filter__field">
          <InputTextField
            :model-value="filters.search"
            name="search"
            :label="$t('mergeRequests.search')"
            :placeholder="$t('mergeRequests.searchPlaceholder')"
            @update:model-value="onSearchChange"
          />
        </div>

        <div class="mr-filter__field">
          <SelectField
            :model-value="filters.author"
            name="author"
            :label="$t('mergeRequests.filterByAuthor')"
            :options="authorOptions"
            :placeholder="$t('mergeRequests.selectAuthor')"
            show-clear
            @update:model-value="onAuthorChange"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { InputTextField, SelectField } from '@/components/common'

import type { MergeRequestsFilters } from '../composables/useMergeRequests'

interface ProjectOption {
  label: string
  value: number
}

interface AuthorOption {
  label: string
  value: string
}

interface Props {
  filters: MergeRequestsFilters
  projectOptions: ProjectOption[]
  authorOptions: AuthorOption[]
  loadingProjects: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:projectId', value: number | null): void
  (event: 'update:search', value: string | null): void
  (event: 'update:author', value: string | null): void
}>()

const onProjectChange = (value: unknown): void => {
  emit('update:projectId', value as number | null)
}

const onSearchChange = (value: string | null): void => {
  emit('update:search', value)
}

const onAuthorChange = (value: unknown): void => {
  emit('update:author', value as string | null)
}
</script>

<style scoped lang="scss">
.mr-filter {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  align-items: end;
}

@include respond-below(lg) {
  .mr-filter {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@include respond-below(md) {
  .mr-filter {
    grid-template-columns: 1fr 1fr;
  }
}

@include respond-below(sm) {
  .mr-filter {
    grid-template-columns: 1fr;
  }
}
</style>
