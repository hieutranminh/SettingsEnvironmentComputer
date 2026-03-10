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

          <div class="filter-form-group">
            <div class="filter-form-item">
              <div class="filter-form-checkbox">
                <Checkbox
                  v-model="prepaidGoodsModel"
                  inputId="prepaid-card"
                  name="prepaid-card"
                  :value="3"
                  :ariaLabel="$t('prepaid-goods-repurchase.label-prepaid-card')"
                />
                <label for="prepaid-card">
                  {{ $t('prepaid-goods-repurchase.label-prepaid-card') }}
                </label>
              </div>
              <div class="filter-form-checkbox">
                <Checkbox
                  v-model="prepaidGoodsModel"
                  inputId="prepaid-service"
                  name="prepaid-service"
                  :value="2"
                  :ariaLabel="$t('prepaid-goods-repurchase.label-prepaid-service')"
                />
                <label for="prepaid-service">
                  {{ $t('prepaid-goods-repurchase.label-prepaid-service') }}
                </label>
              </div>
            </div>

            <!-- Staffs -->
            <div class="filter-form-item">
              <label for="staff">{{ $t('service-sales-by-sales-type.label-staff') }}</label>
              <Select
                v-model="staffModel"
                :options="staffOptions"
                :loading="isStaffOptionsLoading"
                :ariaLabel="$t('service-sales-by-sales-type.label-staff')"
                labelId="service"
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
import { computed, onBeforeUnmount, watch } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

import { useActiveStaffs } from '@/composables/useActiveStaffs'
import { useMessageDialog } from '@/composables/useMessageDialog'
// Constants
import { type DateType, DATE_TYPE } from '@/constants'
// Types
import type { PrepaidGoodsRepurchaseFilterInterface } from '@/types/client-report/PrepaidGoodsRepurchase'
// Utils
import { fromUnixTimestamp, validateExceedOneMonthRange, validateToDateNotBeforeFromDate } from '@/utils/dateUtils'
import { createSelectOptions } from '@/utils/selectUtils'

const props = defineProps<{
  modelValue: PrepaidGoodsRepurchaseFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PrepaidGoodsRepurchaseFilterInterface): void
  (e: 'filtersChanged'): void
}>()

// Composables
const { t } = useI18n()
const { showError } = useMessageDialog()
const { activeStaffs, isLoading: isStaffOptionsLoading, fetchActiveStaffs } = useActiveStaffs()

const staffModel = computed({
  get: () => props.modelValue.staffId,
  set: (value) => {
    emitUpdateModelValue({
      staffId: value,
    })
  },
})

const prepaidGoodsModel = computed(() => [2, 3])

const staffOptions = computed(() =>
  createSelectOptions({
    items: activeStaffs.value,
    labelKey: 'aliasName',
    valueKey: 'staffId',
    allLabel: t('general.all'),
  }),
)

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

const emitUpdateModelValue = (value: Partial<PrepaidGoodsRepurchaseFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
}

const stopWatcher = watch(
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

onBeforeUnmount(() => {
  stopWatcher?.()
})
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
      width: 100%;
    }

    .filter-form-item,
    .filter-form-checkbox {
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
