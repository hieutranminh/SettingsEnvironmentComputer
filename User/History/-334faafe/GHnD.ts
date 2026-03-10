import { ref } from 'vue'

import { servicesCmdService } from '@/services/goods/services/services.cmd'
import { servicesReadService } from '@/services/goods/services/services.read'
import { useAuthStore } from '@/stores/auth/auth'

import { useFormat } from './useFormat'

export interface Service {
  serviceId?: number
  serviceName?: string
  serviceCategoryId: number
  price: number
  estimatedTime?: number
  salarySalesValue?: number
  salarySalesType?: number
  salaryDeductionValue?: number
  enableOnlineBookings?: boolean
  shopId: number
  status: number
  orderNo: number
  numberOfActiveChildItems?: number
  serviceDetails?: string
  onlineDescription?: string
  registrationDate?: string
  modificationDate?: string
  // Prepaid service specific fields
  prepaidServiceId?: number
  prepaidServiceName?: string
  unitPrice?: number
  quantity?: number
  validity?: number
  validityType?: number
  relatedServiceId?: number
  relatedServiceName?: string
  // Type indicator
  itemType?: 'service' | 'prepaid'
}

export interface ServiceFormData {
  serviceId?: number
  serviceCategoryId: number
  serviceCategoryName?: string
  serviceName: string
  price: string
  estimatedTime?: number
  estimatedHours?: string | number
  estimatedMinutes?: string | number
  enableOnlineBookings?: boolean
  onlineDescription?: string
  serviceDetails?: string
  salarySalesValue: string
  salarySalesType: 'percent' | 'amount'
  salaryDeductionValue: string
  shopId?: number
  status: number
}

export interface PrepaidServiceFormData {
  category: string
  serviceName: string
  quantity: string
  noLimitQuantity: boolean
  prepaidServiceName: string
  salesPrice: string
  revenuePerService: string
  salarySales: string
  salaryType: 'percent' | 'amount'
  validity: string
  validityType: 'days' | 'month' | 'year'
  noLimitValidity: boolean
  status?: boolean
}

