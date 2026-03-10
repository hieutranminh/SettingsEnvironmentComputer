import { cloneDeep } from 'lodash'
import { useConfirm } from 'primevue/useconfirm'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'
import { COMMON_STATUS } from '@/constants'
import { BOARD_ROUTES } from '@/constants/routeNames'
import { boardCmdService } from '@/services/board/board.cmd'
import { boardReadService } from '@/services/board/board.read'
import { noticeCmdService } from '@/services/board/notice.cmd'
import { noticeReadService } from '@/services/board/notice.read'
import { useAuthStore } from '@/stores/auth/auth'
import type {
  IBoardManagementResult,
  IBoardNoticeResult,
  IFileAttachment,
  IOriginFileAttachment,
} from '@/types/boards/SystemNotice'
import { extraErrorMessages } from '@/utils/common'
import { convertTimestampToDate } from '@/utils/dateUtils'

export const useHeadquarterNoticeDetail = () => {
  // Helpers
  const route = useRoute()
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()
  const authStore = useAuthStore()
  const router = useRouter()
  const { t } = useTranslation()
  const confirm = useConfirm()

  // Reactives
  const boardManagement = ref<IBoardManagementResult | null>(null)
  const boardActionData = ref<IBoardNoticeResult | null>(null)
  const postOnTopStartDate = ref<Date | null>(null)
  const postOnTopEndDate = ref<Date | null>(null)
  const boardCode = ref<string>(route.params.board_code as string)

  // Computed
  const boardId = computed<number | null>(() => {
    const number = Number(route.query.id)
    return Number.isFinite(number) ? number : null
  })
  // Methods
  const getBoardManagement = async () => {
    try {
      startLoading(true)
      const payload = {
        countryCode: authStore.shop.country,
        boardCode: boardCode.value,
        status: COMMON_STATUS.ALL,
      }
      const response = await boardReadService.get(payload)
      if (!response?.isOK) {
        showError(response.errorMessages[0].errorMessage)
        return
      }
      boardManagement.value = response.result || null
    } catch (error: unknown) {
      showError(extraErrorMessages(error))
    } finally {
      startLoading(false)
    }
  }

  const mapFileAttachmentToApi = (fields: IBoardNoticeResult): IFileAttachment[] => {
    const files: IFileAttachment[] = []
    for (const item of fields.fileAttachments ?? []) {
      const newItem = cloneDeep(item as unknown as IOriginFileAttachment)
      files.push({
        fileAttachmentId: newItem.fileAttachmentId,
        name: newItem.originalFileName,
        storageFileName: newItem.storageFileName,
        size: newItem.fileSize,
        boardCode: newItem.boardCode,
        relatedId: newItem.relatedId,
        relatedType: newItem.relatedType,
        orderNo: newItem.orderNo,
      })
    }

    return files
  }

  const ensureShopName = () => {
    if (boardActionData.value && !boardActionData.value.shopName) {
      boardActionData.value.shopName = authStore.shop.shopName
    }
  }

  const setPostOnTopDates = () => {
    if (!boardActionData.value?.postOnTop) return
    const { country } = authStore.shop
    postOnTopStartDate.value = convertTimestampToDate(
      boardActionData.value.postOnTopStartDateTS || 0,
      country,
      true,
    ).toDate()
    postOnTopEndDate.value = convertTimestampToDate(
      boardActionData.value.postOnTopEndDateTS || 0,
      country,
      true,
    ).toDate()
  }

  const getBoardData = async () => {
    try {
      startLoading(true)

      const payload = { noticeId: boardId.value ?? 0, countryCode: authStore.shop.country }
      const result = await noticeReadService.getBoardNotice(payload)
      if (!result?.isOK) return result

      boardActionData.value = result.result || null

      if (boardActionData.value?.fileAttachments) {
        boardActionData.value.fileAttachments = mapFileAttachmentToApi(boardActionData.value)
      }

      await updateReadCount()
      ensureShopName()
      setPostOnTopDates()

      return result
    } catch (error) {
      showError(extraErrorMessages(error))
    } finally {
      startLoading(false)
    }
  }

  const updateReadCount = async (): Promise<void> => {
    try {
      startLoading(true)
      const payload = {
        boardId: boardId.value ?? 0,
      }
      const response = await boardCmdService.increaseCount(payload)
      if (!response.isOK) {
        showError(response.errorMessages)
      }
    } catch (error) {
      showError(extraErrorMessages(error))
    } finally {
      startLoading(false)
    }
  }

  const onDownloadFile = async (file: IFileAttachment) => {
    file.countryCode = authStore.shop.country || ''
    const payload = {
      countryCode: authStore.shop.country || '',
      fileAttachmentId: file.fileAttachmentId,
      relatedType: file.relatedType,
      relatedId: file.relatedId,
    }
    const result = await boardReadService.download(payload)

    const blob = new Blob([result])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = file.name
    link.click()
  }

  const onDelete = async () => {
    try {
      startLoading(true)
      const response = await noticeCmdService.delete({ noticeId: boardId.value ?? 0 })
      if (!response?.isOK) {
        showError(response.errorMessages[0].errorMessage)
        return
      }
      router.push({ name: BOARD_ROUTES.CHAIN_NOTICE, params: { type: route.params.board_code } })
    } catch (error) {
      showError(extraErrorMessages(error))
    } finally {
      startLoading(false)
    }
  }

  const handleDelete = () => {
    confirm.require({
      message: t('general.delete-confirm'),
      header: t('general.alert'),
      rejectLabel: t('general.cancel'),
      acceptLabel: t('general.delete'),
      accept: () => {
        onDelete()
      },
    })
  }
  return {
    boardCode,
    boardId,
    boardManagement,
    postOnTopStartDate,
    postOnTopEndDate,
    boardActionData,
    getBoardData,
    getBoardManagement,
    onDownloadFile,
    handleDelete,
  }
}
