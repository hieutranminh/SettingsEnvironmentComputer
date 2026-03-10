<template>
  <Card>
    <template #content>
      <div class="table-section">
        <div class="table-header">
          <span class="record-count" v-html="totalRecordsText" />
        </div>

        <DataTable
          :value="rows"
          :paginator="pagination.totalPages > 1"
          :rows="pageSize"
          :totalRecords="pagination.totalItems"
          :lazy="true"
          :first="(pageNumber - 1) * pageSize"
          @page="handlePageChange"
          showGridlines
          class="netmoney-history-table"
        >
          <Column field="netMoneyHistoryId" :header="$t('general.number')">
            <template #body="{ data }">
              {{ data.netMoneyHistoryId }}
            </template>
          </Column>
          <Column :header="$t('general.date')">
            <template #body="{ data }">
              {{ formatDate(data.registrationDate) }}
            </template>
          </Column>
          <Column :header="$t('netmoney-histories.type')">
            <template #body="{ data }">
              {{ formatType(data.amount) }}
            </template>
          </Column>
          <Column :header="$t('netmoney-histories.items')">
            <template #body="{ data }">
              {{ formatSourceType(data.netmoneySourceType) }}
            </template>
          </Column>
          <Column :header="$t('netmoney-histories.amount')">
            <template #body="{ data }">
              {{ formatAmount(data.amount) }}
            </template>
          </Column>
          <Column :header="$t('netmoney-histories.balance')">
            <template #body="{ data }">
              {{ formatAmount(data.balance) }}
            </template>
          </Column>

          <template #empty>
            <div class="table-footer">
              {{ $t('general.no-data-for-table') }}
            </div>
          </template>
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { DataTablePageEvent } from 'primevue/datatable'
import { computed } from 'vue'

import { useTranslation } from '@/composables/useTranslation'
import { NETMONEY_SOURCE_TYPE_SELECT, STANDARD_DATE_FORMAT } from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'
import type { INetmoneyHistoryItem } from '@/types/admins/NetmoneyHistory'
import { getTimezoneByCountryCode, formatAmount } from '@/utils/common'
import { convertTimezone, type TimezoneType } from '@/utils/dateUtils'
// Props
const props = defineProps<{
  rows: INetmoneyHistoryItem[]
  pageSize: number
  pageNumber: number
  pagination: {
    totalItems: number
    totalPages: number
  }
}>()

// Emits
const emit = defineEmits<{
  (e: 'pageChange', event: DataTablePageEvent): void
}>()

// helpers
const { t } = useTranslation()
const authStore = useAuthStore()

// computed
const totalRecordsText = computed(() =>
  t('login-history.all', { total: props.pagination.totalItems }),
)

// Methods
const formatDate = (dateTime: string): string => {
  if (!dateTime) return ''
  const timezone = getTimezoneByCountryCode(authStore.shop.country)
  const day = dayjs.utc(dateTime)
  return convertTimezone(day, timezone as TimezoneType).format(STANDARD_DATE_FORMAT.YMDH)
}

const formatType = (amount: number): string =>
  amount > 0 ? t('netmoney-histories.saving') : t('netmoney-histories.deduction')

const formatSourceType = (item: number): string => {
  const netMoneyText = NETMONEY_SOURCE_TYPE_SELECT.find((i) => i.value === item)
  return netMoneyText ? t(netMoneyText.text) : ''
}

const handlePageChange = (event: DataTablePageEvent): void => {
  emit('pageChange', event)
}
</script>

<style lang="scss" scoped>
.table-section {
  .table-header {
    margin-bottom: 15px;
  }

  .netmoney-history-table {
    :deep(.p-datatable-thead) {
      background-color: var(--p-gray-400);

      th {
        background-color: var(--p-gray-300);
        font-weight: 600;
        padding: 12px 16px;

        .p-datatable-column-header-content {
          align-items: center;
          justify-content: center;
        }
      }
    }

    :deep(.p-datatable-tbody) {
      tr {
        &:hover {
          background-color: var(--p-gray-100);
        }
      }

      td {
        padding: 12px 16px;
        text-align: center;

        @include mobile {
          text-wrap: nowrap;
        }
      }
    }

    @include mobile {
      :deep(.p-datatable-thead) {
        th {
          padding: 10px 8px;
          font-size: 13px;
        }
      }

      :deep(.p-datatable-tbody) {
        td {
          padding: 10px 8px;
          font-size: 13px;
        }
      }
    }
  }

  .table-footer {
    text-align: center;
  }
}
</style>
