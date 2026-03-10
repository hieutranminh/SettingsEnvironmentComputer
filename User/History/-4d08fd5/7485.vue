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
            <!-- Report By -->
            <div class="filter-form-item">
              <label for="report-by">{{ $t('service-sales.label-report-by') }}</label>

              <Select
                v-model="reportByModel"
                :options="reportByTypeOptions"
                labelId="report-by"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Staff -->
            <div class="filter-form-item">
              <label for="staff">{{ $t('service-sales.label-staff') }}</label>
              <Select
                v-model="staffModel"
                :loading="isLoading"
                :options="staffOptions"
                labelId="staff"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Chart -->
            <div class="filter-form-item">
              <label for="chart">{{ $t('service-sales.label-chart') }}</label>
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
import { computed, watch } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useActiveStaffs } from '@/composables/useActiveStaffs'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Constants
import {
  FILTER_VALUES,
  REPORT_BY_TYPE,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  DATE_TYPE,
} from '@/constants'
// Types
import type { IServiceSalesFilterInterface } from '@/types/sales-report/ServiceSales'
import type { DateType, ChartDisplayType, ChartDisplayValue } from '@/constants'
// Utils
import {
  fromUnixTimestamp,
  validateExceedOneMonthRange,
  validateToDateNotBeforeFromDate,
} from '@/utils/dateUtils'

const props = defineProps<{
  modelValue: IServiceSalesFilterInterface
  chartDisplayType: ChartDisplayType
  chartDisplayValue: ChartDisplayValue
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: IServiceSalesFilterInterface): void
  (e: 'chartDisplayTypeChanged', value: ChartDisplayType): void
  (e: 'chartDisplayValueChanged', value: ChartDisplayValue): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { activeStaffs, isLoading, fetchActiveStaffs } = useActiveStaffs()
const { showError } = useMessageDialog()

const reportByTypeOptions = computed(() => [
  { id: REPORT_BY_TYPE.STAFF, name: t('service-sales.label-staff') },
  { id: REPORT_BY_TYPE.CATEGORY, name: t('service-sales.label-category') },
  { id: REPORT_BY_TYPE.SERVICE, name: t('service-sales.label-service') },
  { id: REPORT_BY_TYPE.DATE_OF_WEEK, name: t('service-sales.label-day-of-week') },
  { id: REPORT_BY_TYPE.HOUR_OF_DAY, name: t('service-sales.label-hour-of-day') },
])

const chartDisplayTypeOptions = computed(() => [
  { id: CHART_DISPLAY_TYPE.BAR, name: t('general.label-chart-bar') },
  { id: CHART_DISPLAY_TYPE.PIE, name: t('general.label-chart-pie') },
])

const staffOptions = computed(() => [
  { id: FILTER_VALUES.ALL, name: t('general.all') },
  ...activeStaffs.value.map((item) => ({
    id: item.staffId,
    name: item.aliasName,
  })),
])

const reportByModel = computed({
  get: () => props.modelValue.reportByType,
  set: (value): void => {
    emitUpdateModelValue({
      reportByType: value,
    })
  },
})

const staffModel = computed({
  get: () => props.modelValue.staffId,
  set: (value): void => {
    emitUpdateModelValue({
      staffId: value,
    })
  },
})

const handleSearchClick = (): void => {
  if (props.modelValue.dateType === DATE_TYPE.RANGE) {
    const fromDate = fromUnixTimestamp(props.modelValue.fromDateTs)
    const toDate = fromUnixTimestamp(props.modelValue.toDateTs)

    if (validateToDateNotBeforeFromDate(fromDate, toDate)) {
      return showError(t('general.validate-date-range-not-before-from-date'))
    }
    if (validateExceedOneMonthRange(fromDate, toDate)) {
      return showError(t('general.validate-date-range-exceed-one-month'))
    }
  }

  emit('filtersChanged')
}

const handleChartDisplayTypeChange = (value: ChartDisplayType): void => {
  emit('chartDisplayTypeChanged', value)
}

const handleChartDisplayValueChange = (value: ChartDisplayValue): void => {
  emit('chartDisplayValueChanged', value)
}

const handleDateTypeChange = (value: DateType): void => {
  emitUpdateModelValue({
    dateType: value,
  })
}

const handleDateChange = (value: { fromDateTs: number; toDateTs: number }): void => {
  emitUpdateModelValue({
    fromDateTs: value.fromDateTs,
    toDateTs: value.toDateTs,
  })
}

const emitUpdateModelValue = (value: Partial<IServiceSalesFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
}

/**
 * Watch for shopId changes and fetch active staffs
 * Used when changing branch shop
 * @param newShopId - New shop ID
 * This watcher updates the dropdown options when the branch shop changes
 * Run immediately if shopId is already populated
 */
watch(
  () => props.modelValue.shopId,
  (newShopId): void => {
    if (newShopId && newShopId > 0) {
      fetchActiveStaffs({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
      })
    }
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
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
