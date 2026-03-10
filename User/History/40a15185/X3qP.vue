<template>
  <section class="branch-sales-header">
    <!-- Title -->
    <div class="branch-sales-header-left">
      <h1>{{ $t('branch-sales.title') }}</h1>
    </div>

    <!-- Action -->
    <div v-if="isDesktop" class="branch-sales-header-right">
      <Button :label="$t('general.button-print')" severity="info" @click="handlePrint" />
    </div>
  </section>
</template>

<script setup lang="ts">
// Composables
import { useDevice } from '@/composables/useDevice'

const emit = defineEmits<{
  (e: 'print'): void
}>()

const { isDesktop } = useDevice()

const handlePrint = () => {
  emit('print')
}
</script>

<style lang="scss" scoped>
.branch-sales-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--p-gray-950);

  .branch-sales-header-left {
    h1 {
      font-size: 18px;
      font-weight: 900;
    }
  }

  .branch-sales-header-right {
    margin-left: auto;

    .p-button {
      width: 150px;
    }
  }
}
</style>
