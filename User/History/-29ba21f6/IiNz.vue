<template>
  <Card>
    <template #content>
      <!-- Table  -->
      <DataTable
        v-if="hasData"
        ref="dataTableRef"
        :value="enhancedTableRows"
        :rowHover="true"
        :scrollable="true"
        :tableStyle="`min-width: ${TABLE_MIN_WIDTH}`"
        :scrollHeight="TABLE_SCROLL_HEIGHT"
        tableClass="new-clients-repeat-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :rowspan="2" :header="$t('new-clients-repeat.label-staff')" headerClass="bg-gray" />
            <Column :rowspan="2" headerClass="bg-gray">
              <template #header>
                <div>
                  <strong>{{ formattedNewClientsMonth }}</strong> <br />
                  <strong>{{ $t('new-clients-repeat.label-new-client') }}</strong>
                </div>
              </template>
            </Column>
            <Column :colspan="2" :header="$t('new-clients-repeat.label-repeat-total')" headerClass="bg-gray" />

            <Column
              v-for="month in repeatMonths"
              :key="month"
              :colspan="2"
              :header="formatRepeatMonthDisplay(month)"
              headerClass="bg-gray"
            />
          </Row>

          <Row>
            <!-- Repeat Total Column -->
            <Column :header="$t('new-clients-repeat.label-num')" headerClass="bg-gray" />
            <Column header="%" headerClass="bg-gray" />

            <template v-for="month in repeatMonths" :key="month">
              <Column :header="$t('new-clients-repeat.label-num')" headerClass="bg-gray" />
              <Column header="%" headerClass="bg-gray" />
            </template>
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column>
          <template #body="{ data }">
            {{ formatStaffName(data.staffName) }}
          </template>
        </Column>

        <Column field="totalNewClients" />

        <Column field="summary.totalClients" />
        <Column>
          <template #body="{ data }">
            {{ formatSummaryPercentage(data) }}
          </template>
        </Column>

        <!-- Dynamic Repeat Columns -->
        <template v-for="(column, columnIndex) in repeatMonths" :key="`col-${column}`">
          <Column>
            <template #body="{ data }">
              {{ data.repeatColumns[columnIndex]?.clients ?? 0 }}
            </template>
          </Column>
          <Column>
            <template #body="{ data }">
              {{ data.repeatColumns[columnIndex]?.percentage ?? '' }}
            </template>
          </Column>
        </template>

        <!-- Footer -->
        <ColumnGroup v-if="enhancedTableRows.length" type="footer">
          <Row>
            <Column :footer="$t('new-clients-repeat.label-total')" footerClass="bg-gray" />
            <Column :footer="footerTotals.totalNewClients.toString()" footerClass="bg-gray" />
            <Column :footer="footerTotals.totalRepeatClients.toString()" footerClass="bg-gray" />
            <Column :footer="footerTotals.totalRepeatPercentage" footerClass="bg-gray" />

            <!-- Dynamic Monthly Footer Columns -->
            <template v-for="monthTotal in footerTotals.monthlyTotals" :key="`footer-${monthTotal.month}`">
              <Column :footer="monthTotal.clients.toString()" footerClass="bg-gray" />
              <Column :footer="monthTotal.percentage" footerClass="bg-gray" />
            </template>
          </Row>
        </ColumnGroup>
      </DataTable>

      <div v-else class="empty-data">
        <p>{{ $t('general.no-data-for-table') }}</p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { PRINT_TYPE, NEW_CLIENTS_REPEAT_CONSTANTS } from '@/constants'
import type { NewClientsRepeatReportItem, RepeatInfo } from '@/types/client-report/NewClientsRepeat'
import type { PrintSection } from '@/types/print'
import { formatPercentage } from '@/utils/common'

// Types
interface RepeatSummary {
  totalClients: number
  percentage: number
}

interface TableRow extends NewClientsRepeatReportItem {
  summary: RepeatSummary
  repeatDataMap: Map<number, RepeatInfo>
}

interface RepeatColumn {
  month: number
  clients: number
  percentage: string
}

