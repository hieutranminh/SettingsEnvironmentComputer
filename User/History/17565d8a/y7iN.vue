<template>
  <Dialog
    v-model:visible="localVisible"
    :modal="true"
    :draggable="false"
    :header="$t('shop-info.owner-real-name-verification')"
    :pt="{ root: { style: { width: '450px', maxWidth: '95vw' } } }"
    @show="handleLoadForm"
  >
    <div class="owner-verify-form">
      <div class="form-row">
        <label class="form-label">{{ $t('shop-info.owner-name') }}</label>
        <InputText
          v-model="ownerName"
          autofocus
          ref="ownerNameRef"
          :maxLength="maxOwnerName"
          class="form-input"
        />
      </div>

      <div class="form-row">
        <label class="form-label">{{ $t('shop-info.owner-mobile-number') }}</label>
        <InputText
          v-model="ownerMobile"
          :maxLength="maxOwnerMobile"
          class="form-input"
          @paste="handlePhonePaste"
          @keydown="handlePhoneKeydown"
        />
      </div>

      <div class="notice-text">
        {{ $t('shop-info.contact-support-notice') }}
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button :label="$t('general.confirm')" severity="primary" @click="handleConfirm" />
        <Button :label="$t('general.cancel')" severity="info" @click="handleCancel" />
      </div>
    </template>
  </Dialog>

  <MobileAuthenticationKR
    ref="mobileAuthenticatedRef"
    :name="ownerName"
    :mobileNumber="ownerMobile"
    @mobileAuthResult="handleMobileAuthResult"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Composables
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useLoading } from '@/composables/useLoading'
import { extraErrorMessages } from '@/utils/common'
import { useI18n } from 'vue-i18n'

// Components
import MobileAuthenticationKR, {
  type MobileAuthResult,
} from '@/views/auth/partial/MobileAuthenticationKR.vue'
import { COMBINED_CONTROL_KEYS } from '@/constants'

// Props
const props = defineProps<{
  visible: boolean
  initialOwnerName?: string
  initialOwnerMobile?: string
  isOwnerMobileVerified?: boolean
}>()
// Emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', payload: { ownerName: string; ownerMobile: string }): void
  (e: 'success', payload: { ownerName: string; ownerMobile: string }): void
}>()

// Constants
const MAX_LENGTH_OWNER_NAME = 50
const MAX_LENGTH_OWNER_MOBILE_NUMBER = 12

// Composables
const { startLoading } = useLoading()
const { t } = useI18n()
const { showError } = useMessageDialog()

// Reactives
const ownerName = ref('')
const ownerMobile = ref('')
const errors = ref<string[]>([])
const ownerNameRef = ref<(HTMLInputElement & { $el: HTMLInputElement }) | null>(null)
const mobileAuthenticatedRef = ref<InstanceType<typeof MobileAuthenticationKR> | null>(null)

// Computed
const localVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    emit('update:visible', value)
  },
})

const maxOwnerName = computed(() => {
  return MAX_LENGTH_OWNER_NAME
})

const maxOwnerMobile = computed(() => {
  return MAX_LENGTH_OWNER_MOBILE_NUMBER
})

// Methods
const handleConfirm = (): void => {
  try {
    startLoading(true)
    errors.value = []
    if (!ownerName.value.trim()) {
      errors.value.push(t('shop-info.owner-name-can-not-empty'))
    }

    if (!ownerMobile.value.trim()) {
      errors.value.push(t('shop-info.owner-mobile-number-can-not-empty'))
    }

    if (errors.value.length > 0) {
      showError(errors.value)
      return
    }

    mobileAuthenticatedRef.value?.handleSubmit()
  } catch (error) {
    showError(extraErrorMessages(error))
  } finally {
    startLoading(false)
  }
}

const handleCancel = (): void => {
  localVisible.value = false
}

const handleLoadForm = async (): Promise<void> => {
  if (props.isOwnerMobileVerified) {
    ownerMobile.value = ''
    ownerName.value = ''
  } else {
    ownerName.value = props.initialOwnerName ?? ''
    ownerMobile.value = props.initialOwnerMobile ?? ''
  }

  ownerNameRef.value?.$el?.focus()
}

const handleMobileAuthResult = (query: MobileAuthResult): void => {
  if (query.success && query.error_msg === null) {
    emit('success', { ownerName: ownerName.value, ownerMobile: ownerMobile.value })
  } else {
    showError(query.error_msg)
  }
}

const handlePhoneKeydown = (e: KeyboardEvent): void => {
  const isControlCombo =
    (e.ctrlKey || e.metaKey) && ['v', 'c', 'x', 'a'].includes(e.key.toLowerCase())
  const isDigit = /^\d$/.test(e.key)
  const isControlKey =
    COMBINED_CONTROL_KEYS.includes(e.key) ||
    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
  if (isDigit || isControlKey || isControlCombo) return

  e.preventDefault()
}

const handlePhonePaste = (e: ClipboardEvent): void => {
  const pastedData = e.clipboardData?.getData('text') ?? ''
  // Prevent if pasted text contains any non-digit characters
  if (!/^\d+$/.test(pastedData)) {
    e.preventDefault()
  }
}
</script>

<style scoped lang="scss">
.owner-verify-form {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .form-row {
    display: flex;
    align-items: center;
    gap: 12px;

    @include mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .form-label {
      width: 170px;
      min-width: 170px;
      font-weight: 500;
      white-space: nowrap;

      @include mobile {
        width: auto;
        min-width: auto;
      }
    }

    .form-input {
      flex: 1;

      @include mobile {
        width: 100%;
      }
    }
  }

  .notice-text {
    color: $blue-color;
    font-size: 14px;
    margin-top: 4px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
