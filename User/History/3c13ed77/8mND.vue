<template>
  <DataTable
    ref="dataTableRef"
    :value="data"
    :rowHover="true"
    :scrollable="true"
    :style="{ display: 'none' }"
    :scrollHeight="TABLE_CONSTANTS.SCROLL_HEIGHT"
    tableClass="branch-sales-table"
    dataKey="branch-sales-table"
    showGridlines
  >
    <!-- Header -->
    <ColumnGroup type="header">
      <Row>
        <Column :rowspan="2" :header="$t('branch-sales.label-branch')" headerClass="bg-gray" />
        <Column
          :colspan="3"
          :header="$t('branch-sales.label-service') + ' (A)'"
          headerClass="bg-yellow border-bottom-0"
        />
        <Column
          :colspan="2"
          :header="$t('branch-sales.label-product') + ' (B)'"
          headerClass="bg-yellow border-bottom-0"
        />
        <Column :rowspan="2" headerClass="bg-yellow">
          <template #header>
            <p>{{ $t('branch-sales.label-revenue-total') }} <br />(<span class="text-no-wrap">A + B</span>)</p>
          </template>
        </Column>
        <Column
          :colspan="2"
          :header="$t('branch-sales.label-prepaid-goods-sales')"
          headerClass="bg-green border-bottom-0"
        />
        <Column :rowspan="2" headerClass="bg-green">
          <template #header>
            <p>
              {{ $t('branch-sales.label-sales-total') }} <br />
              (<span class="text-blue text-no-wrap">S1 + S2 + S3 + S4</span>)
            </p>
          </template>
        </Column>
        <Column :rowspan="2" :header="$t('branch-sales.label-prepaid-goods-deduction-total')" headerClass="bg-gray" />
      </Row>

      <Row>
        <Column field="serviceSales" headerClass="bg-green">
          <template #header>
            <p class="text-no-wrap">{{ $t('branch-sales.label-sales') }} (<span class="text-blue">S1</span>)</p>
          </template>
        </Column>
        <Column
          :header="$t('branch-sales.label-prepaid-card-deduction')"
          field="servicePrepaidCard"
          headerClass="bg-yellow"
        />
        <Column
          :header="$t('branch-sales.label-prepaid-service-deduction')"
          field="servicePrepaidService"
          headerClass="bg-yellow"
        />
        <Column field="productSales" headerClass="bg-green">
          <template #header>
            <p class="text-no-wrap">{{ $t('branch-sales.label-sales') }} (<span class="text-blue">S2</span>)</p>
          </template>
        </Column>
        <Column
          :header="$t('branch-sales.label-prepaid-card-deduction')"
          field="productPrepaidCard"
          headerClass="bg-yellow"
        />
        <Column :header="$t('branch-sales.label-prepaid-card') + ' (S3)'" field="prepaidCard" headerClass="bg-green" />
        <Column
          :header="$t('branch-sales.label-prepaid-service') + ' (S4)'"
          field="prepaidService"
          headerClass="bg-green"
        />
      </Row>
    </ColumnGroup>

    <!-- Empty -->
    <template #empty> {{ $t('general.no-data-for-table') }} </template>

    <!-- Body -->
    <Column field="branch" bodyClass="first-column" />
    <Column field="serviceSales">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.serviceSales) }}
      </template>
    </Column>
    <Column field="servicePrepaidCardDeduction">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.servicePrepaidCardDeduction) }}
      </template>
    </Column>
    <Column field="servicePrepaidServiceDeduction">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.servicePrepaidServiceDeduction) }}
      </template>
    </Column>
    <Column field="productSales">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.productSales) }}
      </template>
    </Column>
    <Column field="productPrepaidCardDeduction">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.productPrepaidCardDeduction) }}
      </template>
    </Column>
    <Column field="revenueTotal">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.revenueTotal) }}
      </template>
    </Column>
    <Column field="prepaidCard">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.prepaidCard) }}
      </template>
    </Column>
    <Column field="prepaidService">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.prepaidService) }}
      </template>
    </Column>
    <Column field="salesTotal">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.salesTotal) }}
      </template>
    </Column>
    <Column field="prepaidGoodsDeductionTotal">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.prepaidGoodsDeductionTotal) }}
      </template>
    </Column>

    <ColumnGroup v-if="data.length" type="footer">
      <Row>
        <Column :footer="$t('general.totals')" footerClass="bg-gray first-column" />
        <Column :footer="formatAmount(totalData.serviceSales)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(totalData.servicePrepaidCardDeduction)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(totalData.servicePrepaidServiceDeduction)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(totalData.productSales)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(totalData.productPrepaidCardDeduction)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(totalData.revenueTotal)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(totalData.prepaidCard)" footerClass="bg-green" />
        <Column :footer="formatAmount(totalData.prepaidService)" footerClass="bg-green" />
        <Column :footer="formatAmount(totalData.salesTotal)" footerClass="bg-green" />
        <Column :footer="formatAmount(totalData.prepaidGoodsDeductionTotal)" footerClass="bg-gray" />
      </Row>
    </ColumnGroup>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { PRINT_TYPE } from '@/constants'
import type { PrintSection } from '@/types/print'
import { formatAmount } from '@/utils/common'

interface BranchSalesReportData {
  shopId: number
  branch: string
  serviceSales: number
  servicePrepaidCardDeduction: number
  servicePrepaidServiceDeduction: number
  serviceTotal: number
  productSales: number
  productPrepaidCardDeduction: number
  productTotal: number
  revenueTotal: number
  prepaidCard: number
  prepaidService: number
  prepaidTotal: number
  salesTotal: number
  prepaidGoodsDeductionTotal: number
  pointsDeduction: number
}

defineProps<{
  /** Array of branch sales report data */
  data: BranchSalesReportData[]
  /** Aggregated totals excluding shop identification fields */
  totalData: Omit<BranchSalesReportData, 'shopId' | 'branch'>
}>()

const TABLE_CONSTANTS = {
  SCROLL_HEIGHT: '600px',
  MIN_WIDTH: '100rem',
} as const

const dataTableRef = ref()

// Methods to access DataTable DOM
const getDataTableDOM = (): HTMLElement | null => {
  if (dataTableRef.value) {
    return dataTableRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

// Method to get print configuration
const getPrintConfigurationPrint = (): PrintSection => {
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
  getPrintConfigurationPrint,
})
</script>
