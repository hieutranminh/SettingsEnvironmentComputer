<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-group">
            <!-- Month -->
            <div class="filter-form-item">
              <label for="month">{{ $t('new-clients-repeat.label-as-of') }}</label>
              <DatePicker
                showIcon
                id="month"
                view="month"
                appendTo="self"
                iconDisplay="input"
                :minDate="minDate"
                :maxDate="maxDate"
                :manualInput="false"
                :modelValue="convertedMonth"
                :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
                @update:modelValue="handleMonthChange"
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

import { useDateFormat } from '@/composables/useDateFormat'
import { PRIMEVUE_DATE_FORMATS } from '@/constants'
import type { NewClientsRepeatFilterInterface } from '@/types/client-report/NewClientsRepeat'
import { fromUnixTimestamp } from '@/utils/dateUtils'
const props = defineProps<{
  modelValue: NewClientsRepeatFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: NewClientsRepeatFilterInterface): void
  (e: 'filtersChanged'): void
}>()

// Constants
const YEARS_TO_SUBTRACT = 10

// Types
type DateValue = Date | null | undefined | Date[] | (Date | null)[]

// Composables
const { getCurrentDate } = useDateFormat()

const convertedMonth = computed(() => {
  return props.modelValue.fromDateTs
    ? fromUnixTimestamp(props.modelValue.fromDateTs).toDate()
    : getCurrentDate().toDate()
})

const minDate = computed(() => {
  return getCurrentDate().subtract(YEARS_TO_SUBTRACT, 'year').startOf('year').toDate()
})

const maxDate = computed(() => {
  return getCurrentDate().endOf('year').toDate()
})

const handleSearchClick = () => {
  emit('filtersChanged')
}

const handleMonthChange = (value: DateValue) => {
  console.log(value)
}
</script>

<style lang="scss" scoped>
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
