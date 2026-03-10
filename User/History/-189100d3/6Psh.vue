<template>
  <main class="app-content login-d">
    <div hidden>
      <!-- Translation component placeholder - can be added later if needed -->
    </div>

    <AlertLogin
      v-model:visible="isShowLoginErrorPopup"
      :error-message="errors"
      @close="handleHide"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import { LOGIN_ERROR_CODES, DEFAULT_VALUES, ROUTE_NAMES, STANDARD_DATE_FORMAT } from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'
import { useLoadingStore } from '@/stores/common/loading'
import type { IApiResponse } from '@/types/ApiResponse'
import type { ILoginResponse } from '@/types/auth/User'
import { validateErrorMessages, getTimezoneString, extraErrorMessages } from '@/utils/common'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useCommon } from '@/composables/useCommon'
import AlertLogin from './AlertLogin.vue'

// Stores and composables
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { loginByKey, simpleClearAllCache } = useAuth()
const { showError } = useMessageDialog()
const loadingStore = useLoadingStore()
const { gotoLoginPageWhenPossible: gotoLoginPageWhenPossibleUtil } = useCommon()

// Local state
const country = ref('')
const language = ref('')
const expired = ref(false)
const errors = ref<string>('')
const isShowLoginErrorPopup = ref(false)

onBeforeMount(() => {
  authStore.logout()
})

// Methods
const handleHide = (): void => {
  if (expired.value) router.push({ name: ROUTE_NAMES.PAYMENTS, params: { expired: 'true' } })
  else handleGoToLoginPage()

  isShowLoginErrorPopup.value = false
}

const handleGoToLoginPage = (): void => {
  gotoLoginPageWhenPossibleUtil(country.value)
}

const handleMapExpiredErrorValue = (
  errorValue: string[],
): {
  shopId: number
  shopName: string
  countryCode: string
  language: string
  authToken: string
  formatDate: string
  timezone: string
} => {
  return {
    shopId: parseInt(errorValue[1].split(': ')[1]),
    shopName: errorValue[2].split(': ')[1],
    timezone: getTimezoneString(errorValue[3].split(': ')[1]),
    countryCode: errorValue[4].split(': ')[1],
    language: errorValue[5].split(': ')[1].toLowerCase(),
    authToken: errorValue[6].split(': ')[1],
    formatDate: STANDARD_DATE_FORMAT.YMD,
  }
}

const isExpiredSessionError = (response: IApiResponse<ILoginResponse> | undefined): boolean => {
  if (!response?.errorMessages?.length) return false
  const errorCode = response.errorMessages[0].errorCode
  return errorCode === LOGIN_ERROR_CODES.IDT09A && response.errorMessages.length === 1
}

const handleExpiredSession = (response: IApiResponse<ILoginResponse>): void => {
  expired.value = true
  const resultError = handleMapExpiredErrorValue(response.errorMessages[0].errorValues)
  authStore.setExpiredUser({
    userAuthInfo: {
      authToken: resultError.authToken,
      language: resultError.language,
      countryCode: resultError.countryCode,
      timezone: resultError.timezone,
      formatDate: resultError.formatDate,
      shopId: resultError.shopId,
      shopName: resultError.shopName,
    },
    shopBasicInfo: {
      shopId: resultError.shopId,
      shopName: resultError.shopName,
    },
  })
}

const handleLoginError = (response: IApiResponse<ILoginResponse> | undefined): void => {
  if (!response) return
  console.error('zzzzz', response)
  if (isExpiredSessionError(response)) {
    handleExpiredSession(response)
  } else {
    expired.value = false
  }

  errors.value = validateErrorMessages(response)
  if (errors.value.length) {
    isShowLoginErrorPopup.value = true
    return
  }
  console.error('xxxxx', response.errorMessages)
  showError(response.errorMessages)
}

const handleTryLoginByKey = async (loginKey: string): Promise<void> => {
  try {
    loadingStore.startLoading(true)

    const response = await loginByKey(loginKey, country.value)

    if (!response?.isOK) {
      handleLoginError(response ?? undefined)
      return
    }

    router.push({ name: ROUTE_NAMES.HOME })
  } catch (error) {
    showError(extraErrorMessages(error))
  } finally {
    loadingStore.startLoading(false)
  }
}

onMounted(() => {
  simpleClearAllCache()
  country.value = (route.query.country as string) ?? ''
  authStore.updateLoginCountry(country.value)
  authStore.updateLoginPath('')
  const loginKey = route.query.key as string
  if (loginKey && loginKey.length > 1) {
    language.value = DEFAULT_VALUES.LANGUAGE // Use constant instead of hard code
    handleTryLoginByKey(loginKey)
  }
})
</script>

<style lang="scss" scoped>
.login-d {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $bg-light;
}
</style>
