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
        tableClass="sales-by-month-table"
        dataKey="sales-by-month-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :header="$t('sales-by-month.label-month')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-month.label-service')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-month.label-product')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-month.label-prepaid-card')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-month.label-prepaid-service')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-month.label-total')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }}asdasd </template>

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
        <ColumnGroup v-if="transformedData.length" type="footer">
          <Row>
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.serviceAmount) || '0'" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.productAmount) || '0'" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.prepaidCardAmount) || '0'" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.prepaidServiceAmount) || '0'" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.total) || '0'" footerClass="bg-gray" />
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
import type { SalesByMonthReportItem } from '@/services/sales/sales-reports/sales-by-month-report.read'
import type { PrintSection } from '@/types/print'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data?: SalesByMonthReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<SalesByMonthReportItem[]>(() => {
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
:deep(.sales-by-month-table) {
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
