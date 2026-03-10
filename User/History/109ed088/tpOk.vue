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
  itemClientSummary: ClientSummary
  itemMemberSummary: MemberSummary
}

const props = defineProps<Props>()

// Composables
const { t } = useI18n()

// DataTable ref
const dataTableVisitingClientsRef = ref()
const dataTableVisitingMembersRef = ref()

const transformedDataVisitingClients = computed(() => {
  return [
    {
      countingBasis: t('clients-by-period.label-number-of-clients'),
      new: props.itemClientSummary?.newClient,
      revisit: props.itemClientSummary?.revisitClient,
      total: props.itemClientSummary?.newClient + props.itemClientSummary?.revisitClient,
      unregistered: props.itemClientSummary?.unregisteredClient,
      grandTotal:
        props.itemClientSummary?.newClient +
        props.itemClientSummary?.revisitClient +
        props.itemClientSummary?.unregisteredClient,
    },
    {
      countingBasis: t('clients-by-period.label-number-of-sales'),
      new: props.itemClientSummary?.newSale,
      revisit: props.itemClientSummary?.revisitSale,
      total: props.itemClientSummary?.newSale + props.itemClientSummary?.revisitSale,
      unregistered: props.itemClientSummary?.unregisteredSale,
      grandTotal:
        props.itemClientSummary?.newSale +
        props.itemClientSummary?.revisitSale +
        props.itemClientSummary?.unregisteredSale,
    },
  ]
})

const transformedDataVisitingMembers = computed(() => {
  return [
    {
      countingBasis: t('clients-by-period.label-number-of-clients'),
      firstPurchase: props.itemMemberSummary?.firstPurchaseClient,
      repurchase: props.itemMemberSummary?.repurchaseClient,
      total: props.itemMemberSummary?.firstPurchaseClient + props.itemMemberSummary?.repurchaseClient,
      deduction: props.itemMemberSummary?.deductionClient,
    },
    {
      countingBasis: t('clients-by-period.label-number-of-sales'),
      firstPurchase: props.itemMemberSummary?.firstPurchaseSale,
      repurchase: props.itemMemberSummary?.repurchaseSale,
      total: props.itemMemberSummary?.firstPurchaseSale + props.itemMemberSummary?.repurchaseSale,
      deduction: props.itemMemberSummary?.deductionSale,
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

const getPrintConfiguration = (): PrintSection => {
  const tableElement = getDataTableDOMVisitingClients()
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
.p-card {
  margin-bottom: 1rem;
}

.table-container {
  display: flex;
  gap: 1rem;

  h4 {
    margin-bottom: 0.5rem;
  }

  // .table-left {
  //   width: 50%;
  // }

  // .table-right {
  //   width: 50%;
  //   flex-shrink: 0;
  // }
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
