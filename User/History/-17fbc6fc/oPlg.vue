<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-range">
            <label for="#">{{ $t('general.label-date-range') }}</label>

            <div class="date-range">
              <DatePicker
                id="date-range-from"
                showIcon
                iconDisplay="input"
                view="month"
                appendTo="self"
                :minDate="minDateRange"
                :maxDate="maxDateRange"
                :manualInput="false"
                :modelValue="filterData.fromDate"
                :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
                @update:modelValue="handleFromMonthChange"
              />
              <span>~</span>
              <DatePicker
                id="date-range-to"
                showIcon
                iconDisplay="input"
                view="month"
                appendTo="self"
                :minDate="minDateRange || filterData.fromDate"
                :maxDate="maxDateRange"
                :manualInput="false"
                :modelValue="filterData.toDate"
                :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
                @update:modelValue="handleToMonthChange"
              />
            </div>
          </div>

          <div class="filter-form-counting">
            <label for="#">
              {{ $t('sales-by-month.prepaid-sales-counting') }}
              <TooltipWithIconQuestion :tooltip="$t('sales-by-month.tooltip-prepaid-sales-counting')" />
            </label>

            <div class="filter-form-radio">
              <div class="filter-form-radio-item">
                <RadioButton
                  v-model="prepaidSalesCountingModel"
                  inputId="when-sold"
                  name="when-sold"
                  :value="PREPAID_SALES_COUNTING_TYPE.SOLD"
                />
                <label for="when-sold">{{ $t('sales-by-month.label-when-sold') }}</label>
              </div>
              <div class="filter-form-radio-item">
                <RadioButton
                  v-model="prepaidSalesCountingModel"
                  inputId="when-used"
                  name="when-used"
                  :value="PREPAID_SALES_COUNTING_TYPE.USED"
                />
                <label for="when-used">{{ $t('sales-by-month.label-when-used') }}</label>
              </div>
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
import { computed, ref } from 'vue'

// Constants
import { PREPAID_SALES_COUNTING_TYPE, PRIMEVUE_DATE_FORMATS, TIMEZONE_TYPE } from '@/constants'
// Types
import type { SalesByMonthFilterInterface } from '@/types/sales-report/SalesByMonthFilter'
// Utils
import { fromUnixTimestamp, getEndOf, getStartOf, toUnixTimestamp } from '@/utils/dateUtils'

type DateValue = Date | null | undefined | Date[] | (Date | null)[]

const props = defineProps<{
  modelValue: SalesByMonthFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: SalesByMonthFilterInterface): void
  (e: 'filtersChanged'): void
}>()

const filterData = ref<{
  fromDate: DateValue
  toDate: DateValue
}>({
  fromDate: props.modelValue.fromDateTs ? fromUnixTimestamp(props.modelValue.fromDateTs).toDate() : new Date(),
  toDate: props.modelValue.toDateTs
    ? fromUnixTimestamp(props.modelValue.toDateTs).subtract(1, 'day').toDate()
    : new Date(),
})

const prepaidSalesCountingModel = computed({
  get: () => props.modelValue.prepaidSalesCountingType,
  set: (value) => {
    emitUpdateModelValue({
      prepaidSalesCountingType: value,
    })
  },
})

const minDateRange = computed(() => {
  const YEARS_TO_SUBTRACT = 10
  return fromUnixTimestamp(props.modelValue.fromDateTs).subtract(YEARS_TO_SUBTRACT, 'year').startOf('year').toDate()
})

const maxDateRange = computed(() => {
  return fromUnixTimestamp(props.modelValue.toDateTs).endOf('year').toDate()
})

// Type guards
const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date
}

const handleSearchClick = (): void => {
  emit('filtersChanged')
}

const handleFromMonthChange = (value: DateValue): void => {
  if (!isValidDate(value)) return

  const startOfUnit = getStartOf(value, 'day')
  emitUpdateModelValue({
    fromDateTs: toUnixTimestamp(startOfUnit.toDate(), TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  })
}

const handleToMonthChange = (value: DateValue): void => {
  if (!isValidDate(value)) return

  const endOfUnit = getEndOf(value, 'day')
  emitUpdateModelValue({
    toDateTs: toUnixTimestamp(endOfUnit.toDate(), TIMEZONE_TYPE.UTC, { keepLocalTime: true }),
  })
}

const emitUpdateModelValue = (value: Partial<SalesByMonthFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
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

    .filter-form-counting {
      display: flex;
      gap: 1.5rem;

      @include maxResponsive(smallMobile) {
        flex-wrap: wrap;
        gap: 0.5rem 1.5rem;
        margin-bottom: 1rem;
      }

      label {
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
