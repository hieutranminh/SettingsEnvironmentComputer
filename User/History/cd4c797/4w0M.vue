<template>
  <div class="header">
    <!-- Sales Item Tabs -->
    <div class="header-tabs">
      <button
        v-for="option in salesItemOptions"
        :key="option.id"
        type="button"
        class="tab-item"
        :class="{ active: filters.salesItemType === option.id }"
        :aria-label="option.name"
        :aria-selected="filters.salesItemType === option.id"
        tabindex="0"
        @click="handleSalesItemChange(option.id)"
        @keydown.enter="handleSalesItemChange(option.id)"
        @keydown.space.prevent="handleSalesItemChange(option.id)"
      >
        {{ option.name }}
      </button>

      <!-- View by Checkbox -->
      <div v-if="isShowDisplayBy" class="checkbox-wrapper">
        <Checkbox
          inputId="view-by-checkbox"
          :modelValue="isViewByServiceChecked"
          :binary="true"
          :ariaLabel="viewByCheckboxLabel"
          @update:modelValue="handleViewByCheckboxChange"
        />
        <label for="view-by-checkbox">
          {{ viewByCheckboxLabel }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
// Composables
import { useSalesTotalByBranchFilters } from '@/composables/sales-total-by-branch/useSalesTotalByBranchFilters'
// Constants
import { SALES_ITEM_TYPE, REPORT_BY_TYPE_SALES_BY_ITEM } from '@/constants'

const { t } = useI18n()
const { filters, handleUpdateFilters, handleSearch } = useSalesTotalByBranchFilters()

const salesItemOptions = computed(() => [
  { id: SALES_ITEM_TYPE.SERVICE, name: t('sales-report.label-service') },
  { id: SALES_ITEM_TYPE.PRODUCT, name: t('sales-report.label-product') },
  { id: SALES_ITEM_TYPE.PREPAID_CARD, name: t('sales-report.label-prepaid-card') },
  { id: SALES_ITEM_TYPE.PREPAID_SERVICE, name: t('sales-report.label-prepaid-service') },
])

const isShowDisplayBy = computed(
  () =>
    filters.value.salesItemType === SALES_ITEM_TYPE.SERVICE ||
    filters.value.salesItemType === SALES_ITEM_TYPE.PREPAID_SERVICE,
)

const isViewByServiceChecked = computed(
  () => filters.value.reportByType === REPORT_BY_TYPE_SALES_BY_ITEM.SERVICE,
)

const viewByCheckboxLabel = computed(() => {
  if (filters.value.salesItemType === SALES_ITEM_TYPE.SERVICE) {
    return t('sales-report.label-view-by-service')
  }
  return t('sales-report.label-view-by-prepaid-service')
})

const handleSalesItemChange = (value: number): void => {
  handleUpdateFilters({ salesItemType: value })
  handleSearch()
}

const handleViewByCheckboxChange = (checked: boolean): void => {
  const reportByType = checked
    ? REPORT_BY_TYPE_SALES_BY_ITEM.SERVICE
    : REPORT_BY_TYPE_SALES_BY_ITEM.CATEGORY
  handleUpdateFilters({ reportByType })
  handleSearch()
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 1rem;

  .header-tabs {
    display: flex;
    flex-wrap: wrap;

    .tab-item {
      padding: 0 1rem;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.2s;
      font-size: 1rem;
      border-right: 1px solid var(--p-text-color);

      &:first-child {
        border-left: 1px solid var(--p-text-color);
      }

      &:hover {
        color: var(--p-orange-400);
      }

      &.active {
        color: var(--p-orange-400);
        font-weight: 600;

        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--p-primary-color);
        }
      }

      &:focus-visible {
        outline: 2px solid var(--p-primary-color);
        outline-offset: 2px;
      }
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: 30px;
      @include maxResponsive(smallMobile) {
        .checkbox-wrapper {
          margin-left: 0;
          margin-top: 0.5rem;
        }
      }
    }
  }
}
</style>