interface EnhancedTableRow extends TableRow {
  rowIndex: number
  repeatColumns: RepeatColumn[]
}

interface FooterTotals {
  totalNewClients: number
  totalRepeatClients: number
  totalRepeatPercentage: string
  monthlyTotals: Array<{
    month: number
    clients: number
    percentage: string
  }>
}

interface Props {
  data?: NewClientsRepeatReportItem[]
}

// Props
const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// Composables
const { t } = useI18n()

// Refs
const dataTableRef = ref()

// Extract only frequently used constants
const { NONE_STAFF_NAME, TABLE_MIN_WIDTH, TABLE_SCROLL_HEIGHT } = NEW_CLIENTS_REPEAT_CONSTANTS

// Computed Properties

/**
 * Checks if there is data available for rendering the table
 * @returns {boolean} true if data array has items, false otherwise
 * @example hasData.value // true if props.data.length > 0
 */
const hasData = computed((): boolean => props.data.length > 0)

/**
 * Extracts repeat months from the first data item's repeat infos
 * @returns {number[]} Array of repeat months as numbers
 * @example repeatMonths.value // [202301, 202302, 202303]
 */
const repeatMonths = computed((): number[] => {
  if (!hasData.value) return []

  try {
    return props.data[0]?.repeatInfos.map((info: RepeatInfo): number => info.repeatOfYearMonth) ?? []
  } catch {
    // Silently return empty array if data structure is invalid
    return []
  }
})

/**
 * Formats the new clients month for display in table header
 * @returns {string} Formatted month string (YYYY-MM format)
 * @example formattedNewClientsMonth.value // "2023-01"
 */
const formattedNewClientsMonth = computed((): string => {
  if (!hasData.value) return ''

  try {
    const month = String(props.data[0]?.repeatInfos[0]?.repeatOfYearMonth)
    return formatYearMonthDisplay(month)
  } catch {
    // Return empty string if data structure is invalid
    return ''
  }
})

/**
 * Enhanced table rows with pre-computed data and formatted values
 * Consolidates all transformations in single computation for optimal performance
 * @returns {EnhancedTableRow[]} Array of fully enhanced table row data with repeat columns
 * @example enhancedTableRows.value // [{...item, summary: {...}, repeatColumns: [...], rowIndex: 0}]
 */
const enhancedTableRows = computed<EnhancedTableRow[]>((): EnhancedTableRow[] => {
  if (!hasData.value) return []

  try {
    return props.data.map((item: NewClientsRepeatReportItem, rowIndex: number): EnhancedTableRow => {
      // Create repeat data map for quick lookup
      const repeatDataMap = new Map(item.repeatInfos.map((info: RepeatInfo) => [info.repeatOfYearMonth, info]))

      // Calculate summary statistics
      const totalRepeatClients = item.repeatInfos.reduce(
        (sum: number, info: RepeatInfo): number => sum + info.totalRepeatClients,
        0,
      )
      const summaryPercentage = item.totalNewClients > 0 ? (totalRepeatClients / item.totalNewClients) * 100 : 0

      const summary: RepeatSummary = {
        totalClients: totalRepeatClients,
        percentage: summaryPercentage,
      }

      // Pre-compute repeat columns with formatted values
      const repeatColumns: RepeatColumn[] = repeatMonths.value.map((month: number): RepeatColumn => {
        const clients = repeatDataMap.get(month)?.totalRepeatClients ?? 0
        const percentage = item.totalNewClients > 0 ? (clients / item.totalNewClients) * 100 : 0

        return {
          month,
          clients,
          percentage: percentage ? formatPercentage(percentage) : '',
        }
      })

      return {
        ...item,
        summary,
        repeatDataMap,
        rowIndex,
        repeatColumns,
      }
    })
  } catch {
    // Return empty array if transformation fails
    return []
  }
})

/**
 * Calculates footer totals for all columns including monthly breakdowns
 * @returns {FooterTotals} Object containing all calculated footer totals and percentages
 * @example footerTotals.value // { totalNewClients: 100, totalRepeatClients: 45, ... }
 */
