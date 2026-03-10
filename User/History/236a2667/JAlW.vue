<template>
  <section v-if="isLoaded" class="sales-table" :aria-label="$t('sales-report.title')">
    <div class="sales-table__header">
      <TooltipWithIconQuestion
        :tooltip="$t('general.help')"
        @click="handleShowSalesInformationSupport"
      />
      <label for="show-deleted">
        <Checkbox
          :modelValue="isIncludeDeleted"
          binary
          inputId="show-deleted"
          @update:modelValue="handleShowDeletedChange"
        />
        <span class="show-deleted-label">{{ $t('sales-history.show-deleted') }}</span>
      </label>
    </div>
    <!-- Mobile View -->
    <div v-if="isMobile" class="sales-table__mobile">
      <div class="sales-table__mobile-header">
        <p v-dompurify-html="totalRecordText" />
        <TooltipWithIconQuestion @click="handleShowSalesInformationSupport" />
      </div>

      xxxxx
      <SalesRowMobile
        v-for="row in salesHistoryData"
        :key="row.refId"
        :row="row"
        @viewDetail="handleMobileViewDetail"
        @clickNotes="handleMobileClickNotes"
      />

      <Paginator
        v-if="pagination.totalPages && pagination.totalPages > 1"
        :rows="pagination.pageSize ?? PAGINATION.DEFAULT"
        :totalRecords="pagination.totalItems"
        :first="(pagination.pageNumber - 1) * pagination.pageSize"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink JumpToPageDropdown"
        @page="handlePageChange"
      />
    </div>

    <DataTable
      v-else
      :value="salesHistoryData"
      :paginator="pagination.totalPages ? pagination.totalPages > 1 : false"
      :rows="pagination.pageSize"
      :total-records="pagination.totalItems"
      :first="(pagination.pageNumber - 1) * pagination.pageSize"
      :lazy="true"
      dataKey="id"
      scrollable
      responsiveLayout="scroll"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink NextPageLink LastPageLink JumpToPageDropdown"
      tableStyle="min-width: 1200px"
      scrollHeight="600px"
      rowHover
      class="sales-history-table"
      :rowClass="handleSalesTableClass"
      @page="handlePageChange"
      showGridlines
    >
      <Column :header="$t('general.date')" class="col-date">
        <template #body="{ data }">
          {{ handleDateCell(data.invoiceDateTimeTS) }}
        </template>
      </Column>
      <Column :header="$t('sales-history.client-name')">
        <template #body="{ data }">
          <p v-if="data.clientId">
            <span v-if="isClientOfCurentShop(data)">{{ data.clientName }} </span>
            <span v-tooltip.top="data.clientShopName" v-else class="text-primary">{{
              data.clientName
            }}</span>
          </p>
          <p v-else :class="handleClientNameClass(data)">
            <span v-if="data.clientName">{{ data.clientName }}</span>
            <span v-else>{{ $t('sales-history.unregistered-client') }}</span>
          </p>
        </template>
      </Column>
      <Column
        field="salesItems"
        :header="$t('sales-history.sales-items')"
        :class="'col-sales-items'"
      >
        <template #body="{ data }">
          <EllipsisList
            :items="data.items"
            :refType="data.refType"
            :maxVisible="MAX_VISIBLE_ITEMS"
            :highlightPredicate="isPrepaidGoodItem"
          />
        </template>
      </Column>
      <Column field="staffs" :header="$t('sales-history.staff')" :class="'col-staff'">
        <template #body="{ data }">
          <SalesStaffList
            :items="data.items"
            :maxVisible="MAX_VISIBLE_ITEMS"
            :refType="data.refType"
          />
        </template>
      </Column>

      <Column :header="$t('sales-history.sales-type')" :class="'col-sales-type'">
        <template #body="{ data }">
          <SalesTypeList
            :items="data.items"
            :maxVisible="MAX_VISIBLE_ITEMS"
            :refType="data.refType"
          />
        </template>
      </Column>
      <Column :header="$t('sales-history.discount')" :class="'col-discount'">
        <template #body="{ data }">
          <SalesDiscountList
            :items="data.items"
            :maxVisible="MAX_VISIBLE_ITEMS"
            :sales-setup="salesSetup"
            :refType="data.refType"
          />
        </template>
      </Column>
      <Column :header="$t('sales-history.amount')" :class="'col-amount'">
        <template #body="{ data }">
          <SalesAmountList
            :items="data.items"
            :maxVisible="MAX_VISIBLE_ITEMS"
            :refType="data.refType"
          />
        </template>
      </Column>
      <Column :header="$t('sales-history.payment-method')" :class="'col-payment-method'">
        <template #body="{ data }">
          <SalesPaymentMethodList :salesData="data" :maxVisible="MAX_VISIBLE_ITEMS" />
        </template>
      </Column>
      <Column :header="$t('sales-history.pay-amount')" :class="'col-pay-amount'">
        <template #body="{ data }">
          <SalesPayAmountList :salesData="data" :maxVisible="MAX_VISIBLE_ITEMS" />
        </template>
      </Column>
      <Column :header="$t('general.notes')" :class="'col-notes'">
        <template #body="{ data }">
          <ClampTooltipText :text="data.notes" :maxLines="3" @click="handleEditNotes(data)" />
        </template>
      </Column>
      <Column :header="$t('sales-report.label-detail')" :class="'col-detail'">
        <template #body="{ data }">
          <Button
            v-if="data.refType === SALES_REF_TYPE.SALES && data.refStatus !== SALES_STATUS.DELETED"
            :label="$t('general.view')"
            outlined
            @click="handleDetailSalesCell(data)"
          />
          <Button
            v-else-if="
              data.refType === SALES_REF_TYPE.REFUND && data.refStatus !== SALES_STATUS.DELETED
            "
            :label="$t('general.view')"
            outlined
            @click="handleDetailRefundCell(data)"
          />

          <span v-else>{{ $t('general.deleted') }}</span>
        </template>
      </Column>
      <template #empty>
        <div class="table-footer">
          {{ $t('general.no-data-for-table') }}
        </div>
      </template>
    </DataTable>
  </section>
  <NoteAction v-model:visible="noteActionVisible" :text="noteActionText" :readonly="true" />

  <SalesInformationSupport v-model:visible="salesInformationSupportVisible" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useSalesHistory, type IGoodsFilter } from '@/composables/sales/useSalesHistory'
