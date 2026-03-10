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
              <span class="sales-type-quantity">{{ formatAmount(getSalesTypeData(slotProps.data.reportByTypes, salesType.id)?.quantity || 0) }}</span>
              <p class="sales-type-amount">{{ formatAmount(getSalesTypeData(slotProps.data.reportByTypes, salesType.id)?.amount || 0) }}</p>
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
// Composables
import { useI18n } from 'vue-i18n'

// Constants
import { PRINT_TYPE } from '@/constants'
// Types
import type { PrintSection } from '@/types/print'
import type { ServiceSalesBySalesTypeReportItem } from '@/types/sales-report/ServiceSalesBySalesType'
import type { SalesTypeReportItem } from '@/types/sales-setup/SalesType'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data?: ServiceSalesBySalesTypeReportItem[]
  salesTypeData?: SalesTypeReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  salesTypeData: () => [],
})

// Composables
const { t } = useI18n()

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<ServiceSalesBySalesTypeReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return props.data.map((item) => {
    console.log('item', item.reportByTypes)
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

        .total-quantity {
          color: var(--p-blue-500);
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
