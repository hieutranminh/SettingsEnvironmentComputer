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
                id="month"
                labelId="month"
                showIcon
                iconDisplay="input"
                view="month"
                appendTo="self"
                :manualInput="false"
                :dateFormat="PRIMEVUE_DATE_FORMATS.YM"
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
import { PRIMEVUE_DATE_FORMATS } from '@/constants'

import type { NewClientsRepeatFilterInterface } from '@/types/client-report/NewClientsRepeat'

const props = defineProps<{
  modelValue: NewClientsRepeatFilterInterface
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: NewClientsRepeatFilterInterface): void
  (e: 'filtersChanged'): void
}>()

// Composables

const handleSearchClick = () => {
  emit('filtersChanged')
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
