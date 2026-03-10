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
        tableClass="service-sales-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :header="displayReportByType" headerClass="bg-gray first-column" />
            <Column :header="$t('service-sales.label-qty')" headerClass="bg-gray" />
            <Column :header="$t('service-sales.label-amount')" headerClass="bg-gray" />
            <Column :header="$t('service-sales.label-ratio')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="key" />
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
import { sumBy } from 'lodash'
import { computed, ref } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

// Constants
import { PRINT_TYPE, REPORT_BY_TYPE, type ReportByType } from '@/constants'
// Types
import type { IPrintSection } from '@/types/print'
import type { IServiceSalesReportItem } from '@/types/sales-report/ServiceSales'
// Utils
import { formatAmount, formatPercentage } from '@/utils/common'

interface IProps {
  data?: IServiceSalesReportItem[]
  reportByType?: ReportByType
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
  reportByType: REPORT_BY_TYPE.STAFF,
})

// Constants local
const PERCENTAGE_MULTIPLIER = 100

// Composables
const { t } = useI18n()

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<IServiceSalesReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  const totalAmount = sumBy(props.data, (item) => item?.amount ?? 0)

  return props.data.map((item) => ({
    ...item,
    key: item.key === 'NONE' ? t('general.label-no-input') : item.key,
    ratio: totalAmount !== 0 ? (item.amount / totalAmount) * PERCENTAGE_MULTIPLIER : 0,
  }))
})

// Map data total
const mapDataTotal = computed(() => {
  return transformedData.value.reduce(
    (acc, item) => {
      return {
        amount: acc.amount + item.amount,
        quantity: acc.quantity + item.quantity,
        ratio: acc.ratio + (item.ratio ?? 0),
      }
    },
    { amount: 0, quantity: 0, ratio: 0 },
  )
})

const displayReportByType = computed(() => {
  switch (props.reportByType) {
    case REPORT_BY_TYPE.STAFF:
      return t('service-sales.label-staff')
    case REPORT_BY_TYPE.CATEGORY:
      return t('service-sales.label-category')
    case REPORT_BY_TYPE.SERVICE:
      return t('service-sales.label-service')
    case REPORT_BY_TYPE.DATE_OF_WEEK:
      return t('service-sales.label-day-of-week')
    case REPORT_BY_TYPE.HOUR_OF_DAY:
      return t('service-sales.label-hour-of-day')
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
:deep(.service-sales-table) {
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
