<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('sales-by-date.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />
</template>
