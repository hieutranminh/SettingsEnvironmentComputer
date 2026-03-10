<template>
  <div class="calendar-aha-ai">
    <a-button
      variant="blue-light"
      :class="buttonAhaAiClass"
      @click="onShowAhaAiPopup"
    >
      {{ isMobileDevice ? "AI" : $t('aha-ai.title') }}
    </a-button>

    <!-- Modal - Aha AI -->
    <modal-aha-ai
      ref="modalAhaAi"
      :visible="modalStates.ahaAi"
      :opened-from-search-available-times="context.isFromSearchAvailableTimes"
      @send="onSend"
      @cancel="onCancelAhaAi"
      @show-help-popup="modalStates.ahaAiHelp = true"
      @show-setup-popup="modalStates.ahaAiSetup = true"
      @show-search-available-times-popup="onShowSearchAvailableTimesPopup"
      @confirm-search-available-times="onConfirmSearchAvailableTimesFromAhaAi"
    />

    <!-- Modal - Aha AI Help -->
    <modal-aha-ai-help
      :visible="modalStates.ahaAiHelp"
      @cancel="modalStates.ahaAiHelp = false"
    />

    <!-- Modal - Aha AI Setup -->
    <modal-aha-ai-setup
      :visible="modalStates.ahaAiSetup"
      @cancel="modalStates.ahaAiSetup = false"
    />

    <!-- Modal - Aha AI Search Available Times -->
    <modal-aha-ai-search-available-times
      :visible="modalStates.searchAvailableTimes"
      :saved-filters="savedFilters"
      :is-search-available-times-from-booking-items="context.isSearchAvailableTimesFromBookingItems"
      @cancel="onCancelSearchAvailableTimes"
      @show-aha-ai="onShowAhaAiPopupFromSearchAvailableTimes"
      @confirm-search-available-times="onConfirmSearchAvailableTimes"
    />

    <!-- Modal - Aha AI Result Available Times -->
    <modal-aha-ai-result-available-times
      :visible="modalStates.resultAvailableTimes"
      :saved-filters="savedFilters"
      :result-data.sync="resultData"
      :is-search-available-times-from-booking-items="context.isSearchAvailableTimesFromBookingItems"
      :selected-booked-resource="selectedBookedResource"
      :search-available-times-items-data="searchAvailableTimesItemsData"
      @cancel="onCancelResultAvailableTimes"
      @select-again-search-available-times-popup="onSelectAgainSearchAvailableTimesPopup"
    />

    <!-- Modal - Aha AI Booking Items -->
    <modal-aha-ai-booking-items
      :visible="modalStates.ahaAiBookingItems"
      :selected-booked-resource="selectedBookedResource"
      @cancel="modalStates.ahaAiBookingItems = false"
      @show-help-popup="modalStates.ahaAiHelp = true"
      @show-setup-popup="modalStates.ahaAiSetup = true"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import ComponentBase from 'Components/common/component-base/component-base.vue'
import ModalAhaAi from 'Modules/calendar/components/modal-aha-ai/modal-aha-ai.vue'
import ModalAhaAiHelp from 'Modules/calendar/components/modal-aha-ai-help/modal-aha-ai-help.vue'
import ModalAhaAiSetup from 'Modules/calendar/components/modal-aha-ai-setup/modal-aha-ai-setup.vue'
import ModalAhaAiSearchAvailableTimes from 'Modules/calendar/components/modal-aha-ai-search-available-times/modal-aha-ai-search-available-times.vue'
import ModalAhaAiResultAvailableTimes from 'Modules/calendar/components/modal-aha-ai-result-available-times/modal-aha-ai-result-available-times.vue'
import ModalAhaAiBookingItems from 'Modules/calendar/components/modal-aha-ai-booking-items/modal-aha-ai-booking-items.vue'
// APIs
import { getAhaAIBookingAgent, getAvailableTimes } from 'Modules/api/aha-ai/aha-ai-api'
// Constants
import { options } from 'OptionsHelpers'
import { AHA_AI_INTENT_TYPE, BOOKING_SEARCH_TYPE, TIME_OF_DAY, MINUTES_OF_24H } from 'Constant'
// Helpers
import { parseTimezoneToNumber } from 'CommonHelpers'
import { CalendarEventBus, formatTimeBasedOnMinutes, roundUpTo30Minutes, convertTimeToMinutes } from 'Modules/calendar/utils/index'

