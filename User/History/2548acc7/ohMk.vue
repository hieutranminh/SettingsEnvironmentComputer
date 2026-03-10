<template>
  <Card>
    <template #content>
      <!-- Table  -->
      <DataTable
        ref="dataTableRef"
        :value="transformedData"
        :rowHover="true"
        :scrollable="true"
        scrollHeight="600px"
        tableClass="branch-sales-table"
        dataKey="branch-sales-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column :rowspan="2" :header="$t('branch-prepaid-goods.label-branch')" headerClass="bg-gray" />
            <Column
              :colspan="2"
              :header="$t('branch-prepaid-goods.label-prepaid-card')"
              headerClass="bg-gray border-bottom-0"
            />
            <Column
              :colspan="2"
              :header="$t('branch-prepaid-goods.label-prepaid-card-discount')"
              headerClass="bg-gray border-bottom-0"
            />
            <Column
              :colspan="3"
              :header="$t('branch-prepaid-goods.label-prepaid-service')"
              headerClass="bg-gray border-bottom-0"
            />
            <Column
              :colspan="3"
              :header="$t('branch-prepaid-goods.label-prepaid-service-qty')"
              headerClass="bg-gray border-bottom-0"
            />
            <Column :rowspan="2" :header="$t('branch-prepaid-goods.label-total-balance')" headerClass="bg-gray" />
          </Row>

          <Row>
            <Column :header="$t('branch-prepaid-goods.label-records')" headerClass="bg-gray" />
            <Column :header="$t('branch-prepaid-goods.label-balance')" headerClass="bg-gray" />

            <Column :header="$t('branch-prepaid-goods.label-records')" headerClass="bg-gray" />
            <Column :header="$t('branch-prepaid-goods.label-balance')" headerClass="bg-gray" />

            <Column :header="$t('branch-prepaid-goods.label-records')" headerClass="bg-gray" />
            <Column :header="$t('branch-prepaid-goods.label-remaining-qty')" headerClass="bg-gray" />
            <Column :header="$t('branch-prepaid-goods.label-balance')" headerClass="bg-gray" />

            <Column :header="$t('branch-prepaid-goods.label-records')" headerClass="bg-gray" />
            <Column :header="$t('branch-prepaid-goods.label-remaining-qty')" headerClass="bg-gray" />
            <Column :header="$t('branch-prepaid-goods.label-balance')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="shopName" bodyClass="first-column" />
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.prepaidCards?.records) }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.prepaidCards?.balance) }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.discountCards?.records) }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.discountCards?.balance) }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.prepaidServices?.records) }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.prepaidServices?.remainingQty) }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.prepaidServices?.balance) }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.unlimitedPrepaidServices?.records) }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{
              slotProps.data.unlimitedPrepaidServices?.records
                ? slotProps.data.unlimitedPrepaidServices?.remainingQty === -1
                  ? $t('general.no-limit')
                  : formatAmount(slotProps.data.unlimitedPrepaidServices?.remainingQty)
                : ''
            }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.unlimitedPrepaidServices?.balance) }}
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.totalBalance) }}
          </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="transformedData.length" type="footer">
          <Row>
            <Column :footer="$t('general.totals')" footerClass="first-column" />
            <Column :footer="formatAmount(lastItem?.prepaidCards?.records || 0)" />
            <Column :footer="formatAmount(lastItem?.prepaidCards?.balance || 0)" />
            <Column :footer="formatAmount(lastItem?.discountCards?.records || 0)" />
            <Column :footer="formatAmount(lastItem?.discountCards?.balance || 0)" />
            <Column :footer="formatAmount(lastItem?.prepaidServices?.records || 0)" />
            <Column :footer="formatAmount(lastItem?.prepaidServices?.remainingQty || 0)" />
            <Column :footer="formatAmount(lastItem?.prepaidServices?.balance || 0)" />
            <Column :footer="formatAmount(lastItem?.unlimitedPrepaidServices?.records || 0)" />
            <Column :footer="formatAmount(lastItem?.unlimitedPrepaidServices?.remainingQty || 0)" />
            <Column :footer="formatAmount(lastItem?.unlimitedPrepaidServices?.balance || 0)" />
          </Row>
        </ColumnGroup>
      </DataTable>
    </template>
  </Card>
  <pre>{{ props.data }}</pre>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Constants
import { PRINT_TYPE } from '@/constants'
// Types
import type { BranchPrepaidGoodsReportItem } from '@/services/sales/sales-reports/branch-prepaid-goods-report.read'
import type { PrintSection } from '@/types/print'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data?: BranchPrepaidGoodsReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// DataTable ref
const dataTableRef = ref()
const dataTableRefPrint = ref()

// Transform API data to table format
const transformedData = computed<BranchPrepaidGoodsReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return props.data.slice(0, -1)
})

// Last item
const lastItem = computed(() => {
  return props.data[props.data.length - 1]
})

// Methods to access DataTable DOM
const getDataTableDOM = (): HTMLElement | null => {
  if (dataTableRefPrint.value) {
    return dataTableRefPrint.value.$el.querySelector('.p-datatable-table')
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
    tableStyles: {
      // Custom cell parsing for this table
      didParseCell: (data: { column: { index: number }; section: string; cell: { styles: { halign?: string } } }) => {
        // First column (index 0) should be center aligned for all sections
        if (data.column.index === 0) {
          data.cell.styles.halign = 'center'
        } else {
          // Other columns: check section type for proper alignment
          if (data.section === 'head') {
            // Header section - keep center alignment
            data.cell.styles.halign = 'center'
          } else {
            // Body and footer sections - right alignment
            data.cell.styles.halign = 'right'
          }
        }
      },
    },
  }
}

defineExpose({
  getDataTableDOM,
  getPrintConfiguration,
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

:deep(.branch-sales-table) {
  .p-datatable-column-header-content {
    text-align: center;
    justify-content: center;
  }

  .p-datatable-column-title {
    font-weight: 400;
  }

  .p-datatable-tbody,
  .p-datatable-tfoot {
    & > tr {
      & > td {
        text-align: right;
      }

      & > td.first-column {
        text-align: center;
        min-width: 150px;
      }
    }

    .p-datatable-empty-message {
      & > td {
        text-align: center;
      }
    }
  }

  .bg-gray {
    background-color: var(--p-gray-100);
  }

  .border-bottom-0 {
    border-bottom: none;
  }

  .text-no-wrap {
    white-space: nowrap;
  }
}

.load-more {
  @include flex-center;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
