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

<script setup lang="ts"></script>
