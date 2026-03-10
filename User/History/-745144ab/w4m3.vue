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
// Composables
import { useI18n } from 'vue-i18n'

import { useMessageDialog } from '@/composables/useMessageDialog'
// Constants
import { type DateType, DATE_TYPE } from '@/constants'
// Types
import type { SalesByRepeatClientsFilterInterface } from '@/types/client-report/SalesByRepeatClients'
// Utils
import { fromUnixTimestamp, validateExceedOneMonthRange, validateToDateNotBeforeFromDate } from '@/utils/dateUtils'

const props = defineProps<{
  modelValue: SalesByRepeatClientsFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: SalesByRepeatClientsFilterInterface): void
  (e: 'filtersChanged'): void
}>()

// Composables
const { t } = useI18n()
const { showError } = useMessageDialog()

// Computed properties
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

const emitUpdateModelValue = (value: Partial<SalesByRepeatClientsFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
}
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
    flex-wrap: wrap;
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
      width: 100%;
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
