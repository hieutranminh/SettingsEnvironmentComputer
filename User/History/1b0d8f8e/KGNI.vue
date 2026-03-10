<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-group">
            <!-- Report By -->
            <div class="filter-form-item">
              <label for="report-by">{{ $t('clients-by-type.label-report-by') }}</label>

              <Select
                v-model="reportTypeModel"
                :options="reportTypeOptions"
                labelId="report-by"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Chart -->
            <div class="filter-form-item">
              <label for="chart">{{ $t('clients-by-type.label-chart') }}</label>
              <Select
                :modelValue="chartDisplayType"
                :options="chartDisplayTypeOptions"
                labelId="chart"
                optionLabel="name"
                optionValue="id"
                @update:modelValue="handleChartDisplayTypeChange"
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
import { computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

// Constants
import { CHART_DISPLAY_TYPE, REPORT_TYPE_IN_CLIENTS_BY_TYPE, type ChartDisplayType } from '@/constants'
// Types
import type { ClientsByTypeFilterInterface } from '@/types/client-report/ClientsByType'

const props = defineProps<{
  modelValue: ClientsByTypeFilterInterface
  chartDisplayType: ChartDisplayType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ClientsByTypeFilterInterface): void
  (e: 'chartDisplayTypeChanged', value: ChartDisplayType): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()

// Computed
const reportTypeModel = computed({
  get: () => props.modelValue.reportType,
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      reportType: value,
    })
  },
})

const reportTypeOptions = computed(() => [
  { id: REPORT_TYPE_IN_CLIENTS_BY_TYPE.SEX, name: t('clients-by-type.label-sex') },
  { id: REPORT_TYPE_IN_CLIENTS_BY_TYPE.CLIENT_RATING, name: t('clients-by-type.label-client-rating') },
  { id: REPORT_TYPE_IN_CLIENTS_BY_TYPE.CLIENT_GROUP, name: t('clients-by-type.label-client-group') },
])

const chartDisplayTypeOptions = computed(() => [
  { id: CHART_DISPLAY_TYPE.PIE, name: t('general.label-chart-pie') },
  { id: CHART_DISPLAY_TYPE.BAR, name: t('general.label-chart-bar') },
])

// Event handlers
const handleSearchClick = () => {
  emit('filtersChanged')
}

const handleChartDisplayTypeChange = (value: ChartDisplayType) => {
  emit('chartDisplayTypeChanged', value)
}
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
  }
}
</style>
