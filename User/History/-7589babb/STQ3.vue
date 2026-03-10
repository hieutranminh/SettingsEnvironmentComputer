<template>
  <Card>
    <template #content>
      <div class="products-header">
        <!-- Total -->
        <p>{{ $t('general.all-records', { total: totalItems }) }}</p>

        <!-- Checkbox -->
        <div class="show-inactive-checkbox">
          <Checkbox
            v-model="statusModel"
            inputId="show-inactive-product"
            binary
            :trueValue="GOODS_PRODUCTS_STATUS.INACTIVE"
            :falseValue="GOODS_PRODUCTS_STATUS.ACTIVE"
            :pt="{ input: { 'data-testid': 'products-checkbox-show-inactive' } }"
            @change="handleChangeStatus"
          />
          <label for="show-inactive-product">
            {{ $t('goods.common.show-inactives') }}
          </label>
        </div>
      </div>

      <!-- Table -->
      <DataTable
        v-model:selection="selectedProducts"
        :value="data"
        :lazy="true"
        :rowHover="true"
        :scrollable="true"
        :rows="pageSize"
        :first="firstIndex"
        :rowClass="getRowClass"
        :totalRecords="totalItems"
        :paginator="totalItems > pageSize"
        :scrollHeight="TABLE_GOODS_PRODUCTS.SCROLL_HEIGHT"
        showGridlines
        dataKey="productId"
        tableClass="products-table"
        tableStyle="min-width: 60rem"
        paginatorTemplate="FirstPageLink PrevPageLink NextPageLink LastPageLink JumpToPageDropdown"
        data-testid="products-table"
        @page="emit('pageChange', $event)"
      >
        <!-- Customize Pagination -->
        <template #paginatorstart>
          <PaginationInfo
            :currentPage="currentPage"
            :totalItems="totalItems"
            :pageSize="pageSize"
          />
        </template>

        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column selectionMode="multiple" headerStyle="width: 3rem" class="bg-gray"></Column>
            <Column :header="$t('goods.products.label-category')" headerClass="bg-gray" />
            <Column :header="$t('goods.products.label-product-code')" headerClass="bg-gray" />
            <Column :header="$t('goods.products.label-product-name')" headerClass="bg-gray" />
            <Column :header="$t('goods.products.label-specification')" headerClass="bg-gray" />
            <Column :header="$t('goods.products.label-supplier-price')" headerClass="bg-gray" />
            <Column :header="$t('goods.products.label-retail-price')" headerClass="bg-gray" />
            <Column :header="$t('goods.products.label-usage')" headerClass="bg-gray" />
            <Column :header="$t('general.edit')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column selectionMode="multiple" />
        <Column field="productCategoryName" />
        <Column field="productCode" />
        <Column field="productName" />
        <Column field="specification" />
        <Column field="supplierPrice">
          <template #body="{ data }">
            {{ formatAmount(data.supplierPrice, { showZeroValues: true }) }}
          </template>
        </Column>
        <Column field="retailPrice">
          <template #body="{ data }">
            {{ formatAmount(data.retailPrice, { showZeroValues: true }) }}
          </template>
        </Column>
        <Column field="usageStatus">
          <template #body="{ data }">
            {{ formatUsageStatus(data.usageStatus) }}
          </template>
        </Column>
        <Column field="actions">
          <template #body="{ data }">
            <Button
              :label="$t('general.edit')"
              severity="info"
              outlined
              data-testid="products-table-button-edit"
              @click="emit('onShowFormActionsDialog', data)"
            />
          </template>
        </Column>
      </DataTable>

      <!-- Actions -->
      <div class="products-actions">
        <Button
          severity="primary"
          :label="$t('goods.products.button-enable-selected-items')"
          :disabled="
            !selectedProducts.length || props.modelValue.status === GOODS_PRODUCTS_STATUS.ACTIVE
          "
          :class="{
            'disabled-button':
              !selectedProducts.length || props.modelValue.status === GOODS_PRODUCTS_STATUS.ACTIVE,
          }"
          data-testid="products-button-enable-selected"
          @click="
            emit('enableSelectedItems', selectedProducts, GOODS_PRODUCTS_UPDATE_STATUS.ENABLE)
          "
        />
        <Button
          severity="primary"
          :label="$t('goods.products.button-disable-selected-items')"
          :disabled="!selectedProducts.length"
          data-testid="products-button-disable-selected"
          @click="
            emit('disableSelectedItems', selectedProducts, GOODS_PRODUCTS_UPDATE_STATUS.DISABLE)
          "
          :class="{
            'disabled-button': !selectedProducts.length,
          }"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// Constants
