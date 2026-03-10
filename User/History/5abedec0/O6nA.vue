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
              <label for="category">{{ $t('service-sales-by-sales-type.label-category') }}</label>
              <Select
                v-model="categoryModel"
                :options="serviceCategoryOptions"
                :loading="isServiceCategoryLoading"
                :ariaLabel="$t('service-sales-by-sales-type.label-category')"
                labelId="category"
                optionLabel="name"
                optionValue="id"
                @value-change="handleCategoryChange"
              />
            </div>

            <!-- Service -->
            <div class="filter-form-item">
              <label for="service">{{ $t('service-sales-by-sales-type.label-service') }}</label>
              <Select
                v-model="serviceModel"
                :options="serviceOptions"
                :loading="isServiceOptionsLoading"
                :ariaLabel="$t('service-sales-by-sales-type.label-service')"
                labelId="service"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Staffs -->
            <div class="filter-form-item">
              <label for="staff">{{ $t('service-sales-by-sales-type.label-staff') }}</label>
              <Select
                v-model="staffModel"
                :options="staffOptions"
                :loading="isStaffOptionsLoading"
                :ariaLabel="$t('service-sales-by-sales-type.label-staff')"
                labelId="staff"
                optionLabel="name"
                optionValue="id"
              />
            </div>
          </div>

          <div class="filter-form-counting">
            <label for="prepaid-sales-counting" class="prepaid-sales-counting-label">
              {{ $t('service-sales-by-sales-type.prepaid-sales-counting') }}
              <TooltipWithIconQuestion
                :tooltip="$t('service-sales-by-sales-type.tooltip-prepaid-sales-counting')"
              />
            </label>

            <div class="filter-form-radio">
              <div class="filter-form-radio-item">
                <RadioButton
                  v-model="prepaidSalesCountingModel"
                  inputId="when-sold"
                  name="when-sold"
                  :value="PREPAID_SALES_COUNTING_TYPE.SOLD"
                  :ariaLabel="$t('service-sales-by-sales-type.label-when-sold')"
                />
                <label for="when-sold">{{
                  $t('service-sales-by-sales-type.label-when-sold')
                }}</label>
              </div>
              <div class="filter-form-radio-item">
                <RadioButton
                  v-model="prepaidSalesCountingModel"
                  inputId="when-used"
                  name="when-used"
                  :value="PREPAID_SALES_COUNTING_TYPE.USED"
                  :ariaLabel="$t('service-sales-by-sales-type.label-when-used')"
                />
                <label for="when-used">{{
                  $t('service-sales-by-sales-type.label-when-used')
                }}</label>
              </div>
            </div>

            <div class="filter-form-checkbox">
              <Checkbox
                v-model="isPointDeductionIncludedModel"
                inputId="include-points-deduction"
                name="include-points-deduction"
                binary
                :ariaLabel="$t('service-sales-by-sales-type.label-include-points-deduction')"
              />
              <label for="include-points-deduction">
                {{ $t('service-sales-by-sales-type.label-include-points-deduction') }}
              </label>
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
import { computed, onBeforeUnmount, watch } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useActiveStaffs } from '@/composables/useActiveStaffs'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useServiceCategory } from '@/composables/useServiceCategory'
import { useServiceOptions } from '@/composables/useServiceOptions'
// Constants
import { type DateType, DATE_TYPE, FILTER_VALUES, PREPAID_SALES_COUNTING_TYPE } from '@/constants'
// Types
import type { ServiceSalesBySalesTypeFilterInterface } from '@/types/sales-report/ServiceSalesBySalesType'
// Utils
import {
  fromUnixTimestamp,
  validateExceedOneMonthRange,
  validateToDateNotBeforeFromDate,
} from '@/utils/dateUtils'
import { createSelectOptions } from '@/utils/selectUtils'

const props = defineProps<{
  modelValue: ServiceSalesBySalesTypeFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ServiceSalesBySalesTypeFilterInterface): void
  (e: 'filtersChanged'): void
}>()

// Composables
const { t } = useI18n()
const { showError } = useMessageDialog()
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
const { activeStaffs, isLoading: isStaffOptionsLoading, fetchActiveStaffs } = useActiveStaffs()

// Computed properties
const categoryModel = computed({
  get: () => props.modelValue.categoryId,
  set: (value): void => {
    emitUpdateModelValue({
      categoryId: value,
      serviceId: FILTER_VALUES.ALL,
    })
  },
})

const serviceModel = computed({
  get: () => props.modelValue.serviceId,
  set: (value): void => {
    emitUpdateModelValue({
      serviceId: value,
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

const prepaidSalesCountingModel = computed({
  get: () => props.modelValue.prepaidSalesCountingType,
  set: (value): void => {
    emitUpdateModelValue({
      prepaidSalesCountingType: value,
    })
  },
})

const isPointDeductionIncludedModel = computed({
  get: () => props.modelValue.isPointDeductionIncluded,
  set: (value): void => {
    emitUpdateModelValue({
      isPointDeductionIncluded: value,
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

const serviceCategoryOptions = computed(() =>
  createSelectOptions({
    items: serviceCategory.value,
    labelKey: 'serviceCategoryName',
    valueKey: 'serviceCategoryId',
    allLabel: t('general.all'),
  }),
)

const serviceOptions = computed(() =>
  createSelectOptions({
    items: serviceOptionsData.value,
    labelKey: 'serviceName',
    valueKey: 'serviceId',
    allLabel: t('general.all'),
  }),
)

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

const handleCategoryChange = (value: number): void => {
  fetchServiceOptions({
    shopId: props.modelValue.shopId,
    headquarterShopId: props.modelValue.headquarterShopId,
    serviceCategoryId: value,
    status: 1,
    pageSize: 100,
    pageNumber: 1,
  })
}

const emitUpdateModelValue = (value: Partial<ServiceSalesBySalesTypeFilterInterface>): void => {
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

onBeforeUnmount(() => {
  stopWatcher?.()
})
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

      & > label {
        flex-shrink: 0;

        @include maxResponsive(smallMobile) {
          margin-bottom: 0.2rem;
          display: inline-block;
        }
      }
    }

    .p-inputtext,
    .p-select {
      width: 100%;
      min-width: 200px;
    }
  }

  .filter-form-counting {
    display: flex;
    gap: 1.5rem;

    @include maxResponsive(smallMobile) {
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
      margin-bottom: 1rem;
    }

    .prepaid-sales-counting-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-form-radio {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      .filter-form-radio-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
  }

  .filter-form-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
