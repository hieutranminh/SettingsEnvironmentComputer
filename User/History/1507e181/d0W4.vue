<template>
  <Card>
    <template #content>
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
        <template #empty>
          {{ $t('general.no-data-for-table') }}
        </template>

        <!-- Body -->
        <Column field="service" />
        <Column field="newQty">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.newQty) }}
          </template>
        </Column>
        <Column field="newAmount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.newAmount) }}
          </template>
        </Column>
        <Column field="repeatQty">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.repeatQty) }}
          </template>
        </Column>
        <Column field="repeatAmount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.repeatAmount) }}
          </template>
        </Column>
        <Column field="unregisteredQty">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.unregisteredQty) }}
          </template>
        </Column>
        <Column field="unregisteredAmount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.unregisteredAmount) }}
          </template>
        </Column>
        <Column field="totalQty">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.totalQty) }}
          </template>
        </Column>
        <Column field="totalAmount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.totalAmount) }}
          </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="transformedData.length" type="footer">
          <Row>
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
            <Column :footer="formatAmount(calculatedTotals.newQty)" footerClass="bg-gray" />
            <Column :footer="formatAmount(calculatedTotals.newAmount)" footerClass="bg-gray" />
            <Column :footer="formatAmount(calculatedTotals.repeatQty)" footerClass="bg-gray" />
            <Column :footer="formatAmount(calculatedTotals.repeatAmount)" footerClass="bg-gray" />
            <Column :footer="formatAmount(calculatedTotals.unregisteredQty)" footerClass="bg-gray" />
            <Column :footer="formatAmount(calculatedTotals.unregisteredAmount)" footerClass="bg-gray" />
            <Column :footer="formatAmount(calculatedTotals.totalQty)" footerClass="bg-gray" />
            <Column :footer="formatAmount(calculatedTotals.totalAmount)" footerClass="bg-gray" />
          </Row>
        </ColumnGroup>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Constants
import { ITEM_TYPE, PRINT_TYPE } from '@/constants'
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

  const serviceGroups: Record<string, TableRow> = {}

  for (const item of props.data) {
    if (!serviceGroups[item.key]) {
      serviceGroups[item.key] = {
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

    const row = serviceGroups[item.key]

    switch (item.itemType) {
      case ITEM_TYPE.NEW:
        // New
        row.newQty += item.quantity
        row.newAmount += item.amount
        break

      case ITEM_TYPE.REPEAT:
        // Repeat
        row.repeatQty += item.quantity
        row.repeatAmount += item.amount
        break

      case ITEM_TYPE.UNREGISTERED:
        // Unregistered
        row.unregisteredQty += item.quantity
        row.unregisteredAmount += item.amount
        break
    }

    row.totalQty = row.newQty + row.repeatQty + row.unregisteredQty
    row.totalAmount = row.newAmount + row.repeatAmount + row.unregisteredAmount
  }

  return Object.values(serviceGroups)
})

// Map data total
const calculatedTotals = computed(() => {
  return transformedData.value.reduce(
    (acc, item) => ({
      newQty: acc.newQty + item.newQty,
      newAmount: acc.newAmount + item.newAmount,
      repeatQty: acc.repeatQty + item.repeatQty,
      repeatAmount: acc.repeatAmount + item.repeatAmount,
      unregisteredQty: acc.unregisteredQty + item.unregisteredQty,
      unregisteredAmount: acc.unregisteredAmount + item.unregisteredAmount,
      totalQty: acc.totalQty + item.totalQty,
      totalAmount: acc.totalAmount + item.totalAmount,
    }),
    {
      newQty: 0,
      newAmount: 0,
      repeatQty: 0,
      repeatAmount: 0,
      unregisteredQty: 0,
      unregisteredAmount: 0,
      totalQty: 0,
      totalAmount: 0,
    },
  )
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
