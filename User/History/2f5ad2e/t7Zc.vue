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
import { toRef } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useDateRangeFilter } from '@/composables/useDateRangeFilter'
// Constants
import { type DateType, DATE_TYPE } from '@/constants'
// Types
import type { ClientsByPeriodFilterInterface } from '@/types/client-report/ClientsByPeriod'

const props = defineProps<{
  modelValue: ClientsByPeriodFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ClientsByPeriodFilterInterface): void
  (e: 'filtersChanged'): void
}>()

// Composables
const { t } = useI18n()
const { showError } = useMessageDialog()
const { validateRangeTypeFilters } = useDateRangeFilter(toRef(props, 'modelValue'))

// Event handlers
const handleSearchClick = () => {
  if (props.modelValue.dateType === DATE_TYPE.RANGE) {
    const validationResult = validateRangeTypeFilters()
    if (!validationResult.isValid) {
      return showError(t(validationResult.errorKey!))
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

const emitUpdateModelValue = (value: Partial<ClientsByPeriodFilterInterface>): void => {
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
