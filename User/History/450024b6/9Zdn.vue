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
        tableClass="service-sales-by-sales-type-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :header="$t('service-sales-by-sales-type.label-staff')" headerClass="bg-gray" style="width: 25%" />
            <Column :header="$t('service-sales-by-sales-type.label-no-input')" headerClass="bg-gray" />
            <Column
              v-for="salesType in salesTypeData"
              :header="salesType.name"
              :key="salesType.id"
              headerClass="bg-gray"
            />
            <Column :header="$t('service-sales-by-sales-type.label-total')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <!-- Staff Column -->
        <Column field="staff" />

        <!-- No Input Column -->
        <Column>
          <template #body="slotProps">
            {{ getNoInputValue(slotProps.data.reportByTypes) }}
          </template>
        </Column>

        <!-- Dynamic Sales Type Columns -->
        <Column
          v-for="salesType in salesTypeData"
          :key="salesType.id"
        >
          <template #body="slotProps">
            <div v-if="getSalesTypeData(slotProps.data.reportByTypes, salesType.id)">
              <span class="sales-type-quantity">
                {{ formatAmount(getSalesTypeData(slotProps.data.reportByTypes, salesType.id)?.quantity || 0) }}
              </span>
              <p class="sales-type-amount">
                {{ formatAmount(getSalesTypeData(slotProps.data.reportByTypes, salesType.id)?.amount || 0) }}
              </p>
            </div>
            <div v-else>
              <span class="sales-type-quantity">{{ formatAmount(0) }}</span>
              <p class="sales-type-amount">{{ formatAmount(0) }}</p>
            </div>
          </template>
        </Column>

        <!-- Total Column -->
        <Column field="total">
          <template #body="slotProps">
            <span class="total-quantity">{{ formatAmount(slotProps.data.totalQuantity) }}</span>
            <p class="total-amount">{{ formatAmount(slotProps.data.totalAmount) }}</p>
          </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="transformedData.length" type="footer">
          <Row>
            <!-- Staff Column Footer -->
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />

            <!-- No Input Column Footer -->
            <Column
              :footer="getColumnTotal('noInput')"
              footerClass="bg-gray"
            />

            <!-- Dynamic Sales Type Column Footers -->
            <Column
              v-for="salesType in salesTypeData"
              :key="`footer-${salesType.id}`"
              :footer="getColumnTotal('salesType', salesType.id)"
              footerClass="bg-gray"
            />

            <!-- Total Column Footer -->
            <Column
              :footer="getColumnTotal('total')"
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
// Types
import type { PrintSection } from '@/types/print'
import type { ServiceSalesBySalesTypeReportItem } from '@/types/sales-report/ServiceSalesBySalesType'
import type { SalesTypeReportItem } from '@/types/sales-setup/SalesType'
// Utils
import { formatAmount } from '@/utils/common'

// Extended interface for table data with calculated totals
interface TransformedServiceSalesData extends ServiceSalesBySalesTypeReportItem {
  totalQuantity: number
  totalAmount: number
}

interface Props {
  data?: ServiceSalesBySalesTypeReportItem[]
  salesTypeData?: SalesTypeReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  salesTypeData: () => [],
})


// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<TransformedServiceSalesData[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return props.data.map((item) => {
    const calcTotal = item.reportByTypes.reduce(
      (acc, type) => ({
        quantity: acc.quantity + type.quantity,
        amount: acc.amount + type.amount,
      }),
      { quantity: 0, amount: 0 },
    )

    return {
      ...item,
      totalQuantity: calcTotal.quantity,
      totalAmount: calcTotal.amount,
    }
  })
})

/**
 * Get sales type data from reportByTypes array by typeId
 * @param reportByTypes - Array of report items by types
 * @param typeId - ID of the sales type to find
 * @returns The matching report item or undefined
 */
const getSalesTypeData = (reportByTypes: ServiceSalesBySalesTypeReportItem['reportByTypes'], typeId: number) => {
  return reportByTypes.find((item) => item.typeId === typeId)
}

/**
 * Get "No Input" value (items with typeId = 0)
 * @param reportByTypes - Array of report items by types
 * @returns Formatted display value for no input items
 */
const getNoInputValue = (reportByTypes: ServiceSalesBySalesTypeReportItem['reportByTypes']): string => {
  const noInputItem = reportByTypes.find((item) => item.typeId === 0)
  if (noInputItem && (noInputItem.quantity > 0 || noInputItem.amount > 0)) {
    return `${formatAmount(noInputItem.quantity)} | ${formatAmount(noInputItem.amount)}`
  }
  return `${formatAmount(0)} | ${formatAmount(0)}`
}

/**
 * Calculate column totals for footer
 * @param columnType - Type of column ('noInput', 'salesType', 'total')
 * @param typeId - Sales type ID (for salesType columns)
 * @returns Formatted total string for the column
 */
const getColumnTotal = (columnType: 'noInput' | 'salesType' | 'total', typeId?: number): string => {
  if (!transformedData.value || transformedData.value.length === 0) {
    return `${formatAmount(0)} | ${formatAmount(0)}`
  }

  switch (columnType) {
    case 'noInput': {
      const total = transformedData.value.reduce(
        (acc, item) => {
          const noInputItem = item.reportByTypes.find((type) => type.typeId === 0)
          return {
            quantity: acc.quantity + (noInputItem?.quantity || 0),
            amount: acc.amount + (noInputItem?.amount || 0),
          }
        },
        { quantity: 0, amount: 0 },
      )
      return `${formatAmount(total.quantity)} | ${formatAmount(total.amount)}`
    }

    case 'salesType': {
      if (typeId === undefined) return `${formatAmount(0)} | ${formatAmount(0)}`
      const total = transformedData.value.reduce(
        (acc, item) => {
          const salesTypeItem = item.reportByTypes.find((type) => type.typeId === typeId)
          return {
            quantity: acc.quantity + (salesTypeItem?.quantity || 0),
            amount: acc.amount + (salesTypeItem?.amount || 0),
          }
        },
        { quantity: 0, amount: 0 },
      )
      return `${formatAmount(total.quantity)} | ${formatAmount(total.amount)}`
    }

    case 'total': {
      const total = transformedData.value.reduce(
        (acc, item) => ({
          quantity: acc.quantity + (item.totalQuantity || 0),
          amount: acc.amount + (item.totalAmount || 0),
        }),
        { quantity: 0, amount: 0 },
      )
      return `${formatAmount(total.quantity)} | ${formatAmount(total.amount)}`
    }

    default:
      return `${formatAmount(0)} | ${formatAmount(0)}`
  }
}

// Map data total
// const mapDataTotal = computed(() => {
//   return transformedData.value.reduce(
//     (acc, item) => {
//       return {
//         amount: acc.amount + item.amount,
//         quantity: acc.quantity + item.quantity,
//         ratio: acc.ratio + (item.ratio ?? 0),
//       }
//     },
//     { amount: 0, quantity: 0, ratio: 0 },
//   )
// })

// Methods to access DataTable DOM
const getDataTableDOM = (): HTMLElement | null => {
  if (dataTableRef.value) {
    return dataTableRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

// Method to get print configuration
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

:deep(.service-sales-by-sales-type-table) {
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

        .total-quantity,
        .sales-type-quantity {
          color: var(--p-blue-500);
        }

        .sales-type-amount {
          margin: 0;
          font-size: 0.875rem;
        }
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
