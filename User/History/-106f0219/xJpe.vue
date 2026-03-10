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
                :modelValue="convertedFromDate"
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
                :modelValue="convertedToDate"
                :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
                @update:modelValue="handleToMonthChange"
              />
            </div>
          </div>

          <div class="filter-form-group">
            <!-- Category -->
            <div class="filter-form-item">
              <label for="category">{{ $t('product-sales-by-month.label-product-category') }}</label>
              <Select
                v-model="categoryModel"
                :options="productCategoryOptions"
                :loading="isProductCategoryLoading"
                :ariaLabel="$t('product-sales-by-month.label-product-category')"
                labelId="category"
                optionLabel="name"
                optionValue="id"
                @value-change="handleCategoryChange"
              />
            </div>

            <!-- Product -->
            <div class="filter-form-item">
              <label for="product">{{ $t('product-sales-by-month.label-product') }}</label>
              <Select
                v-model="productModel"
                :options="productOptions"
                :loading="isProductOptionsLoading"
                :ariaLabel="$t('product-sales-by-month.label-product')"
                labelId="product"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Staffs -->
            <div class="filter-form-item">
              <label for="staff">{{ $t('product-sales-by-month.label-staff') }}</label>
              <Select
                v-model="staffModel"
                :options="staffOptions"
                :loading="isStaffOptionsLoading"
                :ariaLabel="$t('product-sales-by-month.label-staff')"
                labelId="staff"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Chart -->
            <div class="filter-form-item">
              <label for="chart">{{ $t('product-sales-by-month.label-chart') }}</label>
              <Select
                :modelValue="chartDisplayType"
                :options="chartDisplayTypeOptions"
                :ariaLabel="$t('product-sales-by-month.label-chart')"
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
import { computed, watch, onBeforeUnmount } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useActiveStaffs } from '@/composables/useActiveStaffs'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useProductCategory } from '@/composables/useProductCategory'
import { useProductOptions } from '@/composables/useProductOptions'
// Constants
import {
  FILTER_VALUES,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  PRIMEVUE_DATE_FORMATS,
  TIMEZONE_TYPE,
  type ChartDisplayType,
  type ChartDisplayValue,
} from '@/constants'
// Types
import type { ProductSalesByMonthFilterInterface } from '@/types/sales-report/ProductSalesByMonth'
// Utils
import {
  fromUnixTimestamp,
  toUnixTimestamp,
  getCurrentDate,
  getStartOf,
  getEndOf,
  validateToDateNotBeforeFromDate,
} from '@/utils/dateUtils'
import { createSelectOptions } from '@/utils/selectUtils'

type DateValue = Date | null | undefined | Date[] | (Date | null)[]

const props = defineProps<{
  modelValue: ProductSalesByMonthFilterInterface
  chartDisplayType: ChartDisplayType
  chartDisplayValue: ChartDisplayValue
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProductSalesByMonthFilterInterface): void
  (e: 'chartDisplayTypeChanged', value: ChartDisplayType): void
  (e: 'chartDisplayValueChanged', value: ChartDisplayValue): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { activeStaffs, isLoading: isStaffOptionsLoading, fetchActiveStaffs } = useActiveStaffs()
const { showError } = useMessageDialog()
const { productCategory, isLoading: isProductCategoryLoading, fetchProductCategory } = useProductCategory()
const {
  productOptions: productOptionsData,
  isLoading: isProductOptionsLoading,
  fetchProductOptions,
} = useProductOptions()

// Date range constraints
const minDateRange = getStartOf(getCurrentDate(), 'month').subtract(24, 'month').toDate()
const maxDateRange = getEndOf(getCurrentDate(), 'month').toDate()

// Type guards
const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date
}

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
  }),
)

const productCategoryOptions = computed(() =>
  createSelectOptions({
    items: productCategory.value,
    labelKey: 'productCategoryName',
    valueKey: 'productCategoryId',
    allLabel: t('general.all'),
  }),
)

const productOptions = computed(() =>
  createSelectOptions({
    items: productOptionsData.value,
    labelKey: 'productName',
    valueKey: 'productId',
    allLabel: t('general.all'),
  }),
)

const categoryModel = computed({
  get: () => props.modelValue.categoryId,
  set: (value): void => {
    emitUpdateModelValue({
      categoryId: value,
      productId: FILTER_VALUES.ALL,
    })
  },
})

const productModel = computed({
  get: () => props.modelValue.productId,
  set: (value): void => {
    emitUpdateModelValue({
      productId: value,
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

const convertedFromDate = computed(() => {
  return props.modelValue.fromDateTs
    ? fromUnixTimestamp(props.modelValue.fromDateTs).toDate()
    : getCurrentDate().toDate()
})

const convertedToDate = computed(() => {
  return props.modelValue.toDateTs
    ? fromUnixTimestamp(props.modelValue.toDateTs).subtract(1, 'day').toDate()
    : getCurrentDate().toDate()
})

const handleSearchClick = (): void => {
  const fromDate = fromUnixTimestamp(props.modelValue.fromDateTs)
  const toDate = fromUnixTimestamp(props.modelValue.toDateTs)

  if (validateToDateNotBeforeFromDate(fromDate, toDate)) {
    return showError(t('general.validate-date-range-not-before-from-date'))
  }

  emit('filtersChanged')
}

const handleChartDisplayTypeChange = (value: ChartDisplayType): void => {
  emit('chartDisplayTypeChanged', value)
}

const handleChartDisplayValueChange = (value: ChartDisplayValue): void => {
  emit('chartDisplayValueChanged', value)
}

const handleFromMonthChange = (value: DateValue): void => {
  if (!isValidDate(value)) return

  const startOfUnit = getStartOf(value, 'month')
  emitUpdateModelValue({
    fromDateTs: toUnixTimestamp(startOfUnit.toDate(), TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  })
}

const handleToMonthChange = (value: DateValue): void => {
  if (!isValidDate(value)) return

  const endOfUnit = getEndOf(value, 'month')
  emitUpdateModelValue({
    toDateTs: toUnixTimestamp(endOfUnit.toDate(), TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  })
}

const handleCategoryChange = (value: number): void => {
  fetchProductOptions({
    shopId: props.modelValue.shopId,
    headquarterShopId: props.modelValue.headquarterShopId,
    productCategoryId: value,
    status: 1,
    pageSize: 100,
    pageNumber: 1,
    keyWord: '',
    usageStatus: '',
  })
}

const emitUpdateModelValue = (value: Partial<ProductSalesByMonthFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
}

const stopWatcher = watch(
  () => props.modelValue.shopId,
  (newShopId): void => {
    if (newShopId && newShopId > 0) {
      fetchProductCategory({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
        // Hard-coded instead of using FILTER_STATUS in constants
        // because the active status is sometimes 0 and sometimes 1 — needs further discussion
        status: 1,
        pageSize: 100,
        pageNumber: 1,
      })

      fetchProductOptions({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
        productCategoryId: props.modelValue.categoryId,
        status: 1,
        pageSize: 100,
        pageNumber: 1,
        keyWord: '',
        usageStatus: '',
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

<style scoped lang="scss">
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

    .p-button {
      width: 120px;
    }
  }
}
</style>