import { STATUS } from '@/constants/common'
import { TABLE_GOODS_PRODUCTS } from '@/constants/table'
import {
  GOODS_PRODUCTS_STATUS,
  GOODS_PRODUCTS_UPDATE_STATUS,
  type GoodsProductsUpdateStatus,
} from '@/constants'
// Composables
import { useFormat } from '@/composables/useFormat'
import { useModelBinding } from '@/composables/useModelBinding'
// Types
import type { IProductsRequest, IProductsItem } from '@/types/goods/Products'
// Utils
import { formatAmount } from '@/utils/common'

// Interface for pagination event
interface IPaginationEvent {
  first: number
  rows: number
  page: number
  pageCount: number
}

const props = defineProps<{
  modelValue: IProductsRequest
  data: IProductsItem[]
  totalItems: number
  currentPage: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'changeStatus'): void
  (e: 'update:modelValue', value: IProductsRequest): void
  (e: 'pageChange', event: IPaginationEvent): void
  (e: 'onShowFormActionsDialog', data: IProductsItem): void
  (e: 'enableSelectedItems', data: IProductsItem[], status: GoodsProductsUpdateStatus): void
  (e: 'disableSelectedItems', data: IProductsItem[], status: GoodsProductsUpdateStatus): void
}>()

const selectedProducts = ref<IProductsItem[]>([])

const { formatUsageStatus } = useFormat()
const statusModel = useModelBinding<IProductsRequest>(props, emit, 'status')

const firstIndex = computed(() => Math.max(0, (props.currentPage - 1) * props.pageSize))

const getRowClass = (row: IProductsItem): string => {
  return row.status === STATUS.INACTIVE ? 'inactive-class' : ''
}

const handleChangeStatus = (): void => {
  handleResetSelectedProducts()
  emit('changeStatus')
}

const handleResetSelectedProducts = (): void => {
  selectedProducts.value = []
}

defineExpose({
  handleResetSelectedProducts,
})
</script>

<style lang="scss" scoped>
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.show-inactive-checkbox {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}

.products-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;

  .disabled-button {
    pointer-events: unset;
    cursor: not-allowed;
    background-color: var(--p-gray-400);
    border-color: var(--p-gray-200);
    color: $white;
  }
}

:deep(.products-table) {
  margin-top: 0.5px;
  .bg-gray {
    background-color: var(--p-gray-100);
  }

  .row-reorder {
    width: 3rem;
  }

  .p-datatable-thead {
    & > tr {
      & > th {
        .p-datatable-column-header-content {
          justify-content: center;
          text-align: center;
        }
      }
    }
  }

  .p-datatable-tbody,
  .p-datatable-tfoot {
    & > tr {
      &.inactive-class {
        background-color: var(--p-gray-100);
      }
      & > td {
        text-align: center;
        &:nth-child(2) {
          width: 15%;
        }
        &:nth-child(3) {
          width: 15%;
        }
        &:nth-child(4) {
          width: 25%;
        }
        &:nth-child(5) {
          width: 15%;
        }
        &:nth-child(8) {
          width: 60px;
          min-width: 60px;
        }
      }
    }

    .p-datatable-empty-message {
      & > td {
        text-align: center;
      }
    }
  }
}
</style>
