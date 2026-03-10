<template>
  <Card>
    <template #content>
      <!-- Header -->
      <div class="products-categories-header">
        <!-- Total -->
        <p>{{ $t('general.all-records', { total: totalItems }) }}</p>

        <!-- Checkbox -->
        <div class="show-inactive-checkbox">
          <Checkbox
            v-model="statusModel"
            inputId="show-inactive-category"
            binary
            :trueValue="GOODS_PRODUCTS_CATEGORIES_STATUS.INACTIVE"
            :falseValue="GOODS_PRODUCTS_CATEGORIES_STATUS.ACTIVE"
            :pt="{ input: { 'data-testid': 'product-categories-checkbox-show-inactive' } }"
            @change="handleChangeStatus"
          />
          <label for="show-inactive-category">
            {{ $t('goods.products-categories.label-show-inactive') }}
          </label>
        </div>
      </div>

      <!-- Draggable Table (same pattern as ServicesTable / PrepaidCardView) -->
      <div class="p-datatable p-datatable-gridlines products-categories-table" data-testid="product-categories-table">
        <div class="p-datatable-wrapper">
          <table
            role="table"
            class="draggable-table"
            :aria-label="$t('goods.products-categories.label-items')"
          >
            <thead class="p-datatable-thead">
              <tr>
                <th class="bg-gray">
                  {{ $t('goods.products-categories.label-items') }}
                </th>
                <th class="bg-gray last-column">
                  {{ $t('goods.products-categories.label-edit') }}
                </th>
              </tr>
            </thead>

            <tbody ref="tableBodyRef" class="p-datatable-tbody">
              <tr
                v-for="(element, index) in internalData"
                :key="element.productCategoryId"
                :data-id="element.productCategoryId"
                :data-index="index"
                :class="['draggable-row', getRowClass(element)]"
              >
                <td
                  class="text-left draggable-handle"
                  tabindex="0"
                  :aria-label="$t('branch.drag-items-to-change-order')"
                >
                  {{ element.productCategoryName }}
                </td>
                <td>
                  <Button
                    :label="$t('general.edit')"
                    severity="info"
                    outlined
                    data-testid="product-categories-table-button-edit"
                    @click="handleShowActionsCategoryDialog(element)"
                  />
                </td>
              </tr>

              <tr v-if="!internalData.length">
                <td colspan="3">
                  <div class="no-data-message">
                    {{ $t('general.no-data-for-table') }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <Paginator
          v-if="totalItems > pageSize"
          :first="firstIndex"
          :rows="pageSize"
          :totalRecords="totalItems"
          template="FirstPageLink PrevPageLink NextPageLink LastPageLink JumpToPageDropdown"
          data-testid="product-categories-paginator"
          @page="handlePageChange"
        >
          <template #start>
            <PaginationInfo
              :currentPage="currentPage"
              :totalItems="totalItems"
              :pageSize="pageSize"
            />
          </template>
        </Paginator>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
// Composables
import { ref, watch, computed } from 'vue'
import { useModelBinding } from '@/composables/useModelBinding'
import { useSortableTable } from '@/composables/useSortableTable'
// Constants
import { STATUS } from '@/constants/common'
import { GOODS_PRODUCTS_CATEGORIES_STATUS } from '@/constants'
// Components
import PaginationInfo from '@/components/common/PaginationInfo.vue'
// Types
import type { IProductsCategoriesItem } from '@/types/goods/ProductsCategories'
import type { IProductsCategoriesRequest } from '@/types/goods/ProductsCategories'

// Interface for pagination event
interface IPaginationEvent {
  first: number
  rows: number
  page: number
  pageCount: number
}

const props = defineProps<{
  modelValue: IProductsCategoriesRequest
  data: IProductsCategoriesItem[]
  totalItems: number
  currentPage: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'changeStatus'): void
  (e: 'update:modelValue', value: IProductsCategoriesRequest): void
  (e: 'onShowActionsCategoryDialog', data: IProductsCategoriesItem): void
  (e: 'onRowReorder', event: { dragIndex: number; dropIndex: number }): void
  (e: 'pageChange', event: IPaginationEvent): void
}>()

const statusModel = useModelBinding<IProductsCategoriesRequest>(props, emit, 'status')
const internalData = ref<IProductsCategoriesItem[]>([...props.data])
const tableBodyRef = ref<HTMLElement | null>(null)

const firstIndex = computed(() => Math.max(0, (props.currentPage - 1) * props.pageSize))

const handleChangeStatus = (): void => {
  emit('changeStatus')
}

const handleShowActionsCategoryDialog = (data: IProductsCategoriesItem): void => {
  emit('onShowActionsCategoryDialog', data)
}

const getRowClass = (row: IProductsCategoriesItem): string => {
  return row.status === STATUS.INACTIVE ? 'inactive-class' : ''
}

const handleReorder = async (
  oldIndex: number,
  newIndex: number,
  _prevList: IProductsCategoriesItem[],
): Promise<void> => {
  emit('onRowReorder', { dragIndex: oldIndex, dropIndex: newIndex })
}

const handlePageChange = (event: IPaginationEvent): void => {
  emit('pageChange', event)
}

useSortableTable<IProductsCategoriesItem>({
  tableBodyRef,
  items: internalData,
  onReorder: handleReorder,
})

watch(
  () => props.data,
  (next) => {
    internalData.value = [...next]
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.products-categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.show-inactive-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: flex-end;
}

.products-categories-table {
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
        &.last-column {
          width: 10%;
          @include maxResponsive(ipad) {
            width: 120px;
          }
          @include maxResponsive(ipad) {
            width: 100px;
          }
        }
      }
    }
  }

  .p-datatable-wrapper {
    max-height: 600px;
    overflow-y: auto;
  }

  .row-reorder-col {
    width: 3rem;
    text-align: center;
  }

  .p-datatable-thead {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: var(--p-gray-100);

    & > tr {
      & > th {
        background-color: var(--p-gray-100);
      }
    }
  }

  :deep(.draggable-handle) {
    cursor: move;
  }

  :deep(.draggable-row) {
    cursor: pointer;
  }

  :deep(.drag-ghost) {
    opacity: 0.4;
    background-color: $green-1;
  }

  :deep(.drag-chosen) {
    background-color: $green-1;
  }

  :deep(.drag-active) {
    cursor: grabbing;
  }

  .p-datatable-tbody,
  .p-datatable-tfoot {
    & > tr {
      &.inactive-class {
        background-color: var(--p-gray-100);
      }
      & > td {
        text-align: center;
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
