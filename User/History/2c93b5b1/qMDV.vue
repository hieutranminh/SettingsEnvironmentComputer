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
              :showPrevNext="false"
              @update:dateType="handleDateTypeChange"
              @dateChange="handleDateChange"
            />
          </div>

          <div class="filter-form-group">
            <!-- Staff -->
            <div class="filter-form-item">
              <label for="staff">{{ $t('sales-by-discount-category.label-staff') }}</label>
              <Select
                v-model="staffModel"
                :loading="isStaffOptionsLoading"
                :options="staffOptions"
                :ariaLabel="$t('sales-by-discount-category.label-staff')"
                labelId="staff"
                optionLabel="name"
                optionValue="id"
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
import { computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

// Composables
import DatePickerGroup from '@/components/common/DatePickerGroup.vue'
import { useActiveStaffs } from '@/composables/useActiveStaffs'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Components
// Constants
import { type DateType, DATE_TYPE, FILTER_VALUES } from '@/constants'
// Types
import type { SalesByDiscountCategoryFilterInterface } from '@/types/sales-report/SalesByDiscountCategory'
// Utils
import { createSelectOptions } from '@/utils/selectUtils'

/**
 * Props for the SalesByDiscountCategoryFilter component
 * @param modelValue - The model value for the filter
 */
const props = defineProps<{
  modelValue: SalesByDiscountCategoryFilterInterface
}>()

/**
 * Emits for the SalesByDiscountCategoryFilter component
 * @param update:modelValue - The model value for the filter
 * @param filtersChanged - The filters have changed
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: SalesByDiscountCategoryFilterInterface): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { showError } = useMessageDialog()
const { activeStaffs, isLoading: isStaffOptionsLoading, fetchActiveStaffs } = useActiveStaffs()

const staffModel = computed({
  get: () => props.modelValue.staffId,
  set: (value) => {
    emitUpdateModelValue({
      staffId: value,
    })
  },
})

const staffOptions = computed(() =>
  createSelectOptions({
    items: activeStaffs.value,
    labelKey: 'aliasName',
    valueKey: 'staffId',
    allLabel: t('general.all'),
  }),
)

const handleSearchClick = (): void => {
  emit('filtersChanged')
}

const handleDateTypeChange = (dateType: string): void => {
  emitUpdateModelValue({
    dateType: dateType as any,
  })
}

const handleDateChange = (dateRange: { fromDateTs: number; toDateTs: number }): void => {
  emitUpdateModelValue({
    fromDateTs: dateRange.fromDateTs,
    toDateTs: dateRange.toDateTs,
  })
}

const emitUpdateModelValue = (value: Partial<SalesByDiscountCategoryFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
}

const stopWatcher = watch(
  () => props.modelValue.shopId,
  (newShopId) => {
    if (newShopId && newShopId > 0) {
      fetchActiveStaffs({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
      })
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  stopWatcher?.()
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

.filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  @include maxResponsive(smallMobile) {
    display: block;
  }

  .filter-form {
    flex: 1;
    gap: 1rem;

    .filter-form-range {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      gap: 0.5rem;

      @include maxResponsive(smallMobile) {
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
    }

    .filter-form-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;

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

        & > label {
          flex-shrink: 0;

          @include maxResponsive(smallMobile) {
            margin-bottom: 0.2rem;
            display: inline-block;
          }
        }
      }

      .p-inputtext,
      .p-select,
      .p-multiselect {
        width: 100%;
        min-width: 200px;
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
