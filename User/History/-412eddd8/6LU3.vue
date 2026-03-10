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
        tableClass="clients-by-type-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :header="$t('clients-by-type.label-sex')" headerClass="bg-gray" />
            <Column :header="$t('clients-by-type.label-number-of-clients')" headerClass="bg-gray" />
            <Column :header="$t('clients-by-type.label-ratio')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="name" style="width: 40%" />
        <Column field="totalClient" style="width: 30%" />
        <Column field="ratio" style="width: 30%">
          <template #body="slotProps"> {{ formatAmount(slotProps.data.ratio, { decimalCount: 1 }) || 0 }}% </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="transformedData.length" type="footer">
          <Row>
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.totalClient)" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.ratio, { decimalCount: 1 }) + '%'" footerClass="bg-gray" />
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
import type { ClientsByTypeReportItem } from '@/types/client-report/ClientsByType'
import type { PrintSection } from '@/types/print'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data?: ClientsByTypeReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// Composables
const { t } = useI18n()

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<ClientsByTypeReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  const totalAmount = props.data.reduce((sum, item) => sum + (item.totalClient ?? 0), 0)

  return props.data.map((item) => ({
    ...item,
    name: item.name === 'None' ? t('general.label-no-input') : item.name,
    ratio: totalAmount > 0 ? ((item.totalClient ?? 0) / totalAmount) * 100 : 0,
  }))
})

// Map data total
const mapDataTotal = computed(() => {
  return transformedData.value.reduce(
    (acc, item) => {
      return {
        totalClient: acc.totalClient + (item.totalClient ?? 0),
        ratio: acc.ratio + (item.ratio ?? 0),
      }
    },
    {
      totalClient: 0,
      ratio: 0,
    },
  )
})

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
