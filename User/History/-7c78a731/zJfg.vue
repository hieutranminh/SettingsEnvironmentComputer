<template>
  <Card>
    <template #content>
      <pre>{{ localFilters }}</pre>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-group">
            <div class="filter-form-item">
              <label for="branch-type-select">{{ $t('branch-prepaid-goods.label-branch-type') }}</label>
              <Select
                v-model="localFilters.customBranchTypeId"
                :options="branchTypeOptions"
                :loading="isLoadingBranchTypes"
                optionLabel="name"
                optionValue="id"
                @update:modelValue="handleBranchTypeChange"
              />
            </div>
            <div class="filter-form-item">
              <label for="branch-group-select">{{ $t('branch-prepaid-goods.label-branch-group') }}</label>
              <Select
                v-model="localFilters.branchGroupId"
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
                :placeholder="branchShopOptions.length ? $t('general.all') : $t('general.empty-selection')"
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
              <label for="branch-name-input">{{ $t('branch-prepaid-goods.label-branch-name') }}</label>
              <InputText v-model="localFilters.branchName" @update:modelValue="handleBranchNameChange" />
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
import { reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Composables
import { useBranchGroups } from '@/composables/useBranchGroups'
import { useBranchSalesTotalFilter } from '@/composables/useBranchSalesTotalFilter'
import { useCustomBranchTypes } from '@/composables/useCustomBranchTypes'
// Constants
import { FILTER_VALUES } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { BranchPrepaidGoodsFilterInterface } from '@/types/branch/BranchPrepaidGoodsFilter'

// Component interface definitions
interface Props {
  /** Initial filter values passed from parent component */
  modelValue: BranchPrepaidGoodsFilterInterface
}

interface Emits {
  /** Emitted when filter values change, providing updated filter state to parent */
  (e: 'filtersChanged', value: BranchPrepaidGoodsFilterInterface): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local reactive state for filter values
// This maintains the current filter state and allows for local changes before emitting to parent
const localFilters = reactive<BranchPrepaidGoodsFilterInterface>({
  branchGroupId: props.modelValue.branchGroupId,
  branchShopIds: props.modelValue.branchShopIds,
  branchName: props.modelValue.branchName,
  customBranchTypeId: props.modelValue.customBranchTypeId,
  headquarterShopId: props.modelValue.headquarterShopId,
  isHeadquarterView: props.modelValue.isHeadquarterView,
})

// Composables for data management and authentication
const authStore = useAuthStore()
const { customBranchTypes, isLoading: isLoadingBranchTypes, fetchBranchTypes } = useCustomBranchTypes()
const { branchGroups, isLoading: isLoadingBranchGroups, fetchBranchGroups } = useBranchGroups()
const {
  branchSalesTotalFilterItems,
  isLoading: isLoadingBranchShops,
  fetchBranchSalesTotalFilterData,
} = useBranchSalesTotalFilter()
const { t } = useI18n()

// Computed properties for dropdown options

/**
 * Branch type options for the dropdown selector
 * Includes "All" option and fetched custom branch types
 */
const branchTypeOptions = computed(() => [
  { id: FILTER_VALUES.ALL, name: t('general.all') },
  ...customBranchTypes.value,
])

/**
 * Branch group options for the dropdown selector
 * Includes "All" option and fetched branch groups
 */
const branchGroupOptions = computed(() => [{ id: FILTER_VALUES.ALL, name: t('general.all') }, ...branchGroups.value])

/**
 * Filtered branch shop items based on selected branch type and group
 * Uses early returns for performance optimization when "All" is selected
 */
const filteredBranchShopItems = computed(() => {
  const { customBranchTypeId, branchGroupId } = localFilters

  // Early return for "All" selections to avoid unnecessary filtering
  if (customBranchTypeId === FILTER_VALUES.ALL && branchGroupId === FILTER_VALUES.ALL)
    return branchSalesTotalFilterItems.value

  // Filter items based on selected branch type and group
  // Only applies filtering when specific values are selected (not "All")
  return branchSalesTotalFilterItems.value.filter((item) => {
    const matchesBranchType = customBranchTypeId === FILTER_VALUES.ALL || item.customBranchTypeId === customBranchTypeId
    const matchesBranchGroup = branchGroupId === FILTER_VALUES.ALL || item.branchGroupId === branchGroupId
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

/**
 * Determines if all available branch shops are currently selected
 * Used for displaying "All" in the MultiSelect value template
 */
const isAllSelected = computed(() => {
  return localFilters.branchShopIds.length === branchShopOptions.value.length
})

// Event handlers

/**
 * Handles search button click
 * Emits current filter state to parent component for data fetching
 */
const handleSearchClick = (): void => {
  emit('filtersChanged', { ...localFilters } as BranchPrepaidGoodsFilterInterface)
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
  await fetchBranchSalesTotalFilterData({ shopId: authStore.shop.shopId })
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
  emit('filtersChanged', { ...localFilters } as BranchPrepaidGoodsFilterInterface)
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
  @include flex-center;
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
      @include flex-center;
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

    .p-button {
      width: 120px;
    }
  }
}
</style>
