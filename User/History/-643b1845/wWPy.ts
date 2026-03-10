import { ref } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { FILTER_VALUES, PAGINATION } from '@/constants'
import { branchReadService } from '@/services/admins'
import { useAuthStore } from '@/stores/auth/auth'
import type { IBranchGroup } from '@/types/admins/BranchGroup'
import type { ICustomBranchType } from '@/types/admins/CustomBranchType'
import type { IBranchItem, IPagingInfo } from '@/types/branch/branches'
import { extraErrorMessages } from '@/utils/common'

export interface IBranchesFilter {
  chainId: number
  branchName: string
  customBranchTypeId: number
  branchGroupId: number
  pageNumber: number
  pageSize: number
}
import type { Ref } from 'vue'

export interface IUseBranchesReturn {
  branchGroups: Ref<IBranchGroup[] | []>
  tableData: Ref<IBranchItem[] | []>
  filterData: Ref<IBranchesFilter>
  branchTypes: Ref<ICustomBranchType[] | []>
  pagination: Ref<IPagingInfo>
  loadTableDataAsync: () => Promise<void>
  getBranchTypeAsync: () => Promise<ICustomBranchType[] | []>
  getBranchGroupsAsync: () => Promise<IBranchGroup[] | []>
  formatBranchTypeBranchGroup: (row: IBranchItem) => string
}

export const useBranches = (): IUseBranchesReturn => {
  // Helpers
  const { showError } = useMessageDialog()
  const { startLoading } = useLoading()
  const authStore = useAuthStore()

  // Reactives
  const filterData = ref<IBranchesFilter>({
    chainId: 0,
    branchName: '',
    customBranchTypeId: FILTER_VALUES.ALL,
    branchGroupId: FILTER_VALUES.ALL,
    pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  })

  const branchTypes = ref<ICustomBranchType[] | []>([])

  const branchGroups = ref<IBranchGroup[] | []>([])

  const tableData = ref<IBranchItem[] | []>([])
  const pagination = ref<IPagingInfo>({
    pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    totalItems: PAGINATION.ZERO,
  })

  // Methods
  const getBranchTypeAsync = async (): Promise<ICustomBranchType[] | []> => {
    try {
      startLoading(true)
      const payload = {
        chainId: authStore.shop.chainId,
      }
      const response = await branchReadService.getCustomBranchTypes(payload)
      if (!response.isOK) {
        showError(response.errorMessages)
        return []
      }

      branchTypes.value = response.result?.items ?? []
      return branchTypes.value
    } catch (error) {
      showError(extraErrorMessages(error))
      return []
    } finally {
      startLoading(false)
    }
  }

  const getBranchGroupsAsync = async (): Promise<IBranchGroup[] | []> => {
    try {
      startLoading(true)
      const payload = {
        chainId: authStore.shop.chainId,
      }
      const response = await branchReadService.getBranchGroups(payload)
      if (!response.isOK) {
        showError(response.errorMessages)
        return []
      }
      branchGroups.value = response.result?.items ?? []
      return branchGroups.value
    } catch (error) {
      showError(extraErrorMessages(error))
      return []
    } finally {
      startLoading(false)
    }
  }

  const loadTableDataAsync = async (): Promise<void> => {
    try {
      startLoading(true)
      const payload = {
        ...filterData.value,
        chainId: authStore.shop.chainId,
      }
      const response = await branchReadService.getBranches(payload)
      if (!response.isOK) {
        showError(response.errorMessages)
        return
      }
      tableData.value = response.result?.items ?? []
      pagination.value = response.result?.pagingInfo ?? {
        pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        totalItems: PAGINATION.ZERO,
      }
    } catch (error) {
      showError(extraErrorMessages(error))
    } finally {
      startLoading(false)
    }
  }

  const formatBranchTypeBranchGroup = (row: IBranchItem): string => {
    const branchTypeName = row.customBranchTypeName ?? ''
    const branchGroupName = row.branchGroupName ?? ''

    if (!branchTypeName && !branchGroupName) {
      return ''
    }

    const separator = branchTypeName && branchGroupName ? ' </br>/ ' : ' / '
    return `${branchTypeName}${separator}${branchGroupName}`
  }

  return {
    branchGroups,
    tableData,
    filterData,
    branchTypes,
    pagination,
    loadTableDataAsync,
    getBranchTypeAsync,
    getBranchGroupsAsync,
    formatBranchTypeBranchGroup,
  }
}
