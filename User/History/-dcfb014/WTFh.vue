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
                showIcon
                iconDisplay="input"
                view="month"
                appendTo="self"
                :manualInput="false"
                :modelValue="filterData.fromDate"
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
</script>

<style lang="scss" scoped></style>
