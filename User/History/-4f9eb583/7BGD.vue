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
import { useI18n } from 'vue-i18n'
import { type DateType, type ChartDisplayType, DATE_TYPE } from '@/constants'
import type { IBookingsRatioFilter } from '@/types/bookings-report/BookingsRatio'
import { useMessageDialog } from '@/composables/useMessageDialog'
import {
  fromUnixTimestamp,
  validateToDateNotBeforeFromDate,
  validateExceedThreeMonthRange,
} from '@/utils/dateUtils'
const props = defineProps<{
  modelValue: IBookingsRatioFilter
  chartDisplayType: ChartDisplayType
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: IBookingsRatioFilter): void
  (e: 'filtersChanged'): void
}>()
const { t } = useI18n()
const { showError } = useMessageDialog()

const handleSearchClick = (): void => {
  if (props.modelValue.dateType === DATE_TYPE.RANGE) {
    const fromDate = fromUnixTimestamp(props.modelValue.fromDateTs)
    const toDate = fromUnixTimestamp(props.modelValue.toDateTs)
    if (validateToDateNotBeforeFromDate(fromDate, toDate)) {
      return showError(t('general.validate-date-range-not-before-from-date'))
    }
    if (validateExceedThreeMonthRange(fromDate, toDate)) {
      return showError(t('general.validate-date-range-exceed-three-month'))
    }
  }
  emit('filtersChanged')
}

const emitUpdateModelValue = (value: Partial<IBookingsRatioFilter>): void => {
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
    }
  }

  .filter-form-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-left: 2rem;

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
