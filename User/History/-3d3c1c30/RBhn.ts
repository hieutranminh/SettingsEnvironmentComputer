import { computed, type Ref } from 'vue'
import { FILTER_VALUES } from '@/constants'

/**
 * Handles branch shop filtering logic based on branch type and group selections
 * Separates complex filtering logic from component template
 * 
 * @param modelValue - Reactive filter model containing branch type and group selections
 * @param branchSalesTotalFilter - Raw branch shop data from API
 * @returns Filtered branch shop items and options for dropdown
 * 
 * @example
 * const { filteredBranchShopItems, branchShopOptions, isAllSelected } = useBranchShopFilter(
 *   toRef(props, 'modelValue'),
 *   branchSalesTotalFilter
 * )
 */
export const useBranchShopFilter = <T extends { customBranchTypeId: any; branchGroupId: any; branchShopIds: any[] }>(
  modelValue: Ref<T>,
  branchSalesTotalFilter: Ref<any[]>
) => {
  /**
   * Checks if an item matches the selected branch type
   * @param item - Branch shop item to check
   * @param customBranchTypeId - Selected branch type ID
   * @returns True if item matches branch type or "All" is selected
   */
  const matchesBranchType = (item: any, customBranchTypeId: any): boolean => {
    return customBranchTypeId === FILTER_VALUES.ALL || item.customBranchTypeId === customBranchTypeId
  }

  /**
   * Checks if an item matches the selected branch group
   * @param item - Branch shop item to check
   * @param branchGroupId - Selected branch group ID
   * @returns True if item matches branch group or "All" is selected
   */
  const matchesBranchGroup = (item: any, branchGroupId: any): boolean => {
    return branchGroupId === FILTER_VALUES.ALL || item.branchGroupId === branchGroupId
  }

  /**
   * Filtered branch shop items based on selected branch type and group
   * Automatically updates when filter selections change
   */
  const filteredBranchShopItems = computed(() => {
    const { customBranchTypeId, branchGroupId } = modelValue.value
    return branchSalesTotalFilter.value.filter((item) => {
      return matchesBranchType(item, customBranchTypeId) && matchesBranchGroup(item, branchGroupId)
    })
  })

  /**
   * Formatted options for MultiSelect dropdown
   * Maps filtered items to select options format
   */
  const branchShopOptions = computed(() =>
    filteredBranchShopItems.value.map((item) => ({
      id: item.branchShopId,
      name: item.branchShopName,
    }))
  )

  /**
   * Checks if all available branch shops are selected
   * Used to show "All" placeholder in MultiSelect
   */
  const isAllSelected = computed(() => {
    return modelValue.value.branchShopIds.length === branchShopOptions.value.length
  })

  return {
    filteredBranchShopItems,
    branchShopOptions,
    isAllSelected,
  }
}
