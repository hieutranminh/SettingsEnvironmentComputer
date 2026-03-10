<template>
  <div class="login">
    <div class="login__card">
      <!-- Logo -->
      <div class="login__logo">
        <img src="@/assets/images/applogo-ahaplus.png" class="login__logo-image" />
      </div>

      <!-- Title -->
      <h3 class="login__title">
        {{ t('login.title') }}
      </h3>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login__form" data-testid="login-form">
        <!-- ID Input -->
        <div class="login__field">
          <InputText
            v-model="id"
            name="userid"
            :placeholder="t('logins.enter-id')"
            class="login__input login__input--id"
            maxlength="16"
            autocomplete="nope"
            data-testid="login-input-userid"
          />
        </div>

        <!-- Password Input -->
        <div class="login__field">
          <Password
            v-model="pw"
            :placeholder="t('logins.enter-password')"
            class="login__input"
            :feedback="false"
            toggle-mask
            maxlength="20"
            autocomplete="new-password"
            :input-props="{ 'data-testid': 'login-input-password' }"
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
          <label for="remember-id" class="login__checkbox-label">
            {{ t('logins.remember-id') }}
          </label>
        </div>

        <!-- Login Button -->
        <div class="login__field">
          <Button
            type="submit"
            :label="t('login.button_login')"
            class="login__button"
            severity="info"
            data-testid="login-button-submit"
          />
        </div>
      </form>

      <!-- Country Dropdown -->
      <div class="login__country">
        <label for="country" class="login__country-label">{{ t('login.label_country') }}</label>
        <Select
          v-model="country"
          :options="countries"
          option-label="name"
          option-value="value"
          class="login__country-dropdown"
        />
      </div>

      <!-- Links -->
      <div class="login__links">
        <button
          type="button"
          class="login__link"
          @click="handleFindLoginInfo(FIND_LOGIN_INFO_TYPE.USER_ID)"
        >
          {{ t('logins.find-userid') }}
        </button>
        <span class="login__link-separator">|</span>
        <button
          type="button"
          class="login__link"
          @click="handleFindLoginInfo(FIND_LOGIN_INFO_TYPE.PASSWORD)"
        >
          {{ t('logins.find-password') }}
        </button>
        <span v-if="isShowRemoteSupport" class="login__link-separator">|</span>
        <button
          v-if="isShowRemoteSupport"
          type="button"
          class="login__link"
          @click="handleRemoteSupport"
        >
          {{ t('logins.remote-support') }}
        </button>
      </div>
    </div>
  </div>
  <AlertLogin v-model:visible="isShowLoginErrorPopup" :error-message="errors" @close="handleHide" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import { useDevice } from '@/composables/useDevice'
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'
import {
  COUNTRY_CONFIG,
  DEFAULT_VALUES,
  LOGIN_ERROR_CODES,
  TIME_ZONE_OFFSETS,
  ROUTE_NAMES,
  COUNTRY_CODES,
  FIND_LOGIN_INFO_TYPE,
  STANDARD_DATE_FORMAT,
} from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'
import {
  extraErrorMessages,
  getTimezoneString,
  showRemoteSupport,
  validateErrorMessages,
} from '@/utils/common'
import type { ILoginResponse } from '@/types/auth/User'
import type { IApiResponse } from '@/types/ApiResponse'
import AlertLogin from './AlertLogin.vue'
import { useStorage } from '@/composables/useStorage'

const router = useRouter()
const { t } = useTranslation()
const { updateRememberId, rememberId, loginCountry, setExpiredUser } = useAuthStore()
const { handleLogin: authLogin, simpleClearAllCache, setLanguage, logout } = useAuth()

const { isMobile } = useDevice()

const { startLoading } = useLoading()
const { showError } = useMessageDialog()
const { setLoginCountry } = useStorage()

const id = ref('')
const pw = ref('')
const remember_id = ref(false)
const country = ref(COUNTRY_CONFIG.kr as string) // Default to KR using constant
const expired = ref(false)
const isShowLoginErrorPopup = ref(false)
const errors = ref<string>('')
import type { AppLocale } from '@/plugins/i18n'
const language = ref<AppLocale>(COUNTRY_CONFIG.kr as AppLocale)

// Computed
const isShowRemoteSupport = computed((): boolean => {
  return !isMobile
})

const countries = [
  { value: COUNTRY_CODES.KR, name: t('logins.select-country-kr') },
  { value: COUNTRY_CODES.VN, name: t('logins.select-country-vi') },
]

