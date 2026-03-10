<template>
  <Card>
    <template #content>
      <div class="table-container">
        <div v-for="config in tableConfigs" :key="config.key" :class="config.containerClass">
          <h4>{{ config.title }}</h4>
          <DataTable
            :ref="(el) => setTableRef(config.key, el)"
            :value="config.transformedData"
            :rowHover="true"
            :scrollable="true"
            tableStyle="min-width: 30rem"
            tableClass="clients-by-period-table"
            showGridlines
          >
            <!-- Header -->
            <ColumnGroup type="header">
              <Row>
                <Column :rowspan="2" :header="$t('clients-by-period.label-counting-basis')" headerClass="bg-gray" />
                <Column
                  :colspan="config.headerConfig.mainGroup.colspan"
                  :header="config.headerConfig.mainGroup.header"
                  headerClass="bg-gray border-bottom-0"
                />
                <Column
                  v-if="config.headerConfig.hasAdditionalColumn"
                  :rowspan="2"
                  :header="config.headerConfig.additionalColumn.header"
                  headerClass="bg-gray"
                />
                <Column
                  v-if="config.headerConfig.hasGrandTotal"
                  :rowspan="2"
                  :header="config.headerConfig.grandTotal.header"
                  headerClass="bg-gray"
                />
              </Row>

              <Row>
                <Column
                  v-for="subHeader in config.headerConfig.subHeaders"
                  :key="subHeader.key"
                  :header="subHeader.header"
                  headerClass="bg-gray"
                />
              </Row>
            </ColumnGroup>

            <!-- Body -->
            <Column field="countingBasis" />
            <Column v-for="field in config.bodyFields" :key="field" :field="field" />

            <!-- Empty -->
            <template #empty>
              {{ $t('general.no-data-for-table') }}
            </template>
          </DataTable>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { PRINT_TYPE } from '@/constants'
import type { ClientSummary, MemberSummary } from '@/types/client-report/ClientsByPeriod'
import type { PrintSection } from '@/types/print'

interface Props {
  clientSummary: ClientSummary
  memberSummary: MemberSummary
}

interface TableConfig {
  key: string
  title: string
  containerClass: string
  transformedData: any[]
  headerConfig: {
    mainGroup: {
      colspan: number
      header: string
    }
    hasAdditionalColumn: boolean
    additionalColumn?: {
      header: string
    }
    hasGrandTotal: boolean
    grandTotal?: {
      header: string
    }
    subHeaders: Array<{
      key: string
      header: string
    }>
  }
  bodyFields: string[]
}

const props = withDefaults(defineProps<Props>(), {
  clientSummary: () => ({}) as ClientSummary,
  memberSummary: () => ({}) as MemberSummary,
})

const { t } = useI18n()
const tableRefs = ref<Record<string, any>>({})

// Utility functions
const createSummaryRows = (
  clientData: Record<string, number>,
  saleData: Record<string, number>,
  labelPrefix: string = 'clients-by-period.label',
) => {
  return [
    {
      countingBasis: t(`${labelPrefix}-number-of-clients`),
      ...clientData,
    },
    {
      countingBasis: t(`${labelPrefix}-number-of-sales`),
      ...saleData,
    },
  ]
}

const calculateTotals = (values: number[]): number => {
  return values.reduce((sum, val) => sum + (val || 0), 0)
}

// Transform data for visiting clients
const transformedDataVisitingClients = computed(() => {
  if (!props.clientSummary) return []

  const {
    newClient = 0,
    revisitClient = 0,
    unregisteredClient = 0,
    newSale = 0,
    revisitSale = 0,
    unregisteredSale = 0,
  } = props.clientSummary

  const clientTotal = calculateTotals([newClient, revisitClient])
  const clientGrandTotal = calculateTotals([clientTotal, unregisteredClient])
  const saleTotal = calculateTotals([newSale, revisitSale])
  const saleGrandTotal = calculateTotals([saleTotal, unregisteredSale])

  return createSummaryRows(
    {
      new: newClient,
      revisit: revisitClient,
      total: clientTotal,
      unregistered: unregisteredClient,
      grandTotal: clientGrandTotal,
    },
    {
      new: newSale,
      revisit: revisitSale,
      total: saleTotal,
      unregistered: unregisteredSale,
      grandTotal: saleGrandTotal,
    },
  )
})

