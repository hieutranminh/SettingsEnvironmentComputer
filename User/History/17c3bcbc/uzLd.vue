<template>
  <Card>
    <template #content>
      <div class="table-container">
        <div class="bookings-summary">
          <h4>{{ $t('bookings-tally-details.title-table-bookings-summary') }}</h4>
          <DataTable
            ref="dataTableBookingsSummaryRef"
            :value="transformedDataBookingsSummary"
            :rowHover="true"
            :scrollable="true"
            tableClass="bookings-tally-details-table"
            showGridlines
          >
            <!-- Header -->
            <ColumnGroup type="header">
              <Row>
                <Column headerClass="bg-gray" :style="COLUMN_STYLES.NUMBER_OF_BOOKINGS" />
                <Column
                  :style="COLUMN_STYLES.NAVER"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-administrator')"
                  headerClass="bg-gray"
                />
                <Column
                  :style="COLUMN_STYLES.NAVER"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-naver')"
                  headerClass="bg-gray"
                />
                <Column
                  :style="COLUMN_STYLES.NAVER"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-total')"
                  headerClass="bg-gray"
                />
                <Column
                  :style="COLUMN_STYLES.NO_SHOW"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-cancellation')"
                  headerClass="bg-gray"
                />
                <Column
                  :style="COLUMN_STYLES.NO_SHOW"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-no-show')"
                  headerClass="bg-gray"
                />
              </Row>
            </ColumnGroup>

            <!-- Body -->
            <Column field="countingBasis"> </Column>
            <Column field="administrator"> </Column>
            <Column field="naver"> </Column>
            <Column field="total"> </Column>
            <Column field="cancellation"> </Column>
            <Column field="noShow"> </Column>

            <!-- Empty -->
            <template #empty> {{ $t('general.no-data-for-table') }} </template>
          </DataTable>
        </div>

        <div class="bookings-by-resource">
          <h4>{{ $t('bookings-tally-details.title-table-bookings-by-resource') }}</h4>
          <DataTable
            ref="dataTableBookingsResourceRef"
            :value="transformedDataBookingsResource"
            :rowHover="true"
            :scrollable="true"
            tableClass="bookings-tally-details-table"
            showGridlines
          >
            <!-- Header -->
            <ColumnGroup type="header">
              <Row>
                <Column
                  :style="COLUMN_STYLES.RESOURCE"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-resource')"
                  headerClass="bg-gray"
                />
                <Column
                  :style="COLUMN_STYLES.NAVER"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-administrator')"
                  headerClass="bg-gray"
                />
                <Column
                  :style="COLUMN_STYLES.NAVER"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-naver')"
                  headerClass="bg-gray"
                />
                <Column
                  :style="COLUMN_STYLES.NAVER"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-total')"
                  headerClass="bg-gray"
                />
                <Column
                  :style="COLUMN_STYLES.NAVER"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-cancellation')"
                  headerClass="bg-gray"
                />
                <Column
                  :style="COLUMN_STYLES.NO_SHOW"
                  :header="$t('bookings-tally-details.title-table-bookings-summary-no-show')"
                  headerClass="bg-gray"
                />
              </Row>
            </ColumnGroup>

            <!-- Body -->
            <Column field="resourceName"> </Column>
            <Column field="administrator"> </Column>
            <Column field="naver"> </Column>
            <Column field="total"> </Column>
            <Column field="cancellation"> </Column>
            <Column field="noShow"> </Column>

            <!-- Empty -->
            <template #empty> {{ $t('general.no-data-for-table') }} </template>
          </DataTable>
        </div>

        <div v-if="transformedDataMonthBookings" class="month-bookings">
          <h4>{{ $t('bookings-tally-details.title-table-bookings-month-over-month-bookings') }}</h4>
          <DataTable
            ref="dataTableMonthBookingsRef"
            :value="transformedDataMonthBookings"
            :rowHover="true"
            :scrollable="true"
            tableStyle="min-width: 30rem"
            tableClass="bookings-tally-details-table"
            showGridlines
          >
            <!-- Header -->
            <ColumnGroup type="header">
              <Row>
                <Column
                  :header="$t('bookings-tally-details.title-table-bookings-year-month')"
                  headerClass="bg-gray"
                />
                <Column
                  :header="$t('bookings-tally-details.title-table-bookings-summary-administrator')"
                  headerClass="bg-gray"
                />
                <Column
                  :header="$t('bookings-tally-details.title-table-bookings-summary-naver')"
                  headerClass="bg-gray"
                />
                <Column
                  :header="$t('bookings-tally-details.title-table-bookings-summary-total')"
                  headerClass="bg-gray"
                />
                <Column
                  :header="$t('bookings-tally-details.title-table-bookings-summary-cancellation')"
                  headerClass="bg-gray"
                />
                <Column
                  :header="$t('bookings-tally-details.title-table-bookings-summary-no-show')"
                  headerClass="bg-gray"
                />
              </Row>
            </ColumnGroup>

            <!-- Body -->
            <Column field="reportOfYearMonth" :style="COLUMN_STYLES.YEAR_MONTH">
              <template #body="slotProps">
                {{ formatDateTime(slotProps.data.reportOfYearMonth) }}
              </template>
            </Column>
            <Column field="administrator" :style="COLUMN_STYLES.NAVER"> </Column>
            <Column field="naver" :style="COLUMN_STYLES.NAVER"> </Column>
            <Column field="total" :style="COLUMN_STYLES.NAVER"> </Column>
            <Column field="cancellation" :style="COLUMN_STYLES.NAVER"> </Column>
            <Column field="noShow" :style="COLUMN_STYLES.NO_SHOW"></Column>

            <!-- Footer -->
            <ColumnGroup v-if="transformedDataMonthBookings.length" type="footer">
              <Row>
                <Column :footer="mapDataMonthBookingsTotal.yearMonth" footerClass="bg-gray" />
                <Column :footer="mapDataMonthBookingsTotal.administrator" footerClass="bg-gray">
                </Column>
                <Column :footer="mapDataMonthBookingsTotal.naver" footerClass="bg-gray" />
                <Column :footer="mapDataMonthBookingsTotal.total" footerClass="bg-gray"> </Column>
                <Column :footer="mapDataMonthBookingsTotal.cancellation" footerClass="bg-gray">
                </Column>
                <Column :footer="mapDataMonthBookingsTotal.noShow" footerClass="bg-gray"></Column>
              </Row>
            </ColumnGroup>

            <!-- Empty -->
            <template #empty> {{ $t('general.no-data-for-table') }} </template>
          </DataTable>
        </div>
      </div>
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
import type {
  IBookingsByResource,
  IBookingsSummary,
  IMonthOverMonthBooking,
} from '@/types/bookings-report/BookingsTallyDetails'
import type { IPrintSection } from '@/types/print'
import { formatPercentage } from '@/utils/common'
import { useAuthStore } from '@/stores/auth/auth'

