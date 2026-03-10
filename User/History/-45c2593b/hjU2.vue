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
        tableClass="service-sales-by-item-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column
              :header="$t('service-sales-by-item.label-staff')"
              headerClass="bg-gray first-column"
            />
            <Column :header="$t('service-sales-by-item.label-qty')" headerClass="bg-gray" />
            <Column :header="$t('service-sales-by-item.label-amount')" headerClass="bg-gray" />
            <Column :header="$t('service-sales-by-item.label-ratio')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="itemName" />
        <Column field="quantity" />
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
import { sumBy } from 'lodash'
import { computed, ref } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

// Constants
import { PRINT_TYPE } from '@/constants'
// Types
import type { IPrintSection } from '@/types/print'
import type { IServiceSalesByItemReportItem } from '@/types/sales-report/ServiceSalesByItem'
// Utils
import { formatAmount, formatPercentage } from '@/utils/common'

interface IProps {
  data?: IServiceSalesByItemReportItem[]
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
})

// Constants local
const PERCENTAGE_MULTIPLIER = 100

// Composables
const { t } = useI18n()

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<IServiceSalesByItemReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  const totalAmount = sumBy(props.data, (item) => item?.amount ?? 0)

  return props.data.map((item) => ({
    ...item,
    itemName: item.itemName === 'NONE' ? t('general.label-no-input') : item.itemName,
    ratio: totalAmount > 0 ? (item.amount / totalAmount) * PERCENTAGE_MULTIPLIER : 0,
  }))
})

// Map data total
const mapDataTotal = computed(() => {
  const totals = transformedData.value.reduce(
    (acc, item) => {
      return {
        amount: acc.amount + item.amount,
        quantity: acc.quantity + item.quantity,
      }
    },
    { amount: 0, quantity: 0 },
  )

  // Calculate ratio based on total amount
  const totalRatio = totals.amount > 0 ? (totals.amount / totals.amount) * PERCENTAGE_MULTIPLIER : 0

  return {
    ...totals,
    ratio: totalRatio,
  }
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
:deep(.service-sales-by-item-table) {
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
