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
        tableClass="clients-by-type-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :header="reportTypeLabel" headerClass="bg-gray" />
            <Column :header="$t('clients-by-type.label-number-of-clients')" headerClass="bg-gray" />
            <Column :header="$t('clients-by-type.label-ratio')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="name" :style="COLUMN_STYLES.NAME" />
        <Column field="totalClient" :style="COLUMN_STYLES.CLIENT_COUNT" />
        <Column field="ratio" :style="COLUMN_STYLES.RATIO">
          <template #body="slotProps">
            {{ formatPercentage(slotProps.data.ratio) }}
          </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="hasData" type="footer">
          <Row>
            <Column :footer="$t('general.total')" footerClass="bg-gray" />
            <Column :footer="formatAmount(footerTotals.totalClient)" footerClass="bg-gray" />
            <Column :footer="formatPercentage(footerTotals.ratio)" footerClass="bg-gray" />
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
import {
  PRINT_TYPE,
  REPORT_TYPE_IN_CLIENTS_BY_TYPE,
  type ReportTypeInClientsByType,
} from '@/constants'
// Types
import type { IClientsByTypeReportItem } from '@/types/client-report/ClientsByType'
import type { IPrintSection } from '@/types/print'
// Utils
import { formatAmount, formatPercentage } from '@/utils/common'

interface IProps {
  data?: IClientsByTypeReportItem[]
  reportType?: ReportTypeInClientsByType
}

const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
  reportType: REPORT_TYPE_IN_CLIENTS_BY_TYPE.SEX,
})

// Constants
const TABLE_STYLES = {
  MIN_WIDTH: 'min-width: 40rem',
  SCROLL_HEIGHT: '550px',
} as const

const COLUMN_STYLES = {
  NAME: 'width: 40%',
  CLIENT_COUNT: 'width: 30%',
  RATIO: 'width: 30%',
} as const

const PERCENTAGE_MULTIPLIER = 100

// Composables
const { t } = useI18n()

// DataTable ref
const dataTableRef = ref()

// Computed
const reportTypeLabel = computed(() => {
  const labelMap = {
    [REPORT_TYPE_IN_CLIENTS_BY_TYPE.SEX]: 'clients-by-type.label-sex',
    [REPORT_TYPE_IN_CLIENTS_BY_TYPE.CLIENT_RATING]: 'clients-by-type.label-client-rating',
    [REPORT_TYPE_IN_CLIENTS_BY_TYPE.CLIENT_GROUP]: 'clients-by-type.label-client-group',
  }

  return t(labelMap[props.reportType] || 'general.all')
})

const hasData = computed(() => tableData.value.length > 0)

const totalClientCount = computed(() => {
  return props.data?.reduce((sum, item) => sum + (item.totalClient ?? 0), 0) ?? 0
})

// Transform API data to table format
const tableData = computed<IClientsByTypeReportItem[]>(() => {
  if (!props.data?.length) {
    return []
  }

  return props.data.map(transformDataItem)
})

const footerTotals = computed(() => {
  return tableData.value.reduce(
    (acc, item) => ({
      totalClient: acc.totalClient + (item.totalClient ?? 0),
      ratio: acc.ratio + (item.ratio ?? 0),
    }),
    { totalClient: 0, ratio: 0 },
  )
})

// Helper functions
const transformDataItem = (item: IClientsByTypeReportItem): IClientsByTypeReportItem => {
  const safeTotalClient = item.totalClient ?? 0
  const ratio =
    totalClientCount.value > 0
      ? (safeTotalClient / totalClientCount.value) * PERCENTAGE_MULTIPLIER
      : 0

  return {
    ...item,
    name: item.name.toLowerCase() === 'none' ? t('general.label-no-input') : item.name,
    ratio,
  }
}

const getTableElement = (): HTMLElement | null => {
  return dataTableRef.value?.$el?.querySelector('.p-datatable-table') ?? null
}

const getPrintConfiguration = (): IPrintSection => {
  const tableElement = getTableElement()
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
:deep(.clients-by-type-table) {
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
