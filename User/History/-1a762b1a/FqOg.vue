<template>
  <main>
    <div class="app-title">
      <span>{{ $t('prepaid-cards.prepaid-cards') }}</span>

      <div class="app-title-actions">
        <Button severity="primary" @click="handleAddPrepaidCard(FORM_ACTION.ADD)">
          {{ $t('prepaid-cards.prepaid-card-add') }}
        </Button>
      </div>
    </div>

    <Card>
      <template #content>
        <div class="prepaid-card-list">
          <div class="prepaid-card-header">
            <div class="spacer"></div>
            <div class="show-inactive">
              <Checkbox
                v-model="status"
                binary
                input-id="show-inactive"
                :true-value="INACTIVE_STATUS"
                :false-value="ACTIVE_STATUS"
                @change="handleChangeStatus"
              />
              <label for="show-inactive">{{ $t('general.show-inactives') }}</label>
            </div>
          </div>

          <div class="p-datatable p-datatable-gridlines prepaid-card-table">
            <div class="p-datatable-wrapper">
              <table
                role="table"
                :aria-label="$t('prepaid-cards.prepaid-cards')"
                class="draggable-table"
              >
                <thead class="p-datatable-thead">
                  <tr>
                    <th>
                      {{ $t('general.type') }}
                    </th>
                    <th>
                      {{ $t('prepaid-cards.prepaid-card-name') }}
                    </th>
                    <th>
                      {{ $t('prepaid-cards.sales-price') }}
                    </th>
                    <th>
                      {{ $t('prepaid-cards.bonus') }}
                    </th>
                    <th>
                      {{ $t('prepaid-cards.initial-balance') }}
                    </th>
                    <th>
                      {{ $t('prepaid-cards.validity') }}
                    </th>
                    <th>
                      {{ $t('prepaid-cards.service-discount') }}
                    </th>
                    <th>
                      {{ $t('prepaid-cards.product-discount') || 'Product Discount' }}
                    </th>
                    <th>
                      {{ $t('prepaid-cards.salary') || 'Salary' }}
                    </th>
                    <th class="col-edit">
                      {{ $t('general.edit') }}
                    </th>
                  </tr>
                </thead>

                <tbody ref="tableBodyRef" class="p-datatable-tbody">
                  <tr
                    v-for="(element, index) in prepaidCardList"
                    :key="element.prepaidCardId"
                    :data-id="element.prepaidCardId"
                    :data-index="index"
                    :class="['draggable-row draggable-handle', handleCheckRowClass(element)]"
                  >
                    <td tabindex="0" :aria-label="$t('branch.drag-items-to-change-order')">
                      {{ formatPrepaidCardType(element.prepaidCardType) }}
                    </td>
                    <td>
                      {{ element.prepaidCardName }}
                    </td>
                    <td>
                      {{ formatCurrency(element.price) }}
                    </td>
                    <td>
                      <span v-if="isDepositCard(element)">
                        {{ formatCurrency(element.chargeAmount - element.price) }}
                      </span>
                    </td>
                    <td>
                      <span v-if="isShowChargeAmount(element)">
                        {{ formatNumber(element.chargeAmount) }}
                      </span>
                    </td>
                    <td>
                      {{ formatValidity(element) }}
                    </td>
                    <td>
                      {{ formatGoodDiscount(element.discountForService) }}
                    </td>
                    <td>
                      {{ formatGoodDiscount(element.discountForProduct) }}
                    </td>
                    <td>
                      {{ formatSalary(element) }}
                    </td>
                    <td class="col-edit">
                      <Button @click="handleEdit(element)" severity="info" outlined>
                        {{ $t('general.edit') }}
                      </Button>
                    </td>
                  </tr>
                  <tr v-if="!prepaidCardList.length">
                    <td colspan="11">
                      <div class="no-data-message">
                        <p>{{ $t('general.no-data-for-table') }}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </main>
  <PrepaidCardAction v-model:visible="isShowPrepaidCardAction" @success="handleSuccess" />
</template>

