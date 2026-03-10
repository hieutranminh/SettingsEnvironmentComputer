<template>
  <Card>
    <template #content>
      <div class="filter">
        <div class="filter-form-item">
          <Label :label="$t('clients-by-type.label-sex')" />
          <Select :options="sexOptions" v-model="filters.sex" />
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
