<template>
  <Card>
    <template #content>
      <!-- Table  -->
      <DataTable
        ref="dataTableRef"
        :value="transformedData"
        :rowHover="true"
        :scrollable="true"
        tableStyle="min-width: 40rem"
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
            <Column :footer="formatAmount(mapDataTotal.quantity) || '0'" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.amount) || '0'" footerClass="bg-gray" />
            <Column
              :footer="(formatAmount(mapDataTotal.ratio, { decimalCount: 1 }) || '0') + '%'"
              footerClass="bg-gray"
            />
          </Row>
        </ColumnGroup>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

// Constants
import { PRINT_TYPE } from '@/constants'
// Types
import type { PrintSection } from '@/types/print'
import type { ServiceSalesByMonthReportItem } from '@/types/sales-report/ServiceSalesByMonth'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data?: ServiceSalesByMonthReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// Composables
const { t } = useI18n()

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<ServiceSalesByMonthReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  const totalAmount = props.data.reduce((sum, item) => sum + (item.amount || 0), 0)

  return props.data.map((item) => ({
    ...item,
    ratio: totalAmount > 0 ? ((item.amount || 0) / totalAmount) * 100 : 0,
  }))
})

const mapDataTotal = computed(() => {
  return transformedData.value.reduce(
    (acc, item) => {
      return {
        amount: acc.amount + (item.amount ?? 0),
        quantity: acc.quantity + (item.quantity ?? 0),
        ratio: acc.ratio + (item.ratio ?? 0),
      }
    },
    {
      amount: 0,
      quantity: 0,
      ratio: 0,
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
