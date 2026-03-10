<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div>Time filter picker</div>

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
                v-model="chartType"
                :options="chartTypeOptions"
                labelId="chart"
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
// Constants
import { FILTER_VALUES, REPORT_BY_TYPE, CHART_TYPE } from '@/constants'
// Stores
// Types
import type { ServiceSalesFilterInterface } from '@/types/sales-report/ServiceSalesFilter'

const props = defineProps<{
  modelValue: ServiceSalesFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ServiceSalesFilterInterface): void
}>()

const { t } = useI18n()
const { activeStaffs, isLoading, fetchActiveStaffs } = useActiveStaffs()

const reportByTypeOptions = computed(() => [
  { id: REPORT_BY_TYPE.STAFF, name: t('service-sales.label-staff') },
  { id: REPORT_BY_TYPE.CATEGORY, name: t('service-sales.label-category') },
  { id: REPORT_BY_TYPE.SERVICE, name: t('service-sales.label-service') },
  { id: REPORT_BY_TYPE.DATE_OF_WEEK, name: t('service-sales.label-day-of-week') },
  { id: REPORT_BY_TYPE.HOUR_OF_DAY, name: t('service-sales.label-hour-of-day') },
])

const chartTypeOptions = computed(() => [
  { id: CHART_TYPE.BAR, name: t('service-sales.label-bar') },
  { id: CHART_TYPE.PIE, name: t('service-sales.label-pie') },
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
  set: (value) => {
    emitUpdateModelValue({
      reportByType: value,
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

const handleSearchClick = () => {
  console.log('search')
}

const emitUpdateModelValue = (value: Partial<ServiceSalesFilterInterface>): void => {
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
</script>
