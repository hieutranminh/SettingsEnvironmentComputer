import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api'
import type { LoginCredentials, AuthTokenData } from '@/types/auth'
import type { ApiResponse } from '@/types/api'
import Cookies from 'js-cookie'
import { AUTH_STORAGE_KEYS } from '@/constants'
import { setI18nLanguage } from '@/plugins/i18n'
import type { Locale } from '@/locales'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(Cookies.get(AUTH_STORAGE_KEYS.TOKEN) ?? null)
  const refreshToken = ref<string | null>(Cookies.get(AUTH_STORAGE_KEYS.REFRESH_TOKEN) ?? null)
  const loading = ref(false)
  const locale = ref<Locale>('en')

  const isAuthenticated = computed(() => !!token.value)

  const setTokens = (accessToken: string, refreshTokenValue: string): void => {
    token.value = accessToken
    refreshToken.value = refreshTokenValue
    Cookies.set(AUTH_STORAGE_KEYS.TOKEN, accessToken)
    Cookies.set(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshTokenValue)
  }

  const clearTokens = (): void => {
    token.value = null
    refreshToken.value = null
    locale.value = 'en'
    setI18nLanguage('en')
    Cookies.remove(AUTH_STORAGE_KEYS.TOKEN)
    Cookies.remove(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
  }

  const setLocale = (newLocale: Locale): void => {
    locale.value = newLocale
    setI18nLanguage(newLocale)
  }

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthTokenData>> => {
    loading.value = true

    try {
      const response = await authApi.login(credentials)

      if (response.success) {
        const { access_token, refresh_token } = response.body.data
        setTokens(access_token, refresh_token)
      }

      return response
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    token,
    refreshToken,
    loading,
    locale,

    // Computed
    isAuthenticated,

    // Actions
    login,
    setTokens,
    clearTokens,
    setLocale,
  }
})
