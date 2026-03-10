<template>
  <DataTable
    ref="dataTableRef"
    :value="transformedData"
    :rowHover="true"
    :scrollable="true"
    tableStyle="min-width: 100rem"
    :scrollHeight="TABLE_CONSTANTS.SCROLL_HEIGHT"
    tableClass="branch-sales-table"
    dataKey="branch-sales-table"
    showGridlines
  >
    <!-- Header -->
    <ColumnGroup type="header">
      <Row>
        <Column :rowspan="2" :header="$t('branch-sales.label-branch')" headerClass="bg-gray" />
        <Column :colspan="4" :header="$t('branch-sales.label-service')" headerClass="bg-yellow border-bottom-0" />
        <Column :colspan="3" :header="$t('branch-sales.label-product')" headerClass="bg-yellow border-bottom-0" />
        <Column :rowspan="2" headerClass="bg-yellow">
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
          headerClass="bg-green border-bottom-0"
        />
        <Column :rowspan="2" headerClass="bg-green">
          <template #header>
            <p>
              {{ $t('branch-sales.label-sales-total') }} <br />
              (<span class="text-blue text-no-wrap">S1 + S2 + S3</span>)
            </p>
          </template>
        </Column>
        <Column :rowspan="2" :header="$t('branch-sales.label-prepaid-goods-deduction-total')" headerClass="bg-gray" />
        <Column :rowspan="2" :header="$t('branch-sales.label-points-deduction')" headerClass="bg-gray" />
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
        <Column :header="$t('branch-sales.label-total') + ' (A)'" field="serviceTotal" headerClass="bg-yellow" />
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
        <Column :header="$t('branch-sales.label-total') + ' (B)'" field="productTotal" headerClass="bg-yellow" />
        <Column :header="$t('branch-sales.label-prepaid-card')" field="prepaidCard" headerClass="bg-green" />
        <Column :header="$t('branch-sales.label-prepaid-service')" field="prepaidService" headerClass="bg-green" />
        <Column field="prepaidTotal" headerClass="bg-green">
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
    <Column field="serviceTotal">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.serviceTotal) }}
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
    <Column field="productTotal">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.productTotal) }}
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
    <Column field="prepaidTotal">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.prepaidTotal) }}
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
    <Column field="pointsDeduction">
      <template #body="slotProps">
        {{ formatAmount(slotProps.data.pointsDeduction) }}
      </template>
    </Column>

    <ColumnGroup v-if="transformedData.length" type="footer">
      <Row>
        <Column :footer="$t('general.totals')" footerClass="bg-gray first-column" />
        <Column :footer="formatAmount(mapDataTotal.serviceSales)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(mapDataTotal.servicePrepaidCardDeduction)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(mapDataTotal.servicePrepaidServiceDeduction)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(mapDataTotal.serviceTotal)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(mapDataTotal.productSales)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(mapDataTotal.productPrepaidCardDeduction)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(mapDataTotal.productTotal)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(mapDataTotal.revenueTotal)" footerClass="bg-yellow" />
        <Column :footer="formatAmount(mapDataTotal.prepaidCard)" footerClass="bg-green" />
        <Column :footer="formatAmount(mapDataTotal.prepaidService)" footerClass="bg-green" />
        <Column :footer="formatAmount(mapDataTotal.prepaidTotal)" footerClass="bg-green" />
        <Column :footer="formatAmount(mapDataTotal.salesTotal)" footerClass="bg-green" />
        <Column :footer="formatAmount(mapDataTotal.prepaidGoodsDeductionTotal)" footerClass="bg-gray" />
        <Column :footer="formatAmount(mapDataTotal.pointsDeduction)" footerClass="bg-gray" />
      </Row>
    </ColumnGroup>
  </DataTable>
</template>

<script setup lang="ts">
import { formatAmount } from '@/utils/common'

const props = defineProps<{
  data: any[]
}>()
</script>

<style lang="scss" scoped>
.branch-sales-table {
  width: 100%;
}
</style>