// Time ranges constant (in minutes)
const TIME_RANGES = {
  MORNING:   { start: 0, end: 779 }, // 00:00 ~ 12:59
  AFTERNOON: { start: 780, end: 1079 }, // 13:00 ~ 17:59
  EVENING:   { start: 1080, end: 1439 }, // 18:00 ~ 23:59
}
const MAX_LENGTH_TEXTAREA = 100
const MAX_ESTIMATED_TIME = 600 // 10 hours
const ERROR_CODES = {
  RESOURCE_IS_INVALID:      'SATS03R',
  ERR_COM_API_SERVER_ERROR: 'ERR_COM_API_SERVER_ERROR',
}

export default {
  extends: ComponentBase,

  components: {
    AButton,
    ModalAhaAi,
    ModalAhaAiHelp,
    ModalAhaAiSetup,
    ModalAhaAiSearchAvailableTimes,
    ModalAhaAiResultAvailableTimes,
    ModalAhaAiBookingItems,
  },

  mixins: [
    DeviceMixin,
  ],

  data() {
    return {
      modalStates: {
        ahaAi:                false,
        ahaAiHelp:            false,
        ahaAiSetup:           false,
        ahaAiBookingItems:    false,
        searchAvailableTimes: false,
        resultAvailableTimes: false,
      },
      context: {
        isFromSearchAvailableTimes:             false,
        isSearchAvailableTimesFromAhaAi:        false,
        isSearchAvailableTimesFromBookingItems: false,
      },
      savedFilters:                  null,
      resultData:                    null,
      selectedBookedResource:        null,
      searchAvailableTimesItemsData: null,
    }
  },

  computed: {
    ...mapState('_calendar', [
      'finishTime',
      'crossDate',
      'bookingResources',
    ]),

    ...mapGetters('_calendar', [
      'timeSlots60Minutes',
    ]),

    buttonAhaAiClass() {
      return ['button-aha-ai', { 'button-aha-ai--mobile': this.isMobileDevice }]
    },

    resourcesOptions() {
      if (!this.bookingResources || !this.bookingResources.length) {
        return []
      }
      return this.bookingResources.map(resource => ({
        value: resource.id,
        text:  resource.resource_name,
      }))
    },

    timeOptions() {
      if (!this.timeSlots60Minutes?.length) {
        return []
      }

      return this.timeSlots60Minutes.map(timeSlot => ({
        value: timeSlot.minutes,
        text:  formatTimeBasedOnMinutes({ minutes: timeSlot.minutes, prefix: this.$t('general.next-day-text') }),
      }))
    },
  },

  created() {
    CalendarEventBus.$on('show-search-available-times-popup-from-client-information', this.onShowSearchAvailableTimesPopupFromClientInformation)
    CalendarEventBus.$on('show-search-available-times-popup-from-booking-items', this.onShowSearchAvailableTimesPopupFromBookingItems)
    CalendarEventBus.$on('show-aha-ai-booking-items-popup', this.onShowAhaAiBookingItemsPopup)
    CalendarEventBus.$on('show-setup-popup', this.onShowSetupPopup)
    CalendarEventBus.$on('show-help-popup', this.onShowHelpPopup)
  },

  beforeDestroy() {
    CalendarEventBus.$off('show-search-available-times-popup-from-client-information', this.onShowSearchAvailableTimesPopupFromClientInformation)
    CalendarEventBus.$off('show-search-available-times-popup-from-booking-items', this.onShowSearchAvailableTimesPopupFromBookingItems)
    CalendarEventBus.$off('show-aha-ai-booking-items-popup', this.onShowAhaAiBookingItemsPopup)
    CalendarEventBus.$off('show-setup-popup', this.onShowSetupPopup)
    CalendarEventBus.$off('show-help-popup', this.onShowHelpPopup)
  },

  methods: {
    resetContext() {
      this.context.isFromSearchAvailableTimes = false
      this.context.isSearchAvailableTimesFromAhaAi = false
    },

    onShowAhaAiPopup() {
      this.resetContext()
      this.savedFilters = null
      this.modalStates.ahaAi = true
    },

    onCancelAhaAi() {
      this.modalStates.ahaAi = false

      // Only reset context if not navigating to other modals
      if (!this.context.isSearchAvailableTimesFromAhaAi) {
        this.resetContext()
      }
    },

    async onSend(prompt) {
      if(prompt.length > MAX_LENGTH_TEXTAREA) {
        this.$refs.modalAhaAi.errors = [this.$t('aha-ai.validate-max-length-characters-allowed', { maxLength: MAX_LENGTH_TEXTAREA })]
        return
      }

      try {
        this.preLoader()

        const userLanguage = this.x_user.language === options.language.english ? 0 : 1
        const shopTimeZone = parseTimezoneToNumber(this.shop_data.timezone)
        const bookingSearchType = this.context.isFromSearchAvailableTimes
          ? BOOKING_SEARCH_TYPE.SEARCH_AVAILABLE_TIMES
          : BOOKING_SEARCH_TYPE.SEARCH_ALL

        const payload = {
          shopId:            this.shop_data.shop_id,
          command:           prompt,
          shopTimeZone:      shopTimeZone,
          language:          userLanguage,
          searchInBranches:  this.x_user.is_client_searched_in_branches || false,
          bookingSearchType: bookingSearchType,
        }

        const response = await getAhaAIBookingAgent(payload)
        const resultData = response.data.result

        // For SEARCH_AVAILABLE_TIMES intent, don't close the modal yet
        // Let handleSearchAvailableTimesFromAhaAi handle validation and display
        if (resultData.intent !== AHA_AI_INTENT_TYPE.SEARCH_AVAILABLE_TIMES) {
          this.$refs.modalAhaAi.errors = []
          this.context.isFromSearchAvailableTimes = false
          this.modalStates.ahaAi = false
        }

        this.handleResultFromAhaAi(resultData)
      } catch (error) {
        if (error.codes.includes(ERROR_CODES.RESOURCE_IS_INVALID)) {
          const resourceNameValue = error.values?.[0]?.[0] || ''
          const resourceName = resourceNameValue.split(':')[1]?.trim() || ''
          this.$refs.modalAhaAi.errors = [this.$t('aha-ai.validate-resource-is-invalid', { resourceName: resourceName })]
          return
        }

        if (error.codes.includes(ERROR_CODES.ERR_COM_API_SERVER_ERROR)) {
          this.$refs.modalAhaAi.errors = [this.$t('aha-ai.message-ai-could-not-generate')]
          return
        }

        this.$refs.modalAhaAi.errors = error.message
      } finally {
        this.preLoader(false)
      }
    },

    handleResultFromAhaAi(resultData) {
      switch(resultData.intent) {
        case AHA_AI_INTENT_TYPE.SEARCH_CLIENT:
          this.handleClientLookupFromAhaAi(resultData.clientLookupResult)
          break
        case AHA_AI_INTENT_TYPE.SEARCH_BOOKING:
          this.handleBookingLookupFromAhaAi(resultData.bookingLookupResult)
          break
        case AHA_AI_INTENT_TYPE.SEARCH_AVAILABLE_TIMES:
          this.handleSearchAvailableTimesFromAhaAi(resultData.availableTimesResult)
          break
      }
    },

    handleClientLookupFromAhaAi(resultData) {
      CalendarEventBus.$emit('client-lookup-from-aha-ai', resultData)
    },

    handleBookingLookupFromAhaAi(resultData) {
      CalendarEventBus.$emit('booking-lookup-from-aha-ai', resultData)
    },

    handleSearchAvailableTimesFromAhaAi(resultData) {
      // Reset search available times data first to prevent showing old data when error occurs
      this.$refs.modalAhaAi.resetSearchAvailableTimesData()

      // Validate resources
      const resourceValidationError = this.validateResourcesForSearchAvailableTimes(resultData.resources)
      if (resourceValidationError) {
        this.$refs.modalAhaAi.errors = [resourceValidationError]
        return
      }

      // Validate services and booking items
      const servicesAndBookingItemsValidationError = this.validateServicesAndBookingItemsForSearchAvailableTimes(resultData.servicesAndBookingItems)
      if (servicesAndBookingItemsValidationError) {
        this.$refs.modalAhaAi.errors = servicesAndBookingItemsValidationError
        return
      }

      // Check if there are relative match results
      const { servicesAndBookingItemsRelativeMatch } = resultData.servicesAndBookingItems
      const hasRelativeMatch = servicesAndBookingItemsRelativeMatch?.serviceItems?.length > 0
        || servicesAndBookingItemsRelativeMatch?.bookingItems?.length > 0

      if (hasRelativeMatch) {
        // Display UI for user to select services/booking items
        this.$refs.modalAhaAi.errors = []
        this.$refs.modalAhaAi.setSearchAvailableTimesData(resultData)
      } else {
        // No relative match, call API directly
        this.callGetAvailableTimesAndOpenResult(resultData)
      }
    },

    async callGetAvailableTimesAndOpenResult(resultData) {
      try {
        this.preLoader()

        // Get selected items (from relative match selection)
        const selectedServiceItems = resultData.selectedServiceItems || {}
        const selectedBookingItems = resultData.selectedBookingItems || {}

        // Calculate estimatedTime from exact match and selected relative match items
        const calculatedEstimatedTime = this.calculateEstimatedTimeFromItems(
          resultData.servicesAndBookingItems,
          selectedServiceItems,
          selectedBookingItems,
        )
        const payload = {
          ...resultData.queryParameters,
          estimatedTime: calculatedEstimatedTime ?? resultData.queryParameters.estimatedTime,
        }

        const response = await getAvailableTimes(payload)

        if (!response.data.isOK) {
          this.$refs.modalAhaAi.errors = response.data.errorMessages
          return
        }

        // Store services/booking items data for result modal
        this.searchAvailableTimesItemsData = {
          servicesAndBookingItems: resultData.servicesAndBookingItems,
          selectedServiceItems:    selectedServiceItems,
          selectedBookingItems:    selectedBookingItems,
        }

        // Map resultData to savedFilters and open result modal
        this.resultData = response.data.result
        this.savedFilters = this.mapResultDataToFilters(resultData, selectedServiceItems, selectedBookingItems)

        this.context.isFromSearchAvailableTimes = false
        this.context.isSearchAvailableTimesFromAhaAi = false
        this.modalStates.ahaAi = false
        this.modalStates.resultAvailableTimes = true
      } catch (error) {
        this.$refs.modalAhaAi.errors = [error.message]
      } finally {
        this.preLoader(false)
      }
    },

    calculateEstimatedTimeFromItems(servicesAndBookingItems, selectedServiceItems, selectedBookingItems) {
      if (!servicesAndBookingItems) {
        return null
      }

      const { servicesAndBookingItemsExactMatch } = servicesAndBookingItems

      // Get exact match items
      const exactServiceItems = servicesAndBookingItemsExactMatch?.serviceItems || []
      const exactBookingItems = servicesAndBookingItemsExactMatch?.bookingItems || []

      // Get selected relative match items
      const selectedServiceItemsArray = selectedServiceItems ? Object.values(selectedServiceItems) : []
      const selectedBookingItemsArray = selectedBookingItems ? Object.values(selectedBookingItems) : []

      // If no items at all, return null to use original estimatedTime
      const totalItemsCount = exactServiceItems.length + exactBookingItems.length
        + selectedServiceItemsArray.length + selectedBookingItemsArray.length
      if (totalItemsCount === 0) {
        return null
      }

      // Sum estimatedTime from all items
      const exactServiceEstimatedTime = exactServiceItems.reduce((sum, item) => sum + (item.estimatedTime || 0), 0)
      const exactBookingEstimatedTime = exactBookingItems.reduce((sum, item) => sum + (item.estimatedTime || 0), 0)
      const selectedServiceEstimatedTime = selectedServiceItemsArray.reduce((sum, item) => sum + (item.estimatedTime || 0), 0)
      const selectedBookingEstimatedTime = selectedBookingItemsArray.reduce((sum, item) => sum + (item.estimatedTime || 0), 0)

      return exactServiceEstimatedTime + exactBookingEstimatedTime + selectedServiceEstimatedTime + selectedBookingEstimatedTime
    },

    validateResourcesForSearchAvailableTimes(resources) {
      if (!resources || resources.length === 0) {
        return null
      }

      // Check if any resource has id === 0
      const hasInvalidResource = resources.some(resource => resource.id === 0)
      if (hasInvalidResource) {
        const invalidResource = resources.find(resource => resource.id === 0)
        return this.$t('aha-ai.validate-resource-is-invalid', { resourceName: invalidResource.name })
      }

      // Check if resources > 1 and names don't have overlap
      if (resources.length > 1 && !this.hasResourceNameOverlap(resources)) {
        return this.$t('aha-ai.validate-excessive-resource-searching')
      }

      return null
    },

    hasResourceNameOverlap(resources) {
      for (let i = 0; i < resources.length; i++) {
        for (let j = i + 1; j < resources.length; j++) {
          const name1 = resources[i].name.toLowerCase()
          const name2 = resources[j].name.toLowerCase()
          if (name1.includes(name2) || name2.includes(name1)) {
            return true
          }
        }
      }
      return false
    },

    validateServicesAndBookingItemsForSearchAvailableTimes(servicesAndBookingItems) {
      if (!servicesAndBookingItems) {
        return null
      }

      const { servicesAndBookingItemsNotExist, servicesAndBookingItemsExactMatch, servicesAndBookingItemsRelativeMatch } = servicesAndBookingItems

      // Check if servicesAndBookingItemsNotExist has data
      if (servicesAndBookingItemsNotExist && servicesAndBookingItemsNotExist.length > 0) {
        return servicesAndBookingItemsNotExist.map(itemName =>
          this.$t('aha-ai.validate-not-found-item', { itemName }),
        )
      }

      // Check if output is empty or invalid
      if (!servicesAndBookingItemsExactMatch?.bookingItems?.length
        && !servicesAndBookingItemsExactMatch?.serviceItems?.length
        && !servicesAndBookingItemsRelativeMatch?.bookingItems?.length
        && !servicesAndBookingItemsRelativeMatch?.serviceItems?.length) {
        return [this.$t('aha-ai.validate-ai-content-not-found')]
      }

      return null
    },

    mapResultDataToFilters(resultData, selectedServiceItems, selectedBookingItems) {
      const { dateTimeFilters, isPeriodSelection, queryParameters, resources, servicesAndBookingItems } = resultData

      // Map booking resource setup IDs - use resources field if bookingResourceSetupIds is null
      const resourceIds = queryParameters.bookingResourceSetupIds || (resources ? resources.map(r => r.id) : [])
      const bookingResourceSetupIds = this.getFilteredResources(resourceIds)
      // Handle date filters based on isPeriodSelection
      const { bookingDates, fromDateTS, toDateTS } = this.getDateFilters(dateTimeFilters, isPeriodSelection)
      // Map booking start time
      const { timeOfDay, startTime, endTime } = this.getBookingStartTime(dateTimeFilters)
      // Calculate estimatedTime from exact match and selected relative match items
      const calculatedEstimatedTime = this.calculateEstimatedTimeFromItems(
        servicesAndBookingItems,
        selectedServiceItems || {},
        selectedBookingItems || {},
      )

      return {
        shopId:            this.shop_data.shop_id,
        isPeriodSelection: isPeriodSelection || false,
        estimatedTime:     calculatedEstimatedTime ?? queryParameters.estimatedTime ?? 0,
        bookingStartTime:  {
          timeOfDay: timeOfDay,
          startTime: startTime,
          endTime:   endTime,
        },
        bookingResourceSetupIds: bookingResourceSetupIds,
        fromDateTS:              fromDateTS,
        toDateTS:                toDateTS,
        bookingDates:            bookingDates,
      }
    },

    getFilteredResources(resultResourceIds) {
      // If result.bookingResourceSetupIds is empty, select all resources
      if (!resultResourceIds || resultResourceIds.length === 0) {
        return [...this.resourcesOptions]
      }

      // Map based on result.bookingResourceSetupIds
      const filteredResources = this.resourcesOptions.filter(
        resource => resultResourceIds.includes(resource.value),
      )

      // If no match found, return all resources as fallback
      return filteredResources.length > 0 ? filteredResources : [...this.resourcesOptions]
    },

    getDateFilters(dateTimeFilters, isPeriodSelection) {
      const result = {
        bookingDates: [],
        fromDateTS:   0,
        toDateTS:     0,
      }

      if (!dateTimeFilters || dateTimeFilters.length === 0) {
        return result
      }

      if (isPeriodSelection) {
        // Period selection: bookingDates = empty array, set fromDateTS and toDateTS
        result.fromDateTS = dateTimeFilters[0].bookingDateTS
        result.toDateTS = dateTimeFilters[dateTimeFilters.length - 1].bookingDateTS
      } else {
        // Not period selection: map all bookingDateTS to bookingDates
        result.bookingDates = dateTimeFilters.map(filter => filter.bookingDateTS)
      }

      return result
    },

    calculateTimeOfDay(startTimeMinute, endTimeMinute) {
      const firstTimeOption = this.timeOptions[0]?.value ?? 0
      const lastTimeOption = this.timeOptions[this.timeOptions.length - 1]?.value ?? MINUTES_OF_24H

      if (startTimeMinute === firstTimeOption && endTimeMinute === lastTimeOption) {
        return {
          timeOfDay: TIME_OF_DAY.ALL,
          startTime: 0,
          endTime:   0,
        }
      }

      const isExactRange = (range) => startTimeMinute === range.start && endTimeMinute === range.end

      if (isExactRange(TIME_RANGES.MORNING)) {
        return { timeOfDay: TIME_OF_DAY.MORNING, startTime: 0, endTime: 0 }
      }
      if (isExactRange(TIME_RANGES.AFTERNOON)) {
        return { timeOfDay: TIME_OF_DAY.AFTERNOON, startTime: 0, endTime: 0 }
      }
      if (isExactRange(TIME_RANGES.EVENING)) {
        return { timeOfDay: TIME_OF_DAY.EVENING, startTime: 0, endTime: 0 }
      }

      return {
        timeOfDay: TIME_OF_DAY.MANUAL_SELECTION,
        startTime: startTimeMinute,
        endTime:   endTimeMinute,
      }
    },

    getBookingStartTime(dateTimeFilters) {
      if (!dateTimeFilters?.length || !dateTimeFilters[0].bookingStartTimes?.length) {
        return {
          timeOfDay: TIME_OF_DAY.ALL,
          startTime: 0,
          endTime:   0,
        }
      }

      const { startTimeMinute, endTimeMinute } = dateTimeFilters[0].bookingStartTimes[0]

      if (startTimeMinute != null && endTimeMinute == null) {
        const finishTimeInMinutesOfShop = convertTimeToMinutes(this.finishTime) + (this.crossDate ? MINUTES_OF_24H : 0)
        return {
          timeOfDay: TIME_OF_DAY.MANUAL_SELECTION,
          startTime: startTimeMinute,
          endTime:   finishTimeInMinutesOfShop,
        }
      }

      if (startTimeMinute != null && endTimeMinute != null) {
        return this.calculateTimeOfDay(startTimeMinute, endTimeMinute)
      }

      return {
        timeOfDay: TIME_OF_DAY.ALL,
        startTime: 0,
        endTime:   0,
      }
    },

    onShowHelpPopup() {
      this.modalStates.ahaAiHelp = true
    },

    onShowSearchAvailableTimesPopup() {
      this.context.isFromSearchAvailableTimes = false
      this.context.isSearchAvailableTimesFromAhaAi = true

      this.savedFilters = null
      this.modalStates.ahaAi = false
      this.modalStates.searchAvailableTimes = true
    },

    onShowAhaAiPopupFromSearchAvailableTimes() {
      this.context.isFromSearchAvailableTimes = true
      this.context.isSearchAvailableTimesFromAhaAi = false

      this.modalStates.searchAvailableTimes = false
      this.modalStates.ahaAi = true
    },

    onCancelSearchAvailableTimes() {
      this.modalStates.searchAvailableTimes = false

      if (this.context.isSearchAvailableTimesFromAhaAi) {
        this.context.isSearchAvailableTimesFromAhaAi = false
        this.modalStates.ahaAi = true
      }
    },

    onSelectAgainSearchAvailableTimesPopup() {
      this.context.isFromSearchAvailableTimes = false
      this.modalStates.resultAvailableTimes = false
      this.modalStates.searchAvailableTimes = true
    },

    onCancelResultAvailableTimes() {
      this.modalStates.resultAvailableTimes = false
      this.searchAvailableTimesItemsData = null
    },

    onConfirmSearchAvailableTimes(resultData, filters) {
      this.savedFilters = filters
      this.resultData = resultData
      this.context.isSearchAvailableTimesFromAhaAi = false // From manual search
      this.modalStates.searchAvailableTimes = false
      this.modalStates.resultAvailableTimes = true
    },

    onShowSearchAvailableTimesPopupFromClientInformation() {
      this.savedFilters = null
      this.selectedBookedResource = null
      this.context.isSearchAvailableTimesFromBookingItems = false
      this.modalStates.searchAvailableTimes = true
    },

    onShowSearchAvailableTimesPopupFromBookingItems({ bookedResource, bookingDateTs }) {
      const selectedResource = this.bookingResources.find(
        resource => resource.id === bookedResource.bookingResourceSetupId,
      )

      const roundedEstimatedTime = bookedResource.estimatedTime > MAX_ESTIMATED_TIME
        ? bookedResource.estimatedTime
        : roundUpTo30Minutes(bookedResource.estimatedTime || 0)

      this.savedFilters = {
        shopId:            this.shop_data.shop_id,
        isPeriodSelection: false,
        estimatedTime:     roundedEstimatedTime,
        bookingStartTime:  {
          timeOfDay: TIME_OF_DAY.ALL,
          startTime: 0,
          endTime:   0,
        },
        bookingResourceSetupIds: selectedResource
          ? [{ value: selectedResource.id, text: selectedResource.resource_name }]
          : [...this.resourcesOptions],
        fromDateTS:   0,
        toDateTS:     0,
        bookingDates: [bookingDateTs],
      }

      this.selectedBookedResource = bookedResource
      this.context.isFromSearchAvailableTimes = false
      this.context.isSearchAvailableTimesFromAhaAi = false
      this.context.isSearchAvailableTimesFromBookingItems = true
      this.modalStates.searchAvailableTimes = true
    },

    onShowAhaAiBookingItemsPopup({ bookedResource }) {
      this.selectedBookedResource = bookedResource
      this.modalStates.ahaAiBookingItems = true
    },

    onShowSetupPopup() {
      this.modalStates.ahaAiSetup = true
    },

    onConfirmSearchAvailableTimesFromAhaAi(resultData) {
      // Call API with queryParameters and open result modal
      this.callGetAvailableTimesAndOpenResult(resultData)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './calendar-aha-ai.scss';
</style>
