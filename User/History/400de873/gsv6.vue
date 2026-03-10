<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-range">
            <DatePickerRange
              :fromDateTs="modelValue.fromDateTs"
              :toDateTs="modelValue.toDateTs"
              :minFromDate="minDateRange"
              :maxFromDate="maxDateRange"
              :minToDate="minDateRange"
              :maxToDate="maxDateRange"
              :viewMode="DATE_VIEW_MODE.MONTH"
              @dateChange="handleDateChange"
            />
          </div>

          <div class="filter-form-group">
            <!-- Category -->
            <div class="filter-form-item">
              <label for="category">{{ $t('service-sales-by-month.label-category') }}</label>
              <Select
                v-model="categoryModel"
                :options="serviceCategoryOptions"
                :loading="isServiceCategoryLoading"
                :ariaLabel="$t('service-sales-by-month.label-category')"
                labelId="category"
                optionLabel="name"
                optionValue="id"
                @value-change="handleCategoryChange"
              />
            </div>

            <!-- Service -->
            <div class="filter-form-item">
              <label for="service">{{ $t('service-sales-by-month.label-service') }}</label>
              <Select
                v-model="serviceModel"
                :options="serviceOptions"
                :loading="isServiceOptionsLoading"
                :ariaLabel="$t('service-sales-by-month.label-service')"
                labelId="service"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Staffs -->
            <div class="filter-form-item">
              <label for="staff">{{ $t('service-sales-by-month.label-staff') }}</label>
              <Select
                v-model="staffModel"
                :options="staffOptions"
                :loading="isStaffOptionsLoading"
                :ariaLabel="$t('service-sales-by-month.label-staff')"
                labelId="service"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Chart -->
            <div class="filter-form-item">
              <label for="chart">{{ $t('service-sales-by-month.label-chart') }}</label>
              <Select
                :modelValue="chartDisplayType"
                :options="chartDisplayTypeOptions"
                :ariaLabel="$t('service-sales-by-month.label-chart')"
                labelId="chart"
                optionLabel="name"
                optionValue="id"
                @update:modelValue="handleChartDisplayTypeChange"
              />
            </div>

            <!-- Radio -->
            <div class="filter-form-item filter-form-radio">
              <div class="filter-form-radio-item">
                <RadioButton
                  :modelValue="chartDisplayValue"
                  :value="CHART_DISPLAY_VALUE.QTY"
                  :ariaLabel="$t('general.label-qty')"
                  inputId="qty"
                  name="qty"
                  @update:modelValue="handleChartDisplayValueChange"
                />
                <label for="qty">{{ $t('general.label-qty') }}</label>
              </div>
              <div class="filter-form-radio-item">
                <RadioButton
                  :modelValue="chartDisplayValue"
                  :value="CHART_DISPLAY_VALUE.AMOUNT"
                  :ariaLabel="$t('general.label-amount')"
                  inputId="amount"
                  name="amount"
                  @update:modelValue="handleChartDisplayValueChange"
                />
                <label for="amount">{{ $t('general.label-amount') }}</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="filter-action">
          <Button
            :label="$t('general.button-search')"
            @click="handleSearchClick"
            icon="pi pi-search"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeUnmount, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

// Composables
import { useActiveStaffs } from '@/composables/useActiveStaffs'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useServiceCategory } from '@/composables/useServiceCategory'
import { useServiceOptions } from '@/composables/useServiceOptions'
import { useModelBinding } from '@/composables/useModelBinding'
import { useDateRange } from '@/composables/useDateRange'
// Constants
import {
  DATE_VIEW_MODE,
  DATE_UNITS,
  CHART_DISPLAY_VALUE,
  CHART_DISPLAY_TYPE,
  FILTER_VALUES,
  PAGINATION,
  type ChartDisplayType,
  type ChartDisplayValue,
} from '@/constants'
// Types
import type { IServiceSalesByMonthFilterInterface } from '@/types/sales-report/ServiceSalesByMonth'
// Utils
import { getCurrentDate } from '@/utils/dateUtils'
import { createSelectOptions } from '@/utils/selectUtils'

/**
 * Props for the ServiceSalesByMonthFilter component
 * @param modelValue - The model value for the filter
 * @param chartDisplayType - The type of chart to display
 * @param chartDisplayValue - The value of the chart to display
 */
const props = defineProps<{
  modelValue: IServiceSalesByMonthFilterInterface
  chartDisplayType: ChartDisplayType
  chartDisplayValue: ChartDisplayValue
}>()

