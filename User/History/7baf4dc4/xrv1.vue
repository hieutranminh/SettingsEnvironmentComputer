<template>
  <Card>
    <template #content>
      <div class="branches-table">
        <div class="table-info">{{ totalItemsText }}</div>
        <DataTable
          :value="rows"
          :paginator="pagination.totalItems > pagination.pageSize"
          :rows="pagination.pageSize"
          :total-records="pagination.totalItems"
          :first="(pagination.pageNumber - 1) * pagination.pageSize"
          :lazy="true"
          class="p-datatable-gridlines"
          @page="onPageChange"
        >
          <template #empty>
            <div class="no-data">{{ $t('general.no-data-for-table') }}</div>
          </template>

          <Column
            field="branchNo"
            :header="$t('branch.branch-no')"
          >
            <template #body="{ data }">{{ data.branchNumber }}</template>
          </Column>

          <Column
            field="branchName"
            :header="$t('branch.branch-name')"
          >
            <template #body="{ data }">{{ data.branchName }}</template>
          </Column>

          <Column
            field="branchTypeGroup"
            :header="$t('branch.branch-group-type')"
          >
            <template #body="{ data }">
              <span v-html="formatBranchTypeBranchGroup(data)" />
            </template>
          </Column>

          <Column
            field="ownerName"
            :header="$t('branch.owner-name')"
          >
            <template #body="{ data }">{{ data.ownerName }}</template>
          </Column>

          <Column
            field="ownerMobile"
            :header="$t('branch.owner-mobile')"
          >
            <template #body="{ data }">{{
              formatMobileAndPhoneNumbers(data.ownerMobile)
            }}</template>
          </Column>

          <Column
            field="managerName"
            :header="$t('branch.manage-name')"
          >
            <template #body="{ data }">
              <p>{{ data.managerName }}</p>
              <p v-if="data.managerTitle">({{ data.managerTitle }})</p>
            </template>
          </Column>

          <Column
            field="phoneNumber"
            :header="$t('branch.phone-number')"
          >
            <template #body="{ data }">{{
              formatMobileAndPhoneNumbers(data.phoneNumber)
            }}</template>
          </Column>

          <Column
            field="managerMobile"
            :header="$t('branch.mobile')"
          >
            <template #body="{ data }">{{
              formatMobileAndPhoneNumbers(data.mobile)
            }}</template>
          </Column>

          <Column
            field="address"
            :header="$t('branch.address')"
          >
            <template #body="{ data }">
              <p>{{ data.address1 }}</p>
              <p>{{ data.address2 }}</p>
            </template>
          </Column>

          <Column
            :exportable="false"
            :header="$t('general.edit')"
          >
            <template #body="{ data }">
              <Button
                severity="info"
                variant="outlined"
                @click="onEdit(data)"
                >{{ $t('general.edit') }}</Button
              >
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useBranches } from '@/composables/branches/useBranches'
import { useFormat } from '@/composables/useFormat'
import type { IBranchItem, PagingInfo } from '@/types/branch/branches'

const props = defineProps<{
  rows: IBranchItem[]
  pagination: PagingInfo
}>()

const emit = defineEmits<{
  (e: 'pageChange', value: { page: number; rows: number }): void
  (e: 'edit', value: IBranchItem): void
}>()

const { formatMobileAndPhoneNumbers } = useFormat()
const { t } = useI18n()

const totalItemsText = computed(() => {
  return `${t('general.total')} ${props.pagination.totalItems} ${t('general.records')}`
})

const onPageChange = (event: { page: number; rows: number }) =>
  emit('pageChange', event)
const onEdit = (data: IBranchItem) => emit('edit', data)

// Composables
const { formatBranchTypeBranchGroup } = useBranches()
</script>

<style lang="scss" scoped>
.branches-table {
  .table-info {
    margin-bottom: 10px;
    color: $gray-600;
    font-weight: 500;
  }

  :deep(.p-datatable) {
    .p-datatable-thead {
      > tr > th {
        background: $gray-1000;
      }

      .p-datatable-column-header-content {
        justify-content: center;
        align-items: center;
      }
    }

    .p-datatable-tbody > tr > td {
      text-align: center;
    }
  }
}
</style>
