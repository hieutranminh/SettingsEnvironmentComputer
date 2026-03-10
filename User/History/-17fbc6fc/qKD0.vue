<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-range">
            <DatePickerRange
              :fromDateTs="modelValue.fromDateTs"
              :toDateTs="modelValue.toDateTs"
              :minFromDate="minDateRange"
              :maxFromDate="maxDateRange"
              :minToDate="minDateRange"
              :maxToDate="maxDateRange"
              :viewMode="DATE_VIEW_MODE.MONTH"
              @dateChange="handleDateChange"
            />
          </div>

          <div class="filter-form-counting">
            <label for="prepaid-sales-counting">
              {{ $t('sales-by-month.prepaid-sales-counting') }}
              <TooltipWithIconQuestion
                :tooltip="$t('sales-by-month.tooltip-prepaid-sales-counting')"
              />
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

// Composables
import { useDateRange } from '@/composables/useDateRange'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Constants
import { PREPAID_SALES_COUNTING_TYPE, DATE_VIEW_MODE, DATE_UNITS } from '@/constants'
// Types
import type { ISalesByMonthFilterInterface } from '@/types/sales-report/SalesByMonth'
// Utils
import { getCurrentDate } from '@/utils/dateUtils'

const props = defineProps<{
  modelValue: ISalesByMonthFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ISalesByMonthFilterInterface): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { showError } = useMessageDialog()
const { validateDateRange } = useDateRange(toRef(props, 'modelValue'))

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
  return getCurrentDate()
    .subtract(YEARS_TO_SUBTRACT, DATE_UNITS.YEAR)
    .startOf(DATE_UNITS.YEAR)
    .toDate()
})

const maxDateRange = computed(() => {
  return getCurrentDate().endOf(DATE_UNITS.YEAR).toDate()
})

const handleSearchClick = (): void => {
  const validationResult = validateDateRange({
    checkToDateNotBeforeFromDate: true,
    checkExceedOneYearRange: true,
  })
  if (!validationResult.isValid) {
    return showError(t(validationResult.errorKey!))
  }
  emit('filtersChanged')
}

const handleDateChange = (value: { fromDateTs: number; toDateTs: number }): void => {
  emitUpdateModelValue({
    fromDateTs: value.fromDateTs,
    toDateTs: value.toDateTs,
  })
}

const emitUpdateModelValue = (value: Partial<ISalesByMonthFilterInterface>): void => {
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
  }
}
</style>