import type { ISalesHistoryItem } from '@/types/sales-report/SalesTotalByItem'
import { SALES_REF_TYPE, FORM_ACTION, PAGINATION } from '@/constants'
import SalesInformationSupport from './partial/SalesInformationSupport.vue'
import SalesStaffList from '@/components/sales/SalesStaffList.vue'
import EllipsisList from '@/components/common/EllipsisList.vue'
import SalesTypeList from '@/components/sales/SalesTypeList.vue'
import SalesDiscountList from '@/components/sales/SalesDiscountList.vue'
import SalesAmountList from '@/components/sales/SalesAmountList.vue'
import SalesPaymentMethodList from '@/components/sales/SalesPaymentMethodList.vue'
import SalesPayAmountList from '@/components/sales/SalesPayAmountList.vue'
import ClampTooltipText from '@/components/common/ClampTooltipText.vue'
import NoteAction from '@/components/common/NoteAction.vue'
import { useSalesStore } from '@/stores/sales/sales'
import { useRefundStore } from '@/stores/refund/refund'
import type { IRefundItemDetail } from '@/types/sales/refund'
import SalesRowMobile from '../sales-row-mobile/SalesRowMobile.vue'
import { useDevice } from '@/composables/useDevice'
import type { ISalesSetup } from '@/types/sales/SalesSetup'
import TooltipWithIconQuestion from '@/components/common/TooltipWithIconQuestion.vue'
import { t } from '@/plugins/i18n'
import { SALES_STATUS } from '@/constants'
import type { IPagingInfo } from '@/types/sales-report/SalesTotalByItem'

const props = withDefaults(
  defineProps<{
    data: ISalesHistoryItem[]
    pagination: IPagingInfo
    salesSetup?: ISalesSetup | null
    goodFilter?: IGoodsFilter | null
    isIncludeDeleted: boolean
  }>(),
  {
    salesSetup: null,
    goodFilter: null,
  },
)

const emit = defineEmits<{
  (e: 'pageChange', value: { page: number; rows: number }): void
  (e: 'deletedChange'): void
  (e: 'update:isIncludeDeleted', value: boolean): void
  (e: 'clickViewDetail', value: ISalesHistoryItem): void
  (e: 'clickViewDetailRefund', value: IRefundItemDetail): void
}>()

const MAX_VISIBLE_ITEMS = 10

const isLoaded = ref(false)

// Helpers
const salesStore = useSalesStore()
const refundStore = useRefundStore()
const { isMobile } = useDevice()
const { goodsFilter } = useSalesHistory()

const noteActionVisible = ref<boolean>(false)
const noteActionText = ref<string>('')
const salesInformationSupportVisible = ref(false)

const salesHistoryData = computed(() => {
  return props.data
})

const totalRecordText = computed(() => {
  return t('general.all-result', {
    total_records: props.pagination.totalItems,
  })
})

const handleSalesTableClass = (row: ISalesHistoryItem): string => {
  return row.refStatus === SALES_STATUS.DELETED ? 'deleted' : ''
}

const handleDetailSalesCell = (row: ISalesHistoryItem): void => {
  salesStore.setSalesAction(row)
  emit('clickViewDetail', row)
}

const handleDetailRefundCell = (row: IRefundItemDetail): void => {
  const refundAction = {
    action: FORM_ACTION.VIEW,
    data: row,
  }

  refundStore.setRefundAction(refundAction)
  emit('clickViewDetailRefund', row)
}

const handleShowDeletedChange = async (value: boolean): Promise<void> => {
  emit('update:isIncludeDeleted', value)
  emit('deletedChange')
}