<script setup lang="ts">
import { usePrepaidCard } from '@/composables/goods/prepaid-card/usePrepaidCard'
import { onMounted, ref, watch } from 'vue'
import { useFormat } from '@/composables/useFormat'
import { FORM_ACTION } from '@/constants'
import type { IPrepaidCard } from '@/types/goods'
import { usePrepaidCardStore } from '@/stores/goods/PrepaidCard'
import { useSortableTable } from '@/composables/useSortableTable'
import PrepaidCardAction from './partial/PrepaidCardAction.vue'

// Constants
const ACTIVE_STATUS = 1
const INACTIVE_STATUS = 0

// Helpers
const { formatCurrency } = useFormat()
const { setPrepaidCardAction } = usePrepaidCardStore()

// Reactives
const isShowPrepaidCardAction = ref(false)
const prepaidCardList = ref<IPrepaidCard[]>([])
const tableBodyRef = ref<HTMLElement | null>(null)

const {
  loadTableData,
  tableData,
  status,
  formatPrepaidCardType,
  isDepositCard,
  isShowChargeAmount,
  formatValidity,
  formatGoodDiscount,
  formatSalary,
  handleChangeStatus,
  handleOrderNoChange,
} = usePrepaidCard()

// Methods
const handleAddPrepaidCard = (action: number): void => {
  setPrepaidCardAction(action, null)
  isShowPrepaidCardAction.value = true
}

const handleEdit = (row: IPrepaidCard): void => {
  const actionData = {
    action: FORM_ACTION.EDIT,
    data: row,
  }

  setPrepaidCardAction(actionData.action, actionData.data)
  isShowPrepaidCardAction.value = true
}

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return ''
  return value.toLocaleString()
}

const handleCheckRowClass = (row: IPrepaidCard): string => {
  return row.status === ACTIVE_STATUS ? 'active-row' : 'inactive-row'
}

const handleSuccess = async (): Promise<void> => {
  await loadTableData()
}

const handleReorder = async (
  oldIndex: number,
  newIndex: number,
  prevList: IPrepaidCard[],
): Promise<void> => {
  const movedItem = prevList[oldIndex]
  const targetItem = prevList[newIndex]

  if (!movedItem || !targetItem) {
    return
  }

  const dragIndex = tableData.value.findIndex(
    (item) => item.prepaidCardId === movedItem.prepaidCardId,
  )
  const dropIndex = tableData.value.findIndex(
    (item) => item.prepaidCardId === targetItem.prepaidCardId,
  )

  if (dragIndex < 0 || dropIndex < 0 || dragIndex === dropIndex) {
    return
  }

  await handleOrderNoChange({
    dragIndex,
    dropIndex,
    value: [...tableData.value],
  })
}

useSortableTable<IPrepaidCard>({
  tableBodyRef,
  items: prepaidCardList,
  onReorder: handleReorder,
})

// Lifecycle
onMounted(() => {
  loadTableData()
})

watch(
  tableData,
  (nextValue) => {
    prepaidCardList.value = [...nextValue]
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.app-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.prepaid-card-list {
  .prepaid-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;

    .spacer {
      flex: 1 1 auto;
    }

    .show-inactive {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .prepaid-card-table {
    .p-datatable-wrapper {
      max-height: 600px;
      overflow-y: auto;
    }

    .p-datatable-thead {
      z-index: 2;
      background-color: var(--p-gray-100);

      & > tr {
        & > th {
          padding: 0.25rem 0.5rem !important;
          line-height: 1.1;
          background-color: var(--p-gray-100);
          font-weight: 600;
          white-space: nowrap;

          .p-datatable-column-header-content {
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .p-datatable-tbody {
      & > tr {
        &.inactive-row {
          background-color: var(--p-gray-100);
        }

        & > td {
          padding: 0.25rem 0.5rem !important;
          line-height: 1.1;
          text-align: center;

          @include mobile {
            white-space: nowrap;
          }
        }
      }
    }

    :deep(.draggable-handle) {
      cursor: move;
    }

    :deep(.draggable-row) {
      cursor: move;
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
  }
}
</style>
