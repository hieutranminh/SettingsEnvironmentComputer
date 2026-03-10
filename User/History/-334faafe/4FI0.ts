import { ref } from 'vue'

import { ERROR_KEYS } from '@/constants'
import { PAGINATION, STATUS, DEFAULTS } from '@/constants/common'
import { servicesCmdService } from '@/services/goods/services/services.cmd'
import { servicesReadService } from '@/services/goods/services/services.read'
import { useAuthStore } from '@/stores/auth/auth'
import type { ServiceFormData, PrepaidServiceFormData } from '@/types/goods'
import { extractErrorMessages } from '@/utils/apiHelpers'
import { SERVICE_TYPES, type ExtendedService } from '@/views/goods/service/constants/serviceConstants'
import { buildServicePayload, mapPrepaidServiceToService } from '@/views/goods/service/utils/serviceHelpers'

import { useFormat } from './useFormat'
import { usePrepaidServices } from './usePrepaidServices'
import { useTranslation } from './useTranslation'

export function useServices() {
  const authStore = useAuthStore()
  const { formatCurrency } = useFormat()
  const { t } = useTranslation()
  const { loadPrepaidServices, loadAllPrepaidServices } = usePrepaidServices(t)

  // Reactive state
  const services = ref<ExtendedService[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Load services from API
  const loadServices = async (serviceCategoryId?: number, status?: number) => {
    try {
      loading.value = true
      error.value = null
      const { shopId } = authStore.state.shop

      const response = await servicesReadService.getServices({
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
        shopId: shopId,
        status: status ?? STATUS.ACTIVE, // Default to active services if no status provided
        ...(serviceCategoryId && { serviceCategoryId }),
      })

      let servicesList: ExtendedService[] = []

      if (response.isOK && response.result) {
        // Check if response.result is an array or has items property
        if (Array.isArray(response?.result?.items)) {
          servicesList = response.result.items.map((service) => ({
            ...service,
            itemType: SERVICE_TYPES.REGULAR,
          }))
        }
      }

      // Load prepaid services
      if (serviceCategoryId) {
        // Load prepaid services for the specific category
        const prepaidServices = await loadPrepaidServices(serviceCategoryId, status)
        const mappedPrepaidServices = prepaidServices.map(mapPrepaidServiceToService)
        servicesList = [...servicesList, ...mappedPrepaidServices]
      } else {
        // Load all prepaid services when no category is specified
        const allPrepaidServices = await loadAllPrepaidServices(status)
        const mappedAllPrepaidServices = allPrepaidServices.map(mapPrepaidServiceToService)
        servicesList = [...servicesList, ...mappedAllPrepaidServices]
      }

      // Sort by itemType first (regular services first, then prepaid services), then by orderNo within each group
      servicesList.sort((a, b) => {
        // First sort by itemType: 'service' comes before 'prepaid'
        if (a.itemType !== b.itemType) {
          return a.itemType === SERVICE_TYPES.REGULAR ? -1 : 1
        }
        // Within the same itemType, sort by orderNo
        return (a.orderNo || DEFAULTS.ORDER_NO) - (b.orderNo || DEFAULTS.ORDER_NO)
      })

      services.value = servicesList
    } catch (err) {
      error.value = err instanceof Error ? err.message : t(ERROR_KEYS.UNKNOWN_ERROR)
      services.value = []
    } finally {
      loading.value = false
    }
  }

  // Get single service by ID
  const getService = async (serviceId: number) => {
    try {
      loading.value = true
      error.value = null

      const response = await servicesReadService.getServiceById(serviceId)

      if (response.isOK && response.result) {
        return { success: true, data: response.result }
      } else {
        error.value = response.message || 'Failed to get service'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : t(ERROR_KEYS.UNKNOWN_ERROR)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Create new service
  const createService = async (
    serviceData: ServiceFormData,
    selectedCategory?: { serviceCategoryId: number; serviceCategoryName: string },
  ) => {
    try {
      loading.value = true
      error.value = null

      const payload = {
        ...buildServicePayload(serviceData, selectedCategory, authStore.state.shop.shopId),
        serviceId: DEFAULTS.ID,
      }

      const response = await servicesCmdService.createService(payload)

      if (response.isOK) {
        await loadServices() // Refresh services after creation
        return { success: true, data: response }
      } else {
        error.value = extractErrorMessages(response)
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : t(ERROR_KEYS.UNKNOWN_ERROR)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Update service
  const updateService = async (serviceId: number, serviceData: ServiceFormData) => {
    try {
      loading.value = true
      error.value = null

      const payload = {
        ...buildServicePayload(serviceData, undefined, authStore.state.shop.shopId),
        serviceId: serviceId,
        serviceCategoryId: parseInt(serviceData.serviceCategoryId.toString()),
        serviceDetails: '',
        onlineDescription: '',
      }

      const response = await servicesCmdService.updateService(payload)

      if (response.isOK) {
        await loadServices() // Refresh services after update
        return { success: true, data: response }
      } else {
        error.value = extractErrorMessages(response)
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : t(ERROR_KEYS.UNKNOWN_ERROR)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Create and update prepaid service
  const { createPrepaidService: createPrepaidServiceBase, updatePrepaidService: updatePrepaidServiceBase } =
    usePrepaidServices(t)

  // Create prepaid service with auto-reload
  const createPrepaidService = async (prepaidData: PrepaidServiceFormData, selectedService: ExtendedService) => {
    const result = await createPrepaidServiceBase(prepaidData, selectedService)

    if (result.success) {
      // After successful creation, reload services for this category to include new prepaid service
      await loadServices(selectedService.serviceCategoryId, STATUS.ACTIVE)
    }

    return result
  }

  // Update prepaid service with auto-reload
  const updatePrepaidService = async (
    prepaidServiceId: number,
    prepaidData: PrepaidServiceFormData,
    selectedService: ExtendedService,
  ) => {
    const result = await updatePrepaidServiceBase(prepaidServiceId, prepaidData, selectedService)

    if (result.success) {
      // After successful update, reload services for this category
      await loadServices(selectedService.serviceCategoryId, STATUS.ACTIVE)
    }

    return result
  }

  // Minutes options for dropdown
  const minuteOptions = ref(['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'])

  // Get filtered services - filtering is now handled by API calls based on status parameter
  const getFilteredServices = () => {
    // Ensure services.value is an array
    if (!Array.isArray(services.value)) {
      return []
    }

    // Since filtering is now handled by the API call with status parameter,
    // we just return all services from the current API response
    return services.value
  }

  // Parse estimated time from minutes to hours and minutes
  const parseEstimatedTime = (estimatedTimeMinutes: number) => {
    const hours = Math.floor(estimatedTimeMinutes / 60)
    const minutes = estimatedTimeMinutes % 60
    return {
      hours: hours.toString(),
      minutes: minutes.toString().padStart(2, '0'),
    }
  }

  // Change service order
  const changeServiceOrder = async (oldPositionId: number, newPositionId: number) => {
    try {
      const { shopId } = authStore.state.shop

      const result = await servicesCmdService.changeServiceOrder({
        shopId: shopId,
        oldPositionId,
        newPositionId,
      })

      if (result.isOK) {
        return { success: true, data: result }
      } else {
        error.value = result.message || 'Failed to change service order'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : t(ERROR_KEYS.UNKNOWN_ERROR)
      return { success: false, error: error.value }
    }
  }

  return {
    // State
    services,
    loading,
    error,

    // Methods
    loadServices,
    loadPrepaidServices,
    loadAllPrepaidServices,
    getService,
    createService,
    updateService,
    createPrepaidService,
    updatePrepaidService,
    getFilteredServices,
    changeServiceOrder,
    formatCurrency,
    parseEstimatedTime,

    // Constants
    minuteOptions,
  }
}
