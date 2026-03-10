import { cloneDeep } from 'lodash'
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { IClientFileAttachment } from '@/composables/boards/system-board/useSystemBoardAction'
import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'
import {
  BOARD_ENUM,
  COMMON_STATUS,
  FORM_ACTION,
  IMAGE_COMPRESS_CONFIG,
  MAX_IMAGE_SIZE_POPUP,
  NEVER_SEE_PERIOD_SELECT,
  PAGINATION,
} from '@/constants'
import { BOARD_ROUTES } from '@/constants/routeNames'
import { popupValidationSchema } from '@/middleware/schema/popupValidation.schema'
import { boardReadService } from '@/services/board/board.read'
import { popupCmdService } from '@/services/board/popup.cmd'
import { readPopupService } from '@/services/board/popup.read'
import { useAuthStore } from '@/stores/auth/auth'
import { usePopupStore } from '@/stores/common/popup'
import type {
  IFileAttachment as IPopupApiFileAttachment,
  IPopupCreateResult,
  IPopupDetailPayload,
  IPopupDetailResult,
  IPopupUpdateResult,
} from '@/types/boards/popup'
import type { IBoardManagementResult } from '@/types/boards/SystemNotice'
import { extraErrorMessages, getTimezoneByCountryCode } from '@/utils/common'
import { compressFileAsync } from '@/utils/fileUtils'
import { convertTimestampToDate, toUnixTimestamp, type TimezoneType } from '@/utils/dateUtils'
import type { IApiResponse } from '@/types/ApiResponse'

export interface IInitPopupAction {
  title: string
  contents: string
  status: number
  neverSeePeriodUse: number
  startDateTS: number
  endDateTS: number
  chainId: number
  popUpType: number
  countryCode: string
  shopId: number
  fileActionType: number
  width: number
  height: number
  fileAttachment: IClientFileAttachment[]
}

type IPopupActionData = Omit<IPopupDetailResult, 'fileAttachment'> & {
  fileAttachment: IClientFileAttachment[]
}
interface IUsePopupActionReturn {
  oldFileId: Ref<number>
  startDate: Ref<Date | null>
  endDate: Ref<Date | null>
  popupActionData: Ref<IPopupActionData | IInitPopupAction>
  loadFormData: () => Promise<void>
  boardManagement: Ref<IBoardManagementResult | null>
  onFileSelect: (event: FileUploadSelectEvent) => void
  handleRemoveFile: (file: IClientFileAttachment) => void
  submitActionAsync: () => Promise<void>
  getBoardManagement: () => Promise<void>
}

