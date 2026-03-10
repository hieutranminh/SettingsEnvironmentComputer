import { ref, computed, readonly, type Ref, type ComputedRef } from 'vue'

import { useDevice } from '@/composables/useDevice'
import { useLoading } from '@/composables/useLoading'
import { useStorage } from '@/composables/useStorage'
import { useTranslation } from '@/composables/useTranslation'
import { STORAGE_KEYS } from '@/constants'
import { authAggrService } from '@/services/auth/auth.aggr'
import { useAuthStore } from '@/stores/auth/auth'
// Types
import type { IApiResponse } from '@/types/ApiResponse'
import type {
  IUser,
  ILoginRequest,
  ILoginResponse,
  IAuthState,
  ITokenData,
} from '@/types/auth/User'
import {
  getCulture,
  getDateFormat,
  getTimezoneString,
  getShopLocation,
  getLocaleByCountry,
} from '@/utils/common'

export interface IUseAuthReturn {
  user: Readonly<Ref<IUser | null>>
  userData: ComputedRef<IAuthState['user']>
  shopData: ComputedRef<IAuthState['shop']>
  isAuthenticated: ComputedRef<boolean>
  logout: () => void
  setUser: (userData: IUser | null) => void
  loginByKey: (loginKey: string, country: string) => Promise<IApiResponse<ILoginResponse> | null>
  setLanguage: (country: string) => void
  handleLogin: (
    credentials: ILoginRequest & { country?: string },
  ) => Promise<IApiResponse<ILoginResponse> | null>
  initializeAuth: () => void
  refreshTokenAsync: (
    authToken: string,
    refreshToken: string,
    country: string,
  ) => Promise<IApiResponse<ITokenData> | null>
  simpleClearAllCache: () => void
}

