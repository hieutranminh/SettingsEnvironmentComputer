<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-range">
            <DatePickerGroup
              :hiddenDate="true"
              :dateType="modelValue.dateType"
              :fromDateTs="modelValue.fromDateTs"
              :toDateTs="modelValue.toDateTs"
              :showPrevNext="false"
              @update:dateType="handleDateTypeChange"
              @dateChange="handleDateChange"
            />
          </div>

          <div class="filter-form-group">
            <div class="filter-form-item">
              <label for="chart">{{ $t('bookings-by-resource.label-chart') }}</label>
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
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { type DateType, type ChartDisplayType, CHART_DISPLAY_TYPE, DATE_TYPE } from '@/constants'
import type { IBookingsByResourceFilter } from '@/types/bookings-report/BookingsByResource'
import { useDateRange } from '@/composables/useDateRange'
import { useMessageDialog } from '@/composables/useMessageDialog'
const props = defineProps<{
  modelValue: IBookingsByResourceFilter
  chartDisplayType: ChartDisplayType
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: IBookingsByResourceFilter): void
  (e: 'chartDisplayTypeChanged', value: ChartDisplayType): void
  (e: 'chartDisplayValueChanged', value: number): void
  (e: 'filtersChanged'): void
}>()
const { t } = useI18n()
const { showError } = useMessageDialog()
const { validateDateRange } = useDateRange(toRef(props, 'modelValue'))

const chartDisplayTypeOptions = computed(() => [
  { id: CHART_DISPLAY_TYPE.BAR, name: t('general.label-chart-bar') },
  { id: CHART_DISPLAY_TYPE.PIE, name: t('general.label-chart-pie') },
])
const handleSearchClick = (): void => {
  if (props.modelValue.dateType === DATE_TYPE.RANGE) {
    const validationResult = validateDateRange({
      checkToDateNotBeforeFromDate: true,
      checkExceedOneYearRange: true,
    })
    if (!validationResult.isValid) {
      return showError(t(validationResult.errorKey!))
    }
  }
  emit('filtersChanged')
}

const emitUpdateModelValue = (value: Partial<IBookingsByResourceFilter>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
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

const handleChartDisplayTypeChange = (value: ChartDisplayType): void => {
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
    flex: 1;
    gap: 1rem;

    @include maxResponsive(mobile) {
      margin-bottom: 1rem;
      display: inline;
    }
  }

  .filter-form-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-left: 2rem;

    @include maxResponsive(smallMobile) {
      display: block;
      margin: 1rem 0 0 0;
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
