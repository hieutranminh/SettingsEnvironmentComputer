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
import { computed, watch } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useServices } from '@/composables'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useServiceCategory } from '@/composables/useServiceCategory'
// Constants
import { CHART_DISPLAY_TYPE, CHART_DISPLAY_VALUE, type DateType, DATE_TYPE, FILTER_VALUES } from '@/constants'
// Types
import type { ServiceSalesByItemFilterInterface } from '@/types/sales-report/ServiceSalesByItem'
// Utils
import { fromUnixTimestamp, validateExceedOneMonthRange, validateToDateNotBeforeFromDate } from '@/utils/dateUtils'

const props = defineProps<{
  modelValue: ServiceSalesByItemFilterInterface
  chartDisplayType: string
  chartDisplayValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ServiceSalesByItemFilterInterface): void
  (e: 'chartDisplayTypeChanged', value: string): void
  (e: 'chartDisplayValueChanged', value: number): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { showError } = useMessageDialog()
const { serviceCategory, isLoading: isServiceCategoryLoading, fetchServiceCategory } = useServiceCategory()
const { services, isLoading: isServicesLoading, loadServices } = useServices()

const chartDisplayTypeOptions = computed(() => [
  { id: CHART_DISPLAY_TYPE.BAR, name: t('general.label-chart-bar') },
  { id: CHART_DISPLAY_TYPE.PIE, name: t('general.label-chart-pie') },
])

const categoryModel = computed({
  get: () => props.modelValue.categoryId,
  set: (value) => {
    emitUpdateModelValue({
      categoryId: value,
    })
  },
})

const serviceCategoryOptions = computed(() => [
  // Hard-coded instead of using FILTER_VALUES.ALL in constants
  // because the all category is sometimes 0 and sometimes -1 — needs further discussion
  { id: 0, name: t('general.all') },
  ...serviceCategory.value.map((item) => ({
    id: item.serviceCategoryId,
    name: item.serviceCategoryName,
  })),
])

const handleSearchClick = () => {
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

const handleChartDisplayTypeChange = (value: string) => {
  emit('chartDisplayTypeChanged', value)
}

const handleChartDisplayValueChange = (value: number) => {
  emit('chartDisplayValueChanged', value)
}

const handleDateTypeChange = (value: DateType) => {
  emitUpdateModelValue({
    dateType: value,
  })
}

const handleDateChange = (value: { fromDateTs: number; toDateTs: number }) => {
  emitUpdateModelValue({
    fromDateTs: value.fromDateTs,
    toDateTs: value.toDateTs,
  })
}

const emitUpdateModelValue = (value: Partial<ServiceSalesByItemFilterInterface>): void => {
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

      loadServices(props.modelValue.categoryId, 1, props.modelValue.shopId)
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