export const usePopupAction = (): IUsePopupActionReturn => {
  const authStore = useAuthStore()
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()
  const { t } = useTranslation()
  const router = useRouter()
  const popupStore = usePopupStore()
  const route = useRoute()

  // Reactives
  const boardCode = ref<string>(route.params.board_code as string)

  const popupActionData = ref<IPopupActionData | IInitPopupAction>({
    title: '',
    contents: '',
    status: COMMON_STATUS.ACTIVE,
    neverSeePeriodUse: NEVER_SEE_PERIOD_SELECT[0].value,
    startDateTS: 0,
    endDateTS: 0,
    chainId: 0,
    popUpType: BOARD_ENUM.POPUP_TYPE.CHAIN,
    countryCode: '',
    shopId: 0,
    fileActionType: BOARD_ENUM.FILE_ACTION_TYPE.NONE,
    width: 0,
    height: 0,
    fileAttachment: [],
  })
  const boardManagement = ref<IBoardManagementResult | null>(null)
  const startDate = ref<Date | null>(null)
  const endDate = ref<Date | null>(null)
  const oldFileId = ref<number>(0)

  // Methods
  const isPopupApiAttachment = (item: unknown): item is IPopupApiFileAttachment => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'originalFileName' in (item as Record<string, unknown>)
    )
  }

  const mapFileAttachmentToClient = (
    fileAttachments?:
      | IPopupApiFileAttachment
      | IClientFileAttachment
      | Array<IPopupApiFileAttachment | IClientFileAttachment>
      | unknown,
  ): IClientFileAttachment[] => {
    const files: IClientFileAttachment[] = []
    let iterable: Array<IPopupApiFileAttachment | IClientFileAttachment> = []
    if (Array.isArray(fileAttachments)) {
      iterable = fileAttachments
    } else if (fileAttachments && typeof fileAttachments === 'object') {
      iterable = [fileAttachments as IPopupApiFileAttachment | IClientFileAttachment]
    }
    for (const item of iterable) {
      if (isPopupApiAttachment(item)) {
        const origin = cloneDeep(item)
        files.push({
          fileAttachmentId: origin.fileAttachmentId,
          name: origin.originalFileName,
          storageFileName: origin.storageFileName,
          size: origin.fileSize,
          boardCode: origin.boardCode ?? '',
          relatedId: origin.relatedId,
          relatedType: origin.relatedType,
        })
      } else {
        files.push({ ...cloneDeep(item) })
      }
    }
    return files
  }

  const buildDetailPayload = (): IPopupDetailPayload => ({
    pOPUpId: popupStore.popupAction.id ?? 0,
    countryCode: authStore.shop?.country,
  })

  const applyDetailResult = (result: IPopupDetailResult): void => {
    const mapped = mapFileAttachmentToClient(result.fileAttachment)
    popupActionData.value = { ...result, fileAttachment: mapped }
  }

  const setDatesFromActionData = (): void => {
    const country = authStore.shop?.country
    const startTs = popupActionData.value?.startDateTS ?? 0
    const endTs = popupActionData.value?.endDateTS ?? 0
    startDate.value = convertTimestampToDate(startTs, country).toDate()
    endDate.value = convertTimestampToDate(endTs, country).toDate()
  }

  const loadFormData = async (): Promise<void> => {
    try {
      startLoading(true)
      const response = await readPopupService.getDetail(buildDetailPayload())
      if (!response?.isOK) {
        showError(response?.errorMessages)
        return
      }
      if (!response.result) return
      applyDetailResult(response.result)
      setDatesFromActionData()
    } catch (error) {
      showError(extraErrorMessages(error))
    } finally {
      startLoading(false)
    }
  }

  const getBoardManagement = async (): Promise<void> => {
    try {
      startLoading(true)
      const payload = {
        countryCode: authStore.shop.country,
        boardCode: boardCode.value,
        status: COMMON_STATUS.ALL,
      }
      const response = await boardReadService.get(payload)
      if (!response?.isOK) {
        showError(response.errorMessages)
        return
      }
      boardManagement.value = response.result ?? null
    } catch (error) {
      showError(extraErrorMessages(error))
    } finally {
      startLoading(false)
    }
  }

  const appendOptionalFields = (formData: FormData, fields: IPopupActionData): void => {
    if (typeof fields.neverSeePeriodUse === 'number')
      formData.append('neverSeePeriodUse', String(fields.neverSeePeriodUse))
    if (typeof fields.width === 'number') formData.append('width', String(fields.width))
    if (typeof fields.height === 'number') formData.append('height', String(fields.height))
    if (typeof fields.startDateTS === 'number')
      formData.append('startDateTS', String(fields.startDateTS))
    if (typeof fields.endDateTS === 'number') formData.append('endDateTS', String(fields.endDateTS))
  }

  const appendAttachmentsForCreate = (formData: FormData, fields: IPopupActionData): void => {
    if (!fields.fileAttachment) return
    let attachmentsArr: IClientFileAttachment[] = []
    if (Array.isArray(fields.fileAttachment)) {
      attachmentsArr = fields.fileAttachment as IClientFileAttachment[]
    } else {
      attachmentsArr = [fields.fileAttachment as unknown as IClientFileAttachment]
    }
    for (const attachment of attachmentsArr) {
      if (attachment) {
        formData.append('formFile', attachment as unknown as Blob)
      }
    }
  }

  const appendAttachmentsForUpdate = (formData: FormData, fields: IPopupActionData): void => {
    if (!fields.fileAttachment) return

    for (const attachment of fields.fileAttachment) {
      if (!attachment.fileAttachmentId) {
        formData.append('formFile', attachment as unknown as Blob)
      }
    }
  }

  const mapCreateFieldPopupToApi = (fields: IPopupActionData): FormData => {
    const formData = new FormData()
    formData.append('countryCode', fields.countryCode ?? authStore.shop.country)
    formData.append('shopId', String(fields.shopId ?? authStore.shop.shopId))
    if (fields.chainId) formData.append('chainId', String(fields.chainId))
    formData.append('popUpType', String(fields.popUpType ?? BOARD_ENUM.POPUP_TYPE.CHAIN))
    formData.append('title', fields.title ?? '')
    formData.append('popUpType', String(fields.popUpType ?? BOARD_ENUM.POPUP_TYPE.CHAIN))
    formData.append('status', String(fields.status ?? COMMON_STATUS.ACTIVE))
    appendOptionalFields(formData, fields)
    appendAttachmentsForCreate(formData, fields)
    return formData
  }

  const mapUpdateFieldPopupToApi = (fields: IPopupActionData): FormData => {
    const formData = new FormData()
    formData.append('popUpId', String(fields.popUpId))
    formData.append('fileActionType', String(fields.fileActionType))
    formData.append('title', fields.title ?? '')
    formData.append('status', String(fields.status ?? COMMON_STATUS.ACTIVE))
    appendOptionalFields(formData, fields)
    appendAttachmentsForUpdate(formData, fields)
    return formData
  }

  const buildTimestamps = (): { startTs: number | null; endTs: number | null } => {
    const timezone = getTimezoneByCountryCode(authStore.shop.country) as TimezoneType
    const startTs = startDate.value
      ? toUnixTimestamp(startDate.value, timezone, { keepLocalTime: true })
      : null
    const endTs = endDate.value
      ? toUnixTimestamp(endDate.value, timezone, { keepLocalTime: true })
      : null
    return { startTs, endTs }
  }

  const isNonEmptyString = (value: unknown): value is string =>
    typeof value === 'string' && value.length > 0

  const getMessagesFromEntry = (entry: unknown): string[] => {
    if (Array.isArray(entry)) return entry.flatMap(getMessagesFromEntry)
    if (typeof entry === 'string') return [entry]
    if (entry && typeof entry === 'object' && 'message' in (entry as Record<string, unknown>)) {
      const { message } = entry as { message?: string }
      return message ? [message] : []
    }
    return []
  }

  const extractResolverErrors = (result: unknown): string[] => {
    const maybe = result as { errors?: Record<string, unknown> } | null | undefined
    if (!maybe?.errors) return []
    const values = Object.values(maybe.errors)
    return values.flatMap(getMessagesFromEntry).filter(isNonEmptyString)
  }

  const validatePopupAction = async (): Promise<string[]> => {
    const errors: string[] = []
    if (!popupActionData.value.fileAttachment?.length) {
      errors.push(t('validation_messages.popup-contents-file'))
    }
    const { startTs, endTs } = buildTimestamps()
    const resolver = popupValidationSchema()
    const valuesForValidation = {
      title: popupActionData.value.title,
      startDateTS: startTs,
      endDateTS: endTs,
    }
    const resolverResult = await resolver({
      values: valuesForValidation,
      names: undefined,
    } as unknown)
    errors.push(...extractResolverErrors(resolverResult))
    return errors
  }

  // --- Submit helpers ------------------------------------------------------
  const compressIfChanged = async (): Promise<void> => {
    const fileAttachment = popupActionData.value?.fileAttachment?.[0]
    if (!fileAttachment) return
    const isSame = fileAttachment.fileAttachmentId === oldFileId.value
    if (isSame) return
    const uploadedFile: { file: File } = {
      file: fileAttachment as unknown as File,
    }
    const fileUploaded = await compressFileAsync(
      uploadedFile,
      IMAGE_COMPRESS_CONFIG.MAX_IMAGE_COMPRESS_FILE_SIZE,
    )
    if (popupActionData.value) {
      popupActionData.value.fileAttachment = [fileUploaded.file as unknown as IClientFileAttachment]
    }
  }

  const applyTimestamps = (): void => {
    const { startTs, endTs } = buildTimestamps()
    if (!popupActionData.value) return
    popupActionData.value.startDateTS = startTs ?? 0
    popupActionData.value.endDateTS = endTs ?? 0
  }

  const computeFileActionType = (
    current: IClientFileAttachment | undefined,
    oldId: number,
  ): number => {
    const hasCurrent = !!current
    const hasOld = oldId > 0
    if (hasCurrent) {
      const isSameAsOld = !!current.fileAttachmentId && current.fileAttachmentId === oldId
      return isSameAsOld ? BOARD_ENUM.FILE_ACTION_TYPE.NONE : BOARD_ENUM.FILE_ACTION_TYPE.ADD
    }
    return hasOld ? BOARD_ENUM.FILE_ACTION_TYPE.DELETE : BOARD_ENUM.FILE_ACTION_TYPE.NONE
  }

  const submitCreate = async (): Promise<IApiResponse<IPopupCreateResult>> => {
    if (!popupActionData.value) return null as unknown as IApiResponse<IPopupCreateResult>
    popupStore.setPageFilter(PAGINATION.DEFAULT_PAGE_NUMBER)
    popupActionData.value.chainId = authStore.shop.chainId
    popupActionData.value.popUpType = BOARD_ENUM.POPUP_TYPE.CHAIN
    popupActionData.value.countryCode = authStore.shop.country
    popupActionData.value.shopId = authStore.shop.shopId
    const payload = mapCreateFieldPopupToApi(popupActionData.value as IPopupActionData)
    return popupCmdService.create(payload)
  }

  const submitUpdate = async (): Promise<IApiResponse<IPopupUpdateResult>> => {
    if (!popupActionData.value) return null as unknown as IApiResponse<IPopupUpdateResult>
    const current = popupActionData.value.fileAttachment?.[0]
    popupActionData.value.fileActionType = computeFileActionType(current, oldFileId.value)
    const payload = mapUpdateFieldPopupToApi(popupActionData.value as IPopupActionData)
    return popupCmdService.update(payload)
  }

  const submitActionAsync = async (): Promise<void> => {
    try {
      startLoading(true)
      if (!popupActionData.value) return

      const validationErrors = await validatePopupAction()
      if (validationErrors.length) {
        showError(validationErrors)
        return
      }

      await compressIfChanged()
      applyTimestamps()

      const isCreate = popupStore.popupAction.action === FORM_ACTION.ADD
      const result = isCreate ? await submitCreate() : await submitUpdate()

      if (!result?.isOK) {
        showError(result?.errorMessages)
        return
      }
      router.push({ name: BOARD_ROUTES.POPUP })
    } catch (error) {
      showError(extraErrorMessages(error))
    } finally {
      startLoading(false)
    }
  }

  const onFileSelect = (event: FileUploadSelectEvent): void => {
    const getFirstFileFromEvent = (e: FileUploadSelectEvent): File | null => {
      const files = e.files as unknown
      if (Array.isArray(files)) return (files as File[])[0] ?? null
      const list = files as FileList
      return list && typeof list.length === 'number' && list.length > 0 ? list[0] : null
    }

    const isImageFile = (file: File): boolean =>
      /\.(gif|png|jpeg|jpg)$/i.test(file.name.toLowerCase())

    const first = getFirstFileFromEvent(event)
    if (!first) return

    if (!isImageFile(first)) {
      showError(t('boards.upload-error-image-extension'))
      return
    }

    if (first.size > MAX_IMAGE_SIZE_POPUP) {
      showError(t('popups.upload-error-image-size'))
      return
    }

    if (popupActionData.value) {
      popupActionData.value.fileAttachment = event.files
    }

    const objectURL = URL.createObjectURL(first)
    const img = new Image()
    img.onload = (): void => {
      if (popupActionData.value) {
        popupActionData.value.height = img.height
        popupActionData.value.width = img.width
      }
      URL.revokeObjectURL(objectURL)
    }
    img.onerror = (): void => {
      URL.revokeObjectURL(objectURL)
    }
    img.src = objectURL
  }

  const handleRemoveFile = (file: IClientFileAttachment): void => {
    if (!popupActionData.value?.fileAttachment) return
    const index = popupActionData.value.fileAttachment.findIndex((item) => {
      return (
        (item.fileAttachmentId && item.fileAttachmentId === file.fileAttachmentId) ||
        item.name === file.name
      )
    })
    if (index >= 0) {
      popupActionData.value.fileAttachment.splice(index, 1)
    }
  }

  return {
    oldFileId,
    startDate,
    endDate,
    popupActionData,
    loadFormData,
    boardManagement,
    onFileSelect,
    handleRemoveFile,
    submitActionAsync,
    getBoardManagement,
  }
}
