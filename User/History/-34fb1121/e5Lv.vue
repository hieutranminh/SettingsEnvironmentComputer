<template>
  <DataTable
    :value="data"
    :rowHover="true"
    :scrollable="true"
    :tableStyle="`min-width: ${TABLE_CONSTANTS.MIN_WIDTH}`"
    :scrollHeight="TABLE_CONSTANTS.SCROLL_HEIGHT"
    tableClass="branch-sales-table"
    dataKey="branch-sales-table"
    showGridlines
  >
    <!-- Header -->
    <ColumnGroup type="header">
      <Row>
        <Column :rowspan="2" :header="$t('branch-sales.label-branch')" :headerClass="TABLE_CONSTANTS.CLASSES.GRAY" />
        <Column
          :colspan="4"
          :header="$t('branch-sales.label-service')"
          :headerClass="`${TABLE_CONSTANTS.CLASSES.YELLOW} border-bottom-0`"
        />
        <Column
          :colspan="3"
          :header="$t('branch-sales.label-product')"
          :headerClass="`${TABLE_CONSTANTS.CLASSES.YELLOW} border-bottom-0`"
        />
        <Column :rowspan="2" :headerClass="TABLE_CONSTANTS.CLASSES.YELLOW">
          <template #header>
            <p>
              {{ $t('branch-sales.label-revenue-total') }} <br />
              (<span class="text-no-wrap">A + B</span>)
            </p>
          </template>
        </Column>
        <Column
          :colspan="3"
          :header="$t('branch-sales.label-prepaid-goods-sales')"
          :headerClass="`${TABLE_CONSTANTS.CLASSES.GREEN} border-bottom-0`"
        />
        <Column :rowspan="2" :headerClass="TABLE_CONSTANTS.CLASSES.GREEN">
          <template #header>
            <p>
              {{ $t('branch-sales.label-sales-total') }} <br />
              (<span class="text-blue text-no-wrap">S1 + S2 + S3</span>)
            </p>
          </template>
        </Column>
        <Column
          :rowspan="2"
          :header="$t('branch-sales.label-prepaid-goods-deduction-total')"
          :headerClass="TABLE_CONSTANTS.CLASSES.GRAY"
        />
        <Column
          :rowspan="2"
          :header="$t('branch-sales.label-points-deduction')"
          :headerClass="TABLE_CONSTANTS.CLASSES.GRAY"
        />
      </Row>

      <Row>
        <Column field="serviceSales" :headerClass="TABLE_CONSTANTS.CLASSES.GREEN">
          <template #header>
            <p class="text-no-wrap">{{ $t('branch-sales.label-sales') }} (<span class="text-blue">S1</span>)</p>
          </template>
        </Column>
        <Column
          :header="$t('branch-sales.label-prepaid-card-deduction')"
          field="servicePrepaidCard"
          :headerClass="TABLE_CONSTANTS.CLASSES.YELLOW"
        />
        <Column
          :header="$t('branch-sales.label-prepaid-service-deduction')"
          field="servicePrepaidService"
          :headerClass="TABLE_CONSTANTS.CLASSES.YELLOW"
        />
        <Column
          :header="$t('branch-sales.label-total') + ' (A)'"
          field="serviceTotal"
          :headerClass="TABLE_CONSTANTS.CLASSES.YELLOW"
        />
        <Column field="productSales" :headerClass="TABLE_CONSTANTS.CLASSES.GREEN">
          <template #header>
            <p class="text-no-wrap">{{ $t('branch-sales.label-sales') }} (<span class="text-blue">S2</span>)</p>
          </template>
        </Column>
        <Column
          :header="$t('branch-sales.label-prepaid-card-deduction')"
          field="productPrepaidCard"
          :headerClass="TABLE_CONSTANTS.CLASSES.YELLOW"
        />
        <Column
          :header="$t('branch-sales.label-total') + ' (B)'"
          field="productTotal"
          :headerClass="TABLE_CONSTANTS.CLASSES.YELLOW"
        />
        <Column
          :header="$t('branch-sales.label-prepaid-card')"
          field="prepaidCard"
          :headerClass="TABLE_CONSTANTS.CLASSES.GREEN"
        />
        <Column
          :header="$t('branch-sales.label-prepaid-service')"
          field="prepaidService"
          :headerClass="TABLE_CONSTANTS.CLASSES.GREEN"
        />
        <Column field="prepaidTotal" :headerClass="TABLE_CONSTANTS.CLASSES.GREEN">
          <template #header>
            <p class="text-no-wrap">{{ $t('branch-sales.label-total') }} (<span class="text-blue">S3</span>)</p>
          </template>
        </Column>
      </Row>
    </ColumnGroup>

    <!-- Empty -->
    <template #empty> {{ $t('general.no-data-for-table') }} </template>

    <!-- Body -->
    <Column field="branch" bodyClass="first-column" />
    <Column field="serviceSales">
      <template #body="{ data }">
        {{ formatAmount(data.serviceSales) }}
      </template>
    </Column>
    <Column field="servicePrepaidCardDeduction">
      <template #body="{ data }">
        {{ formatAmount(data.servicePrepaidCardDeduction) }}
      </template>
    </Column>
    <Column field="servicePrepaidServiceDeduction">
      <template #body="{ data }">
        {{ formatAmount(data.servicePrepaidServiceDeduction) }}
      </template>
    </Column>
    <Column field="serviceTotal">
      <template #body="{ data }">
        {{ formatAmount(data.serviceTotal) }}
      </template>
    </Column>
    <Column field="productSales">
      <template #body="{ data }">
        {{ formatAmount(data.productSales) }}
      </template>
    </Column>
    <Column field="productPrepaidCardDeduction">
      <template #body="{ data }">
        {{ formatAmount(data.productPrepaidCardDeduction) }}
      </template>
    </Column>
    <Column field="productTotal">
      <template #body="{ data }">
        {{ formatAmount(data.productTotal) }}
      </template>
    </Column>
    <Column field="revenueTotal">
      <template #body="{ data }">
        {{ formatAmount(data.revenueTotal) }}
      </template>
    </Column>
    <Column field="prepaidCard">
      <template #body="{ data }">
        {{ formatAmount(data.prepaidCard) }}
      </template>
    </Column>
    <Column field="prepaidService">
      <template #body="{ data }">
        {{ formatAmount(data.prepaidService) }}
      </template>
    </Column>
    <Column field="prepaidTotal">
      <template #body="{ data }">
        {{ formatAmount(data.prepaidTotal) }}
      </template>
    </Column>
    <Column field="salesTotal">
      <template #body="{ data }">
        {{ formatAmount(data.salesTotal) }}
      </template>
    </Column>
    <Column field="prepaidGoodsDeductionTotal">
      <template #body="{ data }">
        {{ formatAmount(data.prepaidGoodsDeductionTotal) }}
      </template>
    </Column>
    <Column field="pointsDeduction">
      <template #body="{ data }">
        {{ formatAmount(data.pointsDeduction) }}
      </template>
    </Column>

    <ColumnGroup v-if="data.length" type="footer">
      <Row>
        <Column :footer="$t('general.totals')" :footerClass="`${TABLE_CONSTANTS.CLASSES.GRAY} first-column`" />
        <Column :footer="formatAmount(totalData.serviceSales)" :footerClass="TABLE_CONSTANTS.CLASSES.YELLOW" />
        <Column
          :footer="formatAmount(totalData.servicePrepaidCardDeduction)"
          :footerClass="TABLE_CONSTANTS.CLASSES.YELLOW"
        />
        <Column
          :footer="formatAmount(totalData.servicePrepaidServiceDeduction)"
          :footerClass="TABLE_CONSTANTS.CLASSES.YELLOW"
        />
        <Column :footer="formatAmount(totalData.serviceTotal)" :footerClass="TABLE_CONSTANTS.CLASSES.YELLOW" />
        <Column :footer="formatAmount(totalData.productSales)" :footerClass="TABLE_CONSTANTS.CLASSES.YELLOW" />
        <Column
          :footer="formatAmount(totalData.productPrepaidCardDeduction)"
          :footerClass="TABLE_CONSTANTS.CLASSES.YELLOW"
        />
        <Column :footer="formatAmount(totalData.productTotal)" :footerClass="TABLE_CONSTANTS.CLASSES.YELLOW" />
        <Column :footer="formatAmount(totalData.revenueTotal)" :footerClass="TABLE_CONSTANTS.CLASSES.YELLOW" />
        <Column :footer="formatAmount(totalData.prepaidCard)" :footerClass="TABLE_CONSTANTS.CLASSES.GREEN" />
        <Column :footer="formatAmount(totalData.prepaidService)" :footerClass="TABLE_CONSTANTS.CLASSES.GREEN" />
        <Column :footer="formatAmount(totalData.prepaidTotal)" :footerClass="TABLE_CONSTANTS.CLASSES.GREEN" />
        <Column :footer="formatAmount(totalData.salesTotal)" :footerClass="TABLE_CONSTANTS.CLASSES.GREEN" />
        <Column
          :footer="formatAmount(totalData.prepaidGoodsDeductionTotal)"
          :footerClass="TABLE_CONSTANTS.CLASSES.GRAY"
        />
        <Column :footer="formatAmount(totalData.pointsDeduction)" :footerClass="TABLE_CONSTANTS.CLASSES.GRAY" />
      </Row>
    </ColumnGroup>
  </DataTable>
</template>

<script setup lang="ts">
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
  CLASSES: {
    GRAY: 'bg-gray',
    YELLOW: 'bg-yellow',
    GREEN: 'bg-green',
  },
} as const
</script>
