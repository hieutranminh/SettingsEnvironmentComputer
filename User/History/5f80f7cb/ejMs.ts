import { storeToRefs } from 'pinia'
import { ref, watch, type Ref, type ComputedRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useLoading } from '@/composables/useLoading'
import { useMessageDialog } from '@/composables/useMessageDialog'
import {
  ADMIN_SALES_ENUMS,
  BASE_FEE_PAYMENT_METHOD_OPTIONS,
  BASE_FEE_PAYMENT_METHOD_OPTIONS_KR,
  COUNTRY_CODES,
  NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS_KR,
  NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS_KR_WITH_AUTO_TRANSFER,
  NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS,
  STANDARD_DATE_FORMAT,
  ROUTE_NAMES,
} from '@/constants'
import { AUTH_ROUTES, PAYMENT_ROUTES } from '@/constants/routeNames'
import { shopReadService } from '@/services/shop/shop.read'
import { useAuthStore } from '@/stores/auth/auth'
import { useShopStore } from '@/stores/common/shop'
import type { IMonthlyFeeInfoResult } from '@/types/shop'
import type { IUserState, IShopState } from '@/types/auth/User'
import { extraErrorMessages } from '@/utils/common'
import { convertTimestampToDate } from '@/utils/dateUtils'

const SERVICE_FEE_PAYMENT = 'service_fee'
const authStore = useAuthStore()
const { shop, user } = storeToRefs(authStore)

export interface IUsePaymentReturn {
  isExpired: Ref<boolean>
  shop: ComputedRef<IShopState>
  user: ComputedRef<IUserState>
  methodCheck: Ref<number>
  purposeCheck: Ref<number>
  shopName: Ref<string>
  shopNetMoneyBalance: Ref<number>
  shopExpiryDate: Ref<number>
  paymentMethodCheck: Ref<Array<{ value: number; text: string }> | null>
  depositlessPaymentSuccess: Ref<boolean>
  resultData: null
  monthlyFeeInfo: Ref<IMonthlyFeeInfoResult | null>
  isEnableNetMoneyChargeByAutoTransfer: Ref<boolean>
  outStandingAmount: Ref<number>
  selectedField: Ref<string>
  onChangePurpose: () => void
  loadShopUsage: (shopId: number) => Promise<void>
  formatTimeStampToDate: (timestamp: number) => string
  logout: () => void
  onKey: (e: KeyboardEvent) => void
  gotoLogin: () => void
}

