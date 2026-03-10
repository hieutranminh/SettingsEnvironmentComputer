<template>
  <div class="login">
    <div class="login__card">
      <!-- Logo -->
      <div class="login__logo">
        <img :src="logoIcon" class="login__logo-image" />
        <i18n-t keypath="hello">
          <template #terms>
            <RouterLink to="/terms"><strong>Terms</strong></RouterLink>
          </template>
          <template #privacy>
            <RouterLink to="/privacy"><strong>Privacy</strong></RouterLink>
          </template>
        </i18n-t>
      </div>

      <!-- Title -->
      <h3 class="login__title">
        {{ t('login.title') }}
      </h3>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login__form">
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
          <label for="remember-id" class="login__checkbox-label">
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
        <label for="country" class="login__country-label">{{ t('login.label_country') }}</label>
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
        <button type="button" class="login__link">
          {{ t('login.find-userid') }}
        </button>
        <span class="login__link-separator">|</span>
        <button type="button" class="login__link">
          {{ t('login.find-password') }}
        </button>
        <span v-if="showRemoteSupport" class="login__link-separator">|</span>
        <button v-if="showRemoteSupport" type="button" class="login__link">
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
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'
import {
  COUNTRY_CONFIG,
  COUNTRY_CODES,
  DEFAULT_VALUES,
  LOGIN_ERROR_CODES,
  TIME_ZONE_OFFSETS,
} from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'
import { extraErrorMessages } from '@/utils/common'

// Types
interface Country {
  value: string
  name: string
  code: string
}

const router = useRouter()
const { t } = useTranslation()
const { updateRememberId, rememberId, loginCountry } = useAuthStore()
const { handleLogin: authLogin, simpleClearAllCache, setLanguage } = useAuth()

const { isMobile } = useDevice()

const { startLoading } = useLoading()
const { showError } = useMessageDialog()

const id = ref('')
const pw = ref('')
const remember_id = ref(false)
const country = ref(COUNTRY_CONFIG.kr as string) // Default to KR using constant
const expired = ref(false)

// Computed
const countries = ref<Country[]>([
  { value: COUNTRY_CONFIG.kr, name: t('login.select-country-kr'), code: COUNTRY_CODES.KR },
  { value: COUNTRY_CONFIG.vi, name: t('login.select-country-vi'), code: COUNTRY_CODES.VN },
])

const showRemoteSupport = computed((): boolean => {
  return !isMobile
})

const logoIcon = computed(() => '/src/assets/images/applogo-ahaplus.png')

// Watch country changes
watch(country, () => {
  setLanguage(country.value)
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

/* eslint-disable */
const handleLogin = async (): Promise<void> => {
  try {
    startLoading(true)

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
      if (!result?.isOK && result?.errorMessages[0].errorCode == LOGIN_ERROR_CODES.IDT09A) {
        expired.value = true
      } else {
        expired.value = false
      }
      showError(result?.errorMessages[0]?.errorMessage)
    }
  } catch (error) {
    showError(extraErrorMessages(error))
  } finally {
    startLoading(false)
  }
}

// Lifecycle hooks using constants
onMounted(() => {
  clearSession()
  const rememberedUserId = rememberId
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
