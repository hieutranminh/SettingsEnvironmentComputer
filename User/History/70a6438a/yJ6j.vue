<template>
  <Card>
    <template #content>
      <!-- Table  -->
      <DataTable
        ref="dataTableRef"
        :value="tableData"
        :rowHover="true"
        :scrollable="true"
        :tableStyle="TABLE_STYLES.MIN_WIDTH"
        :scrollHeight="TABLE_STYLES.SCROLL_HEIGHT"
        tableClass="service-sales-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column
              :header="$t('bookings-by-resource.label-resource')"
              headerClass="bg-gray first-column"
            />
            <Column
              :header="$t('bookings-by-resource.label-number-of-bookings')"
              headerClass="bg-gray"
            />
            <Column :header="$t('bookings-by-resource.label-ratio')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="performingResource.resourceName" :style="COLUMN_STYLES.HOUR_OF_DAY">
        </Column>
        <Column field="numbersOfBookings" :style="COLUMN_STYLES.NUMBER_OF_BOOKINGS"></Column>
        <Column field="ratio" :style="COLUMN_STYLES.RATIO">
          <template #body="slotProps">
            {{ (formatAmount(slotProps.data.ratio, { decimalCount: 1 }) || '0') + '%' }}
          </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="tableData.length" type="footer">
          <Row>
            <Column :footer="$t('general.total')" footerClass="bg-gray" />
            <Column
              :footer="formatAmount(footerTotals.numbersOfBookings) || '0'"
              footerClass="bg-gray"
            />
            <Column
              :footer="(formatAmount(footerTotals.ratio, { decimalCount: 0 }) || '0') + '%'"
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

// Constants
import { PRINT_TYPE } from '@/constants'
// Types
import type { IPrintSection } from '@/types/print'
import type { IBookingsByResourceReportItem } from '@/types/bookings-report/BookingsByResource'
// Utils
import { formatAmount } from '@/utils/common'

interface IProps {
  data?: IBookingsByResourceReportItem[]
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
})

// Constants local
const PERCENTAGE_MULTIPLIER = 100
const TABLE_STYLES = {
  MIN_WIDTH: 'min-width: 40rem',
  SCROLL_HEIGHT: '550px',
} as const

const COLUMN_STYLES = {
  HOUR_OF_DAY: 'width: 30%',
  NUMBER_OF_BOOKINGS: 'width: 50%',
  RATIO: 'width: 20%',
} as const

// DataTable ref
const dataTableRef = ref()
const oneHundred = 100

const footerTotals = computed(() => {
  const totalClients = tableData.value.reduce((sc, it) => sc + (it.numbersOfBookings ?? 0), 0)
  // có dữ liệu ⇒ 100, không có ⇒ 0
  const ratio = totalClients > 0 ? oneHundred : 0
  return { numbersOfBookings: totalClients, ratio }
})
// Transform API data to table format
const tableData = computed<IBookingsByResourceReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  const totalAmount = sumBy(props.data, (item) => item?.numbersOfBookings ?? 0)

  return props.data.map((item) => ({
    ...item,
    key: item.performingResource.resourceId,
    ratio: totalAmount > 0 ? (item.numbersOfBookings / totalAmount) * PERCENTAGE_MULTIPLIER : 0,
  }))
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
