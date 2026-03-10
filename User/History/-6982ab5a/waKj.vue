<template>
  <section class="product-header">
    <!-- Title -->
    <div class="product-header-left">
      <h1>{{ $t('goods.products.title') }}</h1>
    </div>

    <!-- Action -->
    <div class="product-header-right">
      <router-link :to="{ name: ROUTE_NAMES.PRODUCTS_CATEGORIES }">
        <Button :label="$t('goods.products.button-navigate-products-categories')" severity="info" />
      </router-link>

      <Button
        :label="$t('goods.products.button-add-product')"
        severity="info"
        @click="handleShowActionsFormDialog"
      />

      <Button
        v-if="isDesktop"
        :label="excelButtonLabel"
        :loading="isDownloading"
        :disabled="isDownloading"
        severity="info"
        @click="handleDownloadExcel"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDevice } from '@/composables/useDevice'
import { ROUTE_NAMES } from '@/constants/routeNames'
import type { IProductsFilter, IProductsItem } from '@/types/goods/Products'
import { useProductsExcelDownload } from '@/composables/goods/products/useProductsExcelDownload'

const props = defineProps<{
  filters: IProductsFilter
  totalItems: number
}>()

const emit = defineEmits<{
  (e: 'onShowActionsFormDialog', item?: IProductsItem): void
}>()

const { t } = useI18n()
const { isDesktop } = useDevice()

const { downloadProductsExcel, isDownloading, progressPercent } = useProductsExcelDownload()

/**
 * Excel button label with dynamic text
 * Shows percentage when downloading
 *
 * Example:
 *   Not downloading: "Excel"
 *   Downloading: "Excel (45%)"
 */
const excelButtonLabel = computed(() => {
  const baseLabel = t('general.excel')
  return isDownloading.value ? `${baseLabel} (${progressPercent.value}%)` : baseLabel
})

/**
 * Handles showing the add/edit product form dialog
 */
const handleShowActionsFormDialog = (): void => {
  emit('onShowActionsFormDialog')
}

/**
 * Handles Excel download with streaming
 * Shows progress toast during download
 */
const handleDownloadExcel = async (): Promise<void> => {
  await downloadProductsExcel(props.filters, props.totalItems)
}

// Keep this for debugging
// Debug logging - Watch for progress updates
// watch([isDownloading, progressPercent, statusText], ([downloading, percent, status]) => {
//   if (downloading && percent > 0) {
//     // eslint-disable-next-line no-console
//     console.log(`📊 Progress: ${percent}% - ${status}`)
//   }
// })
</script>

<style lang="scss" scoped>
.product-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--p-gray-950);

  .product-header-left {
    h1 {
      font-size: 18px;
      font-weight: 900;
    }
  }

  .product-header-right {
    margin-left: auto;
    display: flex;
    gap: 5px;
  }
}
</style>
