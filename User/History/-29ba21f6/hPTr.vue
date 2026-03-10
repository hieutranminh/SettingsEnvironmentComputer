<template>
  <Card>
    <template #content>
      <DataTable
        v-if="hasData"
        ref="dataTableRef"
        :value="tableRows"
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
            <Column :header="$t('new-clients-repeat.label-num')" headerClass="bg-gray" />
            <Column header="%" headerClass="bg-gray" />

            <template v-for="month in repeatMonths" :key="month">
              <Column :header="$t('new-clients-repeat.label-num')" headerClass="bg-gray" />
              <Column header="%" headerClass="bg-gray" />
            </template>
          </Row>
        </ColumnGroup>

        <!-- Empty state -->
        <template #empty>{{ $t('general.no-data-for-table') }}</template>

        <!-- Body Columns -->
        <Column>
          <template #body="{ data }">{{ formatStaffName(data.staffName) }}</template>
        </Column>

        <Column field="totalNewClients" />

        <Column field="summary.totalClients" />
        <Column>
          <template #body="{ data }">{{ formatSummaryPercentage(data) }}</template>
        </Column>

        <!-- Dynamic Repeat Columns -->
        <template v-for="(month, index) in repeatMonths" :key="`col-${month}`">
          <Column>
            <template #body="{ data }">{{ data.repeatColumns[index]?.clients ?? 0 }}</template>
          </Column>
          <Column>
            <template #body="{ data }">{{ data.repeatColumns[index]?.percentage ?? '' }}</template>
          </Column>
        </template>

        <!-- Footer -->
        <ColumnGroup v-if="tableRows.length" type="footer">
          <Row>
            <Column :footer="$t('new-clients-repeat.label-total')" footerClass="bg-gray" />
            <Column :footer="String(totals.totalNewClients)" footerClass="bg-gray" />
            <Column :footer="String(totals.totalRepeatClients)" footerClass="bg-gray" />
            <Column :footer="totals.totalRepeatPercentage" footerClass="bg-gray" />

            <template v-for="monthTotal in totals.monthlyTotals" :key="`footer-${monthTotal.month}`">
              <Column :footer="String(monthTotal.clients)" footerClass="bg-gray" />
              <Column :footer="monthTotal.percentage" footerClass="bg-gray" />
            </template>
          </Row>
        </ColumnGroup>
      </DataTable>

      <EmptyState v-else />
      <div class="empty-data">
        <p>{{ $t('general.no-data-for-table') }}</p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatPercentage } from '@/utils/common'
import { PRINT_TYPE, NEW_CLIENTS_REPEAT_CONSTANTS } from '@/constants'
import type {
  NewClientsRepeatReportItem,
  RepeatInfo,
  TableRow,
  FooterTotals,
  RepeatColumn
} from '@/types/client-report/NewClientsRepeat'
import type { PrintSection } from '@/types/print'

// Component for empty state
const EmptyState = () => (
  <div class="empty-data">
    <p>{{ $t('general.no-data-for-table') }}</p>
  </div>
)

interface Props {
  data?: NewClientsRepeatReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// Composables
const { t } = useI18n()
const dataTableRef = ref()

// Constants
const { NONE_STAFF_NAME, TABLE_MIN_WIDTH, TABLE_SCROLL_HEIGHT } = NEW_CLIENTS_REPEAT_CONSTANTS

// Core computed properties
const hasData = computed(() => props.data.length > 0)

const repeatMonths = computed(() => {
  return props.data[0]?.repeatInfos?.map(info => info.repeatOfYearMonth) ?? []
})

const formattedNewClientsMonth = computed(() => {
  if (!hasData.value) return ''

  const firstMonth = props.data[0]?.repeatInfos?.[0]?.repeatOfYearMonth
  return firstMonth ? formatYearMonthDisplay(String(firstMonth)) : ''
})

// Table data processing
const tableRows = computed(() => {
  if (!hasData.value) return []

  return props.data.map((item, index) => ({
    ...item,
    rowIndex: index,
    summary: calculateRowSummary(item),
    repeatColumns: createRepeatColumns(item),
  }))
})

// Footer totals
const totals = computed<FooterTotals>(() => {
  if (!hasData.value) {
    return {
      totalNewClients: 0,
      totalRepeatClients: 0,
      totalRepeatPercentage: '',
      monthlyTotals: []
    }
  }

  const totalNewClients = tableRows.value.reduce((sum, row) => sum + row.totalNewClients, 0)
  const totalRepeatClients = tableRows.value.reduce((sum, row) => sum + row.summary.totalClients, 0)

  return {
    totalNewClients,
    totalRepeatClients,
    totalRepeatPercentage: calculatePercentage(totalRepeatClients, totalNewClients),
    monthlyTotals: calculateMonthlyTotals(totalNewClients)
  }
})

// Helper functions
function calculateRowSummary(item: NewClientsRepeatReportItem) {
  const totalClients = item.repeatInfos.reduce((sum, info) => sum + info.totalRepeatClients, 0)
  const percentage = item.totalNewClients > 0 ? (totalClients / item.totalNewClients) * 100 : 0

  return { totalClients, percentage }
}

function createRepeatColumns(item: NewClientsRepeatReportItem): RepeatColumn[] {
  const repeatDataMap = new Map(
    item.repeatInfos.map(info => [info.repeatOfYearMonth, info])
  )

  return repeatMonths.value.map(month => {
    const clients = repeatDataMap.get(month)?.totalRepeatClients ?? 0
    const percentage = item.totalNewClients > 0 ? (clients / item.totalNewClients) * 100 : 0

    return {
      month,
      clients,
      percentage: percentage ? formatPercentage(percentage) : ''
    }
  })
}

function calculateMonthlyTotals(totalNewClients: number) {
  return repeatMonths.value.map((month, index) => {
    const clients = tableRows.value.reduce(
      (sum, row) => sum + (row.repeatColumns[index]?.clients ?? 0),
      0
    )

    return {
      month,
      clients,
      percentage: calculatePercentage(clients, totalNewClients)
    }
  })
}

function calculatePercentage(numerator: number, denominator: number): string {
  if (denominator === 0) return ''
  return numerator > 0 ? formatPercentage((numerator / denominator) * 100) : ''
}

// Formatting functions
const formatSummaryPercentage = (row: TableRow) =>
  row.summary.percentage ? formatPercentage(row.summary.percentage) : ''

const formatStaffName = (staffName: string) =>
  staffName.toLowerCase() === NONE_STAFF_NAME
    ? t('general.label-no-input')
    : staffName

const formatRepeatMonthDisplay = (yearMonth: number) => {
  const month = String(yearMonth).slice(-2)
  return `${month} ${t('new-clients-repeat.label-repeat')}`
}

const formatYearMonthDisplay = (yearMonth: string) =>
  `${yearMonth.slice(0, 4)}-${yearMonth.slice(4, 6)}`

// Print functionality
const getPrintConfiguration = (): PrintSection => {
  const tableElement = dataTableRef.value?.$el?.querySelector('.p-datatable-table')

  if (!tableElement) {
    throw new Error('Table element not found for printing')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement
  }
}

defineExpose({ getPrintConfiguration })
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
