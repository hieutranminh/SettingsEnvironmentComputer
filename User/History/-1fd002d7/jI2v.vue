<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('sales-by-discount-category.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />
</template>

<script setup lang="ts">
/**
 * Handles print action by collecting print configurations from child components
 * Opens print preview with chart and table sections
 */
const handlePrint = async (): Promise<void> => {
  const sections = []

  if (salesByDiscountCategoryChartRef.value)
    sections.push(salesByDiscountCategoryChartRef.value.getPrintConfiguration())
  if (salesByDiscountCategoryTableRef.value)
    sections.push(salesByDiscountCategoryTableRef.value.getPrintConfiguration())
  if (!sections.length) return

  await printPreviewStore.openPrintPreview(sections, {
    title: t('sales-by-discount-category.title'),
    dateRange: `(${dateMappedText.value})`,
  })
}

/**
 * Handles branch shop change event
 * Updates shop ID and fetches new report data
 * @param value - New shop ID
 */
const handleChangeBranchShop = async (value: number): Promise<void> => {
  filters.value.shopId = value
  handleFetchReport()
}
</script>
