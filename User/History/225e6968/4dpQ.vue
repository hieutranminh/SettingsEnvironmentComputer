<template>
  <Card>
    <template #content>
      <!-- Table  -->
      <DataTable
        ref="dataTableRef"
        :value="transformedData"
        :rowHover="true"
        :scrollable="true"
        tableStyle="min-width: 50rem"
        scrollHeight="550px"
        tableClass="sales-by-date-table"
        dataKey="sales-by-date-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :header="$t('sales-by-date.label-date')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-date.label-service')" headerClass="bg-gray" />
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
        >

        <!-- Footer -->
        <ColumnGroup type="footer">
          <Row>
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.serviceAmount) || '0'" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.productAmount) || '0'" footerClass="bg-gray" />
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
import type { SalesByDateReportItem } from '@/services/sales/sales-reports/sales-by-date-report.read'
import type { PrintSection } from '@/types/print'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data?: SalesByDateReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<SalesByDateReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return props.data
})

const mapDataTotal = computed(() => {
  return transformedData.value.reduce(
    (acc, item) => {
      return {
        serviceAmount: acc.serviceAmount + item.serviceAmount,
        productAmount: acc.productAmount + item.productAmount,
        prepaidCardAmount: acc.prepaidCardAmount + item.prepaidCardAmount,
        prepaidServiceAmount: acc.prepaidServiceAmount + item.prepaidServiceAmount,
        total: acc.total + (item.total || 0),
      }
    },
    {
      serviceAmount: 0,
      productAmount: 0,
      prepaidCardAmount: 0,
      prepaidServiceAmount: 0,
      total: 0,
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