interface IProps {
  bookingsByResource?: IBookingsByResource
  bookingsSummary?: IBookingsSummary
  monthOverMonthBooking?: IMonthOverMonthBooking
}

const props = withDefaults(defineProps<IProps>(), {
  bookingsByResource: () => ({}) as IBookingsByResource,
  bookingsSummary: () => ({}) as IBookingsSummary,
  monthOverMonthBooking: () => ({}) as IMonthOverMonthBooking,
})

const oneHundred = 100

// Composables
const { t } = useI18n()
const { user } = useAuthStore()

// DataTable ref
const dataTableBookingsSummaryRef = ref()
const dataTableBookingsResourceRef = ref()
const dataTableMonthBookingsRef = ref()

// Constants local
const PERCENTAGE = 100
const COUNTRY_CODE_EN = 'en'
const COLUMN_STYLES = {
  NUMBER_OF_BOOKINGS: 'min-width: 100px',
  RESOURCE: 'min-width: 120px',
  YEAR_MONTH: 'min-width: 160px',
  NO_SHOW: 'min-width: 110px',
  NAVER: 'min-width: 110px',
} as const

const formatDateTime = (monthYear: number): string => {
  const countryCode = user.language
  return formatMonthAndYear(monthYear, countryCode)
}

const formatMonthAndYear = (dateTime: number, country: string): string => {
  if (isNaN(Number(dateTime))) {
    return ''
  }
  const numb = Number(dateTime)
  const year = Math.floor(numb / PERCENTAGE)
  const month = Math.floor(numb % PERCENTAGE)

  return formatMonthYear(`${month} - ${year}`, country)
}

const formatMonthYear = (date: string, country: string): string => {
  const monthOfYear = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const month = date.split('-')[0]
  const year = date.split('-')[1]
  if (country === COUNTRY_CODE_EN) {
    return `${monthOfYear[Number(month) - 1]} ${year}`
  }
  return `${year}년 ${month}월`
}

