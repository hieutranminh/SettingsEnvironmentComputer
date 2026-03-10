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
import { ref, computed } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

// Constants
import { REPORT_TYPE_IN_CLIENTS_BY_TYPE } from '@/constants'

// Types
import type { ReportTypeInClientsByType } from '@/types/client-report/ClientsByType'

const { t } = useI18n()

const reportTypeModel = ref<ReportTypeInClientsByType>(REPORT_TYPE_IN_CLIENTS_BY_TYPE.SEX)
const reportTypeOptions = computed(() => [
  { id: REPORT_TYPE_IN_CLIENTS_BY_TYPE.SEX, name: t('clients-by-type.label-sex') },
  { id: REPORT_TYPE_IN_CLIENTS_BY_TYPE.CLIENT_RATING, name: t('clients-by-type.label-client-rating') },
  { id: REPORT_TYPE_IN_CLIENTS_BY_TYPE.CLIENT_GROUP, name: t('clients-by-type.label-client-group') },
])
</script>

<style scoped lang="scss"></style>
