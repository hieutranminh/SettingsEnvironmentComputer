<template>
  <Card>
    <template #content>
      <!-- Table  -->
      <DataTable
        ref="dataTableRef"
        :value="tableData"
        :rowHover="true"
        :scrollable="true"
        :scrollHeight="TABLE_STYLES.SCROLL_HEIGHT"
        tableClass="service-sales-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :header="$t('bookings-ratio.label-type')" headerClass="bg-gray first-column" />
            <Column :header="$t('bookings-ratio.label-number-of-clients')" headerClass="bg-gray" />
            <Column :header="$t('bookings-ratio.label-ratio')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="keyCode" :style="COLUMN_STYLES.HOUR_OF_DAY">
          <template #body="slotProps">
            {{ getBookingSourceName(slotProps.data.keyCode) }}
          </template>
        </Column>
        <Column field="numberOfClients" :style="COLUMN_STYLES.NUMBER_OF_BOOKINGS">
          <template #body="slotProps">
            {{ formatClientAmount(slotProps.data.numberOfClients) }}
          </template>
        </Column>
        <Column field="ratio" :style="COLUMN_STYLES.RATIO">
          <template #body="slotProps">
            {{ (formatAmount(slotProps.data.ratio, { decimalCount: 1 }) || '0.0') + '%' }}
          </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="tableData.length" type="footer">
          <Row>
            <Column :footer="$t('general.total')" footerClass="bg-gray" />
            <Column
              :footer="formatAmount(footerTotals.numberOfClients) || '0'"
              footerClass="bg-gray"
            />
            <Column
              :footer="(formatAmount(footerTotals.ratio, { decimalCount: 0 }) || '0') + '%'"
              footerClass="bg-gray"
            />
          </Row>
        </ColumnGroup>
      </DataTable>
      <p>{{ $t('bookings-ratio.label-note-scheduled-clients') }}</p>
      <p>{{ $t('bookings-ratio.label-note-unscheduled-clients') }}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { sumBy } from 'lodash'
import { computed, ref } from 'vue'
// Composables
import { useI18n } from 'vue-i18n'

// Constants
import { PRINT_TYPE, BOOKINGS_RATIO_CONSTANTS } from '@/constants'
// Types
import type { IPrintSection } from '@/types/print'
import type { IBookingsRatioReportResult } from '@/types/bookings-report/BookingsRatio'
// Utils
import { formatAmount } from '@/utils/common'
//component

interface IProps {
  data?: IBookingsRatioReportResult[]
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
})

// Constants local
const PERCENTAGE_MULTIPLIER = 100
const TABLE_STYLES = {
  SCROLL_HEIGHT: '550px',
} as const

const COLUMN_STYLES = {
  HOUR_OF_DAY: 'width: 30%',
  NUMBER_OF_BOOKINGS: 'width: 45%',
  RATIO: 'width: 25%',
} as const

// Composables
const { t } = useI18n()

// DataTable ref
const dataTableRef = ref()
const oneHundred = 100

const footerTotals = computed(() => {
  const totalClients = tableData.value.reduce((sc, it) => sc + (it.numberOfClients ?? 0), 0)
  // có dữ liệu ⇒ 100, không có ⇒ 0
  const ratio = totalClients > 0 ? oneHundred : 0
  return { numberOfClients: totalClients, ratio }
})
// Transform API data to table format
const tableData = computed<IBookingsRatioReportResult[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  const totalAmount = sumBy(props.data, (item) => item?.numberOfClients ?? 0)

  return props.data.map((item) => ({
    ...item,
    key: item.key,
    keyCode: item.keyCode,
    ratio: totalAmount > 0 ? (item.numberOfClients / totalAmount) * PERCENTAGE_MULTIPLIER : 0,
  }))
})

const getBookingSourceName = (keyCode: number): string => {
  switch (keyCode) {
    case BOOKINGS_RATIO_CONSTANTS.SCHEDULEDCLIENTS:
      return t('bookings-ratio.label-scheduled-clients')

    case BOOKINGS_RATIO_CONSTANTS.UNSCHEDULEDCLIENTS:
      return t('bookings-ratio.label-unscheduled-clients')

    default:
      return t('bookings-ratio.label-total')
  }
}

const formatClientAmount = (value: number): string => {
  if (value === 0) return '-'
  return formatAmount(value)
}

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
  margin-bottom: 1.5rem;
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