const handlePageChange = async (event: { page: number; rows: number }): Promise<void> => {
  emit('pageChange', event)
}

const handleClientNameClass = (data: ISalesHistoryItem): string => {
  if (data.refStatus === SALES_STATUS.DELETED || data.refType === SALES_REF_TYPE.REFUND) {
    return 'col-client-name deleted'
  }
  return 'is-unregistered'
}

const handleEditNotes = (data: ISalesHistoryItem): void => {
  noteActionVisible.value = true
  noteActionText.value = data.notes ?? ''
}

const handleMobileViewDetail = (row: ISalesHistoryItem): void => {
  if (row.refType === SALES_REF_TYPE.SALES) {
    handleDetailSalesCell(row)
  } else if (row.refType === SALES_REF_TYPE.REFUND) {
    handleDetailRefundCell(row as unknown as IRefundItemDetail)
  }
}

const handleMobileClickNotes = (row: IRefundItemDetail): void => {
  handleEditNotes(row)
}

const handleShowSalesInformationSupport = (): void => {
  salesInformationSupportVisible.value = true
}
// Lifecycle hooks
onMounted(async () => {
  isLoaded.value = true
})

onBeforeUnmount(() => {
  goodsFilter.value = {
    isIncludePrepaidCard: true,
    isIncludePrepaidService: true,
    isIncludeProduct: true,
    isIncludeService: true,
    paymentMethodId: -1,
    deductionTypes: 0,
  }
})

const { handleDateCell, isPrepaidGoodItem, isClientOfCurentShop } = useSalesHistory()
</script>

<style scoped lang="scss">
.sales-table {
  display: flex;
  position: relative;
  flex-direction: column;

  .sales-table__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: absolute;
    top: -35px;
    right: 0;
    margin-right: 12rem;

    @media (max-width: 1198.99px) {
      // margin-right: 0;
      top: -50px;
    }

    @include mobile {
      display: none;
    }

    label {
      @include mobile {
        display: none;
      }
    }
    .show-deleted-label {
      margin-left: 0.5rem;
      cursor: pointer;
    }
  }

  &__mobile {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 600px;
    overflow-y: auto;

    border: 1px solid var(--p-gray-400);

    .sales-table__mobile-header {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--p-gray-100);
      border-bottom: 1px solid var(--p-gray-400);
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }

  .sales-history-table {
    :deep(.p-datatable-thead) {
      th {
        background-color: $gray-100;
        white-space: nowrap;

        .p-datatable-column-header-content {
          text-align: center;
          justify-content: center;
        }

        &.col-sales-items,
        &.col-staff,
        &.col-sales-type,
        &.col-discount,
        &.col-amount {
          background-color: $gray-wram;
        }
      }
    }

    :deep(.p-datatable-tbody) {
      tr.deleted {
        background: var(--p-gray-100);
      }

      td {
        text-align: center;

        &.col-date {
          width: 120px;
          min-width: 120px;
        }

        .is-unregistered {
          color: $blue-color;
          font-weight: 700;
        }

        .col-client-name {
          &.deleted {
            span {
              color: var(--p-gray-500);
            }
          }
        }

        .text-primary {
          font-weight: 700;
          color: $blue-color;
        }
      }
    }
  }
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  &__spacer {
    flex: 1 1 auto;
  }

  &__count {
    color: var(--text-color-secondary);
    margin-left: 0.5rem;
  }
}

.control {
  display: flex;
  flex-direction: column;

  &--inline {
    flex-direction: row;
    align-items: center;
  }

  &__label {
    color: var(--text-color-secondary);
    margin-bottom: 0.25rem;
  }
}

::v-deep(.p-datatable) {
  .p-datatable-tbody > tr.is-refund {
    background: var(--refund-row-bg);
  }
  .p-datatable-tbody > tr.is-deleted {
    background: var(--deleted-row-bg);
    text-decoration: line-through;
  }
}

// Column widths
.p-datatable :is(.col-date) {
  min-width: 1rem;
}
.p-datatable :is(.col-client) {
  min-width: 12rem;
}
.p-datatable :is(.col-sales-items) {
  min-width: 14rem;
}
.p-datatable :is(.col-staff) {
  min-width: 10rem;
}
.p-datatable :is(.col-sales-type) {
  min-width: 10rem;
}
.p-datatable :is(.col-discount) {
  min-width: 8rem;
}
.p-datatable :is(.col-amount) {
  min-width: 10rem;
}
.p-datatable :is(.col-payment-method) {
  min-width: 10rem;
}
.p-datatable :is(.col-pay-amount) {
  min-width: 10rem;
}
.p-datatable :is(.col-notes) {
  min-width: 12rem;
  max-width: 20rem;
  cursor: pointer;
}
.p-datatable :is(.col-detail) {
  min-width: 8rem;
}

.cell-items {
  display: inline-flex;
  align-items: center;
  &__text {
    white-space: nowrap;
  }
}

.client-cell {
  &.is-unregistered {
    color: var(--primary-color);
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
