<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div>Time filter picker</div>

          <div class="filter-form-group">
            <div class="filter-form-item">
              <label for="report-by">{{ $t('service-sales.label-report-by') }}</label>

              <Select
                v-model="reportByModel"
                :options="reportByTypeOptions"
                labelId="report-by"
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
import { computed } from 'vue'

// Composables

import { useI18n } from 'vue-i18n'
// Constants

import { FILTER_VALUES } from '@/constants'
// Stores

// Types
import type { ServiceSalesFilterInterface } from '@/types/sales-report/ServiceSalesFilter'

const props = defineProps<{
  modelValue: ServiceSalesFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ServiceSalesFilterInterface): void
}>()

const reportByTypeOptions = computed(() => [{ id: FILTER_VALUES.ALL, name: t('general.all') }])

const reportByModel = computed({
  get: () => props.modelValue.reportByType,
  set: (value) => {
    emitUpdateModelValue({
      reportByType: value,
    })
  },
})

const handleSearchClick = () => {
  console.log('search')
}

const emitUpdateModelValue = (value: Partial<ServiceSalesFilterInterface>): void => {
  emit('update:modelValue', {
    ...props.modelValue,
    ...value,
  })
}
</script>
