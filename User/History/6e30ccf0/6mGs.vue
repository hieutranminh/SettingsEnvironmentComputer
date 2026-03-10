<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <!-- Date Group -->
          <div class="filter-form-range">
            <DatePickerGroup
              :dateType="modelValue.dateType"
              :fromDateTs="modelValue.fromDateTs"
              :toDateTs="modelValue.toDateTs"
              :showPrevNext="true"
              :fetchOnNavigate="true"
              @update:dateType="handleDateTypeChange"
              @dateChange="handleDateChange"
            />
          </div>

          <div class="filter-form-group">
            <div class="filter-form-item">
              <label for="branch-type-select">{{ $t('branch-sales.label-branch-type') }}</label>
              <Select
                v-model="customBranchTypeIdModel"
                :options="branchTypeOptions"
                :loading="isLoadingBranchTypes"
                :ariaLabel="$t('branch-sales.label-branch-type')"
                labelId="branch-type-select"
                optionLabel="name"
                optionValue="id"
                @update:modelValue="handleBranchTypeChange"
              />
            </div>
            <div class="filter-form-item">
              <label for="branch-group-select">{{ $t('branch-sales.label-branch-group') }}</label>
              <Select
                v-model="branchGroupIdModel"
                :options="branchGroupOptions"
                :loading="isLoadingBranchGroups"
                :ariaLabel="$t('branch-sales.label-branch-group')"
                labelId="branch-group-select"
                optionLabel="name"
                optionValue="id"
                @update:modelValue="handleBranchGroupChange"
              />
            </div>
            <div class="filter-form-item">
              <label for="branch-select">{{ $t('branch-sales.label-branch') }}</label>
              <MultiSelect
                v-model="branchShopIdsModel"
                :options="branchShopOptions"
                :loading="isLoadingBranchShops"
                :maxSelectedLabels="FILTER_CONSTANTS.MAX_SELECTED_LABELS"
                :disabled="!branchShopOptions.length"
                :placeholder="
                  branchShopOptions.length ? $t('general.all') : $t('general.empty-selection')
                "
                :ariaLabel="$t('branch-sales.label-branch')"
                :scrollHeight="FILTER_CONSTANTS.SCROLL_HEIGHT"
                appendTo="self"
                labelId="branch-select"
                optionLabel="name"
                optionValue="id"
                filter
              >
                <template #value="slotProps">
                  <span v-if="isAllSelected">{{ slotProps.placeholder }}</span>
                </template>
              </MultiSelect>
            </div>
            <div class="filter-form-item">
              <label for="branch-name-input">{{ $t('branch-sales.label-branch-name') }}</label>
              <InputText v-model="branchNameModel" />
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
import { computed, toRef, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

// Composables
import { useBranchGroups } from '@/composables/useBranchGroups'
import { useBranchSalesTotalFilter } from '@/composables/useBranchSalesTotalFilter'
import { useCustomBranchTypes } from '@/composables/useCustomBranchTypes'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useModelBinding, useStringModelBinding } from '@/composables/useModelBinding'
// Constants
import { DATE_TYPE, type DateType, FILTER_VALUES } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { IBranchSalesFilterInterface } from '@/types/sales-report/BranchSales'
// Utils
import { createSelectOptions } from '@/utils/selectUtils'

// Component interface definitions
interface Props {
  /** Initial filter values passed from parent component */
  modelValue: IBranchSalesFilterInterface
}

interface Emits {
  (e: 'update:modelValue', value: IBranchSalesFilterInterface): void
  (e: 'filtersChanged'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const FILTER_CONSTANTS = {
  MAX_SELECTED_LABELS: 1,
  SCROLL_HEIGHT: '350px',
} as const

// Composables
const authStore = useAuthStore()
const { showError } = useMessageDialog()
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
const { validateRangeTypeFilters } = useDateRangeFilter(toRef(props, 'modelValue'))

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
 */
const filteredBranchShopItems = computed(() => {
  const { customBranchTypeId, branchGroupId } = props.modelValue
  return branchSalesTotalFilter.value.filter((item) => {
    const matchesBranchType =
      customBranchTypeId === FILTER_VALUES.ALL || item.customBranchTypeId === customBranchTypeId
    const matchesBranchGroup =
      branchGroupId === FILTER_VALUES.ALL || item.branchGroupId === branchGroupId
    return matchesBranchType && matchesBranchGroup
  })
})

const branchShopOptions = computed(() =>
  filteredBranchShopItems.value.map((item) => ({
    id: item.branchShopId,
    name: item.branchShopName,
  })),
)

const isAllSelected = computed(() => {
  return props.modelValue.branchShopIds.length === branchShopOptions.value.length
})

const handleSearchClick = (): void => {
  if (props.modelValue.dateType === DATE_TYPE.RANGE) {
    const validationResult = validateRangeTypeFilters()
    if (!validationResult.isValid) {
      return showError(t(validationResult.errorKey!))
    }
  }

  emit('filtersChanged')
}

const handleDateTypeChange = (value: DateType): void => {
  emitUpdateModelValue({
    dateType: value,
  })
}

const handleDateChange = (
  value: { fromDateTs: number; toDateTs: number },
  fetchOnNavigate: boolean,
): void => {
  emitUpdateModelValue({
    fromDateTs: value.fromDateTs,
    toDateTs: value.toDateTs,
  })

  if (fetchOnNavigate) emit('filtersChanged')
}

/**
 * Updates branch shop selection when filters change
 * Clears branch name input and selects all available shops based on current filters
 */
const updateBranchShopSelection = async (): Promise<void> => {
  // Wait for computed properties to update after reactive changes
  await nextTick()

  emitUpdateModelValue({
    branchName: '',
    branchShopIds: filteredBranchShopItems.value.map((item) => item.branchShopId),
  })
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

  emitUpdateModelValue({
    branchShopIds: filteredBranchShopItems.value.map((item) => item.branchShopId),
  })
}

const emitUpdateModelValue = (value: Partial<IBranchSalesFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
}

/**
 * Initializes all filter data
 * This method can be called from parent component
 */
const initializeFilters = async (): Promise<void> => {
  await Promise.all([initializeBranchTypes(), initializeBranchGroups(), initializeBranchShops()])
}

defineExpose({
  initializeFilters,
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
