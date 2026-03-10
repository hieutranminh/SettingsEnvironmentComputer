import { apiAggr } from '@/services/api'
import type { IApiResponse } from '@/types/ApiResponse'
import type {
  IFindOwnerUserIdResponse,
  ILoginRequest,
  ILoginResponse,
  ITokenData,
} from '@/types/auth/User'

/**
 * Pure API service for authentication
 * Contains only API calls without any business logic
 */
export const authAggrService = {
  /**
   * Login API call
   * @param data Login request data
   * @param culture Culture parameter for API
   * @returns Promise with API response
   */
  login: async (data: ILoginRequest, culture: string): Promise<IApiResponse<ILoginResponse>> => {
    const payload = {
      userId: data.userId,
      password: data.password,
      solutionId: data.solutionId,
    }

    return await apiAggr.post<ILoginResponse>(`auth/Login/Subscriber?culture=${culture}&ui-culture=${culture}`, payload)
  },

  /**
   * Login by Key API call
   * @param loginKey Login key from redirect
   * @param culture Culture parameter for API
   * @returns Promise with API response
   */
  loginByKey: async (loginKey: string, culture: string): Promise<IApiResponse<ILoginResponse>> => {
    return await apiAggr.post(`auth/Login/LoginKey?key=${loginKey}&culture=${culture}&ui-culture=${culture}`, null)
  },

  /**
   * Refresh token API call
   * @param refreshToken Refresh token
   * @param authToken Auth token
   * @param culture Culture parameter for API
   * @returns Promise with API response
   */
  refreshToken: async (
    payload: { authToken: string; refreshToken: string },
    culture: string,
  ): Promise<IApiResponse<ITokenData>> => {
    return await apiAggr.post(`auth/RefreshToken?culture=${culture}`, payload)
  },

  findOwnerUserId: async (payload: {
    countryCode: string
    ownerMobileNumber: string
    ownerName: string
  }): Promise<IApiResponse<IFindOwnerUserIdResponse>> => {
    return await apiAggr.post('auth/FindOwnerUserID', payload)
  },
  checkOwnerUserID: async (payload: { userId: string }): Promise<IApiResponse<unknown>> => {
    return await apiAggr.post('auth/FindOwnerUserID', payload)
  },

  findPasswordUserId: async (payload: { userId: string }): Promise<IApiResponse<void>> => {
    return await apiAggr.post('auth/CheckOwnerUserID', payload)
  },

  mobileCertificationVerification: async (payload: {
    imp_uid: string
    userName: string
    mobilePhoneNumber: string
  }): Promise<IApiResponse<void>> => {
    return await apiAggr.post('auth/MobileCertification/Verification', payload)
  },
}
