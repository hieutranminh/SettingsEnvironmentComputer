import { ref } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'
import { PAGINATION } from '@/constants'
import {
  userAccountReadService,
  type ILoginHistoryItem,
  type ILoginHistoryPayload,
} from '@/services/user-account/user-account.read'
import { useAuthStore } from '@/stores/auth/auth'
import { useUserAccountStore } from '@/stores/user-account/userAccount'
import type { IUserAccountItem } from '@/types/user-account/UserAccount'
import { extraErrorMessages, getTimezoneByCountryCode } from '@/utils/common'
import { getCurrentDate, getStartOf, toUnixTimestamp, type TimezoneType } from '@/utils/dateUtils'
export interface IFilters {
  startDate: Date
  endDate: Date
  userId: string
  pageNumber: number
}
export interface IUseLoginHistoryReturn {
  pagination: { value: { totalItems: number; totalPages: number } }
  pageSize: { value: number }
  loginHistoryData: { value: ILoginHistoryItem[] }
  filters: { value: IFilters }
  fetchUserList: () => Promise<void>
  fetchLoginHistory: () => Promise<void>
  setDefaultDate: () => void
  userList: { value: IUserAccountItem[] }
}

export const useLoginHistory = (): IUseLoginHistoryReturn => {
  // Helpers
  const { showError } = useMessageDialog()
  const { startLoading } = useLoading()
  const { t } = useTranslation()
  const authStore = useAuthStore()
  const userAccountStore = useUserAccountStore()

  // Reactive data
  const pageSize = ref(PAGINATION.DEFAULT)
  const pagination = ref({
    totalItems: 0,
    totalPages: 0,
  })
  const filters = ref<IFilters>({
    startDate: new Date(),
    endDate: new Date(),
    userId: '',
    pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
  })
  const userList = ref<IUserAccountItem[]>([])

  const loginHistoryData = ref<ILoginHistoryItem[]>([])

  // Methods
  const executeWithLoading = async <T>(task: () => Promise<T>): Promise<T | void> => {
    try {
      startLoading(true)
      return await task()
    } catch (error) {
      showError(extraErrorMessages(error))
      return undefined
    } finally {
      startLoading(false)
    }
  }

  const fetchUserList = async (): Promise<void> => {
    await executeWithLoading(async () => {
      const payload = {
        isMaster: false, // default is false
        pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
        pageSize: PAGINATION.MAX,
        shopId: authStore.shop.shopId,
        userID: filters.value.userId,
      }
      const response = await userAccountStore.getUserAccountData(payload)
      if (!response.isOK) {
        showError(response.errorMessages[0].errorMessage)
        return
      }
      userList.value = response?.result?.items ?? []
    })
  }

  const isInvalidDateRange = (): boolean => filters.value.startDate > filters.value.endDate

  const buildLoginHistoryPayload = (timezone: TimezoneType): ILoginHistoryPayload => ({
    shopId: authStore.shop.shopId,
    userID: filters.value.userId,
    registrationDateFromTS: toUnixTimestamp(filters.value.startDate, timezone),
    registrationDateToTS: toUnixTimestamp(filters.value.endDate, timezone),
    pageSize: pageSize.value,
    pageNumber: filters.value.pageNumber,
  })

  const computePagination = (
    totalItems: number,
    pageSizeValue: number,
  ): { totalItems: number; totalPages: number } => ({
    totalItems,
    totalPages: Math.ceil(totalItems / (pageSizeValue || PAGINATION.DEFAULT)),
  })

  const handleLoadLoginHistory = async (): Promise<void> => {
    const timezone = getTimezoneByCountryCode(authStore.shop.country) as TimezoneType
    const payload = buildLoginHistoryPayload(timezone)
    const response = await userAccountReadService.getLoginHistory(payload)
    if (!response.isOK) {
      showError(response.errorMessages)
      return
    }

    loginHistoryData.value = response?.result?.items ?? []

    const paging = response?.result?.pagingInfo
    const totalItems = paging?.totalItems ?? 0
    const pageSizeFromApi = paging?.pageSize ?? pageSize.value
    pagination.value = computePagination(totalItems, pageSizeFromApi)
  }

  const fetchLoginHistory = async (): Promise<void> => {
    if (isInvalidDateRange()) {
      showError(t('validation_messages.from_to_time'))
      return
    }
    await executeWithLoading(handleLoadLoginHistory)
  }

  const setDefaultDate = (): void => {
    const timezone = getTimezoneByCountryCode(authStore.shop.country) as TimezoneType
    const today = getCurrentDate(timezone)
    const firstDayOfMonth = getStartOf(today, 'month')

    filters.value.startDate = firstDayOfMonth.toDate()
    filters.value.endDate = today.toDate()
  }
  return {
    pagination,
    pageSize,
    loginHistoryData,
    filters,
    fetchUserList,
    fetchLoginHistory,
    setDefaultDate,
    userList,
  }
}
