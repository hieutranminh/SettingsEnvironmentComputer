<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-group">
            <div class="filter-form-item">
              <label for="branch-type-select">{{
                $t('branch-prepaid-goods.label-branch-type')
              }}</label>
              <Select
                v-model="customBranchTypeIdModel"
                :options="branchTypeOptions"
                :loading="isLoadingBranchTypes"
                optionLabel="name"
                optionValue="id"
                @update:modelValue="handleBranchTypeChange"
              />
            </div>
            <div class="filter-form-item">
              <label for="branch-group-select">{{
                $t('branch-prepaid-goods.label-branch-group')
              }}</label>
              <Select
                v-model="branchGroupIdModel"
                :options="branchGroupOptions"
                :loading="isLoadingBranchGroups"
                optionLabel="name"
                optionValue="id"
                @update:modelValue="handleBranchGroupChange"
              />
            </div>
            <div class="filter-form-item">
              <label for="branch-select">{{ $t('branch-prepaid-goods.label-branch') }}</label>
              <MultiSelect
                v-model="localFilters.branchShopIds"
                :options="branchShopOptions"
                :loading="isLoadingBranchShops"
                :maxSelectedLabels="1"
                :disabled="!branchShopOptions.length"
                :placeholder="
                  branchShopOptions.length ? $t('general.all') : $t('general.empty-selection')
                "
                scrollHeight="350px"
                appendTo="self"
                optionLabel="name"
                optionValue="id"
                filter
                @update:modelValue="handleBranchChange"
              >
                <template #value="slotProps">
                  <span v-if="isAllSelected">{{ slotProps.placeholder }}</span>
                </template>
              </MultiSelect>
            </div>
            <div class="filter-form-item">
              <label for="branch-name-input">{{
                $t('branch-prepaid-goods.label-branch-name')
              }}</label>
              <InputText
                v-model="localFilters.branchName"
                @update:modelValue="handleBranchNameChange"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="filter-action">
          <Button :label="$t('general.button-search')" @click="handleSearchClick" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Composables
import { useBranchGroups } from '@/composables/useBranchGroups'
import { useBranchSalesTotalFilter } from '@/composables/useBranchSalesTotalFilter'
import { useCustomBranchTypes } from '@/composables/useCustomBranchTypes'
import { useModelBinding, useStringModelBinding } from '@/composables/useModelBinding'
// Constants
import { FILTER_VALUES } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { IBranchPrepaidGoodsFilter } from '@/types/sales-report/BranchPrepaidGoods'
// Utils
import { createSelectOptions } from '@/utils/selectUtils'

// Component interface definitions
interface Props {
  /** Initial filter values passed from parent component */
  modelValue: IBranchPrepaidGoodsFilter
}

