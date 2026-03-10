<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-range">
            <label for="date-range">{{ $t('general.label-date-range') }}</label>

            <div class="date-range">
              <DatePicker
                id="date-range-from"
                showIcon
                iconDisplay="input"
                view="month"
                appendTo="self"
                :minDate="minDateRange"
                :maxDate="maxDateRange"
                :manualInput="false"
                :modelValue="filterData.fromDate"
                :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
                @update:modelValue="handleFromMonthChange"
              />
              <span>~</span>
              <DatePicker
                id="date-range-to"
                showIcon
                iconDisplay="input"
                view="month"
                appendTo="self"
                :minDate="minDateRange"
                :maxDate="maxDateRange"
                :manualInput="false"
                :modelValue="filterData.toDate"
                :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
                @update:modelValue="handleToMonthChange"
              />
            </div>
          </div>

          <div class="filter-form-group">
            <!-- Category -->
            <div class="filter-form-item">
              <label for="category">{{ $t('service-sales-by-item.label-category') }}</label>
              <Select
                v-model="categoryModel"
                :options="serviceCategoryOptions"
                :loading="isServiceCategoryLoading"
                labelId="category"
                optionLabel="name"
                optionValue="id"
                @value-change="handleCategoryChange"
              />
            </div>

            <!-- Service -->
            <div class="filter-form-item">
              <label for="service">{{ $t('service-sales-by-item.label-service') }}</label>
              <Select
                v-model="serviceModel"
                :options="serviceOptions"
                :loading="isServiceOptionsLoading"
                labelId="service"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Staffs -->
            <div class="filter-form-item">
              <label for="staff">{{ $t('service-sales-by-item.label-staff') }}</label>
              <Select
                v-model="staffModel"
                :options="staffOptions"
                :loading="isStaffOptionsLoading"
                labelId="service"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Chart -->
            <div class="filter-form-item">
              <label for="chart">{{ $t('service-sales-by-item.label-chart') }}</label>
              <Select
                :modelValue="chartDisplayType"
                :options="chartDisplayTypeOptions"
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
          <Button :label="$t('general.button-search')" @click="handleSearchClick" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// Composables
import { useActiveStaffs } from '@/composables/useActiveStaffs'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useServiceCategory } from '@/composables/useServiceCategory'
import { useServiceOptions } from '@/composables/useServiceOptions'
// Constants
import {
  PRIMEVUE_DATE_FORMATS,
  TIMEZONE_TYPE,
  CHART_DISPLAY_VALUE,
  CHART_DISPLAY_TYPE,
  FILTER_VALUES,
} from '@/constants'
// Types
import type { ServiceSalesByMonthFilterInterface } from '@/types/sales-report/ServiceSalesByMonth'
// Utils
import {
  getCurrentDate,
  fromUnixTimestamp,
  getEndOf,
  getStartOf,
  toUnixTimestamp,
  validateToDateNotBeforeFromDate,
} from '@/utils/dateUtils'

type DateValue = Date | null | undefined | Date[] | (Date | null)[]

const props = defineProps<{
  modelValue: ServiceSalesByMonthFilterInterface
  chartDisplayType: string
  chartDisplayValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ServiceSalesByMonthFilterInterface): void
  (e: 'chartDisplayTypeChanged', value: string): void
  (e: 'chartDisplayValueChanged', value: number): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { showError } = useMessageDialog()
const { activeStaffs, isLoading: isStaffOptionsLoading, fetchActiveStaffs } = useActiveStaffs()
const { serviceCategory, isLoading: isServiceCategoryLoading, fetchServiceCategory } = useServiceCategory()
const {
  serviceOptions: serviceOptionsData,
  isLoading: isServiceOptionsLoading,
  fetchServiceOptions,
} = useServiceOptions()

const filterData = ref<{
  fromDate: DateValue
  toDate: DateValue
}>({
  fromDate: props.modelValue.fromDateTs ? fromUnixTimestamp(props.modelValue.fromDateTs).toDate() : new Date(),
  toDate: props.modelValue.toDateTs
    ? fromUnixTimestamp(props.modelValue.toDateTs).subtract(1, 'day').toDate()
    : new Date(),
})