const transformedDataBookingsSummary = computed(() => {
  if (!props.bookingsSummary) return []

  const {
    administrator = 0,
    naver = 0,
    total = 0,
    cancellation = 0,
    noShow = 0,
  } = props.bookingsSummary || {}

  return [
    {
      countingBasis: t('bookings-tally-details.title-table-bookings-number-of-bookings'),
      administrator: administrator,
      naver: naver,
      total: total,
      cancellation: cancellation,
      noShow: noShow,
    },
    {
      countingBasis: t('bookings-tally-details.title-table-bookings-ratio'),
      administrator: formatRatio(administrator, total),
      naver: formatRatio(naver, total),
      total: formatRatio(total, total),
      cancellation: formatRatio(cancellation, total),
      noShow: formatRatio(noShow, total),
    },
  ]
})

const transformedDataBookingsResource = computed(() => {
  if (!props.bookingsByResource) return []
  return props.bookingsByResource.items
})

const transformedDataMonthBookings = computed(() => {
  if (!props.bookingsByResource) return []

  return props.monthOverMonthBooking.items
})

const mapDataMonthBookingsTotal = computed(() => {
  const sorted = transformedDataMonthBookings.value.sort(
    (first, second) => second.reportOfYearMonth - first.reportOfYearMonth,
  )
  const currentData = sorted[0]
  const preMonthData = sorted[1]

  return {
    yearMonth: t('bookings-tally-details.title-table-bookings-changes'),
    administrator: formatRatioPercent(currentData.administrator, preMonthData.administrator),
    naver: formatRatioPercent(currentData.naver, preMonthData.naver),
    total: formatRatioPercent(currentData.total, preMonthData.total),
    cancellation: formatRatioPercent(currentData.cancellation, preMonthData.cancellation),
    noShow: formatRatioPercent(currentData.noShow, preMonthData.noShow),
  }
})

const formatRatioPercent = (current: number, prev: number): string => {
  const changeData = current - prev
  const changePrecent = Math.round((changeData / prev) * PERCENTAGE)
  return `${changeData}${prev !== 0 ? `(${changePrecent}%)` : ''}`
}

const formatRatio = (value: number, total: number): string => {
  if (total === 0 || value === 0 || value === oneHundred) {
    return formatPercentage(value, { decimalCount: 0, showZeroValues: true })
  }
  const percent = (value / total) * oneHundred
  return formatPercentage(percent)
}

// Methods to access DataTable DOM
const getDataTableDOMByResource = (): HTMLElement | null => {
  if (dataTableBookingsResourceRef.value) {
    return dataTableBookingsResourceRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

const getDataTableDOMBookingsSummary = (): HTMLElement | null => {
  if (dataTableBookingsSummaryRef.value) {
    return dataTableBookingsSummaryRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

const getDataTableDOMMonthBookings = (): HTMLElement | null => {
  if (dataTableMonthBookingsRef.value) {
    return dataTableMonthBookingsRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

const getPrintConfigurationBookingsByResource = (): IPrintSection => {
  const tableElement = getDataTableDOMByResource()
  if (!tableElement) {
    throw new Error('Table element not found')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
    title: t('bookings-tally-details.title-table-bookings-by-resource'),
  }
}

const getPrintConfigurationBookingsSummary = (): IPrintSection => {
  const tableElement = getDataTableDOMBookingsSummary()
  if (!tableElement) {
    throw new Error('Table element not found')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
    title: t('bookings-tally-details.title-table-bookings-summary'),
  }
}

const getPrintConfigurationMonthBookings = (): IPrintSection => {
  const tableElement = getDataTableDOMMonthBookings()
  if (!tableElement) {
    throw new Error('Table element not found')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
    title: t('bookings-tally-details.title-table-bookings-month-over-month-bookings'),
  }
}

defineExpose({
  getPrintConfigurationBookingsSummary,
  getPrintConfigurationBookingsByResource,
  getPrintConfigurationMonthBookings,
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

.table-container {
  gap: 1rem;

  @include maxResponsive(mobile) {
    display: block;
  }

  h4 {
    margin-bottom: 0.5rem;
  }

  .bookings-summary {
    margin-bottom: 2rem;
  }
  .bookings-by-resource {
    margin-bottom: 2rem;
  }
}

:deep(.bookings-tally-details-table) {
  .bg-gray {
    background-color: var(--p-gray-100);
  }

  .border-bottom-0 {
    border-bottom: none;
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
