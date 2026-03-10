<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    :closable="true"
    class="edit-branch-type-dialog"
    :header="$t('branch.edit-branch-type')"
    :draggable="false"
    :pt="{ root: { style: { width: '420px' }, 'data-testid': 'dialog-edit-branch-type' } }"
    size="small"
    @hide="handleCancel"
    @show="handleShow"
  >
    <div class="form-row">
      <label class="form-label">{{ $t('branch.branch-type-name') }}</label>
      <input
        v-model="branchTypeName"
        ref="branchTypeNameRef"
        :maxlength="MAX_LENGTH"
        class="form-input"
        data-testid="branch-type-edit-input"
      />
    </div>

    <FormErrorList :errors="errors" />

    <div class="panel-actions">
      <GroupBtn
        :options="btnOptions"
        @save="handleSave"
        @delete="handleDelete"
        @cancel="handleCancel"
      />
    </div>
  </Dialog>

  <ConfirmBranchTypeGroup
    v-model:visible="isShowConfirmBranchTypeGroup"
    :title="$t('branch.delete-branch-type-alarm-message')"
    @confirm="handleDeleteAsync"
  />

  <ConfirmDialog
    group="edit-branch-type"
    :pt="{
      footer: { class: 'confirm-footer' },
      root: { style: { width: '400px' }, 'data-testid': 'dialog-confirm-delete-type' },
      pcAcceptButton: { root: { 'data-testid': 'confirm-dialog-button-accept' } },
      pcRejectButton: { root: { 'data-testid': 'confirm-dialog-button-reject' } },
    }"
  />
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { computed, nextTick, ref } from 'vue'

import FormErrorList from '@/components/common/FormErrorList.vue'
import GroupBtn from '@/components/common/GroupBtn.vue'
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'
import { branchPutService } from '@/services/admins/branch/branch.cmd'
import { useAuthStore } from '@/stores/auth/auth'
import type { ICustomBranchType } from '@/types/admins/CustomBranchType'
import { extraErrorMessages } from '@/utils/common'
import ConfirmBranchTypeGroup from '@/views/branch/branches/partial/ConfirmBranchTypeGroup.vue'
const props = defineProps<{
  visible: boolean
  item: ICustomBranchType | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save'): void
  (e: 'delete', value: { id: number }): void
  (e: 'cancel'): void
}>()

const DELETE_ERROR_CODE = 'CBTE05'
const CONFIRM_DELETE_ERROR_CODE = 'CBTE06'
const EVENT_UPDATE_VISIBLE = 'update:visible' as const

// Constants
const MAX_LENGTH = 50
const TIMEOUT_DELAY = 300

// Helpers
const { t } = useTranslation()

// Reactives
const errors = ref<string[]>([])
const { startLoading } = useLoading()
const { showError } = useMessageDialog()
const authStore = useAuthStore()
const confirm = useConfirm()
const branchTypeNameRef = ref<HTMLInputElement | null>(null)

// Computed
const btnOptions = computed(() => {
  return {
    save: true,
    delete: true,
    cancel: true,
  }
})

const localVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit(EVENT_UPDATE_VISIBLE, value),
})

const branchTypeName = ref<string>('')
const initBranchTypeName = ref<string>('')
const isShowConfirmBranchTypeGroup = ref<boolean>(false)

// Small helpers to reduce complexity
const buildDeletePayload = (
  isConfirm: boolean,
): { chainId: number; id: number; isConfirm: boolean } => ({
  chainId: authStore.shop.chainId,
  id: props.item?.id ?? 0,
  isConfirm,
})

const handleDeleteErrorCode = (errorCode: string): boolean => {
  if (errorCode === DELETE_ERROR_CODE) {
    isShowConfirmBranchTypeGroup.value = true
    return true
  }
  if (errorCode === CONFIRM_DELETE_ERROR_CODE) {
    handleConfirmDelete()
    return true
  }
  return false
}

const handleShow = async (): Promise<void> => {
  await nextTick()
  setTimeout(() => {
    if (branchTypeNameRef.value) {
      branchTypeNameRef.value.focus()
    }
  }, TIMEOUT_DELAY)
  initBranchTypeName.value = props.item?.name ?? ''
  branchTypeName.value = props.item?.name ?? ''
}

const handleSave = (): void => {
  if (!branchTypeName.value || branchTypeName.value.trim() === '') {
    errors.value = [t('branch.branch-type-name-is-required')]
    return
  }

  if (branchTypeName.value.trim() === initBranchTypeName.value) {
    emit('update:visible', false)
    return
  }
  handleEditBranchTypeAsync()
}

const handleConfirmDelete = (): void => {
  confirm.require({
    group: 'edit-branch-type',
    message: t('general.delete-confirm'),
    header: t('general.alert'),
    acceptLabel: t('general.delete'),
    rejectLabel: t('general.cancel'),
    accept: () => {
      handleDeleteAsync()
    },
  })
}

const handleDeleteAsync = async (): Promise<void> => {
  try {
    startLoading(true)
    const payload = {
      chainId: authStore.shop.chainId,
      id: props.item?.id ?? 0,
      isConfirm: true,
    }
    const response = await branchPutService.deleteBranchType(payload)
    if (!response.isOK) {
      showError(response.errorMessages)
      return
    }
    emit(EVENT_UPDATE_VISIBLE, false)
    emit('delete', { id: props.item?.id ?? 0 })
  } catch (error) {
    showError(extraErrorMessages(error))
  } finally {
    startLoading(false)
  }
}

const handleEditBranchTypeAsync = async (): Promise<void> => {
  try {
    startLoading(true)
    const payload = {
      chainId: authStore.shop.chainId,
      id: props.item?.id ?? 0,
      name: branchTypeName.value.trim(),
    }

    const response = await branchPutService.editBranchType(payload)
    if (!response.isOK) {
      showError(response.errorMessages)
      return
    }
    emit(EVENT_UPDATE_VISIBLE, false)
    emit('save')
  } catch (error) {
    showError(extraErrorMessages(error))
  } finally {
    startLoading(false)
  }
}

const handleDelete = async (): Promise<void> => {
  try {
    startLoading(true)
    const payload = buildDeletePayload(false)
    const response = await branchPutService.deleteBranchType(payload)

    if (response.isOK) {
      emit(EVENT_UPDATE_VISIBLE, false)
      emit('delete', { id: props.item?.id ?? 0 })
      return
    }

    const errorCode = response.errorMessages?.[0]?.errorCode ?? ''
    if (handleDeleteErrorCode(errorCode)) return

    showError(response.errorMessages)
  } catch (error) {
    showError(extraErrorMessages(error))
  } finally {
    startLoading(false)
  }
}

const handleCancel = (): void => {
  emit('cancel')
  emit(EVENT_UPDATE_VISIBLE, false)
  errors.value = []
}
</script>

<style scoped lang="scss">
.edit-branch-type-dialog {
  .form-row {
    display: flex;

    align-items: center;
    gap: 8px;
    margin: 10px 0 18px;

    .form-label {
      color: $gray-700;
      font-weight: 600;
      word-break: break-all;
      white-space: nowrap;
    }

    .form-input {
      flex: 1;
      height: 30px;
      border: 1px solid var(--p-gray-300);
      color: var(--p-gray-900);
      padding: 0 5px;
      outline: none;
    }
  }

  .panel-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
}
</style>
