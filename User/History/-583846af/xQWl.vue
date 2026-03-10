<template>
  <div class="login">
    <div class="login__card">
      <!-- Logo -->
      <div class="login__logo">
        <img
          :src="logoIcon"
          alt="AHA PLUS"
          class="login__logo-image"
        />
      </div>

      <!-- Title -->
      <h3 class="login__title">
        {{ t('login.title') }}
      </h3>

      <!-- Login Form -->
      <form
        @submit.prevent="handleLogin"
        class="login__form"
      >
        <!-- ID Input -->
        <div class="login__field">
          <InputText
            v-model="id"
            name="userid"
            :placeholder="t('login.enter-id')"
            class="login__input login__input--id"
            maxlength="16"
            autocomplete="nope"
          />
        </div>

        <!-- Password Input -->
        <div class="login__field">
          <Password
            v-model="pw"
            :placeholder="t('login.enter-password')"
            class="login__input"
            :feedback="false"
            toggle-mask
            maxlength="20"
            autocomplete="new-password"
            @keyup.enter="handleLogin"
          />
        </div>

        <!-- Remember ID Checkbox -->
        <div class="login__field login__field--checkbox">
          <Checkbox
            v-model="remember_id"
            :binary="true"
            input-id="remember-id"
            class="login__checkbox"
          />
          <label
            for="remember-id"
            class="login__checkbox-label"
          >
            {{ t('login.label_remember-id') }}
          </label>
        </div>

        <!-- Login Button -->
        <div class="login__field">
          <Button
            type="submit"
            :label="t('login.button_login')"
            class="login__button"
            severity="info"
          />
        </div>
      </form>

      <!-- Country Dropdown -->
      <div class="login__country">
        <label
          for="country"
          class="login__country-label"
          >{{ t('login.label_country') }}</label
        >
        <Select
          v-model="country"
          :options="countries"
          optionLabel="name"
          optionValue="value"
          class="login__country-dropdown"
          name="country"
        />
      </div>

      <!-- Links -->
      <div class="login__links">
        <button
          type="button"
          class="login__link"
        >
          {{ t('login.find-userid') }}
        </button>
        <span class="login__link-separator">|</span>
        <button
          type="button"
          class="login__link"
        >
          {{ t('login.find-password') }}
        </button>
        <span
          v-if="showRemoteSupport"
          class="login__link-separator"
          >|</span
        >
        <button
          v-if="showRemoteSupport"
          type="button"
          class="login__link"
        >
          {{ t('login.link_remote-support') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import { useDevice } from '@/composables/useDevice'
import { useLoading } from '@/composables/useLoading'
import { useTranslation } from '@/composables/useTranslation'
import {
  COUNTRY_CODES,
  COUNTRY_CONFIG,
  TIME_ZONE_OFFSETS,
  LOGIN_ERROR_CODES,
  DEFAULT_VALUES,
  SHOP_STATUS,
  ROUTE_NAMES,
} from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'
import type { ApiError } from '@/types/ApiResponse'
import type { UserAuthInfo, ShopBasicInfo, LoginResponse } from '@/types/auth/User'
import { getTimezoneString, getDateFormat, getLocaleByCountry } from '@/utils/common'

// Types
interface Country {
  value: string
  name: string
  code: string
}

// Types for proper typing instead of any
interface LoginQueryData {
  userId: string
  password: string
  solutionId: number
  country: string
}

interface LoginResultData {
  userAuthInfo: UserAuthInfo
  shopBasicInfo: ShopBasicInfo
}

interface DialogOptions {
  onHide?: () => void
  onConfirm?: () => void
}

const router = useRouter()
const { t, loadLocale } = useTranslation()
const { handleLogin: authLogin, simpleClearAllCache } = useAuth()

const {
  rememberId,
  loginCountry,
  setExpiredUser,
  user: authUser,
  shop: authShop,
  updateRememberId,
  updateLoginCountry,
} = useAuthStore()

const { isMobile } = useDevice()

const { startLoading } = useLoading()

// Reactive data (using constants)
const id = ref('quynh_krhq')
const pw = ref('abcd@1234')
const remember_id = ref(false)
const country = ref(COUNTRY_CONFIG.kr as string) // Default to KR using constant
const alert_msg = ref('')
const expired = ref(false)
const overdued = ref(false)
const errorCodes = ref<string | null>(null)
const showModal = ref(false)
const queryData = ref<LoginQueryData | null>(null)
const resultData = ref<LoginResultData | null>(null)

// Countries setup (using constants)
const countries = ref<Country[]>([
  { value: COUNTRY_CONFIG.kr, name: t('login.select-country-kr'), code: COUNTRY_CODES.KR },
  { value: COUNTRY_CONFIG.vi, name: t('login.select-country-vi'), code: COUNTRY_CODES.VN },
])

// Computed properties using constants
const showRemoteSupport = computed((): boolean => {
  return !isMobile
})

const logoIcon = computed(() => '/src/assets/images/applogo-ahaplus.png')

// Watch country changes
watch(country, () => {
  setLanguage()
})

// Methods using constants
const setLocale = () => {
  const timedifference = new Date().getTimezoneOffset()

  // Get saved login country from auth store
  const savedCountry = loginCountry

  if (savedCountry) {
    country.value = savedCountry
  } else {
    // Use timezone detection as fallback using constants
    if (timedifference === TIME_ZONE_OFFSETS.seoul) {
      country.value = COUNTRY_CONFIG.kr
    }
    if (timedifference === TIME_ZONE_OFFSETS.ho_chi_minh) {
      country.value = COUNTRY_CONFIG.vi
    }
  }

  setLanguage()
}

const setLanguage = () => {
  const locale = getLocaleByCountry(country.value)
  loadLocale(locale)
}

const clearSession = () => {
  simpleClearAllCache()
}

const getRememberId = (): string => {
  return rememberId
}

const setRememberId = (userId: string) => {
  if (userId && remember_id.value) {
    updateRememberId(userId)
  } else {
    updateRememberId('')
  }
}

// Helper functions using constants
const getTimezone = (countryCode: string) => {
  return getTimezoneString(countryCode)
}

const getDateFormatHelper = (countryCode: string) => {
  return getDateFormat(countryCode)
}

const continueValidLogin = () => {
  if (remember_id.value && queryData.value?.userId) {
    setRememberId(queryData.value.userId)
  }

  updateLoginCountry(country.value)

  nextTick(() => {
    router.push({ name: ROUTE_NAMES.HOME, params: { from_login: 'true' } })
  })
}

const handleApiError = (errorInfo: ApiError) => {
  errorCodes.value = errorInfo.codes || null

  if (errorInfo.message && errorInfo.message.length === 1 && errorInfo.codes === LOGIN_ERROR_CODES.IDT09A) {
    expired.value = true

    const errorValues = errorInfo.values?.[0] || []
    const expiredUserData = {
      userAuthInfo: {
        country: errorValues[3]?.split(': ')[1] || '',
        authToken: errorValues[5]?.split(': ')[1] || '',
        language: errorValues[4]?.split(': ')[1]?.toLowerCase() || 'en',
        timezone: getTimezone(errorValues[3]?.split(': ')[1] || ''),
        format_date: getDateFormatHelper(errorValues[3]?.split(': ')[1] || ''),
      },
      shopBasicInfo: {
        shopId: errorValues[1]?.split(': ')[1] || '',
        shopName: errorValues[2]?.split(': ')[1] || '',
      },
    }

    setExpiredUser(expiredUserData as unknown as LoginResponse)
  } else {
    expired.value = false
  }
}

// App version checking
const checkAppVersionByFile = async (): Promise<{ hasNewAppVersion?: boolean }> => {
  try {
    return { hasNewAppVersion: false }
  } catch {
    return { hasNewAppVersion: false }
  }
}

/* eslint-disable */
const handleLogin = async () => {
  try {
    startLoading(true)

    const { hasNewAppVersion } = (await checkAppVersionByFile()) || {}
    if (hasNewAppVersion) {
      return
    }

    expired.value = false
    errorCodes.value = null
    resultData.value = null
    clearSession()

    if (!remember_id.value) {
      setRememberId('')
    }

    const query = {
      userId: id.value,
      password: pw.value,
      solutionId: import.meta.env.VITE_SALONADMIN_SOLUTION_ID || DEFAULT_VALUES.SOLUTION_ID,
      country: country.value,
    }
    queryData.value = query

    const success = await authLogin(query)

    // Get result data
    const user = authUser
    const shop = authShop
    resultData.value = {
      userAuthInfo: user as unknown as UserAuthInfo,
      shopBasicInfo: shop as unknown as ShopBasicInfo,
    }

    if (success && resultData.value) {
      // Check for overdue payments using constants
      if (
        resultData.value.shopBasicInfo?.overdueMonths === SHOP_STATUS.OVERDUE_MONTHS_THRESHOLD &&
        resultData.value.shopBasicInfo?.autoTransfer === SHOP_STATUS.AUTO_TRANSFER_ENABLED
      ) {
        overdued.value = true
        throw new Error(t('login.overdue-2month'))
      }

      continueValidLogin()
    }
  } catch (error: unknown) {
    const apiError = error as ApiError & { message: string }
    // Handle different types of errors
    if (apiError.isApiError && apiError.isApiError()) {
      handleApiError(apiError)
    }

    // Show error dialog
  } finally {
    startLoading(false)
  }
}

const showDialogAlert = (message: string, options?: DialogOptions) => {
  alert_msg.value = message
  showModal.value = true
}

// Lifecycle hooks using constants
onMounted(() => {
  clearSession()

  const rememberedUserId = localStorage.getItem('id') || getRememberId()
  if (rememberedUserId) {
    id.value = rememberedUserId
    remember_id.value = true
  } else {
    remember_id.value = false
  }

  country.value = COUNTRY_CONFIG.kr

  nextTick(() => {
    setLocale()
  })
})
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: $gray-1000;
  padding: 20px;

  &__card {
    border-radius: 8px;

    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  &__logo {
    margin-bottom: 1.5rem;
    text-align: left;
  }

  &__logo-image {
    height: 35px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__field {
    display: flex;
    flex-direction: column;
    text-align: left;

    &--checkbox {
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      justify-content: flex-start;
    }
  }

  &__input {
    width: 100%;

    &--id {
      padding: 0.75rem;
    }

    :deep(.p-password-input) {
      padding: 0.75rem;
      border: 1px solid $white;
      border-radius: 4px;
      font-size: 1rem;
      width: 100%;
      box-sizing: border-box;
      line-height: 1.2;

      &:focus {
        border-color: $primary-color;
        outline: none;
      }
    }

    :deep(.p-password) {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;

      .p-password-toggle-mask {
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    &--invalid {
      :deep(.p-inputtext),
      :deep(.p-password-input) {
        border-color: $danger-dark;
      }
    }
  }

  &__checkbox {
    :deep.p-checkbox {
      .p-checkbox-box {
        &:hover {
          background-color: $primary-color;
        }
      }
    }
  }

  &__checkbox-label {
    font-size: 0.9rem;
    color: $text-muted;
    cursor: pointer;
    user-select: none;
  }

  &__button {
    width: 100%;

    :deep(.p-button) {
      padding: 0.75rem;
      background: $primary-color;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      width: 100%;

      &:hover:not(:disabled) {
        background: $button-primary-hover;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }

  &__country {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;

    &-dropdown {
      background: none;

      :deep(.p-select-label) {
        padding: 2px 5px;
      }
    }
  }

  &__country-label {
    font-size: 0.9rem;
    color: $text-muted;
    white-space: nowrap;
  }

  &__error {
    color: $danger-dark;
    font-size: 0.875rem;
    text-align: center;
    padding: 0.5rem;
    background: $error-bg;
    border-radius: 4px;
    border: 1px solid $error-border;
  }

  &__links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  &__link {
    color: $gray-400;
    text-decoration: none;
    font-size: 0.875rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }

  &__link-separator {
    color: $text-light;
    font-size: 0.875rem;
  }
}
</style>
