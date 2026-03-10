<template>
  <Card>
    <template #content>
      <pre>{{ transformedData }}</pre>
      <!-- Table  -->
      <DataTable
        ref="dataTableRef"
        :value="transformedData"
        :rowHover="true"
        :scrollable="true"
        tableStyle="min-width: 38rem"
        scrollHeight="550px"
        tableClass="sales-by-discount-category-table"
        showGridlines
      >
        <!-- Header -->
        <ColumnGroup type="header">
          <Row>
            <Column
              :header="$t('sales-by-discount-category.label-discount-category')"
              headerClass="bg-gray"
              style="width: 25%"
            />
            <Column :header="$t('sales-by-discount-category.label-qty')" headerClass="bg-gray" />
            <Column :header="$t('sales-by-discount-category.label-discount-amount')" headerClass="bg-gray" />
            <Column :header="$t('service-sales-by-month.label-ratio')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="discountCategory">
          <template #body="slotProps">
            {{
              slotProps.data.discountCategory === 'NONE'
                ? $t('sales-by-discount-category.label-no-discount-category')
                : slotProps.data.discountCategory
            }}
          </template>
        </Column>
        <Column field="quantity">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.qty) || 0 }}
          </template>
        </Column>
        <Column field="amount">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.discountAmount) || 0 }}
          </template>
        </Column>
        <Column field="ratio">
          <template #body="slotProps"> {{ formatAmount(slotProps.data.ratio, { decimalCount: 1 }) || 0 }}% </template>
        </Column>

        <!-- Footer -->
        <ColumnGroup v-if="transformedData.length" type="footer">
          <Row>
            <Column :footer="$t('sales-by-discount-category.label-total')" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.qty) || '0'" footerClass="bg-gray" />
            <Column :footer="formatAmount(mapDataTotal.discountAmount) || '0'" footerClass="bg-gray" />
            <Column
              :footer="(formatAmount(mapDataTotal.ratio, { decimalCount: 1 }) || '0') + '%'"
              footerClass="bg-gray"
            />
          </Row>
        </ColumnGroup>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Constants
import { PRINT_TYPE } from '@/constants'
// Types
import type { PrintSection } from '@/types/print'
import type { SalesByDiscountCategoryReportItem } from '@/types/sales-report/SalesByDiscountCategory'
// Utils
import { formatAmount } from '@/utils/common'

interface Props {
  data?: SalesByDiscountCategoryReportItem[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format
const transformedData = computed<SalesByDiscountCategoryReportItem[]>(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return props.data
})

const mapDataTotal = computed(() => {
  return transformedData.value.reduce(
    (acc, item) => {
      return {
        discountAmount: acc.discountAmount + (item.discountAmount ?? 0),
        qty: acc.qty + (item.qty ?? 0),
        ratio: acc.ratio + (item.ratio ?? 0),
      }
    },
    {
      discountAmount: 0,
      qty: 0,
      ratio: 0,
    },
  )
})

// Methods to access DataTable DOM
const getDataTableDOM = (): HTMLElement | null => {
  if (dataTableRef.value) {
    return dataTableRef.value.$el.querySelector('.p-datatable-table')
  }
  return null
}

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
:deep(.sales-by-discount-category-table) {
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
