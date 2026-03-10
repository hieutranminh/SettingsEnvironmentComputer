<template>
  <Card>
    <template #content>
      <pre>{{ transformedData }}</pre>
      <!-- Table  -->
      <DataTable
        ref="dataTableRef"
        :value="transformedData"
        :rowHover="true"
        :scrollable="true"
        tableStyle="min-width: 38rem"
        scrollHeight="550px"
        tableClass="sales-by-repeat-clients-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column
              :rowspan="2"
              :header="$t('sales-by-repeat-clients.label-service')"
              headerClass="bg-gray"
              style="width: 25%"
            />
            <Column
              :colspan="2"
              :header="$t('sales-by-repeat-clients.label-new')"
              headerClass="bg-gray border-bottom-0"
            />
            <Column
              :colspan="2"
              :header="$t('sales-by-repeat-clients.label-repeat')"
              headerClass="bg-gray border-bottom-0"
            />
            <Column
              :colspan="2"
              :header="$t('sales-by-repeat-clients.label-unregistered')"
              headerClass="bg-gray border-bottom-0"
            />
            <Column
              :colspan="2"
              :header="$t('sales-by-repeat-clients.label-total')"
              headerClass="bg-gray border-bottom-0"
            />
          </Row>

          <Row>
            <Column :header="$t('sales-by-repeat-clients.label-qty')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-repeat-clients.label-amount')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-repeat-clients.label-qty')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-repeat-clients.label-amount')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-repeat-clients.label-qty')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-repeat-clients.label-amount')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-repeat-clients.label-qty')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-repeat-clients.label-amount')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="monthOfYear" />
        <Column field="quantity">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.quantity) || 0 }}
          </template>
        </Column>
        <Column field="amount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.amount) || 0 }}
          </template>
        </Column>
        <Column field="ratio">
          <template #body="slotProps"> {{ formatAmount(slotProps.data.ratio, { decimalCount: 1 }) || 0 }}% </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="transformedData.length" type="footer">
          <Row>
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
          </Row>
        </ColumnGroup>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Constants
import { PRINT_TYPE } from '@/constants'
// Types
import type { SalesByRepeatClientsReportItem } from '@/types/client-report/SalesByRepeatClients'
import type { PrintSection } from '@/types/print'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data?: SalesByRepeatClientsReportItem[]
}

interface TableRow {
  service: string

  newQty: number
  newAmount: number

  repeatQty: number
  repeatAmount: number

  unregisteredQty: number
  unregisteredAmount: number

  totalQty: number
  totalAmount: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<TableRow[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  const grouped: Record<string, TableRow> = {}

  for (const item of data) {
    if (!grouped[item.key]) {
      grouped[item.key] = {
        service: item.key,
        newQty: 0,
        newAmount: 0,
        repeatQty: 0,
        repeatAmount: 0,
        unregisteredQty: 0,
        unregisteredAmount: 0,
        totalQty: 0,
        totalAmount: 0,
      }
    }

    const row = grouped[item.key]

    if (item.itemType === 1) {
      // New
      row.newQty += item.quantity
      row.newAmount += item.amount
    } else if (item.itemType === 2) {
      // Repeat
      row.repeatQty += item.quantity
      row.repeatAmount += item.amount
    } else if (item.itemType === 0) {
      // Unregistered
      row.unregisteredQty += item.quantity
      row.unregisteredAmount += item.amount
    }

    // Cập nhật tổng
    row.totalQty = row.newQty + row.repeatQty + row.unregisteredQty
    row.totalAmount = row.newAmount + row.repeatAmount + row.unregisteredAmount
  }

  return []
})

// Methods to access DataTable DOM
const getDataTableDOM = (): HTMLElement | null => {
  if (dataTableRef.value) {
    return dataTableRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

const getPrintConfiguration = (): PrintSection => {
  const tableElement = getDataTableDOM()
  if (!tableElement) {
    throw new Error('Table element not found')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
  }
}

defineExpose({
  getPrintConfiguration,
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

:deep(.sales-by-repeat-clients-table) {
  .bg-gray {
    background-color: var(--p-gray-100);
  }

  .border-bottom-0 {
    border-bottom: none;
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
