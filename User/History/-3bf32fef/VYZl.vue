<template>
  <Card>
    <template #content>
      <div class="filter">
        <!-- Form -->
        <div class="filter-form">
          <div class="filter-form-group">
            <!-- Product Category -->
            <div class="filter-form-item">
              <label for="category">{{ $t('goods.products.label-category') }}</label>
              <Select
                v-model="categoryModel"
                :options="productsCategoriesOptions"
                labelId="category"
                optionLabel="name"
                optionValue="id"
              />
            </div>

            <!-- Product -->
            <div class="filter-form-item">
              <label for="product">{{ $t('goods.products.label-product') }}</label>
              <InputText
                v-model="productModel"
                id="product"
                :placeholder="$t('goods.products.placeholder-product')"
                @keyup.enter="handleSearchClick"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="filter-action">
          <Button
            :label="$t('general.button-search')"
            @click="handleSearchClick"
            icon="pi pi-search"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
// Constants
import { PAGINATION, GOODS_PRODUCTS_STATUS, FILTER_VALUES } from '@/constants'
// Stores
import { useI18n } from 'vue-i18n'
// Composables
import { useModelBinding, useStringModelBinding } from '@/composables/useModelBinding'
import { useProductsCategories } from '@/composables/goods/products-categories/useProductsCategories'
// Types
import type { IProductsFilter } from '@/types/goods/Products'

const props = defineProps<{
  modelValue: IProductsFilter
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: IProductsFilter): void
  (e: 'filtersChanged'): void
}>()

const { t } = useI18n()
const { items, fetchData } = useProductsCategories()

const categoryModel = useModelBinding(props, emit, 'productCategoryId')
const productModel = useStringModelBinding(props, emit, 'keyWord')

const productsCategoriesOptions = computed(() => {
  const all = { id: FILTER_VALUES.NONE, name: t('general.all') }
  const options = items.value.map((item) => ({
    id: item.productCategoryId,
    name: item.productCategoryName,
  }))
  return [all, ...options]
})

const handleSearchClick = (): void => {
  emit('filtersChanged')
}

onMounted(() => {
  fetchData({
    shopId: props.modelValue.shopId,
    pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE_MAX,
    status: GOODS_PRODUCTS_STATUS.ACTIVE,
  })
})
</script>

<style scoped lang="scss">
.p-card {
  margin-bottom: 1rem;
}

.filter {
  @include flexCenter;
  flex-wrap: wrap;

  @include maxResponsive(mobile) {
    display: block;
  }

  .filter-form {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1rem;

    @include maxResponsive(mobile) {
      margin-bottom: 1rem;
    }
  }

  .filter-form-group {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;

    @include maxResponsive(smallMobile) {
      display: block;
    }

    .filter-form-item {
      @include flexCenter;
      gap: 0.5rem;

      @include maxResponsive(smallMobile) {
        display: block;
        margin-bottom: 1rem;
      }

      & > label {
        flex-shrink: 0;

        @include maxResponsive(smallMobile) {
          margin-bottom: 0.2rem;
          display: inline-block;
        }
      }
    }
    .p-inputtext {
      width: 100%;
      min-width: 250px;
    }
    .p-select {
      width: 100%;
      min-width: 200px;
      max-width: 200px;
      @include maxResponsive(smallMobile) {
        max-width: unset;
      }
    }
  }

  .filter-action {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    @include maxResponsive(smallMobile) {
      justify-content: center;
    }
  }
}
</style>
