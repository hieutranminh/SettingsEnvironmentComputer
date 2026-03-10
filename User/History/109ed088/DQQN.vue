<template>
  <Card>
    <template #content>
      <div class="table-container">
        <div class="table-left">
          <h4>{{ $t('clients-by-period.title-table-visiting-clients') }}</h4>
          <DataTable
            ref="dataTableVisitingClientsRef"
            :value="transformedDataVisitingClients"
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
                  :colspan="3"
                  :header="$t('clients-by-period.label-registered-clients')"
                  headerClass="bg-gray border-bottom-0"
                />
                <Column
                  :rowspan="2"
                  :header="`${$t('clients-by-period.label-unregistered-clients')} (B)`"
                  headerClass="bg-gray"
                />
                <Column
                  :rowspan="2"
                  :header="`${$t('clients-by-period.label-grand-total')} (A + B)`"
                  headerClass="bg-gray"
                />
              </Row>

              <Row>
                <Column :header="$t('clients-by-period.label-new')" headerClass="bg-gray" />
                <Column :header="$t('clients-by-period.label-revisit')" headerClass="bg-gray" />
                <Column :header="`${$t('clients-by-period.label-total')}(A)`" headerClass="bg-gray" />
              </Row>
            </ColumnGroup>

            <!-- Body -->
            <Column field="countingBasis"> </Column>
            <Column field="new"> </Column>
            <Column field="revisit"> </Column>
            <Column field="total"> </Column>
            <Column field="unregistered"> </Column>
            <Column field="grandTotal"> </Column>

            <!-- Empty -->
            <template #empty> {{ $t('general.no-data-for-table') }} </template>
          </DataTable>
        </div>

        <div class="table-right">
          <h4>{{ $t('clients-by-period.title-table-visiting-members') }}</h4>
          <DataTable
            ref="dataTableVisitingMembersRef"
            :value="transformedDataVisitingMembers"
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
                  :colspan="3"
                  :header="$t('clients-by-period.label-prepaid-goods-sales')"
                  headerClass="bg-gray border-bottom-0"
                />
                <Column
                  :rowspan="2"
                  :header="$t('clients-by-period.label-prepaid-goods-deduction')"
                  headerClass="bg-gray"
                />
              </Row>

              <Row>
                <Column :header="$t('clients-by-period.label-first-purchase')" headerClass="bg-gray" />
                <Column :header="$t('clients-by-period.label-repurchase')" headerClass="bg-gray" />
                <Column :header="$t('clients-by-period.label-total')" headerClass="bg-gray" />
              </Row>
            </ColumnGroup>

            <!-- Body -->
            <Column field="countingBasis"> </Column>
            <Column field="firstPurchase"> </Column>
            <Column field="repurchase"> </Column>
            <Column field="total"> </Column>
            <Column field="deduction"> </Column>

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
import type { ClientSummary, MemberSummary } from '@/types/client-report/ClientsByPeriod'
import type { PrintSection } from '@/types/print'

interface Props {
  clientSummary: ClientSummary
  memberSummary: MemberSummary
}

const props = withDefaults(defineProps<Props>(), {
  clientSummary: () => ({}) as ClientSummary,
  memberSummary: () => ({}) as MemberSummary,
})

// Composables
const { t } = useI18n()

// DataTable ref
const dataTableVisitingClientsRef = ref()
const dataTableVisitingMembersRef = ref()

const transformedDataVisitingClients = computed(() => {
  if (!props.clientSummary) return []

  const {
    newClient = 0,
    revisitClient = 0,
    unregisteredClient = 0,
    newSale = 0,
    revisitSale = 0,
    unregisteredSale = 0,
  } = props.clientSummary || {}

  const clientTotal = newClient + revisitClient
  const clientGrandTotal = clientTotal + unregisteredClient
  const saleTotal = newSale + revisitSale
  const saleGrandTotal = saleTotal + unregisteredSale

  return [
    {
      countingBasis: t('clients-by-period.label-number-of-clients'),
      new: newClient,
      revisit: revisitClient,
      total: clientTotal,
      unregistered: unregisteredClient,
      grandTotal: clientGrandTotal,
    },
    {
      countingBasis: t('clients-by-period.label-number-of-sales'),
      new: newSale,
      revisit: revisitSale,
      total: saleTotal,
      unregistered: unregisteredSale,
      grandTotal: saleGrandTotal,
    },
  ]
})

const transformedDataVisitingMembers = computed(() => {
  if (!props.memberSummary) return []

  const {
    firstPurchaseClient = 0,
    repurchaseClient = 0,
    deductionClient = 0,
    firstPurchaseSale = 0,
    repurchaseSale = 0,
    deductionSale = 0,
  } = props.memberSummary || {}

  return [
    {
      countingBasis: t('clients-by-period.label-number-of-clients'),
      firstPurchase: firstPurchaseClient,
      repurchase: repurchaseClient,
      total: firstPurchaseClient + repurchaseClient,
      deduction: deductionClient,
    },
    {
      countingBasis: t('clients-by-period.label-number-of-sales'),
      firstPurchase: firstPurchaseSale,
      repurchase: repurchaseSale,
      total: firstPurchaseSale + repurchaseSale,
      deduction: deductionSale,
    },
  ]
})

// Methods to access DataTable DOM
const getDataTableDOMVisitingClients = (): HTMLElement | null => {
  if (dataTableVisitingClientsRef.value) {
    return dataTableVisitingClientsRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

const getPrintConfigurationVisitingClients = (): PrintSection => {
  const tableElement = getDataTableDOMVisitingClients()
  if (!tableElement) {
    throw new Error('Table element not found')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
    title: t('clients-by-period.title-table-visiting-clients'),
  }
}

const getDataTableDOMVisitingMembers = (): HTMLElement | null => {
  if (dataTableVisitingMembersRef.value) {
    return dataTableVisitingMembersRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

const getPrintConfigurationVisitingMembers = (): PrintSection => {
  const tableElement = getDataTableDOMVisitingMembers()
  if (!tableElement) {
    throw new Error('Table element not found')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
    title: t('clients-by-period.title-table-visiting-members'),
  }
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
