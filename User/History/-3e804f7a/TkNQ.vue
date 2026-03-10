<template>
  <Card>
    <template #content>
      <!-- Table  -->
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
        <BranchSalesTableHeader />

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

      <!-- Table special for print  -->
      <DataTable
        ref="dataTableRefPrint"
        :value="transformedData"
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
            <Column
              :rowspan="2"
              :header="$t('branch-sales.label-prepaid-goods-deduction-total')"
              headerClass="bg-gray"
            />
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
            <Column
              :header="$t('branch-sales.label-prepaid-card') + ' (S3)'"
              field="prepaidCard"
              headerClass="bg-green"
            />
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

        <ColumnGroup v-if="transformedData.length" type="footer">
          <Row>
            <Column :footer="$t('general.totals')" footerClass="bg-gray first-column" />
            <Column :footer="formatAmount(mapDataTotal.serviceSales)" footerClass="bg-yellow" />
            <Column :footer="formatAmount(mapDataTotal.servicePrepaidCardDeduction)" footerClass="bg-yellow" />
            <Column :footer="formatAmount(mapDataTotal.servicePrepaidServiceDeduction)" footerClass="bg-yellow" />
            <Column :footer="formatAmount(mapDataTotal.productSales)" footerClass="bg-yellow" />
            <Column :footer="formatAmount(mapDataTotal.productPrepaidCardDeduction)" footerClass="bg-yellow" />
            <Column :footer="formatAmount(mapDataTotal.revenueTotal)" footerClass="bg-yellow" />
            <Column :footer="formatAmount(mapDataTotal.prepaidCard)" footerClass="bg-green" />
            <Column :footer="formatAmount(mapDataTotal.prepaidService)" footerClass="bg-green" />
            <Column :footer="formatAmount(mapDataTotal.salesTotal)" footerClass="bg-green" />
            <Column :footer="formatAmount(mapDataTotal.prepaidGoodsDeductionTotal)" footerClass="bg-gray" />
          </Row>
        </ColumnGroup>
      </DataTable>

      <!-- Load More -->
      <div v-if="hasMoreItems" class="load-more">
        <p>
          {{
            $t('branch-sales.total-of-records', {
              sumItems: props.data?.length || 0,
              items: pagingInfo?.totalItems || 0,
            })
          }}
        </p>
        <Button :label="$t('general.more')" @click="handleLoadMore" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Constants
import { PRINT_TYPE } from '@/constants'
// Types
import type { ListResponse } from '@/types/ApiResponse'
import type { PrintSection } from '@/types/print'
// Utils
import type { BranchSalesTotalReportItem } from '@/types/sales-report/BranchSales'
import { formatAmount } from '@/utils/common'

import BranchSalesTableHeader from './BranchSalesTableHeader.vue'

interface Props {
  data?: BranchSalesTotalReportItem[]
  pagingInfo?: ListResponse<BranchSalesTotalReportItem>['pagingInfo']
}

interface Emits {
  (e: 'loadMore'): void
}

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

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  pagingInfo: undefined,
})

const emit = defineEmits<Emits>()

const TABLE_CONSTANTS = {
  SCROLL_HEIGHT: '600px',
} as const

// DataTable ref
const dataTableRef = ref()
const dataTableRefPrint = ref()

// Transform API data to table format
const transformedData = computed<BranchSalesReportData[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return props.data.map((item) => {
    const totalServiceAmount =
      item.serviceSalesAmount + item.serviceBalanceDeductionAmount + item.serviceDeductionAmount
    const totalProductAmount = item.productSalesAmount + item.productBalanceDeductionAmount
    const totalPrepaidGoodsSalesAmount = item.prepaidCardSalesAmount + item.prepaidServicesSalesAmount

    return {
      shopId: item.shopId,
      branch: item.shopName,
      // Service
      serviceSales: item.serviceSalesAmount,
      servicePrepaidCardDeduction: item.serviceBalanceDeductionAmount,
      servicePrepaidServiceDeduction: item.serviceDeductionAmount,
      serviceTotal: totalServiceAmount,
      // Product
      productSales: item.productSalesAmount,
      productPrepaidCardDeduction: item.productBalanceDeductionAmount,
      productTotal: totalProductAmount,
      // Prepaid Goods
      revenueTotal: totalProductAmount + totalServiceAmount,
      prepaidCard: item.prepaidCardSalesAmount,
      prepaidService: item.prepaidServicesSalesAmount,
      prepaidTotal: totalPrepaidGoodsSalesAmount,
      salesTotal: item.serviceSalesAmount + item.productSalesAmount + totalPrepaidGoodsSalesAmount,
      prepaidGoodsDeductionTotal: item.prepaidGoodsDeductionAmount,
      pointsDeduction: item.pointDeduction,
    }
  })
})

const mapDataTotal = computed(() => {
  return transformedData.value.reduce(
    (acc, item) => {
      return {
        serviceSales: acc.serviceSales + item.serviceSales,
        servicePrepaidCardDeduction: acc.servicePrepaidCardDeduction + item.servicePrepaidCardDeduction,
        servicePrepaidServiceDeduction: acc.servicePrepaidServiceDeduction + item.servicePrepaidServiceDeduction,
        serviceTotal: acc.serviceTotal + item.serviceTotal,
        productSales: acc.productSales + item.productSales,
        productPrepaidCardDeduction: acc.productPrepaidCardDeduction + item.productPrepaidCardDeduction,
        productTotal: acc.productTotal + item.productTotal,
        revenueTotal: acc.revenueTotal + item.revenueTotal,
        prepaidCard: acc.prepaidCard + item.prepaidCard,
        prepaidService: acc.prepaidService + item.prepaidService,
        prepaidTotal: acc.prepaidTotal + item.prepaidTotal,
        salesTotal: acc.salesTotal + item.salesTotal,
        prepaidGoodsDeductionTotal: acc.prepaidGoodsDeductionTotal + item.prepaidGoodsDeductionTotal,
        pointsDeduction: acc.pointsDeduction + item.pointsDeduction,
      }
    },
    {
      serviceSales: 0,
      servicePrepaidCardDeduction: 0,
      servicePrepaidServiceDeduction: 0,
      serviceTotal: 0,
      productSales: 0,
      productPrepaidCardDeduction: 0,
      productTotal: 0,
      revenueTotal: 0,
      prepaidCard: 0,
      prepaidService: 0,
      prepaidTotal: 0,
      salesTotal: 0,
      prepaidGoodsDeductionTotal: 0,
      pointsDeduction: 0,
    },
  )
})

// Check if there are more items to load
const hasMoreItems = computed(() => {
  if (!props.pagingInfo) return false
  const currentItems = props.data?.length || 0
  return currentItems < props.pagingInfo.totalItems
})

const handleLoadMore = (): void => {
  emit('loadMore')
}

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
      didParseCell: (data: {
        column: { index: number }
        section: string
        cell: { styles: { halign?: string } }
      }): void => {
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

  .bg-yellow {
    background-color: var(--p-yellow-100);
  }

  .bg-green {
    background-color: var(--p-green-100);
  }

  .border-bottom-0 {
    border-bottom: none;
  }

  .text-blue {
    color: var(--p-blue-500);
  }

  .text-no-wrap {
    white-space: nowrap;
  }
}

.load-more {
  @include flexCenter;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