const footerTotals = computed<FooterTotals>((): FooterTotals => {
  // Early return for empty data
  if (!hasData.value) {
    return createEmptyFooterTotals()
  }

  try {
    const rows = enhancedTableRows.value

    // Calculate totals using a single reduce for better performance
    const { totalNewClients, totalRepeatClients } = calculateClientTotals(rows)

    // Calculate monthly totals
    const monthlyTotals = calculateMonthlyTotals(rows, totalNewClients)

    return {
      totalNewClients,
      totalRepeatClients,
      totalRepeatPercentage: calculatePercentage(totalRepeatClients, totalNewClients),
      monthlyTotals,
    }
  } catch (error) {
    return createEmptyFooterTotals()
  }
})

const createEmptyFooterTotals = (): FooterTotals => {
  return {
    totalNewClients: 0,
    totalRepeatClients: 0,
    totalRepeatPercentage: '',
    monthlyTotals: [],
  }
}

const calculateClientTotals = (rows: EnhancedTableRow[]) => {
  return rows.reduce(
    (totals, row) => ({
      totalNewClients: totals.totalNewClients + row.totalNewClients,
      totalRepeatClients: totals.totalRepeatClients + row.summary.totalClients,
    }),
    { totalNewClients: 0, totalRepeatClients: 0 },
  )
}

const calculateMonthlyTotals = (rows: EnhancedTableRow[], totalNewClients: number): MonthlyTotal[] => {
  return repeatMonths.value.map((month: number, index: number) => {
    const monthlyClients = rows.reduce((sum, row) => sum + (row.repeatColumns[index]?.clients ?? 0), 0)

    return {
      month,
      clients: monthlyClients,
      percentage: calculatePercentage(monthlyClients, totalNewClients),
    }
  })
}

const calculatePercentage = (numerator: number, denominator: number): string => {
  return denominator > 0 ? formatPercentage((numerator / denominator) * 100) : ''
}

/**
 * Formats summary percentage for display
 * @param {EnhancedTableRow} row - Enhanced table row with summary data
 * @returns {string} Formatted percentage string or empty string
 * @example formatSummaryPercentage(row) // "25.50%"
 */
const formatSummaryPercentage = (row: EnhancedTableRow): string => {
  return row.summary.percentage ? formatPercentage(row.summary.percentage) : ''
}

/**
 * Formats staff name for display, handling special 'none' case
 * @param {string} staffName - Raw staff name from data
 * @returns {string} Formatted staff name or localized 'no input' label
 * @example formatStaffName("John Doe") // "John Doe"
 * @example formatStaffName("none") // "입력 없음" (in Korean)
 */
const formatStaffName = (staffName: string): string => {
  return staffName.toLowerCase() === NONE_STAFF_NAME ? t('general.label-no-input') : staffName
}

/**
 * Formats repeat month for display in table header
 * @param {number} yearMonth - Year month in YYYYMM format
 * @returns {string} Formatted month display with repeat label
 * @example formatRepeatMonthDisplay(202301) // "01 반복" (in Korean)
 */
const formatRepeatMonthDisplay = (yearMonth: number): string => {
  const monthString = yearMonth.toString().slice(-2)
  return `${monthString} ${t('new-clients-repeat.label-repeat')}`
}

/**
 * Formats year-month string into readable format
 * @param {string} yearMonth - Year month string in YYYYMM format
 * @returns {string} Formatted date string in YYYY-MM format
 * @example formatYearMonthDisplay("202301") // "2023-01"
 */
const formatYearMonthDisplay = (yearMonth: string): string => {
  return `${yearMonth.slice(0, 4)}-${yearMonth.slice(4, 6)}`
}

// Print Functions
const getDataTableElement = (): HTMLElement | null => {
  if (!dataTableRef.value) return null
  return dataTableRef.value.$el.querySelector('.p-datatable-table')
}

const getPrintConfiguration = (): PrintSection => {
  const tableElement = getDataTableElement()

  if (!tableElement) {
    throw new Error('Table element not found for printing')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
  }
}

// Expose
defineExpose({
  getPrintConfiguration,
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

.empty-data {
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--p-gray-300);
}

:deep(.new-clients-repeat-table) {
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
