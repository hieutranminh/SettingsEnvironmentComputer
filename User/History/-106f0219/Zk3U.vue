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
              <label for="category">
                {{ $t('product-sales-by-month.label-product-category') }}
              </label>
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
// Composables
import { useI18n } from 'vue-i18n'
import { useActiveStaffs } from '@/composables/useActiveStaffs'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useProductCategory } from '@/composables/useProductCategory'
import { useProductOptions } from '@/composables/useProductOptions'
import { useDateRange } from '@/composables/useDateRange'
import { useModelBinding } from '@/composables/useModelBinding'
// Constants
import {
  FILTER_VALUES,
  PAGINATION,
  CHART_DISPLAY_TYPE,
  CHART_DISPLAY_VALUE,
  DATE_VIEW_MODE,
  DATE_UNITS,
  type ChartDisplayType,
  type ChartDisplayValue,
} from '@/constants'
// Types
import type { IProductSalesByMonthFilterInterface } from '@/types/sales-report/ProductSalesByMonth'
// Utils
import { getCurrentDate } from '@/utils/dateUtils'
import { createSelectOptions } from '@/utils/selectUtils'

const props = defineProps<{
  modelValue: IProductSalesByMonthFilterInterface
  chartDisplayType: ChartDisplayType
  chartDisplayValue: ChartDisplayValue
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: IProductSalesByMonthFilterInterface): void
  (e: 'chartDisplayTypeChanged', value: ChartDisplayType): void
  (e: 'chartDisplayValueChanged', value: ChartDisplayValue): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { activeStaffs, isLoading: isStaffOptionsLoading, fetchActiveStaffs } = useActiveStaffs()
const { showError } = useMessageDialog()
const {
  productCategory,
  isLoading: isProductCategoryLoading,
  fetchProductCategory,
} = useProductCategory()
const {
  productOptions: productOptionsData,
  isLoading: isProductOptionsLoading,
  fetchProductOptions,
} = useProductOptions()
const { validateDateRange } = useDateRange(toRef(props, 'modelValue'))

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

const productCategoryOptions = computed(() =>
  createSelectOptions({
    items: productCategory.value,
    labelKey: 'productCategoryName',
    valueKey: 'productCategoryId',
    allLabel: t('general.all'),
    includeAll: true,
  }),
)

const productOptions = computed(() =>
  createSelectOptions({
    items: productOptionsData.value,
    labelKey: 'productName',
    valueKey: 'productId',
    allLabel: t('general.all'),
    includeAll: true,
  }),
)

const categoryModel = useModelBinding(props, emit, 'categoryId', { productId: FILTER_VALUES.ALL })
const productModel = useModelBinding(props, emit, 'productId')
const staffModel = useModelBinding(props, emit, 'staffId')

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

const handleChartDisplayTypeChange = (value: ChartDisplayType): void => {
  emit('chartDisplayTypeChanged', value)
}

const handleChartDisplayValueChange = (value: ChartDisplayValue): void => {
  emit('chartDisplayValueChanged', value)
}

const handleCategoryChange = (value: number): void => {
  fetchProductOptions({
    shopId: props.modelValue.shopId,
    headquarterShopId: props.modelValue.headquarterShopId,
    productCategoryId: value,
    status: 1,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE_MAX,
    pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
    keyWord: '',
    usageStatus: '',
  })
}

const handleDateChange = (value: { fromDateTs: number; toDateTs: number }): void => {
  emitUpdateModelValue({
    fromDateTs: value.fromDateTs,
    toDateTs: value.toDateTs,
  })
}

const emitUpdateModelValue = (value: Partial<IProductSalesByMonthFilterInterface>): void => {
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
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE_MAX,
        pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
      })

      fetchProductOptions({
        shopId: props.modelValue.shopId,
        headquarterShopId: props.modelValue.headquarterShopId,
        productCategoryId: props.modelValue.categoryId,
        status: 1,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE_MAX,
        pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
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
  }
}
</style>
