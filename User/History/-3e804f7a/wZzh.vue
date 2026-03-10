<template>
  <Card>
    <template #content>
      <!-- Table Main -->
      <BranchSalesTableMain :data="transformedData" :totalData="mapDataTotal" />

      <!-- Table Print -->
      <BranchSalesTablePrint ref="dataTableRefPrint" :data="transformedData" :totalData="mapDataTotal" />

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
import { COLUMN_ALIGNMENT, COLUMN_INDEX, TABLE_SECTIONS } from '@/constants/table'
// Types
import type { ListResponse } from '@/types/ApiResponse'
import type { PrintSection } from '@/types/print'
// Utils
import type { BranchSalesTotalReportItem, BranchSalesReportData } from '@/types/sales-report/BranchSales'

// Components
import BranchSalesTableMain from './BranchSalesTableMain.vue'
import BranchSalesTablePrint from './BranchSalesTablePrint.vue'

interface Props {
  data?: BranchSalesTotalReportItem[]
  pagingInfo?: ListResponse<BranchSalesTotalReportItem>['pagingInfo']
}

interface Emits {
  (e: 'loadMore'): void
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  pagingInfo: undefined,
})

const emit = defineEmits<Emits>()

// DataTable ref
const dataTableRefPrint = ref<InstanceType<typeof BranchSalesTablePrint>>()

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

const mapDataTotal = computed<Omit<BranchSalesReportData, 'shopId' | 'branch'>>(() => {
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

// Method to get print configuration
const getPrintConfiguration = (): PrintSection => {
  const tableElement = dataTableRefPrint.value?.getDataTableDOM()
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
        // First column should be center aligned for all sections
        if (data.column.index === COLUMN_INDEX.FIRST) {
          data.cell.styles.halign = COLUMN_ALIGNMENT.FIRST_COLUMN
        } else {
          // Other columns: check section type for proper alignment
          if (data.section === TABLE_SECTIONS.HEAD) {
            // Header section - keep center alignment
            data.cell.styles.halign = COLUMN_ALIGNMENT.HEADER_COLUMNS
          } else {
            // Body and footer sections - right alignment
            data.cell.styles.halign = COLUMN_ALIGNMENT.OTHER_COLUMNS
          }
        }
      },
    },
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
