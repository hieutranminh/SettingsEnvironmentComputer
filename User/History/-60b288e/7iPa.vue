<template>
  <Card class="branches-filter" data-testid="branches-filter">
    <template #content>
      <div class="filter-row">
        <div class="filter-group" data-testid="filter-group-branch-type">
          <label class="filter-label">{{ $t('branch.branch-type') }}</label>
          <Dropdown
            :modelValue="props.filterData.customBranchTypeId"
            :options="branchTypeOptions"
            optionLabel="name"
            optionValue="id"
            class="filter-input"
            data-testid="filter-dropdown-branch-type"
            :placeholder="$t('general.all-select')"
            @update:modelValue="
              (value: number) =>
                emit('update:filterData', { ...props.filterData, customBranchTypeId: value })
            "
          />
        </div>

        <div class="filter-group" data-testid="filter-group-branch-group">
          <label class="filter-label">{{ $t('branch.branch-group') }}</label>
          <Dropdown
            :modelValue="props.filterData.branchGroupId"
            :options="branchGroupOptions"
            optionLabel="name"
            optionValue="id"
            class="filter-input"
            data-testid="filter-dropdown-branch-group"
            :placeholder="$t('general.all-select')"
            @update:modelValue="
              (value: number) =>
                emit('update:filterData', { ...props.filterData, branchGroupId: value })
            "
          />
        </div>

        <div class="filter-group" data-testid="filter-group-branch-name">
          <label class="filter-label">{{ $t('branch.branch-name') }}</label>
          <InputText
            :modelValue="props.filterData.branchName"
            :maxlength="MAX_BRANCH_NAME_LENGTH"
            class="filter-input"
            data-testid="filter-input-branch-name"
            @update:modelValue="
              (value: string | undefined) =>
                emit('update:filterData', { ...props.filterData, branchName: value ?? '' })
            "
          />
        </div>

        <div class="filter-actions">
          <Button
            class="search-btn"
            severity="info"
            icon="pi pi-search"
            :label="t('general.search')"
            data-testid="filter-button-search"
            @click="handleSearch"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { IBranchesFilter } from '@/composables/branches/useBranches'
import { FILTER_VALUES } from '@/constants'
import type { IBranchGroup } from '@/types/admins/BranchGroup'
import type { ICustomBranchType } from '@/types/admins/CustomBranchType'

// Props
const props = defineProps<{
  filterData: IBranchesFilter
  branchTypes: ICustomBranchType[]
  branchGroups: IBranchGroup[]
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:filterData', value: IBranchesFilter): void
  (e: 'search'): void
}>()

// Constants
const MAX_BRANCH_NAME_LENGTH = 200

// Helpers
const { t } = useI18n()

// Computed
const branchTypeOptions = computed(() => {
  const all = { id: FILTER_VALUES.ALL, name: t('general.all') }
  return [all, ...props.branchTypes]
})

const branchGroupOptions = computed(() => {
  const all = { id: FILTER_VALUES.ALL, name: t('general.all') }
  return [all, ...props.branchGroups]
})

// Methods
const handleSearch = (): void => emit('search')
</script>

<style scoped lang="scss">
.branches-filter {
  padding: 10px;

  .filter-row {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 10px;

    .filter-label {
      @include maxResponsive(smallMobile) {
        min-width: 110px;
      }
    }

    .filter-input {
      width: 180px;
    }
  }

  .filter-actions {
    margin-left: auto;

    @include mobile {
      margin: auto;
    }

    .search-btn {
      border: none;
      min-width: 120px;
    }
  }
}
</style>