// Lifecycle hooks
// onBeforeMount(() => {
//   logout()
// })

// Watch country changes
watch(country, () => {
  setLanguage(country.value)
  if (country.value === COUNTRY_CODES.KR) language.value = 'ko' as AppLocale
  if (country.value === COUNTRY_CODES.VN) language.value = 'en' as AppLocale
})

// Methods
const setLocale = (): void => {
  const timedifference = new Date().getTimezoneOffset()

  if (loginCountry) {
    country.value = loginCountry
  } else {
    // Use timezone detection as fallback using constants
    if (timedifference === TIME_ZONE_OFFSETS.seoul) {
      country.value = COUNTRY_CONFIG.kr
    }
    if (timedifference === TIME_ZONE_OFFSETS.ho_chi_minh) {
      country.value = COUNTRY_CONFIG.vi
    }
  }

  setLanguage(country.value)
}

const handleHide = (): void => {
  if (expired.value) router.push({ name: ROUTE_NAMES.PAYMENTS, params: { expired: 'true' } })
  isShowLoginErrorPopup.value = false
}

const clearSession = (): void => {
  simpleClearAllCache()
}

const setRememberId = (userId: string): void => {
  if (userId && remember_id.value) {
    updateRememberId(userId)
  } else {
    updateRememberId('')
  }
}

// App version checking

const validateInputLogin = (): string => {
  let errors = ''
  if (id.value === null || id.value.trim() === '') {
    errors = t('logins.please-enter-id')
  } else if (pw.value === null || pw.value.trim() === '') {
    errors = t('logins.please-enter-password')
  }

  return errors
}

const handleFindLoginInfo = (type: string): void => {
  setLoginCountry(country.value)
  const routeDate = router.resolve({
    name: ROUTE_NAMES.FIND_LOGIN_INFO,
    params: { type: type, country: country.value },
  })
  window.open(routeDate.href, '_blank')
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
    formatDate: STANDARD_DATE_FORMAT.YMD
  }
}

/* eslint-disable */
const handleLogin = async (): Promise<void> => {
  try {
    startLoading(true)
    errors.value = validateInputLogin()
    if (errors.value.length) {
      isShowLoginErrorPopup.value = true
      return
    }

    if (!remember_id.value) {
      setRememberId('')
    }

    const query = {
      userId: id.value,
      password: pw.value,
      solutionId: import.meta.env.VITE_SALONADMIN_SOLUTION_ID || DEFAULT_VALUES.SOLUTION_ID,
      country: country.value,
    }

    const result = await authLogin(query)
    if (result?.isOK) {
      router.push({ name: 'home', params: { from_login: 'true' } })
    } else {
      const errorCode = result?.errorMessages[0].errorCode

      if (
        !result?.isOK &&
        errorCode == LOGIN_ERROR_CODES.IDT09A &&
        result?.errorMessages.length === 1
      ) {
        expired.value = true
        const resultError = handleMapExpiredErrorValue(result?.errorMessages[0].errorValues)
        setExpiredUser({
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
      } else {
        expired.value = false
      }

      errors.value = validateErrorMessages(result as IApiResponse<ILoginResponse>)
      if (errors.value.length) {
        isShowLoginErrorPopup.value = true
        return
      }
      showError(result?.errorMessages)
    }
  } catch (error) {
    showError(extraErrorMessages(error))
  } finally {
    startLoading(false)
  }
}

const handleRemoteSupport = () => {
  showRemoteSupport()
}

// Lifecycle hooks using constants
onMounted(async () => {
  clearSession()
  const rememberedUserId = rememberId
  if (rememberedUserId) {
    id.value = rememberedUserId
    remember_id.value = true
  } else {
    remember_id.value = false
  }

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
    :deep(.p-checkbox) {
      .p-checkbox-box {
        &:hover {
          background-color: $primary-color;
        }
      }
    }
  }

  &__checkbox-label {
    color: $gray-700;
    cursor: pointer;
    user-select: none;
  }

  &__button {
    width: 100%;
    height: 40px;

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
      :deep(.p-select-label) {
        padding: 2px 5px;
      }
    }
  }

  &__country-label {
    color: $gray-700;
    white-space: nowrap;
  }

  &__error {
    color: $danger-dark;
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

    button {
      background-color: transparent;
    }
  }

  &__link {
    color: $gray-700;
    text-decoration: none;
    font-size: 13px;
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
