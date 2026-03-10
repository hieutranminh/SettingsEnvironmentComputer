<template>
  <Card>
    <template #content>
      <!-- Table  -->
      <DataTable
        v-if="transformedData.length"
        ref="dataTableRef"
        :value="transformedData"
        :rowHover="true"
        :scrollable="true"
        tableStyle="min-width: 50rem"
        scrollHeight="550px"
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
                  <strong>{{ monthOfNewClients }}</strong> <br />
                  <strong>{{ $t('new-clients-repeat.label-new-client') }}</strong>
                </div>
              </template>
            </Column>
            <Column :colspan="2" :header="$t('new-clients-repeat.label-repeat-total')" headerClass="bg-gray" />

            <Column
              v-for="month in monthHeaders"
              :key="month"
              :colspan="2"
              :header="`${month} ${$t('new-clients-repeat.label-repeat')}`"
              headerClass="bg-gray"
            />
          </Row>

          <Row>
            <!-- Repeat Total Column -->
            <Column :header="$t('new-clients-repeat.label-num')" headerClass="bg-gray" />
            <Column header="%" headerClass="bg-gray" />

            <!-- Dynamic month columns -->
            <template v-for="month in monthHeaders" :key="`subheader-${month}`">
              <Column :header="$t('new-clients-repeat.label-num')" headerClass="bg-gray" />
              <Column header="%" headerClass="bg-gray" />
            </template>
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body Columns -->
        <!-- Staff Name -->
        <Column>
          <template #body="slotProps">
            {{ formatStaffName(slotProps.data.staffName, $t('general.label-no-input')) }}
          </template>
        </Column>

        <!-- Total New Clients -->
        <Column field="totalNewClients" />

        <!-- Total Repeat Clients -->
        <Column field="totalRepeatClients" />

        <!-- Total Percentage -->
        <Column>
          <template #body="slotProps">
            {{ slotProps.data.ratio ? formatPercentage(slotProps.data.ratio) : '' }}
          </template>
        </Column>

        <!-- Dynamic Monthly Columns -->
        <template v-for="(month, index) in monthHeaders" :key="`column-${month}`">
          <!-- Count Column -->
          <Column>
            <template #body="slotProps">
              {{ slotProps.data.monthlyRepeats[index]?.count || 0 }}
            </template>
          </Column>

          <!-- Percentage Column -->
          <Column>
            <template #body="slotProps">
              {{
                slotProps.data.monthlyRepeats[index]?.percentage
                  ? formatPercentage(slotProps.data.monthlyRepeats[index].percentage)
                  : ''
              }}
            </template>
          </Column>
        </template>
      </DataTable>

      <div v-else class="empty-data">
        <p>{{ $t('general.no-data-for-table') }}</p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Composables
import { useI18n } from 'vue-i18n'
import { useNewClientsRepeatTable } from '@/composables/tables/useNewClientsRepeatTable'

// Constants
import { PRINT_TYPE } from '@/constants'

// Types
import type { NewClientsRepeatReportItem } from '@/types/client-report/NewClientsRepeat'
import type { PrintSection } from '@/types/print'

// Utils
import { formatPercentage } from '@/utils/common'

interface Props {
  data?: NewClientsRepeatReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// Composables
const { t } = useI18n()
const dataRef = computed(() => props.data)
const { transformedData, monthOfNewClients, monthHeaders, formatStaffName } = useNewClientsRepeatTable(dataRef)

// DataTable ref
const dataTableRef = ref()

/**
 * Get DataTable DOM element for printing
 * Output: HTML table element or null if not found
 */
const getDataTableDOM = (): HTMLElement | null => {
  if (dataTableRef.value) {
    return dataTableRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

/**
 * Get print configuration for this table
 * Output: PrintSection configuration object
 */
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
