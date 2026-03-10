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
        tableClass="service-sales-by-month-table"
        dataKey="monthOfYear"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :header="$t('general.label-month')" headerClass="bg-gray" style="width: 25%" />
            <Column :header="$t('service-sales-by-month.label-qty')" headerClass="bg-gray" />
            <Column :header="$t('service-sales-by-month.label-amount')" headerClass="bg-gray" />
            <Column :header="$t('service-sales-by-month.label-ratio')" headerClass="bg-gray" />
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

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<SalesByRepeatClientsReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return props.data
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
:deep(.service-sales-by-month-table) {
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