export function useServices() {
  const authStore = useAuthStore()
  const { formatCurrency } = useFormat()

  // Reactive state
  const services = ref<Service[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Load services from API
  const loadServices = async (serviceCategoryId?: number, status?: number) => {
    try {
      loading.value = true
      error.value = null
      const { shopId } = authStore.state.shop

      const response = await servicesReadService.getServices({
        pageSize: 100,
        pageNumber: 1,
        shopId: shopId,
        status: status ?? 1, // Default to active services if no status provided
        ...(serviceCategoryId && { serviceCategoryId }),
      })

      let servicesList: Service[] = []

      if (response.isOK && response.result) {
        // Check if response.result is an array or has items property
        if (Array.isArray(response?.result?.items)) {
          servicesList = response.result.items.map((service) => ({ ...service, itemType: 'service' as const }))
        }
      }

      // Load prepaid services
      if (serviceCategoryId) {
        // Load prepaid services for the specific category
        const prepaidServices = await loadPrepaidServices(serviceCategoryId, status)
        servicesList = [...servicesList, ...prepaidServices]
      } else {
        // Load all prepaid services when no category is specified
        const allPrepaidServices = await loadAllPrepaidServices(status)
        servicesList = [...servicesList, ...allPrepaidServices]
      }

      // Sort by itemType first (regular services first, then prepaid services), then by orderNo within each group
      servicesList.sort((a, b) => {
        // First sort by itemType: 'service' comes before 'prepaid'
        if (a.itemType !== b.itemType) {
          return a.itemType === 'service' ? -1 : 1
        }
        // Within the same itemType, sort by orderNo
        return (a.orderNo || 0) - (b.orderNo || 0)
      })

      services.value = servicesList
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      services.value = []
    } finally {
      loading.value = false
    }
  }

  // Load prepaid services from API
  const loadPrepaidServices = async (serviceCategoryId: number, status?: number): Promise<Service[]> => {
    try {
      const { shopId } = authStore.state.shop

      const response = await servicesReadService.getPrepaidServicesByCategory({
        pageSize: 100,
        pageNumber: 1,
        shopId: shopId,
        status: status ?? 1,
        serviceCategoryId: serviceCategoryId,
      })

      if (response.isOK && response.result && Array.isArray(response.result.items)) {
        return response.result.items.map((prepaidService) => ({
          // Map prepaid service fields to Service interface
          serviceCategoryId: prepaidService.serviceCategoryId,
          price: prepaidService.price,
          shopId: prepaidService.shopId,
          status: prepaidService.status,
          orderNo: prepaidService.orderNo,
          prepaidServiceId: prepaidService.prepaidServiceId,
          prepaidServiceName: prepaidService.prepaidServiceName,
          unitPrice: prepaidService.unitPrice,
          quantity: prepaidService.quantity,
          validity: prepaidService.validity,
          validityType: prepaidService.validityType,
          relatedServiceId: prepaidService.relatedServiceId,
          relatedServiceName: prepaidService.relatedServiceName,
          salarySalesValue: prepaidService.salarySalesValue ? parseFloat(prepaidService.salarySalesValue) : undefined,
          salarySalesType: prepaidService.salarySalesType,
          numberOfActiveChildItems: prepaidService.numberOfActiveChildItems,
          registrationDate: prepaidService.registrationDate,
          modificationDate: prepaidService.modificationDate,
          itemType: 'prepaid' as const,
        }))
      }

      return []
    } catch (err) {
      return []
    }
  }

  // Load all prepaid services from API (without category filter)
  const loadAllPrepaidServices = async (status?: number): Promise<Service[]> => {
    try {
      const { shopId } = authStore.state.shop

      // Don't include serviceCategoryId to get all categories
      const response = await servicesReadService.getPrepaidServices({
        pageSize: 100,
        pageNumber: 1,
        shopId: shopId,
        status: status ?? 1,
        // serviceCategoryId is optional, don't include it to get all
      })

      if (response.isOK && response.result && Array.isArray(response.result.items)) {
        return response.result.items.map((prepaidService) => ({
          // Map prepaid service fields to Service interface
          serviceCategoryId: prepaidService.serviceCategoryId,
          price: prepaidService.price,
          shopId: prepaidService.shopId,
          status: prepaidService.status,
          orderNo: prepaidService.orderNo,
          prepaidServiceId: prepaidService.prepaidServiceId,
          prepaidServiceName: prepaidService.prepaidServiceName,
          unitPrice: prepaidService.unitPrice,
          quantity: prepaidService.quantity,
          validity: prepaidService.validity,
          validityType: prepaidService.validityType,
          relatedServiceId: prepaidService.relatedServiceId,
          relatedServiceName: prepaidService.relatedServiceName,
          salarySalesValue: prepaidService.salarySalesValue ? parseFloat(prepaidService.salarySalesValue) : undefined,
          salarySalesType: prepaidService.salarySalesType,
          numberOfActiveChildItems: prepaidService.numberOfActiveChildItems,
          registrationDate: prepaidService.registrationDate,
          modificationDate: prepaidService.modificationDate,
          itemType: 'prepaid' as const,
        }))
      }

      return []
    } catch (err) {
      return []
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
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
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

      const estimatedTimeMinutes =
        parseInt((serviceData.estimatedHours || 0).toString()) * 60 +
        parseInt((serviceData.estimatedMinutes || 0).toString())

      const payload = {
        enableOnlineBookings: true,
        estimatedTime: estimatedTimeMinutes,
        onlineDescription: '',
        price: parseFloat(serviceData.price),
        salarySalesType: serviceData.salarySalesType === 'percent' ? 1 : 2,
        ...(serviceData.salaryDeductionValue &&
          serviceData.salaryDeductionValue.trim() && {
            salaryDeductionValue: parseFloat(serviceData.salaryDeductionValue),
          }),
        ...(serviceData.salarySalesValue &&
          serviceData.salarySalesValue.trim() && {
            salarySalesValue: parseFloat(serviceData.salarySalesValue),
          }),
        serviceCategoryId: selectedCategory?.serviceCategoryId || parseInt(serviceData.serviceCategoryId),
        serviceCategoryName: selectedCategory?.serviceCategoryName || '',
        serviceDetails: '',
        serviceId: 0,
        serviceName: serviceData.serviceName,
        shopId: authStore.state.shop.shopId,
        status: serviceData.status,
        isHeadquarterGoods: false,
        shared: false,
        ownShopId: authStore.state.shop.shopId,
        orderNo: 1,
      }

      const response = await servicesCmdService.createService(payload)

      if (response.isOK) {
        await loadServices() // Refresh services after creation
        return { success: true, data: response }
      } else {
        error.value = response.message || 'Failed to create service'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
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

      const estimatedTimeMinutes =
        parseInt((serviceData.estimatedHours || 0).toString()) * 60 +
        parseInt((serviceData.estimatedMinutes || 0).toString())

      const payload = {
        serviceId: serviceId,
        serviceName: serviceData.serviceName,
        serviceCategoryId: parseInt(serviceData.serviceCategoryId),
        price: parseFloat(serviceData.price),
        estimatedTime: estimatedTimeMinutes,
        salarySalesType: serviceData.salarySalesType === 'percent' ? 1 : 2,
        ...(serviceData.salarySalesValue &&
          serviceData.salarySalesValue.trim() && {
            salarySalesValue: parseFloat(serviceData.salarySalesValue),
          }),
        ...(serviceData.salaryDeductionValue &&
          serviceData.salaryDeductionValue.trim() && {
            salaryDeductionValue: parseFloat(serviceData.salaryDeductionValue),
          }),
        enableOnlineBookings: true,
        isHeadquarterGoods: false,
        shared: false,
        shopId: authStore.state.shop.shopId,
        ownShopId: authStore.state.shop.shopId,
        status: serviceData.status,
        orderNo: 1,
        serviceDetails: '',
        onlineDescription: '',
      }

      const response = await servicesCmdService.updateService(payload)

      if (response.isOK) {
        await loadServices() // Refresh services after update
        return { success: true, data: response }
      } else {
        error.value = response.message || 'Failed to update service'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Create prepaid service
  const createPrepaidService = async (prepaidData: PrepaidServiceFormData, selectedService: Service) => {
    try {
      loading.value = true
      error.value = null

      const { shopId } = authStore.state.shop

      // Map form data to API payload
      const payload = {
        serviceCategoryId: selectedService.serviceCategoryId,
        serviceCategoryName: '',
        relatedServiceId: selectedService.serviceId || 0,
        relatedServiceName: selectedService.serviceName || '',
        prepaidServiceId: 0,
        prepaidServiceName: prepaidData.prepaidServiceName,
        unitPrice: parseFloat(prepaidData.revenuePerService) || 0,
        quantity: prepaidData.noLimitQuantity ? -1 : parseInt(prepaidData.quantity) || 0,
        price: parseFloat(prepaidData.salesPrice) || 0,
        salarySalesValue: prepaidData.salarySales || '',
        salarySalesType: prepaidData.salaryType === 'percent' ? 1 : 2,
        validity: prepaidData.noLimitValidity ? -1 : parseInt(prepaidData.validity) || 0,
        validityType: prepaidData.validityType === 'month' ? 1 : 2,
        status: prepaidData.status ? 1 : 2,
        shopId: shopId,
      }

      const response = await servicesCmdService.createPrepaidService(payload)

      if (response.isOK) {
        // After successful creation, reload services for this category to include new prepaid service
        await loadServices(selectedService.serviceCategoryId, 1)
        return { success: true, data: response }
      } else {
        // Show detailed error message if available
        let detailedError = response.message || 'Failed to create prepaid service'
        const { errorMessages } = response as any
        detailedError = errorMessages.map((e: { errorMessage: string }) => e.errorMessage).join('\n')
        error.value = detailedError
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Update prepaid service
  const updatePrepaidService = async (
    prepaidServiceId: number,
    prepaidData: PrepaidServiceFormData,
    selectedService: Service,
  ) => {
    try {
      loading.value = true
      error.value = null

      const { shopId } = authStore.state.shop

      // Map form data to API payload
      const payload = {
        serviceCategoryId: parseInt(prepaidData.category),
        serviceCategoryName: '',
        relatedServiceId: selectedService.relatedServiceId || 0,
        relatedServiceName: selectedService.relatedServiceName || '',
        prepaidServiceId: prepaidServiceId,
        prepaidServiceName: prepaidData.prepaidServiceName,
        unitPrice: parseFloat(prepaidData.revenuePerService) || 0,
        quantity: prepaidData.noLimitQuantity ? -1 : parseInt(prepaidData.quantity) || 0,
        price: parseFloat(prepaidData.salesPrice) || 0,
        salarySalesValue: prepaidData.salarySales || '',
        salarySalesType: prepaidData.salaryType === 'percent' ? 1 : 2,
        validity: prepaidData.noLimitValidity ? -1 : parseInt(prepaidData.validity) || 0,
        validityType: prepaidData.validityType === 'month' ? 1 : 2,
        status: prepaidData.status ? 1 : 2,
        shopId: shopId,
      }

      const response = await servicesCmdService.updatePrepaidService(payload)

      if (response.isOK) {
        // After successful update, reload services for this category
        await loadServices(selectedService.serviceCategoryId, 1)
        return { success: true, data: response }
      } else {
        // Show detailed error message if available
        let detailedError = response.message || 'Failed to update prepaid service'
        const { errorMessages } = response as any
        if (errorMessages && Array.isArray(errorMessages)) {
          detailedError = errorMessages.map((e: { errorMessage: string }) => e.errorMessage).join('\n')
        }
        error.value = detailedError
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
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
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
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