const chartDisplayTypeOptions = computed(() => [
  { id: CHART_DISPLAY_TYPE.BAR, name: t('general.label-chart-bar') },
  { id: CHART_DISPLAY_TYPE.PIE, name: t('general.label-chart-pie') },
])

const categoryModel = computed({
  get: () => props.modelValue.categoryId,
  set: (value) => {
    emitUpdateModelValue({
      categoryId: value,
      serviceId: FILTER_VALUES.ALL,
    })
  },
})

const serviceModel = computed({
  get: () => props.modelValue.serviceId,
  set: (value) => {
    emitUpdateModelValue({
      serviceId: value,
    })
  },
})

const staffModel = computed({
  get: () => props.modelValue.staffId,
  set: (value) => {
    emitUpdateModelValue({
      staffId: value,
    })
  },
})

const staffOptions = computed(() => [
  { id: FILTER_VALUES.ALL, name: t('general.all') },
  ...activeStaffs.value.map((item) => ({
    id: item.staffId,
    name: item.aliasName,
  })),
])

const serviceCategoryOptions = computed(() => [
  { id: FILTER_VALUES.ALL, name: t('general.all') },
  ...serviceCategory.value.map((item) => ({
    id: item.serviceCategoryId,
    name: item.serviceCategoryName,
  })),
])

const serviceOptions = computed(() => [
  { id: FILTER_VALUES.ALL, name: t('general.all') },
  ...serviceOptionsData.value.map((item) => ({
    id: item.serviceId,
    name: item.serviceName,
  })),
])

const minDateRange = computed(() => {
  const YEARS_TO_SUBTRACT = 10
  return getCurrentDate().subtract(YEARS_TO_SUBTRACT, 'year').startOf('year').toDate()
})

const maxDateRange = computed(() => {
  return getCurrentDate().endOf('year').toDate()
})

// Type guards
const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date
}

const handleSearchClick = (): void => {
  const fromDate = fromUnixTimestamp(props.modelValue.fromDateTs)
  const toDate = fromUnixTimestamp(props.modelValue.toDateTs)

  if (validateToDateNotBeforeFromDate(fromDate, toDate)) {
    return showError(t('general.validate-date-range-not-before-from-date'))
  }

  emit('filtersChanged')
}

const handleCategoryChange = (value: number) => {
  fetchServiceOptions({
    shopId: props.modelValue.shopId,
    headquarterShopId: props.modelValue.headquarterShopId,
    serviceCategoryId: value,
    status: 1,
    pageSize: 100,
    pageNumber: 1,
  })
}

const handleFromMonthChange = (value: DateValue): void => {
  if (!isValidDate(value)) return

  const startOfUnit = getStartOf(value, 'day')
  emitUpdateModelValue({
    fromDateTs: toUnixTimestamp(startOfUnit.toDate(), TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  })
}

const handleToMonthChange = (value: DateValue): void => {
  if (!isValidDate(value)) return

  const endOfUnit = getEndOf(value, 'day')
  emitUpdateModelValue({
    toDateTs: toUnixTimestamp(endOfUnit.toDate(), TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  })
}

const handleChartDisplayTypeChange = (value: string) => {
  emit('chartDisplayTypeChanged', value)
}

const handleChartDisplayValueChange = (value: number) => {
  emit('chartDisplayValueChanged', value)
}

const emitUpdateModelValue = (value: Partial<ServiceSalesByMonthFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
}

watch(
  () => props.modelValue.shopId,
  (newShopId) => {
    if (newShopId && newShopId > 0) {
      fetchServiceCategory({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
        // Hard-coded instead of using FILTER_STATUS in constants
        // because the active status is sometimes 0 and sometimes 1 — needs further discussion
        status: 1,
        pageSize: 100,
        pageNumber: 1,
      })

      fetchServiceOptions({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
        serviceCategoryId: props.modelValue.categoryId,
        status: 1,
        pageSize: 100,
        pageNumber: 1,
      })

      fetchActiveStaffs({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
      })
    }
  },
  { immediate: true },
)
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

      .date-range {
        display: flex;
        align-items: center;
        gap: 0.5rem;
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

        &.filter-form-radio {
          display: flex;
          gap: 1rem;
        }

        .filter-form-radio-item {
          @include flex-center;
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

    .p-button {
      width: 120px;
    }
  }
}
</style>
