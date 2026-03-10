<template>
  <Dialog
    v-model:visible="localVisible"
    :modal="true"
    :draggable="false"
    :header="props.popupInfo.title"
    :pt="{ root: { style: { width: `${modalWidth}px` } }, footer: { class: 'popup-footer' } }"
    @show="handleShow"
    @hide="handleHide"
  >
    <div class="home-system-modal">
      <div v-if="isImageLoading" class="loading-container">
        <ProgressSpinner />
      </div>
      <div v-else class="home-system-modal-content">
        <img
          :src="imagePath"
          class="home-system-modal-image"
          :alt="props.popupInfo.title"
          @load="handleModalSizeAdjust"
        />
      </div>
    </div>

    <template #footer>
      <div class="custom-popup-bottom">
        <div
          v-if="popupData?.neverSeePeriodUse === NEVER_SEE_PERIOD_USE.PROVIDED"
          class="never-see"
        >
          <span class="paren">(</span>
          <RadioButtonGroup v-model="noTodayCheck" name="never-see-options" class="options">
            <div>
              <RadioButton :value="NEVER_SEE_PERIOD.DAY" />
              <span class="label">{{ $t('popups.only-today') }}</span>
            </div>
            <div>
              <RadioButton :value="NEVER_SEE_PERIOD.FOREVER" />
              <span class="label">{{ $t('popups.never') }}</span>
            </div>
          </RadioButtonGroup>
          <span class="paren">)</span>
          <span class="label">{{ $t('popups.never-see') }}</span>
        </div>

        <Button class="btn-close" variant="blue-light" severity="info" @click="hideModalOneDay()">
          {{ $t('general.close') }}
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { IPopupInfo } from '@/composables/boards/useBoard'
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import {
  FOREVER_YEARS_AHEAD,
  NEVER_SEE_PERIOD,
  NEVER_SEE_PERIOD_USE,
  TIME_CONSTANTS,
} from '@/constants'
import { readPopupService } from '@/services/board/popup.read'
import type { IPopupDetailResult } from '@/types/boards/popup'
import { extraErrorMessages } from '@/utils/common'

// Props
const props = defineProps<{
  visible: boolean
  popupInfo: IPopupInfo
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

// Constants
const MAX_WIDTH = 900
const MIN_WIDTH = 320
const UPDATE_EVENT_NAME = 'update:visible'

// Reactives
const popupData = ref<IPopupDetailResult | null>(null)
const modalWidth = ref<number>(MAX_WIDTH)
const noTodayCheck = ref<number | null>(null)
const isImageLoading = ref(true)

// Helpers
const { startLoading } = useLoading()
const { showError } = useMessageDialog()

// Computed
const localVisible = computed({
  get: () => props.visible && !isImageLoading.value,
  set: (value: boolean) => {
    if (!value) {
      isImageLoading.value = true
      popupData.value = null
      modalWidth.value = MAX_WIDTH
    }
    emit('update:visible', value)
  },
})

const imagePath = computed(() => {
  if (popupData.value?.fileAttachment !== null) {
    const base = String(import.meta.env.VITE_AZURE_STORAGE_BOARD_URL || '')
    const normalized = base.endsWith('/') ? base : `${base}/`
    return `${normalized}${popupData.value?.countryCode}/POPUp/${popupData.value?.shopId}/${popupData.value?.fileAttachment.storageFileName}`
  }
  return ''
})

// Watch for visibility changes
watch(
  () => props.visible,
  (newValue: boolean): void => {
    if (newValue) {
      handleLoadPopupAsync()
    }
  },
  { immediate: false },
)

// Methods
const handleShow = (): void => {
  // Event handler for Dialog show event (kept for compatibility)
}

const handleLoadPopupAsync = async (): Promise<void> => {
  try {
    startLoading(true)
    isImageLoading.value = true

    const payload = {
      pOPUpId: props.popupInfo.popupId,
      countryCode: props.popupInfo.country,
    }

    const response = await readPopupService.getDetail(payload)
    if (!response.isOK) {
      showError(response.errorMessages)
      isImageLoading.value = false
      return
    }
    popupData.value = response.result || null

    // Preload image before showing popup
    if (popupData.value?.fileAttachment) {
      await handlePreloadImage()
    } else {
      isImageLoading.value = false
    }
  } catch (error) {
    showError(extraErrorMessages(error))
    isImageLoading.value = false
  } finally {
    startLoading(false)
  }
}

const handlePreloadImage = (): Promise<void> => {
  return new Promise((resolve, reject): void => {
    const img = new Image()

    img.onload = (): void => {
      // Calculate modal size before showing
      const imgWidth = img.naturalWidth || img.width || 0
      const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, imgWidth))
      modalWidth.value = width

      isImageLoading.value = false
      resolve()
    }

    img.onerror = (): void => {
      isImageLoading.value = false
      reject(new Error('Failed to load image'))
    }

    img.src = imagePath.value
  })
}

const handleResolveModalId = (): string => {
  return props.popupInfo?.modalId || ''
}

const handleModalSizeAdjust = (e: Event): void => {
  const img = e.target as HTMLImageElement | null
  if (!img) return

  const imgWidth = img.naturalWidth || img.width || 0
  const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, imgWidth))
  modalWidth.value = width
}

const hideModalOneDay = (): void => {
  const modalId = handleResolveModalId()
  if (!modalId) {
    emit(UPDATE_EVENT_NAME, false)
    return
  }

  // Only store when the never-see option is provided and a choice is made
  if (
    popupData.value?.neverSeePeriodUse === NEVER_SEE_PERIOD_USE.PROVIDED &&
    noTodayCheck.value !== null
  ) {
    let expiry: Date | null = null

    if (noTodayCheck.value === NEVER_SEE_PERIOD.DAY) {
      const midnightNextDay = new Date()
      midnightNextDay.setHours(TIME_CONSTANTS.HOURS_PER_DAY, 0, 0, 0)
      expiry = midnightNextDay
    } else if (noTodayCheck.value === NEVER_SEE_PERIOD.FOREVER) {
      const now = new Date()
      expiry = new Date(now.getFullYear() + FOREVER_YEARS_AHEAD, now.getMonth(), now.getDate())
    }

    if (expiry) {
      localStorage.setItem(modalId, JSON.stringify(expiry.toISOString()))
    }
  }

  emit(UPDATE_EVENT_NAME, false)
}

const handleHide = (): void => {
  emit(UPDATE_EVENT_NAME, false)
}
</script>

<style scoped lang="scss">
.home-system-modal {
  width: 100%;
  overflow: hidden;

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  .home-system-modal-content {
    .home-system-modal-image {
      width: 100%;
      height: 100%;
    }
  }
}

.p-dialog-footer {
  .custom-popup-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    @include mobile {
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    &.flexcolumn {
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
    }

    .never-see {
      display: flex;
      align-items: center;
      gap: 6px;

      .paren {
        color: var(--p-gray-600);
      }

      .options {
        display: inline-flex;
        align-items: center;
        gap: 12px;
      }

      .label {
        margin-left: 4px;
      }
    }

    .btn-close {
      min-width: 80px;
    }
  }
}
</style>