// Transform data for visiting members
const transformedDataVisitingMembers = computed(() => {
  if (!props.memberSummary) return []

  const {
    firstPurchaseClient = 0,
    repurchaseClient = 0,
    deductionClient = 0,
    firstPurchaseSale = 0,
    repurchaseSale = 0,
    deductionSale = 0,
  } = props.memberSummary

  const clientTotal = calculateTotals([firstPurchaseClient, repurchaseClient])
  const saleTotal = calculateTotals([firstPurchaseSale, repurchaseSale])

  return createSummaryRows(
    {
      firstPurchase: firstPurchaseClient,
      repurchase: repurchaseClient,
      total: clientTotal,
      deduction: deductionClient,
    },
    {
      firstPurchase: firstPurchaseSale,
      repurchase: repurchaseSale,
      total: saleTotal,
      deduction: deductionSale,
    },
  )
})

// Table configurations
const tableConfigs = computed<TableConfig[]>(() => [
  {
    key: 'visitingClients',
    title: t('clients-by-period.title-table-visiting-clients'),
    containerClass: 'table-left',
    transformedData: transformedDataVisitingClients.value,
    headerConfig: {
      mainGroup: {
        colspan: 3,
        header: t('clients-by-period.label-registered-clients'),
      },
      hasAdditionalColumn: true,
      additionalColumn: {
        header: `${t('clients-by-period.label-unregistered-clients')} (B)`,
      },
      hasGrandTotal: true,
      grandTotal: {
        header: `${t('clients-by-period.label-grand-total')} (A + B)`,
      },
      subHeaders: [
        { key: 'new', header: t('clients-by-period.label-new') },
        { key: 'revisit', header: t('clients-by-period.label-revisit') },
        { key: 'total', header: `${t('clients-by-period.label-total')}(A)` },
      ],
    },
    bodyFields: ['new', 'revisit', 'total', 'unregistered', 'grandTotal'],
  },
  {
    key: 'visitingMembers',
    title: t('clients-by-period.title-table-visiting-members'),
    containerClass: 'table-right',
    transformedData: transformedDataVisitingMembers.value,
    headerConfig: {
      mainGroup: {
        colspan: 3,
        header: t('clients-by-period.label-prepaid-goods-sales'),
      },
      hasAdditionalColumn: true,
      additionalColumn: {
        header: t('clients-by-period.label-prepaid-goods-deduction'),
      },
      hasGrandTotal: false,
      subHeaders: [
        { key: 'firstPurchase', header: t('clients-by-period.label-first-purchase') },
        { key: 'repurchase', header: t('clients-by-period.label-repurchase') },
        { key: 'total', header: t('clients-by-period.label-total') },
      ],
    },
    bodyFields: ['firstPurchase', 'repurchase', 'total', 'deduction'],
  },
])

// Ref management
const setTableRef = (key: string, el: any) => {
  if (el) {
    tableRefs.value[key] = el
  }
}

// Generic methods for DOM access and print configuration
const getTableDOM = (key: string): HTMLElement | null => {
  const tableRef = tableRefs.value[key]
  return tableRef?.$el?.querySelector('.p-datatable-table') || null
}

const createPrintConfiguration = (key: string, title: string): PrintSection => {
  const tableElement = getTableDOM(key)
  if (!tableElement) {
    throw new Error(`Table element for ${key} not found`)
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
    title,
  }
}

// Exposed methods
const getPrintConfigurationVisitingClients = (): PrintSection => {
  return createPrintConfiguration('visitingClients', t('clients-by-period.title-table-visiting-clients'))
}

const getPrintConfigurationVisitingMembers = (): PrintSection => {
  return createPrintConfiguration('visitingMembers', t('clients-by-period.title-table-visiting-members'))
}

defineExpose({
  getPrintConfigurationVisitingClients,
  getPrintConfigurationVisitingMembers,
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

.table-container {
  display: flex;
  gap: 1rem;

  @include maxResponsive(mobile) {
    display: block;
  }

  h4 {
    margin-bottom: 0.5rem;
  }

  .table-left,
  .table-right {
    flex: 1;
    min-width: 0;
  }

  .table-left {
    @include maxResponsive(mobile) {
      margin-bottom: 2rem;
    }
  }
}

:deep(.clients-by-period-table) {
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
