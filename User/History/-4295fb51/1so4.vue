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
        tableClass="product-sales-by-month-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column
              :header="$t('product-sales-by-month.label-month')"
              headerClass="bg-gray first-column"
            />
            <Column :header="$t('product-sales-by-month.label-qty')" headerClass="bg-gray" />
            <Column :header="$t('product-sales-by-month.label-amount')" headerClass="bg-gray" />
            <Column :header="$t('product-sales-by-month.label-ratio')" headerClass="bg-gray" />
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
          <template #body="slotProps">
            {{ formatPercentage(slotProps.data.ratio, { showZeroValues: true }) }}
          </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="transformedData.length" type="footer">
          <Row>
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.quantity) || '0'" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.amount) || '0'" footerClass="bg-gray" />
            <Column
              :footer="formatPercentage(mapDataTotal.ratio, { showZeroValues: true })"
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

// Constants
import { PRINT_TYPE } from '@/constants'
// Composables
import { useFormat } from '@/composables/useFormat'
// Types
import type { IPrintSection } from '@/types/print'
import type { IProductSalesByMonthReportItem } from '@/types/sales-report/ProductSalesByMonth'
// Utils
import { formatAmount, formatPercentage } from '@/utils/common'

interface IProps {
  data?: IProductSalesByMonthReportItem[]
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
})

// Constants local
const PERCENTAGE_MULTIPLIER = 100

// Composables
const { formatYearMonthDisplay } = useFormat()

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<IProductSalesByMonthReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  const totalAmount = props.data.reduce((sum, item) => sum + (item?.amount ?? 0), 0)

  return props.data.map((item) => ({
    ...item,
    monthOfYear: formatYearMonthDisplay(String(item.monthOfYear)),
    ratio: totalAmount !== 0 ? ((item.amount ?? 0) / totalAmount) * PERCENTAGE_MULTIPLIER : 0,
  }))
})

// Map data total
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

// Method to get print configuration
const getPrintConfiguration = (): IPrintSection => {
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
:deep(.product-sales-by-month-table) {
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
        &.first-column {
          width: 25%;
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