/**
 * Emits for the ServiceSalesByMonthFilter component
 * @param update:modelValue - The model value for the filter
 * @param chartDisplayTypeChanged - The type of chart to display
 * @param chartDisplayValueChanged - The value of the chart to display
 * @param filtersChanged - The filters have changed
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: IServiceSalesByMonthFilterInterface): void
  (e: 'chartDisplayTypeChanged', value: ChartDisplayType): void
  (e: 'chartDisplayValueChanged', value: ChartDisplayValue): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { showError } = useMessageDialog()
const { activeStaffs, isLoading: isStaffOptionsLoading, fetchActiveStaffs } = useActiveStaffs()
const {
  serviceCategory,
  isLoading: isServiceCategoryLoading,
  fetchServiceCategory,
} = useServiceCategory()
const {
  serviceOptions: serviceOptionsData,
  isLoading: isServiceOptionsLoading,
  fetchServiceOptions,
} = useServiceOptions()
const { validateDateRange } = useDateRange(toRef(props, 'modelValue'))

const categoryModel = useModelBinding(props, emit, 'categoryId', { serviceId: FILTER_VALUES.ALL })
const serviceModel = useModelBinding(props, emit, 'serviceId')
const staffModel = useModelBinding(props, emit, 'staffId')

const chartDisplayTypeOptions = computed(() => [
  { id: CHART_DISPLAY_TYPE.LINE, name: t('general.label-chart-line') },
  { id: CHART_DISPLAY_TYPE.BAR, name: t('general.label-chart-bar') },
  { id: CHART_DISPLAY_TYPE.BAR_LINE, name: t('general.label-chart-bar-line') },
])

const staffOptions = computed(() =>
  createSelectOptions({
    items: activeStaffs.value,
    labelKey: 'aliasName',
    valueKey: 'staffId',
    allLabel: t('general.all'),
    notSelectedLabel: t('general.not-selected'),
    includeAll: true,
    includeNotSelected: true,
  }),
)

const serviceCategoryOptions = computed(() =>
  createSelectOptions({
    items: serviceCategory.value,
    labelKey: 'serviceCategoryName',
    valueKey: 'serviceCategoryId',
    allLabel: t('general.all'),
    includeAll: true,
  }),
)

const serviceOptions = computed(() =>
  createSelectOptions({
    items: serviceOptionsData.value,
    labelKey: 'serviceName',
    valueKey: 'serviceId',
    allLabel: t('general.all'),
    includeAll: true,
  }),
)

const minDateRange = computed(() => {
  const YEARS_TO_SUBTRACT = 10
  return getCurrentDate()
    .subtract(YEARS_TO_SUBTRACT, DATE_UNITS.YEAR)
    .startOf(DATE_UNITS.YEAR)
    .toDate()
})

const maxDateRange = computed(() => {
  return getCurrentDate().endOf(DATE_UNITS.YEAR).toDate()
})

const handleSearchClick = (): void => {
  const validationResult = validateDateRange({
    checkToDateNotBeforeFromDate: true,
    checkExceedOneYearRange: true,
  })
  if (!validationResult.isValid) {
    return showError(t(validationResult.errorKey!))
  }
  emit('filtersChanged')
}

const handleCategoryChange = (value: number): void => {
  fetchServiceOptions({
    shopId: props.modelValue.shopId,
    headquarterShopId: props.modelValue.headquarterShopId,
    serviceCategoryId: value,
    status: 1,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE_MAX,
    pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
  })
}

const handleDateChange = (value: { fromDateTs: number; toDateTs: number }): void => {
  emitUpdateModelValue({
    fromDateTs: value.fromDateTs,
    toDateTs: value.toDateTs,
  })
}

const handleChartDisplayTypeChange = (value: ChartDisplayType): void => {
  emit('chartDisplayTypeChanged', value)
}

const handleChartDisplayValueChange = (value: ChartDisplayValue): void => {
  emit('chartDisplayValueChanged', value)
}

const emitUpdateModelValue = (value: Partial<IServiceSalesByMonthFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
}

const stopWatcher = watch(
  () => props.modelValue.shopId,
  (newShopId): void => {
    if (newShopId && newShopId > 0) {
      fetchServiceCategory({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
        // Hard-coded instead of using FILTER_STATUS in constants
        // because the active status is sometimes 0 and sometimes 1 — needs further discussion
        status: 1,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE_MAX,
        pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
      })

      fetchServiceOptions({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
        serviceCategoryId: props.modelValue.categoryId,
        status: 1,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE_MAX,
        pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
      })

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
        margin-bottom: 0;
      }

      .date-range {
        display: flex;
        align-items: center;
        gap: 0.5rem;
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
        @include flexCenter;
        gap: 0.5rem;

        @include maxResponsive(smallMobile) {
          display: block;
          margin-bottom: 1rem;
        }

        &.filter-form-radio {
          display: flex;
          gap: 1rem;
        }

        .filter-form-radio-item {
          @include flexCenter;
          gap: 0.5rem;
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
