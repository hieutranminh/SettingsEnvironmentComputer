<template>
  <Card>
    <template #content>
      <div class="branch-sales-note">
        <h3>Notes</h3>
        <p>Current filter summary:</p>
        <ul>
          <li>Date Type: {{ getDateTypeLabel(filters.dateType) }}</li>
          <li>From Date: {{ formatTimestamp(filters.fromDateTs) }}</li>
          <li>To Date: {{ formatTimestamp(filters.toDateTs) }}</li>
          <li>Branch Name: {{ filters.branchName || 'All branches' }}</li>
          <li>Selected Branches: {{ filters.branchShopIds.length || 0 }}</li>
        </ul>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { DATE_TYPE } from '@/constants'

interface BranchSalesFilter {
  pageSize: number
  isHeadquarterView: boolean
  dateType: number
  toDateTs: number
  pageNumber: number
  headquarterShopId: number
  fromDateTs: number
  branchName: string
  branchShopIds: number[]
  branchGroupId: number
  customBranchTypeId: number
}

interface Props {
  filters: BranchSalesFilter
}

const props = defineProps<Props>()

const getDateTypeLabel = (dateType: number): string => {
  switch (dateType) {
    case DATE_TYPE.DATE:
      return 'Single Date'
    case DATE_TYPE.MONTH:
      return 'Month'
    case DATE_TYPE.RANGE:
      return 'Date Range'
    default:
      return 'Unknown'
  }
}

const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return 'Not set'
  return new Date(timestamp * 1000).toLocaleDateString()
}
</script>

<style lang="scss" scoped>
.branch-sales-note {
  h3 {
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 0.25rem 0;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
