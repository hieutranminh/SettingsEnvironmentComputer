<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('sales-by-month.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />
</template>

<script setup lang="ts">
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'
</script>
