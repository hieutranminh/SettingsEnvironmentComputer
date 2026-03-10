<template>
  <Card>
    <template #content>
      <!-- Table  -->
      <DataTable
        ref="dataTableRef"
        :value="transformedData"
        :rowHover="true"
        :scrollable="true"
        tableStyle="min-width: 40rem"
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
            <Column :header="$t('sales-by-discount-category.label-ratio')" headerClass="bg-gray" />
          </Row>
        </ColumnGroup>

        <!-- Empty -->
        <template #empty> {{ $t('general.no-data-for-table') }} </template>

        <!-- Body -->
        <Column field="discountCategory" />
        <Column field="qty">
          <template #body="slotProps">
            {{ formatAmount(slotProps.data.qty) || 0 }}
          </template>
        </Column>
        <Column field="discountAmount">
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
            <Column :footer="$t('general.totals')" footerClass="bg-gray" />
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
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()

// DataTable ref
const dataTableRef = ref()

// Transform API data to table format (no transformation needed for this table)
const transformedData = computed(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return props.data
})

// Calculate totals for footer
const mapDataTotal = computed(() => {
  if (!props.data || props.data.length === 0) {
    return {
      qty: 0,
      discountAmount: 0,
      ratio: 0,
    }
  }

  return props.data.reduce(
    (acc, item) => ({
      qty: acc.qty + item.qty,
      discountAmount: acc.discountAmount + item.discountAmount,
      ratio: acc.ratio + item.ratio,
    }),
    {
      qty: 0,
      discountAmount: 0,
      ratio: 0,
    },
  )
})

/**
 * Get print configuration for the table component
 * @returns Print section configuration
 */
const getPrintConfiguration = (): PrintSection => {
  return {
    type: PRINT_TYPE.TABLE,
    title: t('sales-by-discount-category.table-title'),
    element: dataTableRef.value?.$el,
  }
}

// Expose methods for parent component
defineExpose({
  getPrintConfiguration,
})
</script>

<style lang="scss" scoped>
:deep(.sales-by-discount-category-table) {
  .p-datatable-thead > tr > th {
    background-color: var(--surface-100);
    color: var(--text-color);
  }

  .p-datatable-tbody > tr > td {
    padding: 0.75rem;
  }

  .p-datatable-tfoot > tr > td {
    background-color: var(--surface-100);
    color: var(--text-color);
    font-weight: bold;
  }
}
</style>
