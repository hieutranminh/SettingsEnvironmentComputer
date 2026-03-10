<template>
  <Card>
    <template #content>
      <pre>{{ fromDateFilter }}</pre>
      <!-- Table  -->
      <DataTable
        ref="dataTableRef"
        :value="transformedData"
        :rowHover="true"
        :scrollable="true"
        scrollHeight="600px"
        tableClass="sales-by-date-table"
        dataKey="sales-by-date-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :header="$t('sales-by-date.label-date')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-date.label-service')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-date.label-product')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-date.label-prepaid-card')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-date.label-prepaid-service')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-date.label-total')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="date" />
        <Column field="serviceAmount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.serviceAmount) || 0 }}
          </template>
        </Column>
        <Column field="productAmount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.productAmount) || 0 }}
          </template>
        </Column>
        <Column field="prepaidCardAmount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.prepaidCardAmount) || 0 }}
          </template>
        </Column>
        <Column field="prepaidServiceAmount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.prepaidServiceAmount) || 0 }}
          </template>
        </Column>
        <Column field="total">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.total) || 0 }}
          </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="transformedData.length > 1" type="footer">
          <Row>
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
            <Column :footer="formatAmount(100000 || 0)" footerClass="bg-gray" />
            <Column :footer="formatAmount(100000 || 0)" footerClass="bg-gray" />
            <Column :footer="formatAmount(100000 || 0)" footerClass="bg-gray" />
            <Column :footer="formatAmount(100000 || 0)" footerClass="bg-gray" />
            <Column :footer="formatAmount(100000 || 0)" footerClass="bg-gray" />
          </Row>
        </ColumnGroup>
      </DataTable>
    </template>
  </Card>

  <pre>{{ transformedData }}</pre>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Constants
import { PRINT_TYPE } from '@/constants'
// Types
import type { SalesByDateReportItem } from '@/services/sales/sales-reports/sales-by-date-report.read'
// Utils
import { formatAmount } from '@/utils/common'
import { fromUnixTimestamp } from '@/utils/dateUtils'

interface Props {
  data?: SalesByDateReportItem[]
  fromDateFilter?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  fromDateFilter: 0,
})

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<SalesByDateReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  const startDate = fromUnixTimestamp(props.fromDateFilter || 0)

  return props.data.map((item, index) => {
    const startDateFormatted = startDate.add(index, 'day').format('YYYY-MM-DD')
    const totalRow = item.serviceAmount + item.productAmount + item.prepaidCardAmount + item.prepaidServiceAmount

    return {
      ...item,
      total: totalRow,
      date: startDateFormatted,
    }
  })
})

// Methods to access DataTable DOM
const getDataTableDOM = (): HTMLElement | null => {
  if (dataTableRef.value) {
    return dataTableRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}
</script>

<style lang="scss" scoped>
:deep(.sales-by-date-table) {
  .bg-gray {
    background-color: var(--p-gray-100);
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
