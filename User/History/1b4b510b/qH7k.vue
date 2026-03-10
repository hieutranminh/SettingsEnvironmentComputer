<template>
  <ColumnGroup type="header">
    <!-- Main header row -->
    <Row>
      <Column :rowspan="2" :header="$t('branch-sales.label-branch')" headerClass="bg-gray" />

      <!-- Service group header -->
      <Column
        v-for="group in headerGroups"
        :key="group.label"
        :colspan="group.colspan"
        headerClass="bg-yellow border-bottom-0"
      >
        <template #header>
          <p>
            {{ $t(group.label) }}
            <span v-if="group.suffix" class="text-no-wrap"> ({{ group.suffix }})</span>
          </p>
        </template>
      </Column>

      <!-- Revenue total header -->
      <Column :rowspan="2" headerClass="bg-yellow">
        <template #header>
          <p>
            {{ $t('branch-sales.label-revenue-total') }} <br />
            (<span class="text-no-wrap">A + B</span>)
          </p>
        </template>
      </Column>

      <!-- Prepaid goods group header -->
      <Column
        :colspan="3"
        :header="$t('branch-sales.label-prepaid-goods-sales')"
        headerClass="bg-green border-bottom-0"
      />

      <!-- Sales total header -->
      <Column :rowspan="2" headerClass="bg-green">
        <template #header>
          <p>
            {{ $t('branch-sales.label-sales-total') }} <br />
            (<span class="text-blue text-no-wrap">S1 + S2 + S3</span>)
          </p>
        </template>
      </Column>

      <!-- Deduction headers -->
      <Column :rowspan="2" :header="$t('branch-sales.label-prepaid-goods-deduction-total')" headerClass="bg-gray" />
      <Column :rowspan="2" :header="$t('branch-sales.label-points-deduction')" headerClass="bg-gray" />
    </Row>

    <!-- Sub-header row with column details -->
    <Row>
      <Column v-for="column in columns" :key="column.field" :field="column.field" :headerClass="column.headerClass">
        <template #header>
          <p class="text-no-wrap">
            {{ $t(column.headerKey) }}
            <span v-if="column.headerSuffix" class="text-blue"> ({{ column.headerSuffix }})</span>
          </p>
        </template>
      </Column>
    </Row>
  </ColumnGroup>
</template>

<script setup lang="ts">
import type { ColumnConfig, HeaderGroupConfig } from '@/constants/branchSalesTable'

interface Props {
  columns: ColumnConfig[]
  headerGroups: HeaderGroupConfig[]
}

defineProps<Props>()
</script>
