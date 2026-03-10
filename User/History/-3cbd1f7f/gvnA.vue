<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('service-sales-by-month.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />
</template>

<script setup lang="ts">
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'
</script>
