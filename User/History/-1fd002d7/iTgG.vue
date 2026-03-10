<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('sales-by-discount-category.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />
</template>

<script setup lang="ts"></script>
