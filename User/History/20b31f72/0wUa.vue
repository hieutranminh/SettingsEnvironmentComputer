<template>
  <!-- Header -->
  <ProductsCategoriesHeader @onShowActionsCategoryDialog="handleShowActionsCategoryDialog" />

  <!-- Table -->
  <ProductsCategoriesTable
    v-model="filters"
    :data="items"
    @onRowReorder="handleRowReorder"
    @changeStatus="handleChangeStatus"
    @onShowActionsCategoryDialog="handleShowActionsCategoryDialog"
  />

  <!-- Form Actions Dialog -->
  <FormActionsDialog
    v-model:visible="isShowFormActionsDialog"
    :selectedItem="selectedItem"
    @addCategorySuccess="handleDataSuccess"
    @updateCategorySuccess="handleDataSuccess"
    @deleteCategorySuccess="handleDataSuccess"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// Constants
import { GOODS_PRODUCTS_CATEGORIES_STATUS, PAGINATION } from '@/constants'
// Composables
import { useProductsCategories } from '@/composables/goods/products-categories/useProductsCategories'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Components
import ProductsCategoriesHeader from './partials/ProductsCategoriesHeader.vue'
import ProductsCategoriesTable from './partials/ProductsCategoriesTable.vue'
import FormActionsDialog from './partials/FormActionsDialog.vue'
// Types
import type {
  IProductsCategoriesRequest,
  IProductsCategoriesItem,
} from '@/types/goods/ProductsCategories'

const { shop } = useAuthStore()
const { items, fetchData, changeOrder } = useProductsCategories()

// State
const filters = ref<IProductsCategoriesRequest>({
  pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE_MAX_500,
  status: GOODS_PRODUCTS_CATEGORIES_STATUS.ACTIVE,
  shopId: shop.shopId,
})
const isShowFormActionsDialog = ref(false)
const selectedItem = ref<IProductsCategoriesItem | null>(null)

const handleShowActionsCategoryDialog = (item?: IProductsCategoriesItem): void => {
  isShowFormActionsDialog.value = true
  selectedItem.value = item ?? null
}

const handleDataSuccess = (): void => {
  isShowFormActionsDialog.value = false
  fetchData(filters.value)
}

const handleChangeStatus = (): void => {
  fetchData(filters.value)
}

/**
 * Handle row reorder when user drags and drops categories
 * @param event - PrimeVue DataTable row reorder event containing dragIndex and dropIndex
 */
const handleRowReorder = async (event: { dragIndex: number; dropIndex: number }): Promise<void> => {
  const { dragIndex, dropIndex } = event
  // Get the dragged item to extract its ID
  const draggedItem = items.value[dragIndex]
  const targetItem = items.value[dropIndex]
  // if (!draggedItem || !targetItem) return
  const payload = {
    shopId: shop.shopId,
    oldPositionId: draggedItem.productCategoryId,
    newPositionId: targetItem.productCategoryId,
  }
  const success = await changeOrder(payload)
  success && (await fetchData(filters.value))
}

onMounted(() => {
  fetchData(filters.value)
})
</script>
