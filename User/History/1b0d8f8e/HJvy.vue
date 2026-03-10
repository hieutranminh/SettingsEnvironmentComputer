<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form">
          <div class="filter-form-group">
            <div class="filter-form-item">
              <label for="report-by">{{ $t('clients-by-type.label-report-by') }}</label>

              <Select
                v-model="reportTypeModel"
                :options="reportTypeOptions"
                labelId="report-by"
                optionLabel="name"
                optionValue="id"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="filter-action">
        <Button :label="$t('general.button-search')" @click="handleSearchClick" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="scss"></style>
