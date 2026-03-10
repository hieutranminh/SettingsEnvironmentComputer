<template>
  <main>
    <div class="app-title">
      <span>{{ $t('menu.payment-history') }}</span>
    </div>

    <div class="payment-history">
      <!-- Filter -->
      <div class="history-payment-filter">
        <PaymentHistoryFilter
          @search="handleSearch"
          v-model:filterDate="filterDate"
        />
      </div>

      <!-- Table -->
      <div class="history-payment-table">
        <PaymentHistoryTable
          :rows="rows"
          :pageSize="pageSize"
          :pagination="pagination"
          :pageNumber="pageNumber"
          @pageChange="onPageChange"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { DataTablePageEvent } from 'primevue/datatable'
import { onMounted } from 'vue'

import { usePaymentHistory } from '@/composables/payments/usePaymentHistory'
import { useAuthStore } from '@/stores/auth/auth'
import { useShopStore } from '@/stores/common/shop'
import PaymentHistoryFilter from '@/views/payment/payment-history/partial/PaymentHistoryFilter.vue'
import PaymentHistoryTable from '@/views/payment/payment-history/partial/paymentHistoryTable.vue'
// Helpers

const authStore = useAuthStore()
const shopStore = useShopStore()

// Methods
const onPageChange = (event: DataTablePageEvent): void => {
  if (typeof event.rows === 'number' && event.rows > 0) {
    pageSize.value = event.rows
  }
  pageNumber.value = event.page + 1
  fetchData()
}

const handleSearch = (): void => {
  onSearch()
}
// Lifecycle
onMounted(async () => {
  initDateRange()
  await shopStore.setMonthFeeInfoData({ shopId: authStore.shop.shopId })
  await fetchData()
})

// Composables
const {
  rows,
  fetchData,
  pagination,
  pageNumber,
  pageSize,
  onSearch,
  filterDate,
  initDateRange,
} = usePaymentHistory()
</script>

<style scoped lang="scss">
.history-payment-filter {
  margin-bottom: 20px;
}

.history-payment-table {
  margin-bottom: 20px;
}
</style>