export const usePayment = (): IUsePaymentReturn => {
  const isExpired = ref(false)
  const shopName = ref('')
  const shopNetMoneyBalance = ref(0)
  const shopExpiryDate = ref(0)
  const paymentMethodCheck = ref<{ value: number; text: string }[] | null>(null)
  const depositlessPaymentSuccess = ref(false)
  const methodCheck = ref(1)
  const resultData = null
  const monthlyFeeInfo = ref<IMonthlyFeeInfoResult | null>(null)
  const isEnableNetMoneyChargeByAutoTransfer = ref(false)
  const outStandingAmount = ref(0)
  const selectedField = ref('depositless')
  const purposeCheck = ref(1)
  const { startLoading } = useLoading()
  const { showError } = useMessageDialog()
  const shopStore = useShopStore()
  const { monthlyFee } = storeToRefs(shopStore)
  const router = useRouter()
  const route = useRoute()

  // Watches
  watch(
    () => route.query.type,
    (newType) => {
      purposeCheck.value = newType
        ? ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.BASE_FEE
        : ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE
      if (!monthlyFeeInfo.value?.autoTransfer) {
        onChangePurpose()
      }
      // Add logic here if you want to react to changes in the 'type' query parameter
    },
  )
  // Methods
  /**
   * Updates payment method options and method based on selected purpose and shop country.
   * Refactored to use composition API refs and constants.
   */
  const onChangePurpose = (): void => {
    const isKR = shop.value.country === COUNTRY_CODES.KR
    const isNetMoneyCharge =
      purposeCheck.value === ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE

    if (isKR) {
      if (isNetMoneyCharge) {
        paymentMethodCheck.value = NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS_KR
      } else {
        paymentMethodCheck.value = BASE_FEE_PAYMENT_METHOD_OPTIONS_KR
      }
      methodCheck.value = ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL
    } else {
      if (purposeCheck.value === ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE) {
        paymentMethodCheck.value = NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS
      } else {
        paymentMethodCheck.value = BASE_FEE_PAYMENT_METHOD_OPTIONS
      }
      methodCheck.value = ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL
    }
  }

  // -------- Helpers extracted from loadShopUsage --------
  const determineInitialPurpose = (): number => {
    return route.query?.type === SERVICE_FEE_PAYMENT
      ? ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.BASE_FEE
      : ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE
  }

  const setMethodOptionsByCountry = (): void => {
    if (shop.value.country === COUNTRY_CODES.KR) {
      methodCheck.value = ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL
      if (monthlyFeeInfo.value?.autoTransfer && isEnableNetMoneyChargeByAutoTransfer.value) {
        paymentMethodCheck.value = NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS_KR_WITH_AUTO_TRANSFER
      } else {
        paymentMethodCheck.value = NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS_KR
      }
    } else {
      methodCheck.value = ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL
      // paymentMethodCheck.value = NETMONEY_CHARGE_PAYMENT_METHOD_OPTIONS
      paymentMethodCheck.value = BASE_FEE_PAYMENT_METHOD_OPTIONS
    }
  }

  const loadCoreShopInfos = async (shopId: number): Promise<void> => {
    await Promise.all([
      shopStore.setMonthlyFeeInfo({ shopId }),
      shopStore.setPaymentInfo({ shopId }),
    ])
    monthlyFeeInfo.value = monthlyFee.value
  }

  const loadOutstandingAmount = async (): Promise<boolean> => {
    const payload = { shopId: shop.value.shopId }
    const adminSalesResult = await shopReadService.getAdminSalesOutstandingSumOfShopCMSable(payload)
    if (!adminSalesResult.isOK) {
      showError(adminSalesResult.errorMessages)
      return false
    }
    outStandingAmount.value = adminSalesResult.result ?? 0
    isEnableNetMoneyChargeByAutoTransfer.value = outStandingAmount.value >= 0
    return true
  }

  const maybeRedirectIfAutoTransfer = async (): Promise<void> => {
    if (monthlyFeeInfo.value?.autoTransfer) {
      await router.push({ name: PAYMENT_ROUTES.PAYMENTS, query: { _t: Date.now() } })
    }
  }

  const loadUsageAndPopulate = async (): Promise<boolean> => {
    const shopUsageResult = await shopReadService.getShopUsage({ shopId: shop.value.shopId })
    if (!shopUsageResult.isOK) {
      showError(shopUsageResult.errorMessages)
      return false
    }
    shopNetMoneyBalance.value = shopUsageResult.result?.netMoneyBalance ?? 0
    shopExpiryDate.value = shopUsageResult.result?.expiryDateTS ?? 0
    shopName.value = shopUsageResult.result?.shopName ?? ''
    return true
  }

  const handleExpiredShop = (): void => {
    if (shop.value.expired) {
      purposeCheck.value = ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.BASE_FEE
      onChangePurpose()
    }
  }

  const loadShopUsage = async (shopId: number): Promise<void> => {
    try {
      startLoading(true)

      await loadCoreShopInfos(shopId)

      const outstandingOk = await loadOutstandingAmount()
      if (!outstandingOk) return

      await maybeRedirectIfAutoTransfer()

      purposeCheck.value = determineInitialPurpose()

      setMethodOptionsByCountry()

      depositlessPaymentSuccess.value = false

      const usageOk = await loadUsageAndPopulate()
      if (!usageOk) return

      handleExpiredShop()
    } catch (error) {
      showError(extraErrorMessages(error))
    } finally {
      startLoading(false)
    }
  }

  const formatTimeStampToDate = (timestamp: number): string => {
    if (!timestamp) return ''
    return convertTimestampToDate(timestamp, shop.value.country).format(STANDARD_DATE_FORMAT.YMD)
  }

  const logout = (): void => {
    router.push({ name: AUTH_ROUTES.LOGOUT })
  }

  const onKey = (e: KeyboardEvent): void => {
    // Prevent F5 (116) or Ctrl+N (78), Ctrl+R (82), Ctrl+F5 (116)
    const KEY_CODE_F5 = 116
    const KEY_CODE_N = 78
    const KEY_CODE_R = 82

    const isF5 = e.key === 'F5' || e.keyCode === KEY_CODE_F5
    const isCtrlN = e.ctrlKey && (e.key === 'n' || e.keyCode === KEY_CODE_N)
    const isCtrlR = e.ctrlKey && (e.key === 'r' || e.keyCode === KEY_CODE_R)
    const isCtrlF5 = e.ctrlKey && (e.key === 'F5' || e.keyCode === KEY_CODE_F5)

    if (isF5 || isCtrlN || isCtrlR || isCtrlF5) {
      e.preventDefault()
    }
  }

  const gotoLogin = (): void => {
    router.push({ name: AUTH_ROUTES.LOGOUT })
  }

  return {
    isExpired,
    shop,
    user,
    methodCheck,
    purposeCheck,
    shopName,
    shopNetMoneyBalance,
    shopExpiryDate,
    paymentMethodCheck,
    depositlessPaymentSuccess,
    resultData,
    monthlyFeeInfo,
    isEnableNetMoneyChargeByAutoTransfer,
    outStandingAmount,
    selectedField,
    onChangePurpose,
    loadShopUsage,
    formatTimeStampToDate,
    logout,
    onKey,
    gotoLogin,
  }
}
