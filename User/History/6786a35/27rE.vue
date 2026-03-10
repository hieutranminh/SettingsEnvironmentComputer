<template>
  <div class="payment-details-table">
    <DataTable
      ref="dataTableRef"
      :value="filteredPaymentDetailsData"
      :rowHover="true"
      :scrollable="true"
      tableStyle="min-width: 40rem"
      tableClass="table-grid-primary"
      showGridlines
    >
      <!-- Header -->
      <ColumnGroup type="header">
        <Row>
          <Column :header="$t('sales-report.label-payment-method')" headerClass="bg-gray" frozen />
          <Column :header="$t('sales-report.label-service')" headerClass="bg-gray" />
          <Column :header="$t('sales-report.label-product')" headerClass="bg-gray" />
          <Column :header="$t('sales-report.label-prepaid-card')" headerClass="bg-gray" />
          <Column :header="$t('sales-report.label-prepaid-service')" headerClass="bg-gray" />
          <Column :header="$t('sales-report.label-total')" headerClass="bg-gray" />
        </Row>
      </ColumnGroup>

      <template #empty> {{ $t('general.no-data-for-table') }} </template>

      <!-- Body -->
      <Column field="paymentMethodName" frozen>
        <template #body="{ data }">
          {{ formatPaymentMethod(data.paymentMethodName) }}
        </template>
      </Column>
      <Column field="servicesPaymentAmount" bodyClass="text-right">
        <template #body="{ data }">
          {{ formatAmount(data.servicesPaymentAmount) }}
        </template>
      </Column>
      <Column field="productPaymentAmount" bodyClass="text-right">
        <template #body="{ data }">
          {{ formatAmount(data.productPaymentAmount) }}
        </template>
      </Column>
      <Column field="prepaidCardPaymentAmount" bodyClass="text-right">
        <template #body="{ data }">
          {{ formatAmount(data.prepaidCardPaymentAmount) }}
        </template>
      </Column>
      <Column field="prepaidServicePaymentAmount" bodyClass="text-right">
        <template #body="{ data }">
          {{ formatAmount(data.prepaidServicePaymentAmount) }}
        </template>
      </Column>
      <Column field="paymentAmountTotal" bodyClass="text-right">
        <template #body="{ data }">
          {{ formatAmount(data.paymentAmountTotal) }}
        </template>
      </Column>

      <!-- Footer -->
      <ColumnGroup type="footer">
        <Row>
          <Column :footer="$t('general.total')" footerClass="bg-gray" frozen />
          <Column
            :footer="formatAmount(totals.servicesPaymentAmount)"
            footerClass="bg-gray text-right"
          />
          <Column
            :footer="formatAmount(totals.productPaymentAmount)"
            footerClass="bg-gray text-right"
          />
          <Column
            :footer="formatAmount(totals.prepaidCardPaymentAmount)"
            footerClass="bg-gray text-right"
          />
          <Column
            :footer="formatAmount(totals.prepaidServicePaymentAmount)"
            footerClass="bg-gray text-right"
          />
          <Column
            :footer="formatAmount(totals.paymentAmountTotal)"
            footerClass="bg-gray text-right"
          />
        </Row>
      </ColumnGroup>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFormat } from '@/composables/useFormat'
// Utils
import { formatAmount } from '@/utils/common'
import type { IPaymentDetail } from '@/types/sales-report/SalesTotal'

const props = defineProps<{
  paymentDetailsData: IPaymentDetail[]
}>()

const { formatPaymentMethod } = useFormat()

const OUTSTANDING_PAYMENT_METHOD_NAME = 'Outstanding'
const TOTAL_PAYMENT_METHOD_NAME = 'TOTAL'

// DataTable ref
const dataTableRef = ref()

/**
 * Filters out "Outstanding" rows with 0 total and "TOTAL" row from the payment details data
 * Input: Array of payment details including Outstanding and TOTAL rows
 * Output: Array of payment details without Outstanding (when total is 0) and TOTAL rows
 */
const filteredPaymentDetailsData = computed(() => {
  return props.paymentDetailsData.filter(
    (item) =>
      // Filter out Outstanding rows with 0 total
      !(
        item.paymentMethodName === OUTSTANDING_PAYMENT_METHOD_NAME && item.paymentAmountTotal === 0
      ) &&
      // Filter out TOTAL row (will be shown in footer)
      item.paymentMethodName !== TOTAL_PAYMENT_METHOD_NAME,
  )
})

/**
 * Extracts the TOTAL row from payment details data for footer display
 * Input: Array of payment details from backend
 * Output: TOTAL row object with all payment amounts, or default zeros if not found
 */
const totals = computed(() => {
  const totalRow = props.paymentDetailsData.find(
    (item) => item.paymentMethodName === TOTAL_PAYMENT_METHOD_NAME,
  )

  return totalRow
    ? {
        servicesPaymentAmount: totalRow.servicesPaymentAmount,
        productPaymentAmount: totalRow.productPaymentAmount,
        prepaidCardPaymentAmount: totalRow.prepaidCardPaymentAmount,
        prepaidServicePaymentAmount: totalRow.prepaidServicePaymentAmount,
        paymentAmountTotal: totalRow.paymentAmountTotal,
      }
    : {
        servicesPaymentAmount: 0,
        productPaymentAmount: 0,
        prepaidCardPaymentAmount: 0,
        prepaidServicePaymentAmount: 0,
        paymentAmountTotal: 0,
      }
})

const getDataTableDOM = (): HTMLElement | null => {
  return dataTableRef.value?.$el?.querySelector('.p-datatable-table') ?? null
}

defineExpose({
  getDataTableDOM,
})
</script>

<style lang="scss" scoped>
.payment-details-table {
  margin-bottom: 1.5rem;

  :deep(.p-datatable-table) {
    .p-datatable-empty-message {
      display: none;
    }
    .p-datatable-thead {
      & > tr {
        & > th {
          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5),
          &:nth-child(6) {
            width: calc(100% / 6);
          }
        }
      }
    }
    .p-datatable-tbody {
      & > tr {
        & > td {
          &:nth-child(1) {
            min-width: 150px;
          }
        }
      }
    }
  }
}
</style>
