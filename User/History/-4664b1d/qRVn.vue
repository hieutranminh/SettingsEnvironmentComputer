<template>
  <section class="sales-by-date-header">
    <!-- Title -->
    <div class="sales-by-date-header-left">
      <h1>{{ $t('sales-by-date.title') }}</h1>
    </div>

    <!-- Action -->
    <div class="sales-by-date-header-right">
      <Button
        :label="$t('general.button-back')"
        icon="pi pi-arrow-left
"
        severity="info"
        @click="handleBack"
      />

      <Button :label="$t('general.button-print')" severity="info" @click="handlePrint" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

import { ROUTE_NAMES } from '@/constants/routeNames'

const emit = defineEmits<{
  (e: 'print'): void
}>()

const route = useRoute()
const router = useRouter()

const handleBack = () => {
  router.push({
    name: ROUTE_NAMES.REPORT,
    query: route.query,
  })
}

const handlePrint = () => {
  emit('print')
}
</script>

<style lang="scss" scoped>
.sales-by-date-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--p-gray-950);

  .sales-by-date-header-left {
    h1 {
      font-size: 18px;
      font-weight: 900;
    }
  }

  .sales-by-date-header-right {
    margin-left: auto;
    display: flex;
    gap: 5px;

    .p-button {
      width: 150px;
    }
  }
}
</style>
