import { defineStore } from 'pinia'
import { ref } from 'vue'

import { FORM_ACTION } from '@/constants'
import {
  userAccountAggrService,
  type IUserAccountResult,
} from '@/services/user-account/user-account.aggr'
import {
  userAccountReadService,
  type IUserAccountActionResult,
} from '@/services/user-account/user-account.read'
import type { IApiResponse } from '@/types/ApiResponse'
import type { IUserAccountItem, IUserAccountPayload } from '@/types/user-account/UserAccount'

export interface IUserAccountAction {
  action: number
  data: IUserAccountActionResult | null
  userAccountPassword?: IUserAccountItem | null
}

export const useUserAccountStore = defineStore('userAccount', () => {
  const userAccount = ref<IUserAccountResult | []>([])
  const userAccountAction = ref<IUserAccountAction | null>(null)
  const userAccountPassword = ref<IUserAccountItem | null>(null)

  const setUserAccountAction = (userAction: IUserAccountAction): void => {
    userAccountAction.value = userAction
  }

  // Functions
  const setUserAccountPassword = (userPassword: IUserAccountItem | null): void => {
    userAccountPassword.value = userPassword
  }

  const getUserAccountData = async (
    query: IUserAccountPayload,
  ): Promise<IApiResponse<IUserAccountResult>> => {
    try {
      const response = await userAccountAggrService.getUserAccountList(query)
      userAccount.value = response?.result ?? []
      return response
    } catch (error) {
      throw new Error(error as string)
    }
  }

  const getSingleUserAccount = async (userAction: {
    id: number
    shopId: number
    status: number
  }): Promise<IApiResponse<IUserAccountActionResult>> => {
    const payload = {
      shopId: userAction.shopId,
      status: userAction.status,
      userAccountId: userAction.id,
    }
    try {
      const response = await userAccountReadService.getUserAccountAction(payload)
      const userAction = {
        action: FORM_ACTION.EDIT,
        data: response.result ?? null,
      }
      setUserAccountAction(userAction)
      return response
    } catch (error) {
      throw new Error(error as string)
    }
  }

  return {
    userAccount,
    userAccountAction,
    userAccountPassword,
    getUserAccountData,
    setUserAccountAction,
    getSingleUserAccount,
    setUserAccountPassword,
  }
})
