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
              <label for="staff">{{ $t('service-sales-by-item.label-staff') }}</label>
              <Select
                v-model="staffModel"
                :options="staffOptions"
                :loading="isStaffOptionsLoading"
                :ariaLabel="$t('service-sales-by-item.label-staff')"
                labelId="service"
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
import { computed, watch } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useActiveStaffs } from '@/composables/useActiveStaffs'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useServiceCategory } from '@/composables/useServiceCategory'
import { useServiceOptions } from '@/composables/useServiceOptions'
// Constants
import { type DateType, DATE_TYPE, FILTER_VALUES } from '@/constants'
// Types
import type { ServiceSalesBySalesTypeFilterInterface } from '@/types/sales-report/ServiceSalesBySalesType'
// Utils
import { fromUnixTimestamp, validateExceedOneMonthRange, validateToDateNotBeforeFromDate } from '@/utils/dateUtils'
const props = defineProps<{
  modelValue: ServiceSalesBySalesTypeFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ServiceSalesBySalesTypeFilterInterface): void
  (e: 'filtersChanged'): void
}>()

i

const { t } = useI18n()
const { showError } = useMessageDialog()
const { serviceCategory, isLoading: isServiceCategoryLoading, fetchServiceCategory } = useServiceCategory()
const {
  serviceOptions: serviceOptionsData,
  isLoading: isServiceOptionsLoading,
  fetchServiceOptions,
} = useServiceOptions()
const { activeStaffs, isLoading: isStaffOptionsLoading, fetchActiveStaffs } = useActiveStaffs()

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

const staffOptions = computed(() => [
  { id: FILTER_VALUES.ALL, name: t('general.all') },
  ...activeStaffs.value.map((item) => ({
    id: item.staffId,
    name: item.aliasName,
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

const emitUpdateModelValue = (value: Partial<ServiceSalesBySalesTypeFilterInterface>): void => {
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