interface Emits {
  (e: 'update:modelValue', value: IBranchPrepaidGoodsFilter): void
  (e: 'filtersChanged', value: IBranchPrepaidGoodsFilter): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables for data management and authentication
const authStore = useAuthStore()
const {
  customBranchTypes,
  isLoading: isLoadingBranchTypes,
  fetchBranchTypes,
} = useCustomBranchTypes()
const { branchGroups, isLoading: isLoadingBranchGroups, fetchBranchGroups } = useBranchGroups()
const {
  branchSalesTotalFilter,
  isLoading: isLoadingBranchShops,
  fetchBranchSalesTotalFilter,
} = useBranchSalesTotalFilter()
const { t } = useI18n()

// Model bindings using composable
const customBranchTypeIdModel = useModelBinding(props, emit, 'customBranchTypeId')
const branchGroupIdModel = useModelBinding(props, emit, 'branchGroupId')
const branchShopIdsModel = useModelBinding(props, emit, 'branchShopIds', { branchName: '' })
const branchNameModel = useStringModelBinding(props, emit, 'branchName')

const branchTypeOptions = computed(() =>
  createSelectOptions({
    items: customBranchTypes.value,
    labelKey: 'name',
    valueKey: 'id',
    allLabel: t('general.all'),
  }),
)

const branchGroupOptions = computed(() =>
  createSelectOptions({
    items: branchGroups.value,
    labelKey: 'name',
    valueKey: 'id',
    allLabel: t('general.all'),
  }),
)
/**
 * Filtered branch shop items based on selected branch type and group
 * Uses early returns for performance optimization when "All" is selected
 */
const filteredBranchShopItems = computed(() => {
  const { customBranchTypeId, branchGroupId } = props.modelValue

  // Early return for "All" selections to avoid unnecessary filtering
  if (customBranchTypeId === FILTER_VALUES.ALL && branchGroupId === FILTER_VALUES.ALL)
    return branchSalesTotalFilter.value

  // Filter items based on selected branch type and group
  // Only applies filtering when specific values are selected (not "All")
  return branchSalesTotalFilter.value.filter((item) => {
    const matchesBranchType =
      customBranchTypeId === FILTER_VALUES.ALL || item.customBranchTypeId === customBranchTypeId
    const matchesBranchGroup =
      branchGroupId === FILTER_VALUES.ALL || item.branchGroupId === branchGroupId
    return matchesBranchType && matchesBranchGroup
  })
})

/**
 * Branch shop options formatted for the MultiSelect component
 * Maps filtered items to the format expected by the dropdown
 */
const branchShopOptions = computed(() =>
  filteredBranchShopItems.value.map((item) => ({
    id: item.branchShopId,
    name: item.branchShopName,
  })),
)

const isAllSelected = computed(() => {
  return props.modelValue.branchShopIds.length === branchShopOptions.value.length
})

// Event handlers

/**
 * Handles search button click
 * Emits current filter state to parent component for data fetching
 */
const handleSearchClick = (): void => {
  emit('filtersChanged', { ...localFilters } as IBranchPrepaidGoodsFilter)
}

/**
 * Updates branch shop selection when filters change
 * Clears branch name input and selects all available shops based on current filters
 */
const updateBranchShopSelection = (): void => {
  // Clear branch name when filter changes to avoid inconsistent state
  localFilters.branchName = ''

  // Update branch shop IDs to match filtered options
  // This ensures selected shops are always valid for current filter combination
  localFilters.branchShopIds = filteredBranchShopItems.value.map((item) => item.branchShopId)
}

/**
 * Handles branch type dropdown change
 * Triggers branch shop selection update to maintain filter consistency
 */
const handleBranchTypeChange = (): void => {
  updateBranchShopSelection()
}

/**
 * Handles branch group dropdown change
 * Triggers branch shop selection update to maintain filter consistency
 */
const handleBranchGroupChange = (): void => {
  updateBranchShopSelection()
}

/**
 * Handles branch dropdown change
 * Triggers branch shop selection update to maintain filter consistency
 */
const handleBranchChange = (): void => {
  // Clear branch name when filter changes to avoid inconsistent state
  localFilters.branchName = ''
}

/**
 * Handles branch name input change
 * Triggers branch shop selection update to maintain filter consistency
 */
const handleBranchNameChange = (): void => {
  localFilters.customBranchTypeId = FILTER_VALUES.ALL
  localFilters.branchGroupId = FILTER_VALUES.ALL

  // Update branch shop IDs to match filtered options
  // This ensures selected shops are always valid for current filter combination
  localFilters.branchShopIds = filteredBranchShopItems.value.map((item) => item.branchShopId)
}

// Initialization functions

/**
 * Fetches custom branch types for the current chain
 * Used during component initialization
 */
const initializeBranchTypes = async (): Promise<void> => {
  await fetchBranchTypes({ chainId: authStore.shop.chainId })
}

/**
 * Fetches branch groups for the current chain
 * Used during component initialization
 */
const initializeBranchGroups = async (): Promise<void> => {
  await fetchBranchGroups({ chainId: authStore.shop.chainId })
}

/**
 * Fetches branch shop data and initializes shop selection
 * Sets up initial branch shop IDs based on available filtered items
 */
const initializeBranchShops = async (): Promise<void> => {
  await fetchBranchSalesTotalFilter({ shopId: authStore.shop.shopId })
  // Use the same logic as filter changes for consistency
  localFilters.branchShopIds = filteredBranchShopItems.value.map((item) => item.branchShopId)
}

/**
 * Main initialization function that sets up all filter data
 * Fetches all required data in parallel and emits initial filter state
 */
const initializeFilters = async (): Promise<void> => {
  // Fetch all data in parallel for better performance
  await Promise.all([initializeBranchTypes(), initializeBranchGroups(), initializeBranchShops()])

  // Emit the initialized filters to parent component
  // This ensures parent receives the complete filter state after data loading
  emit('filtersChanged', { ...localFilters } as IBranchPrepaidGoodsFilter)
}

// Lifecycle hooks

/**
 * Component mounted lifecycle hook
 * Initializes all filter data when component is ready
 */
onMounted(() => {
  initializeFilters()
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

.filter {
  @include flexCenter;
  flex-wrap: wrap;

  @include maxResponsive(mobile) {
    display: block;
  }

  .filter-form {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1rem;

    @include maxResponsive(mobile) {
      margin-bottom: 1rem;
    }
  }

  .filter-form-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    @include maxResponsive(smallMobile) {
      display: block;
    }

    .filter-form-item {
      @include flexCenter;
      gap: 0.5rem;

      @include maxResponsive(smallMobile) {
        display: block;
        margin-bottom: 1rem;
      }

      label {
        flex-shrink: 0;

        @include maxResponsive(smallMobile) {
          margin-bottom: 0.2rem;
          display: inline-block;
        }
      }

      .p-inputtext,
      .p-select,
      .p-multiselect {
        width: 100%;
        min-width: 200px;
      }

      :deep(.p-multiselect) {
        .p-multiselect-option {
          white-space: normal;
        }
      }
    }
  }

  .filter-action {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    @include maxResponsive(smallMobile) {
      justify-content: center;
    }
  }
}
</style>
