<template>
  <section class="report-by-branch-header">
    <!-- Title -->
    <div class="report-by-branch-header-left">
      <h1>{{ title }}</h1>

      <!-- Select Branch -->
      <div class="select-branch">
        <label for="branch">{{ $t('report-by-branch.label-branch') }}</label>
        <Select
          v-model="selectedBranch"
          labelId="branch"
          :options="branchOptions"
          :placeholder="$t('general.select')"
          :loading="isLoading"
          optionLabel="branchName"
          optionValue="branchShopId"
          @update:modelValue="handleChangeBranchShop"
        />
      </div>
    </div>

    <!-- Action -->
    <div class="report-by-branch-header-right">
      <Button :label="$t('general.button-back')" icon="pi pi-arrow-left" severity="info" @click="handleBack" />

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
import { computed, onMounted, ref } from 'vue'
// Router
import { useRoute, useRouter, type RouteRecordName } from 'vue-router'

// Composables
import { useBranchSales } from '@/composables/useBranchSales'
import { useDevice } from '@/composables/useDevice'
// Constants
import { ROUTE_NAMES } from '@/constants/routeNames'
// Stores
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { BranchSales } from '@/types/admins/BranchSales'

defineProps({
  title: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'print'): void
  (e: 'changeBranchShop', value: number): void
}>()
// Composables
const authStore = useAuthStore()
const { isDesktop } = useDevice()
const { branchSales, isLoading, fetchBranchSales } = useBranchSales()

// Router
const route = useRoute()
const router = useRouter()

const selectedBranch = ref<number | null>(null)

const branchOptions = computed<BranchSales[]>(() => branchSales.value)

const initializeBranchOptions = async (): Promise<void> => {
  await fetchBranchSales({ chainId: authStore.shop.chainId })
}

const handleBack = () => {
  router.push({
    name: ROUTE_NAMES.REPORT_BY_BRANCH,
    query: route.query,
  })
}

const handlePrint = () => {
  emit('print')
}

const handleChangeBranchShop = (value: number) => {
  const query = {
    ...route.query,
    branchShopId: String(value),
  }

  router.replace({
    name: route.name as RouteRecordName,
    query,
  })

  emit('changeBranchShop', value)
}

onMounted(() => {
  selectedBranch.value = Number(route.query?.branchShopId) || 0
  initializeBranchOptions()
})
</script>

<style lang="scss" scoped>
.report-by-branch-header {
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

  .report-by-branch-header-left {
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

      .p-select {
        width: 200px;
      }
    }
  }

  .report-by-branch-header-right {
    margin-left: auto;
    display: flex;
    gap: 5px;

    .p-button {
      width: 150px;

      @include maxResponsive(smallMobile) {
        width: 96px;
      }
    }
  }
}
</style>
