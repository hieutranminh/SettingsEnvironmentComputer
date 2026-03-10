/**
 * Token refresh logic for the response interceptor.
 *
 * Uses raw axios (not apiClient) to avoid circular dependency:
 *   axios.ts -> response.ts -> tokenRefresh.ts -> axios (raw)
 *
 * Handles concurrent 401s: only one refresh request is made at a time,
 * subsequent callers wait for the same result via a subscriber queue.
 */
import axios from 'axios'
import { appConfig } from '@/config/app'
import { AUTH_STORAGE_KEYS } from '@/constants'
import type { ApiResponse } from '@/types/api'
import type { RefreshTokenResult, UserAuthInfo } from '@/types/auth'

let isRefreshing = false
let refreshSubscribers: Array<(token: string | null) => void> = []

const notifySubscribers = (token: string | null): void => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

/**
 * Updates the stored UserAuthInfo with new token data from refresh response.
 */
const updateStoredUserAuthInfo = (result: RefreshTokenResult): void => {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
  if (!stored) {
    return
  }
  try {
    const userAuthInfo = JSON.parse(stored) as UserAuthInfo
    userAuthInfo.authToken = result.authToken
    userAuthInfo.refreshToken = result.refreshToken
    userAuthInfo.tokenExpiredDateTimeTS = result.tokenExpiredDateTimeTS
    userAuthInfo.refreshTokenExpiredDateTimeTS = result.refreshTokenExpiredDateTimeTS
    sessionStorage.setItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO, JSON.stringify(userAuthInfo))
  } catch {
    // If parsing fails, remove corrupted data
    sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
  }
}

/**
 * Attempts to refresh the auth token.
 * - If no tokens exist, returns null immediately.
 * - If a refresh is already in progress, queues the caller and waits.
 * - On success, updates sessionStorage and returns the new auth token.
 * - On failure, returns null.
 */
export const tryRefreshToken = async (): Promise<string | null> => {
  const currentRefreshToken = sessionStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
  const currentAuthToken = sessionStorage.getItem(AUTH_STORAGE_KEYS.TOKEN)

  if (!currentRefreshToken || !currentAuthToken) {
    return null
  }

  // If already refreshing, queue this caller and wait for the result
  if (isRefreshing) {
    return new Promise<string | null>((resolve) => {
      refreshSubscribers.push(resolve)
    })
  }

  isRefreshing = true

  try {
    const response = await axios.post<ApiResponse<RefreshTokenResult>>(
      `${appConfig.gatewayBaseUrl}/api/aggr/v1/auth/RefreshToken`,
      {
        refreshToken: currentRefreshToken,
        authToken: currentAuthToken,
      },
      {
        params: { culture: 'ko-KR', 'ui-culture': 'ko-KR' },
        headers: { 'Content-Type': 'application/json' },
      },
    )

    const data = response.data

    if (data.isOK && data.result) {
      // Update tokens in sessionStorage
      sessionStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, data.result.authToken)
      sessionStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.result.refreshToken)
      updateStoredUserAuthInfo(data.result)

      notifySubscribers(data.result.authToken)
      return data.result.authToken
    }

    notifySubscribers(null)
    return null
  } catch {
    notifySubscribers(null)
    return null
  } finally {
    isRefreshing = false
  }
}

/**
 * Clears all auth data from sessionStorage.
 * Called when token refresh fails and user must re-authenticate.
 */
export const clearAuthSession = (): void => {
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN)
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER_AUTH_INFO)
}
