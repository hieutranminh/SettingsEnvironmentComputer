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

// Composables
import { useDateFormat } from '@/composables/useDateFormat'
// Constants
import { PRIMEVUE_DATE_FORMATS, TIMEZONE_TYPE } from '@/constants'
// Types
import type { NewClientsRepeatFilterInterface } from '@/types/client-report/NewClientsRepeat'
// Utils
import { fromUnixTimestamp, getStartOf, toUnixTimestamp, getEndOf } from '@/utils/dateUtils'
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

/**
 * Computed property for min date
 * @returns Min date
 * The reason I have to add 1 day is because
 * PrimeVue’s DatePicker displays values in UTC, while my getCurrentDate is based on the timezone
 * Therefore, I need to add 1 day to match PrimeVue’s display behavior
 */
const minDate = computed(() => {
  return getCurrentDate().subtract(YEARS_TO_SUBTRACT, 'year').startOf('year').add(1, 'day').toDate()
})

const maxDate = computed(() => {
  return getCurrentDate().endOf('year').toDate()
})

// Type guards
const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date
}

const handleSearchClick = (): void => {
  emit('filtersChanged')
}

const handleMonthChange = (value: DateValue): void => {
  if (!isValidDate(value)) return

  const startOfUnit = getStartOf(value, 'month')
  const endOfUnit = getEndOf(value, 'month')

  emit('update:modelValue', {
    ...props.modelValue,
    fromDateTs: toUnixTimestamp(startOfUnit.toDate(), TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
    toDateTs: toUnixTimestamp(endOfUnit.toDate(), TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  })
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
  }
}
</style>
