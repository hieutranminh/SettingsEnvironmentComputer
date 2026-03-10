<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-range">
            <DatePickerRange
              :fromDateTs="modelValue.fromDateTs"
              :toDateTs="modelValue.toDateTs"
              :maxFromDate="maxDateRange"
              :minToDate="minDateRange"
              @dateChange="handleDateChange"
            />
          </div>

          <div class="filter-form-counting">
            <label for="prepaid-sales-counting">
              {{ $t('sales-by-date.prepaid-sales-counting') }}
              <TooltipWithIconQuestion
                :tooltip="$t('sales-by-date.tooltip-prepaid-sales-counting')"
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
                <label for="when-sold">{{ $t('sales-by-date.label-when-sold') }}</label>
              </div>
              <div class="filter-form-radio-item">
                <RadioButton
                  v-model="prepaidSalesCountingModel"
                  inputId="when-used"
                  name="when-used"
                  :value="PREPAID_SALES_COUNTING_TYPE.USED"
                />
                <label for="when-used">{{ $t('sales-by-date.label-when-used') }}</label>
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
import { computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useModelBinding } from '@/composables/useModelBinding'
// Constants
import { PREPAID_SALES_COUNTING_TYPE } from '@/constants'
// Types
import type { ISalesByDateFilterInterface } from '@/types/sales-report/SalesByDate'
// Utils
import { fromUnixTimestamp, validateExceedOneMonthRange } from '@/utils/dateUtils'

const props = defineProps<{
  modelValue: ISalesByDateFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ISalesByDateFilterInterface): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { showError } = useMessageDialog()

const prepaidSalesCountingModel = computed({
  get: () => props.modelValue.prepaidSalesCountingType,
  set: (value) => {
    emitUpdateModelValue({
      prepaidSalesCountingType: value,
    })
  },
})

const minDateRange = computed(() => {
  return fromUnixTimestamp(props.modelValue.fromDateTs).toDate()
})

const maxDateRange = computed(() => {
  return fromUnixTimestamp(props.modelValue.toDateTs).subtract(1, 'day').toDate()
})

const handleSearchClick = (): void => {
  const fromDate = fromUnixTimestamp(props.modelValue.fromDateTs)
  const toDate = fromUnixTimestamp(props.modelValue.toDateTs)

  if (validateExceedOneMonthRange(fromDate, toDate)) {
    return showError(t('general.validate-date-range-exceed-one-month'))
  }

  emit('filtersChanged')
}

const handleDateChange = (value: { fromDateTs: number; toDateTs: number }): void => {
  emitUpdateModelValue({
    fromDateTs: value.fromDateTs,
    toDateTs: value.toDateTs,
  })
}

const emitUpdateModelValue = (value: Partial<ISalesByDateFilterInterface>): void => {
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
