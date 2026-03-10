<template>
  <DataTable
    :value="data"
    :rowHover="true"
    :scrollable="true"
    :tableStyle="`min-width: ${TABLE_BRANCH_SALES.MIN_WIDTH}`"
    :scrollHeight="TABLE_BRANCH_SALES.SCROLL_HEIGHT"
    tableClass="branch-sales-table"
    dataKey="branch-sales-table"
    showGridlines
  >
    <!-- Header -->
    <ColumnGroup type="header">
      <Row>
        <Column :rowspan="2" :header="$t('branch-sales.label-branch')" headerClass="bg-gray" />
        <Column
          :colspan="4"
          :header="$t('branch-sales.label-service')"
          headerClass="bg-yellow border-bottom-0"
        />
        <Column
          :colspan="3"
          :header="$t('branch-sales.label-product')"
          headerClass="bg-yellow border-bottom-0"
        />
        <Column :rowspan="2" headerClass="bg-yellow">
          <template #header>
            <p>
              {{ $t('branch-sales.label-revenue-total') }} <br />
              (<span class="text-no-wrap">{{ $t('branch-sales.label-a-b') }}</span
              >)
            </p>
          </template>
        </Column>
        <Column
          :colspan="3"
          :header="$t('branch-sales.label-prepaid-goods-sales')"
          headerClass="bg-green border-bottom-0"
        />
        <Column :rowspan="2" headerClass="bg-green">
          <template #header>
            <p>
              {{ $t('branch-sales.label-sales-total') }} <br />
              (<span class="text-blue text-no-wrap">{{ $t('branch-sales.label-s1-s2-s3') }}</span
              >)
            </p>
          </template>
        </Column>
        <Column
          :rowspan="2"
          :header="$t('branch-sales.label-prepaid-goods-deduction-total')"
          headerClass="bg-gray"
        />
        <Column
          :rowspan="2"
          :header="$t('branch-sales.label-points-deduction')"
          headerClass="bg-gray"
        />
      </Row>

      <Row>
        <Column field="serviceSales" headerClass="bg-green">
          <template #header>
            <p class="text-no-wrap">
              {{ $t('branch-sales.label-sales') }} (<span class="text-blue">{{
                $t('branch-sales.label-s1')
              }}</span
              >)
            </p>
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
        <Column
          :header="$t('branch-sales.label-total') + ' (A)'"
          field="serviceTotal"
          headerClass="bg-yellow"
        />
        <Column field="productSales" headerClass="bg-green">
          <template #header>
            <p class="text-no-wrap">
              {{ $t('branch-sales.label-sales') }} (<span class="text-blue">{{
                $t('branch-sales.label-s2')
              }}</span
              >)
            </p>
          </template>
        </Column>
        <Column
          :header="$t('branch-sales.label-prepaid-card-deduction')"
          field="productPrepaidCard"
          headerClass="bg-yellow"
        />
        <Column
          :header="$t('branch-sales.label-total') + ' (B)'"
          field="productTotal"
          headerClass="bg-yellow"
        />
        <Column
          :header="$t('branch-sales.label-prepaid-card')"
          field="prepaidCard"
          headerClass="bg-green"
        />
        <Column
          :header="$t('branch-sales.label-prepaid-service')"
          field="prepaidService"
          headerClass="bg-green"
        />
        <Column field="prepaidTotal" headerClass="bg-green">
          <template #header>
            <p class="text-no-wrap">
              {{ $t('branch-sales.label-total') }} (<span class="text-blue">{{
                $t('branch-sales.label-s3')
              }}</span
              >)
            </p>
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
        <Column :footer="$t('general.totals')" footerClass="bg-gray first-column" />
        <Column :footer="formatAmount(totalData.serviceSales)" footerClass="bg-yellow" />
        <Column
          :footer="formatAmount(totalData.servicePrepaidCardDeduction)"
          footerClass="bg-yellow"
        />
        <Column
          :footer="formatAmount(totalData.servicePrepaidServiceDeduction)"
          footerClass="bg-yellow"
        />
        <Column :footer="formatAmount(totalData.serviceTotal)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(totalData.productSales)" footerClass="bg-yellow" />
        <Column
          :footer="formatAmount(totalData.productPrepaidCardDeduction)"
          footerClass="bg-yellow"
        />
        <Column :footer="formatAmount(totalData.productTotal)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(totalData.revenueTotal)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(totalData.prepaidCard)" footerClass="bg-green" />
        <Column :footer="formatAmount(totalData.prepaidService)" footerClass="bg-green" />
        <Column :footer="formatAmount(totalData.prepaidTotal)" footerClass="bg-green" />
        <Column :footer="formatAmount(totalData.salesTotal)" footerClass="bg-green" />
        <Column
          :footer="formatAmount(totalData.prepaidGoodsDeductionTotal)"
          footerClass="bg-gray"
        />
        <Column :footer="formatAmount(totalData.pointsDeduction)" footerClass="bg-gray" />
      </Row>
    </ColumnGroup>
  </DataTable>
</template>

<script setup lang="ts">
import { TABLE_BRANCH_SALES } from '@/constants/table'
import type { IBranchSalesReportData } from '@/types/sales-report/BranchSales'
import { formatAmount } from '@/utils/common'

defineProps<{
  /** Array of branch sales report data */
  data: IBranchSalesReportData[]
  /** Aggregated totals excluding shop identification fields */
  totalData: Omit<IBranchSalesReportData, 'shopId' | 'branch'>
}>()
</script>
