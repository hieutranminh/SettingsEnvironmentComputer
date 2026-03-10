<template>
  <Card>
    <template #content>
      <div class="my-issues-filter">
        <div class="my-issues-filter__field my-issues-filter__field--project">
          <SelectField
            :model-value="filters.projectId"
            name="projectName"
            :label="$t('myIssues.projectName')"
            :options="projectOptions"
            :placeholder="$t('myIssues.selectProject')"
            :loading="loadingProjects"
            filter
            show-clear
            @update:model-value="onProjectChange"
          />
        </div>

        <div class="my-issues-filter__field my-issues-filter__field--search">
          <InputTextField
            :model-value="filters.search"
            name="search"
            :label="$t('myIssues.search')"
            :placeholder="$t('myIssues.searchPlaceholder')"
            @update:model-value="onSearchChange"
          />
        </div>

        <div class="my-issues-filter__field my-issues-filter__field--status">
          <SelectField
            :model-value="filters.status"
            name="status"
            :label="$t('myIssues.status')"
            :options="statusOptions"
            :placeholder="$t('myIssues.selectStatus')"
            show-clear
            @update:model-value="onStatusChange"
          >
            <template #value="slotProps">
              <span
                v-if="slotProps.value"
                :value="getStatusLabel(slotProps.value)"
                :severity="getStatusSeverityByValue(slotProps.value)"
              />
              <span v-else>{{ $t('myIssues.selectStatus') }}</span>
            </template>
            <template #option="slotProps">
              <Tag :value="slotProps.option.label" :severity="slotProps.option.severity" />
            </template>
          </SelectField>
        </div>

        <div class="my-issues-filter__field my-issues-filter__field--narrow">
          <InputNumberField
            :model-value="filters.releaseNumber"
            name="releaseNumber"
            :label="$t('myIssues.releaseNumber')"
            :placeholder="$t('myIssues.enterReleaseNumber')"
            :max="9999"
            :max-length="4"
            :use-grouping="false"
            :precision="0"
            @update:model-value="onReleaseNumberChange"
          />
        </div>

        <div class="my-issues-filter__field my-issues-filter__field--narrow">
          <SelectField
            :model-value="filters.region"
            name="region"
            :label="$t('myIssues.region')"
            :options="regionOptions"
            :placeholder="$t('myIssues.selectRegion')"
            @update:model-value="onRegionChange"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { StatusSeverity } from '@/constants/myIssues'
import { REGION_OPTIONS, STATUS_OPTIONS, STATUS_SEVERITY_MAP } from '@/constants/myIssues'

import { InputNumberField, InputTextField, SelectField } from '@/components/common'

import type { MyIssuesFilters } from '../composables/useMyIssues'

interface ProjectOption {
  label: string
  value: number
}

interface Props {
  filters: MyIssuesFilters
  projectOptions: ProjectOption[]
  loadingProjects: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:projectId', value: number | null): void
  (event: 'update:search', value: string | null): void
  (event: 'update:releaseNumber', value: number | null): void
  (event: 'update:region', value: string | null): void
  (event: 'update:status', value: string | null): void
}>()

const regionOptions = [...REGION_OPTIONS]
const statusOptions = [...STATUS_OPTIONS]

const onProjectChange = (value: unknown): void => {
  emit('update:projectId', value as number | null)
}

const onSearchChange = (value: string | null): void => {
  emit('update:search', value)
}

const onReleaseNumberChange = (value: number | null): void => {
  emit('update:releaseNumber', value)
}

const onRegionChange = (value: unknown): void => {
  emit('update:region', value as string | null)
}

const onStatusChange = (value: unknown): void => {
  emit('update:status', value as string | null)
}

const getStatusLabel = (value: unknown): string => {
  const option = STATUS_OPTIONS.find((opt) => opt.value === value)
  return option?.label ?? String(value)
}

const getStatusSeverityByValue = (value: unknown): StatusSeverity | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }
  return STATUS_SEVERITY_MAP[value]
}
</script>

<style scoped lang="scss">
.my-issues-filter {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  align-items: end;
}

@include respond-below(lg) {
  .my-issues-filter {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@include respond-below(md) {
  .my-issues-filter {
    grid-template-columns: 1fr 1fr;
  }
}

@include respond-below(sm) {
  .my-issues-filter {
    grid-template-columns: 1fr;
  }
}
</style>
