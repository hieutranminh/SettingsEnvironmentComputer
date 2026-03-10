<template>
  <section class="sales-report-header">
    <!-- Title -->
    <div class="sales-report-header-left">
      <h1>{{ $t('sales-report.title') }}</h1>

      <!-- Select Branch -->
      <div class="select-branch">
        <label for="branch">
          {{ $t('report-by-branch.label-branch') }}
        </label>
        <SelectField
          v-model="selectedBranch"
          labelId="branch"
          :options="branchOptions"
          :placeholder="$t('general.select')"
          :emptyMessage="$t('general.no-available-options')"
          :loading="isLoading"
          optionLabel="branchName"
          optionValue="branchShopId"
          @update:modelValue="handleChangeBranchShop"
        />
      </div>
    </div>

    <!-- Action -->
    <div class="sales-report-header-right">
      <Button
        v-if="isDesktop"
        :disabled="!selectedBranch"
        :label="$t('general.button-print')"
        severity="info"
        @click="handlePrint"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
// Composables
import { useRoute } from 'vue-router'
import { useDevice } from '@/composables/useDevice'
import { useBranchSales } from '@/composables/useBranchSales'
import { useSalesTotalByBranchFilters } from '@/composables/sales-total-by-branch/useSalesTotalByBranchFilters'
// Constants
import { FILTER_VALUES } from '@/constants'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
import { useAppStore } from '@/stores/common/app'
// Types
import { type IBranchSales } from '@/types/admins/BranchSales'

const emit = defineEmits<{
  (e: 'print'): void
}>()
// Composables
const { shop } = useAuthStore()
const { isDesktop } = useDevice()
const { branchSales, isLoading, fetchBranchSales } = useBranchSales()
const { handleUpdateFilters, handleSearch } = useSalesTotalByBranchFilters()
// Router
const route = useRoute()
// Stores
const appStore = useAppStore()

const selectedBranch = ref<number | null>(null)

const branchOptions = computed<IBranchSales[]>(() => branchSales.value)

const handlePrint = (): void => {
  emit('print')
}

const handleChangeBranchShop = (value: number): void => {
  handleUpdateFilters({ shopId: value, staffId: FILTER_VALUES.ALL })
  handleSearch()
}

const initializeData = async (): Promise<void> => {
  selectedBranch.value = Number(route.query?.shopId) || 0

  await fetchBranchSales({
    chainId: shop.chainId,
  })
}

onMounted(async () => {
  await initializeData()
})

watch(
  () => appStore.routeViewKey,
  async () => {
    await initializeData()
    console.log('selectedBranch', selectedBranch.value)
    selectedBranch.value = 0
  },
)
</script>

<style lang="scss" scoped>
.sales-report-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--p-gray-950);

  @include maxResponsive(smallMobile) {
    align-items: flex-start;
    flex-wrap: inherit;
    padding-top: 10px;
  }

  .sales-report-header-left {
    display: flex;
    align-items: center;
    gap: 60px;

    @include maxResponsive(smallMobile) {
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    h1 {
      font-size: 18px;
      font-weight: 900;
    }

    .select-branch {
      display: flex;
      align-items: center;
      gap: 10px;

      :deep(.p-select) {
        width: 200px;
      }
    }
  }

  .sales-report-header-right {
    margin-left: auto;
    display: flex;
    gap: 5px;

    .p-button {
      width: 150px;
      white-space: nowrap;

      @include maxResponsive(smallMobile) {
        width: 96px;
      }
    }
  }
}
</style>