export const useAuth = (): IUseAuthReturn => {
  const authStore = useAuthStore()
  const { simpleClearAllCache } = useStorage()
  const { loadLocale } = useTranslation()
  const { isMobile, isTablet } = useDevice()
  const { startLoading } = useLoading()

  // Legacy user ref for backward compatibility
  const user = ref<IUser | null>(null)

  const userData = computed(() => authStore.user)
  const shopData = computed(() => authStore.shop)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  const setLanguage = (country: string): void => {
    const locale = getLocaleByCountry(country)
    loadLocale(locale)
  }

  const setUser = (userData: IUser | null): void => {
    user.value = userData
  }

  const storageManager = {
    set: (key: string, value: string): void => {
      if (isMobile || isTablet) {
        localStorage.setItem(key, value)
      } else {
        sessionStorage.setItem(key, value)
      }
    },

    get: (key: string): string | null => {
      if (isMobile || isTablet) {
        return localStorage.getItem(key)
      } else {
        return sessionStorage.getItem(key)
      }
    },

    remove: (key: string): void => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    },
  }

  const setShopIdToStore = (shopId: number): void => {
    storageManager.set(STORAGE_KEYS.SHOP_ID, shopId.toString())
  }

  const setUserNameToStore = (userName: string): void => {
    storageManager.set(STORAGE_KEYS.USER_NAME, userName)
  }

  const setApiTokenToStore = (token: string): void => {
    storageManager.set(STORAGE_KEYS.API_TOKEN, token)
  }

  const setRefreshTokenToStore = (token: string): void => {
    storageManager.set(STORAGE_KEYS.REFRESH_TOKEN, token)
  }

  const clearSessionData = (): void => {
    storageManager.remove(STORAGE_KEYS.CURRENT_USER)
    storageManager.remove(STORAGE_KEYS.LOGIN_PATH)
    storageManager.remove(STORAGE_KEYS.API_TOKEN)
    storageManager.remove(STORAGE_KEYS.REFRESH_TOKEN)
    storageManager.remove(STORAGE_KEYS.SHOP_ID)
    storageManager.remove(STORAGE_KEYS.USER_NAME)

    // Clear additional session data
    storageManager.remove(STORAGE_KEYS.TOKEN_EXPIRED_DATE_TIME_TS)
    storageManager.remove(STORAGE_KEYS.REFRESH_TOKEN_EXPIRED_DATE_TIME_TS)
  }

  // Save user data to storage
  const saveUserData = (state: IAuthState): void => {
    const data = { user: state.user, shop: state.shop }
    storageManager.set(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data))
  }

  const logout = (): void => {
    authStore.logout()
    simpleClearAllCache()
    clearSessionData()
    user.value = null
  }

  const initializeAuth = (): void => {
    authStore.initializeAuth()
  }

  // ===============================
  // BUSINESS LOGIC FUNCTIONS (moved from store)
  // ===============================

  // Enhanced setUser with VueJS old project logic
  const setUserData = (userData: ILoginResponse): void => {
    const { userAuthInfo } = userData
    const { shopBasicInfo } = userData

    authStore.setUser(userData)

    setShopIdToStore(shopBasicInfo.shopId)
    setUserNameToStore(userAuthInfo.userID)
    setApiTokenToStore(userAuthInfo.authToken)
    setRefreshTokenToStore(userAuthInfo.refreshToken)

    const authState = {
      user: {
        userID: userAuthInfo.userID,
        language: userAuthInfo.language.toLowerCase(),
        userName: userAuthInfo.userName ?? null,
        authToken: userAuthInfo.authToken,
        refreshToken: userAuthInfo.refreshToken,
        userRoleCode: userAuthInfo.userRoleCode,
        shopUserRoleId: userAuthInfo.shopUserRoleId,
        shopUserRoleCode: userAuthInfo.shopUserRoleCode,
        isTemporaryPassword: userAuthInfo.isTemporaryPassword,
        tokenExpiredDateTimeTS: userAuthInfo.tokenExpiredDateTimeTS,
        refreshTokenExpiredDateTimeTS: userAuthInfo.refreshTokenExpiredDateTimeTS,
      },
      shop: {
        shopId: shopBasicInfo.shopId,
        solutionId: userAuthInfo.solutionId,
        country: userAuthInfo.countryCode,
        timezone: getTimezoneString(shopBasicInfo.countryCode),
        formatDate: getDateFormat(userAuthInfo.countryCode) || '',
        shopLocation: getShopLocation(userAuthInfo.countryCode),
        shopName: shopBasicInfo.shopName,
        businessTypeCode: shopBasicInfo.businessTypeCode,
        serviceTypeCode: shopBasicInfo.serviceTypeCode,
        chainId: shopBasicInfo.chainInfo?.chainId ?? 0,
        branchType: shopBasicInfo.chainInfo?.branchType ?? 0,
        chainBoardType: shopBasicInfo.chainInfo?.boardType ?? 0,
      },
      logged_in: true,
      id: '',
      login_path: null,
      login_country: null,
    } as IAuthState

    saveUserData(authState)
  }

  const setTokenData = (tokenData: ITokenData): void => {
    authStore.setTokenData(tokenData)

    setApiTokenToStore(tokenData.authToken)
    setRefreshTokenToStore(tokenData.refreshToken)
  }

  const setApiTokenAndRefreshToken = (userData: ILoginResponse): void => {
    const tokenData: ITokenData = {
      authToken: userData.userAuthInfo.authToken,
      refreshToken: userData.userAuthInfo.refreshToken,
      tokenExpiredDateTimeTS: userData.userAuthInfo.tokenExpiredDateTimeTS,
      refreshTokenExpiredDateTimeTS: userData.userAuthInfo.refreshTokenExpiredDateTimeTS,
    }
    setTokenData(tokenData)
  }

  const setLoginedUserData = async (userData: ILoginResponse): Promise<void> => {
    setUserData(userData)
    setApiTokenAndRefreshToken(userData)
    authStore.setLoadedAccountInfo(true)
  }

  const loginByKey = async (
    loginKey: string,
    country: string,
  ): Promise<IApiResponse<ILoginResponse> | null> => {
    try {
      const culture = getCulture(country ?? 'VN')
      const response = await authAggrService.loginByKey(loginKey, culture)

      if (response.isOK && response.result) {
        await setLoginedUserData(response.result)
      }

      return response
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Login by key failed')
    }
  }

  const handleLogin = async (
    credentials: ILoginRequest & { country?: string },
  ): Promise<IApiResponse<ILoginResponse> | null> => {
    try {
      startLoading(true)

      const payload = {
        userId: credentials.userId,
        password: credentials.password,
        solutionId: credentials.solutionId || import.meta.env.VITE_SOLUTION_ID,
      }

      const culture = getCulture(credentials.country ?? 'VN')

      const response = await authAggrService.login(payload, culture)
      if (!response.isOK || !response.result) return response || null

      await setLoginedUserData(response.result)
      if (credentials.country) authStore.updateLoginCountry(credentials.country)
      return response
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const refreshTokenAsync = async (
    authToken: string,
    refreshToken: string,
    country: string,
  ): Promise<IApiResponse<ITokenData> | null> => {
    try {
      const payload = {
        authToken: authToken,
        refreshToken: refreshToken,
      }
      const culture = getCulture(country || 'VN')
      const response = await authAggrService.refreshToken(payload, culture)

      if (!response.isOK || !response.result) return null
      authStore.setTokenData(response.result as ITokenData)
      return response
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Refresh token failed')
    }
  }

  return {
    // State
    user: readonly(user),
    userData,
    shopData,

    // Computed
    isAuthenticated,

    // Methods
    logout,
    setUser,
    loginByKey,
    setLanguage,
    handleLogin,
    initializeAuth,
    refreshTokenAsync,
    simpleClearAllCache,
  }
}
