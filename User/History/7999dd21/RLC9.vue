<template>
  <!-- Header -->
  <ProductsHeader
    @onShowActionsFormDialog="handleShowFormActionsDialog"
    :filters="appliedFilters"
    :totalItems="totalItems"
  />

  <!-- Filter -->
  <ProductsFilter v-model="filters" @filtersChanged="handleFiltersChanged" />

  <!-- Table -->
  <ProductsTable
    v-model="filters"
    ref="productsTableRef"
    :data="items"
    :totalItems="totalItems"
    :currentPage="currentPage"
    :pageSize="pageSize"
    @changeStatus="handleFiltersChanged"
    @pageChange="handlePageChange"
    @onShowFormActionsDialog="handleShowFormActionsDialog"
    @enableSelectedItems="handleUpdateStatusSelectedItems"
    @disableSelectedItems="handleUpdateStatusSelectedItems"
  />

  <!-- Form Actions Dialog -->
  <FormActionsDialog
    v-model:visible="isShowFormActionsDialog"
    :selectedItem="selectedItem"
    @addProductSuccess="handleDataSuccess"
    @updateProductSuccess="handleDataSuccess"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// Constants
import {
  PAGINATION,
  GOODS_PRODUCTS_STATUS,
  FILTER_VALUES,
  type GoodsProductsUpdateStatus,
} from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Components
import ProductsHeader from './partials/ProductsHeader.vue'
import ProductsFilter from './partials/ProductsFilter.vue'
import ProductsTable from './partials/ProductsTable.vue'
import FormActionsDialog from './partials/FormActionsDialog.vue'
// Composables
import { useProducts } from '@/composables/goods/products/useProducts'
import { useProductsForm } from '@/composables/goods/products/useProductsForm'
// Types
import type { IProductsFilter, IProductsItem } from '@/types/goods/Products'

// Interface for pagination event
interface IPaginationEvent {
  first: number
  rows: number
  page: number
  pageCount: number
}

const { shop } = useAuthStore()
const { items, totalItems, currentPage, pageSize, savedFilters, fetchData } = useProducts()
const { handleUpdateProductsStatus } = useProductsForm(ref(null))
// State
const filters = ref<IProductsFilter>({
  keyWord: '',
  usageStatus: '',
  shopId: shop.shopId,
  productCategoryId: FILTER_VALUES.NONE,
  pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  status: GOODS_PRODUCTS_STATUS.ACTIVE,
})
// Filters from last successful fetch — used for Excel download to avoid using uncommitted filter values
const appliedFilters = computed<IProductsFilter>(() => savedFilters.value ?? filters.value)
const isShowFormActionsDialog = ref(false)
const selectedItem = ref<IProductsItem | null>(null)
const productsTableRef = ref<InstanceType<typeof ProductsTable> | null>(null)

const handleFiltersChanged = (): void => {
  filters.value.pageNumber = PAGINATION.DEFAULT_PAGE_NUMBER
  handleFetchData()
}

const handlePageChange = (event: IPaginationEvent): void => {
  const newPageNumber = Math.floor(event.first / event.rows) + 1
  const newPageSize = event.rows

  filters.value.pageNumber = newPageNumber
  filters.value.pageSize = newPageSize

  fetchData({ ...appliedFilters.value, pageNumber: newPageNumber, pageSize: newPageSize })
  productsTableRef.value?.handleResetSelectedProducts()
}

const handleShowFormActionsDialog = (data?: IProductsItem): void => {
  isShowFormActionsDialog.value = true
  selectedItem.value = data ?? null
}

const handleUpdateStatusSelectedItems = async (
  data: IProductsItem[],
  status: GoodsProductsUpdateStatus,
): Promise<void> => {
  const productIds = data.map((item) => item.productId)

  const success = await handleUpdateProductsStatus({
    status,
    productIds,
    shopId: shop.shopId,
  })

  success && handleFetchData()
}

const handleDataSuccess = (): void => {
  isShowFormActionsDialog.value = false
  handleFetchData()
}

const handleFetchData = (): void => {
  fetchData(filters.value)
  productsTableRef.value?.handleResetSelectedProducts()
}

onMounted(() => {
  fetchData(filters.value)
})
</script>
