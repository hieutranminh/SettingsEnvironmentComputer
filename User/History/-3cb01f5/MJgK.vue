<template>
  <div class="popup-view app-content">
    <!-- Header Section -->
    <div class="app-title">
      <span class="popup-title">{{ $t('popups.title') }}</span>
    </div>

    <!-- Content Section -->
    <Card>
      <template #content v-if="popup">
        <div class="detail-section">
          <div class="detail-row">
            <div class="detail-label">{{ $t('popups.title-name') }}</div>
            <div class="detail-value">{{ popup?.title }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">{{ $t('popups.period') }}</div>
            <div class="detail-value">
              {{ formatTimeStampCol(popup?.startDateTS || 0) }} ~
              {{ formatTimeStampCol(popup?.endDateTS || 0) }}
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">{{ $t('general.status') }}</div>
            <div class="detail-value">
              <div class="radio-group" role="radiogroup">
                <RadioButton
                  v-model="popup.status"
                  :value="FORM_STATUS[0].value"
                  disabled
                  inputId="status-active"
                />
                <label class="radio-label" for="status-active">{{ $t('general.active') }}</label>

                <RadioButton
                  v-model="popup.status"
                  :value="FORM_STATUS[1].value"
                  disabled
                  inputId="status-inactive"
                />
                <label class="radio-label" for="status-inactive">{{
                  $t('general.inactive')
                }}</label>
              </div>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              {{ $t('popups.never-see-period-info') }}
            </div>
            <div class="detail-value">
              <div class="radio-group" role="radiogroup">
                <RadioButton
                  v-model="popup.neverSeePeriodUse"
                  :value="NEVER_SEE_PERIOD_SELECT[0].value"
                  disabled
                  inputId="never-used"
                />
                <label class="radio-label" for="never-used">{{
                  $t(NEVER_SEE_PERIOD_SELECT[0].text)
                }}</label>

                <RadioButton
                  v-model="popup.neverSeePeriodUse"
                  :value="NEVER_SEE_PERIOD_SELECT[1].value"
                  disabled
                  inputId="never-not-used"
                />
                <label class="radio-label" for="never-not-used">{{
                  $t(NEVER_SEE_PERIOD_SELECT[1].text)
                }}</label>
              </div>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">{{ $t('popups.content') }}</div>
            <div class="detail-value contents">
              <img :src="imagePath(popup.fileAttachment)" class="popup-image" />
            </div>
          </div>
        </div>

        <div class="panel-actions">
          <Button severity="primary" @click="handleEdit">{{ $t('general.edit') }}</Button>
          <Button severity="primary" @click="handleDelete">{{ $t('general.delete') }}</Button>
          <Button severity="info" @click="handleCancel">{{ $t('general.cancel') }}</Button>
        </div>
      </template>
    </Card>
  </div>
  <ConfirmDialog group="PopupView" />
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'

import { usePopupTable } from '@/composables/boards/popup-board/usePopupTable'
import { usePopupView } from '@/composables/boards/popup-board/usePopupView'
import { useTranslation } from '@/composables/useTranslation'
import { FORM_ACTION, FORM_STATUS, NEVER_SEE_PERIOD_SELECT } from '@/constants'

const { t } = useTranslation()
const confirm = useConfirm()

// Methods
const handleDeletePopup = (): void => {
  confirm.require({
    message: t('general.delete-confirm'),
    header: t('general.alert'),
    rejectLabel: t('general.cancel'),
    acceptLabel: t('general.delete'),
    accept: async () => {
      await onDelete()
    },
  })
}

const handleEdit = (): void => {
  onActionPopup(FORM_ACTION.EDIT)
}
const handleDelete = async (): Promise<void> => {
  handleDeletePopup()
}
const handleCancel = (): void => {
  onCancel()
}

// Composables
const { popup, imagePath, onDelete, onCancel, onActionPopup } = usePopupView()
const { formatTimeStampCol } = usePopupTable()
</script>

<style scoped lang="scss">
.popup-view {
  width: 100%;
  max-width: 1084px;
  margin: 0 auto;

  .detail-section {
    border: 1px solid var(--p-gray-300);
    border-bottom: none;
    background-color: var(--p-white);
  }

  .detail-row {
    display: flex;
    border-bottom: 1px solid var(--p-gray-300);
    align-items: stretch;
    min-height: 42px;

    .detail-label {
      background-color: var(--p-gray-200);
      border-right: 1px solid var(--p-gray-300);
      padding: 10px 12px;
      font-weight: 600;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 15%;

      @include mobile {
        min-width: 80px;
      }
    }

    .detail-value {
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 85%;

      .radio-group {
        display: flex;
        align-items: center;
        gap: 10px;

        .radio-label {
          margin-right: 12px;
        }
      }

      &.contents {
        min-height: 40px;

        .popup-image {
          max-width: 100%;
          object-fit: contain;
        }

        .placeholder {
          font-size: 1.25rem;
          color: var(--p-gray-500);
        }
      }
    }
  }

  .panel-actions {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;

    button {
      padding: 10px 15px;

      @include mobile {
        min-width: 80px;
      }
    }
  }
}
</style>
