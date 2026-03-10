<template>
  <b-modal
    ref="modalAhaAiResultAvailableTimes"
    :visible="visible"
    :modal-class="modalClass"
    :title="$t('aha-ai.search-available-times')"

    static
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    @show="onShow"
    @hide="onHide"
  >
    <!-- Top Header -->
    <div class="modal-aha-ai-result-available-times-top">
      <div class="content">
        <b>{{ formattedBookingDates }}</b>
        <p>
          <span>{{ estimatedTimeText }}</span>
          <span>{{ resourcesText }}</span>
          <span>{{ bookingStartTimeText }}</span>
        </p>
      </div>

      <a-button
        variant="primary"
        @click="onSelectAgain"
      >
        {{ $t('aha-ai.select-again') }}
      </a-button>
    </div>

    <!-- Body -->
    <div class="modal-aha-ai-result-available-times-body">
      <!-- Date Selected -->
      <div
        v-if="isShowBookingDate"
        class="date"
      >
        <b>{{ currentBookingDateText }}</b>
      </div>

      <!-- Empty Available Times -->
      <error-box
        v-if="!hasAvailableResources"
        class="mb-2"
        :errors="[$t('aha-ai.no-available-booking-times')]"
      />

      <!-- Available Times -->
      <template v-if="hasAvailableResources">
        <div
          v-for="resource in displayAvailableResources"
          :key="resource.id"
          class="available-time"
        >
          <p v-if="isShowResourceName">
            {{ resource.resourceName }}
          </p>
          <ul>
            <li
              v-for="(slot, index) in resource.availableStartTimes"
              :key="index"
              :class="{
                'is-recommended': slot.isRecommended,
                'is-not-recommended': slot.isNotRecommended,
              }"
              role="button"
              tabindex="0"
              @click="onSelectAvailableTime(resource, slot)"
              @keydown.enter="onSelectAvailableTime(resource, slot)"
              @keydown.space.prevent="onSelectAvailableTime(resource, slot)"
            >
              {{ slot.timeSlot.startTimeMinuteFormatted }}
            </li>
          </ul>
        </div>
      </template>

      <div class="explain">
        <div class="explain-item explain-item--recommended">
          <p>{{ $t('aha-ai.recommended') }}</p>
        </div>
        <div class="explain-item explain-item--not-recommended">
          <p>{{ $t('aha-ai.not-recommended') }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="modal-footer modal-aha-ai-result-available-times-footer">
      <a-button
        v-if="isShowBookingDate"
        variant="primary"
        :disabled="!canNavigatePrevious"
        @click="onPreviousAvailableDate"
      >
        <b-icon-arrow-left-short />
        {{ $t('aha-ai.previous-available-date') }}
      </a-button>

      <a-button
        v-if="isShowBookingDate"
        variant="primary"
        :disabled="!canNavigateNext"
        @click="onNextAvailableDate"
      >
        {{ $t('aha-ai.next-available-date') }}
        <b-icon-arrow-right-short />
      </a-button>

      <a-button
        variant="blue-light"
        @click="onCancel"
      >
        {{ $t('general.cancel') }}
      </a-button>
    </div>
  </b-modal>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ErrorBox from 'CommonComponents/form/error-box/error-box.vue'
import { BIconArrowLeftShort, BIconArrowRightShort } from 'bootstrap-vue'
// Constants
import { TIME_OF_DAY, MINUTES_OF_24H, BOOKING_ITEM_TYPE } from 'Constant'
// Models
import BookedItem from 'Models/booking/bookedItem'
// Utils
import { CalendarEventBus, formatTimeBasedOnMinutes } from 'Modules/calendar/utils/index'
import { convertTimeStampToDate, formatDate, guid } from 'CommonHelpers'
import { generateDateRangeTimestamps } from 'DatetimeHelpers'
// APIs
import { getAvailableTimes } from 'Modules/api/aha-ai/aha-ai-api'

// Event Constants
const EVENTS = {
  CANCEL:                      'cancel',
  SELECT_AGAIN:                'select-again-search-available-times-popup',
  CLOSE_CLIENT_INFO_ON_SELECT: 'close-client-information-when-select-available-time',
}

export default {
  extends: ComponentBase,

  components: {
    AButton,
    ErrorBox,
    BIconArrowLeftShort,
    BIconArrowRightShort,
  },

  mixins: [DeviceMixin],

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
    savedFilters: {
      type:    Object,
      default: null,
    },
    resultData: {
      type:    Object,
      default: null,
    },
    isSearchAvailableTimesFromBookingItems: {
      type:    Boolean,
      default: false,
    },
    selectedBookedResource: {
      type:    Object,
      default: null,
    },
    searchAvailableTimesItemsData: {
      type:    Object,
      default: null,
    },
  },

  data() {
    return {
      currentFilters:    null,
      currentResultData: null,
      currentDateIndex:  0, // Track current date index in sorted bookingDates
    }
  },

  computed: {
    ...mapState('_calendar', [
      'bookingResources',
    ]),

    ...mapState('_calendar/bookingAction/booking', {
      bookedResources: state => state.bookedResources,
    }),

    modalClass() {
      return ['modal-aha-ai-result-available-times', {
        'modal-aha-ai-result-available-times--mobile': this.isMobileDevice,
      }]
    },

    estimatedTimeOptions() {
      return [
        { text: `30 ${this.$t('aha-ai.minutes')}`, value: 30 },
        { text: `60 ${this.$t('aha-ai.minutes')}`, value: 60 },
        { text: `90 ${this.$t('aha-ai.minutes')}`, value: 90 },
        { text: `120 ${this.$t('aha-ai.minutes')}`, value: 120 },
        { text: `150 ${this.$t('aha-ai.minutes')}`, value: 150 },
        { text: `180 ${this.$t('aha-ai.minutes')}`, value: 180 },
        { text: `3 ${this.$t('aha-ai.hours')} 30 ${this.$t('aha-ai.minutes')}`, value: 210 },
        { text: `4 ${this.$t('aha-ai.hours')}`, value: 240 },
        { text: `4 ${this.$t('aha-ai.hours')} 30 ${this.$t('aha-ai.minutes')}`, value: 270 },
        { text: `5 ${this.$t('aha-ai.hours')}`, value: 300 },
        { text: `6 ${this.$t('aha-ai.hours')}`, value: 360 },
        { text: `7 ${this.$t('aha-ai.hours')}`, value: 420 },
        { text: `8 ${this.$t('aha-ai.hours')}`, value: 480 },
        { text: `9 ${this.$t('aha-ai.hours')}`, value: 540 },
        { text: `10 ${this.$t('aha-ai.hours')}`, value: 600 },
      ]
    },

    bookingStartTimeOfDayOptions() {
      return [
        { text: this.$t('aha-ai.all'), value: TIME_OF_DAY.ALL },
        { text: this.$t('aha-ai.morning'), value: TIME_OF_DAY.MORNING },
        { text: this.$t('aha-ai.afternoon'), value: TIME_OF_DAY.AFTERNOON },
        { text: this.$t('aha-ai.evening'), value: TIME_OF_DAY.EVENING },
        { text: this.$t('aha-ai.manual-selection'), value: TIME_OF_DAY.MANUAL_SELECTION },
      ]
    },

    formatPeriodBookingDate() {
      if(!this.currentFilters?.fromDateTS || !this.currentFilters?.toDateTS) return ''

      const fromDateTS = this.currentFilters.fromDateTS
      const toDateTS = this.currentFilters.toDateTS

      // If fromDateTS and toDateTS are the same, show only the date
      if(fromDateTS === toDateTS) {
        return formatDate(convertTimeStampToDate(fromDateTS, true))
      }

      // If fromDateTS and toDateTS are different, show the period
      const fromDate = convertTimeStampToDate(fromDateTS, true)
      const toDate = convertTimeStampToDate(toDateTS, true)

      return `${formatDate(fromDate)} ~ ${formatDate(toDate)}`
    },

    formatMultiBookingDate() {
      if (!this.navigableBookingDates.length) return ''

      // Convert timestamps to dates
      const dates = this.navigableBookingDates.map(timestamp =>
        convertTimeStampToDate(timestamp, true),
      )

      // Group dates by month/year and format
      const result = []
      let currentGroup = []
      let currentYear = null
      let currentMonth = null

      dates.forEach((date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = String(date.getDate()).padStart(2, '0')

        // If same month/year, add to current group
        if (year === currentYear && month === currentMonth) {
          currentGroup.push(day)
        } else {
          // Different month/year: save current group and start new one
          if (currentGroup.length > 0) {
            result.push(currentGroup.join(', '))
          }
          // Start new group with full date format
          const monthStr = String(month + 1).padStart(2, '0')
          currentGroup = [`${year}-${monthStr}-${day}`]
          currentYear = year
          currentMonth = month
        }
      })

      // Add the last group
      if (currentGroup.length > 0) {
        result.push(currentGroup.join(', '))
      }

      return result.join('\n')
    },

    formattedBookingDates() {
      return this.currentFilters?.isPeriodSelection
        ? this.formatPeriodBookingDate
        : this.formatMultiBookingDate
    },

    estimatedTimeText() {
      const option = this.estimatedTimeOptions.find(opt => opt.value === this.currentFilters?.estimatedTime)
      if(!option) return null

      return `${option.text} ${this.$t('aha-ai.booking')}`
    },

    resourcesText() {
      const resourceIds = this.currentFilters?.bookingResourceSetupIds
      if (!resourceIds?.length) return null

      if(resourceIds.length === this.bookingResources.length) {
        return this.$t('aha-ai.resource-not-assigned')
      }

      return resourceIds.map(item => item.text).join(', ')
    },

    bookingStartTimeText() {
      const timeOfDay = this.currentFilters?.bookingStartTime?.timeOfDay
      const option = this.bookingStartTimeOfDayOptions.find(opt => opt.value === timeOfDay)
      if(!option) return null

      if(option.value === TIME_OF_DAY.ALL) {
        return this.$t('aha-ai.time-not-specified')
      }

      if(option.value === TIME_OF_DAY.MANUAL_SELECTION) {
        const { startTime, endTime } = this.currentFilters.bookingStartTime
        if(startTime == null || endTime == null) return null

        const prefix = this.$t('general.next-day-text')
        const isStartTimeNextDay = startTime >= MINUTES_OF_24H
        const isEndTimeNextDay = endTime >= MINUTES_OF_24H
        const formattedStartTime = formatTimeBasedOnMinutes({ minutes: startTime, prefix, format: isStartTimeNextDay ? 'HH:mm' : 'hh:mm A' })
        const formattedEndTime = formatTimeBasedOnMinutes({ minutes: endTime, prefix, format: isEndTimeNextDay ? 'HH:mm' : 'hh:mm A' })

        return `${formattedStartTime} ~ ${formattedEndTime}`
      }

      return option.text
    },

    // Generate array of timestamps for navigation
    navigableBookingDates() {
      if (this.currentFilters?.isPeriodSelection) {
        // Generate dates from period (fromDateTS to toDateTS)
        const { fromDateTS, toDateTS } = this.currentFilters
        if (!fromDateTS || !toDateTS) return []

        return generateDateRangeTimestamps(fromDateTS, toDateTS)
      }

      // Use bookingDates array and sort
      if (!this.currentFilters?.bookingDates?.length) return []
      return [...this.currentFilters.bookingDates].sort((a, b) => a - b)
    },

    currentBookingDateTS() {
      if (!this.navigableBookingDates.length) return null
      return this.navigableBookingDates[this.currentDateIndex]
    },

    currentBookingDateText() {
      if (!this.currentBookingDateTS) return ''
      return formatDate(convertTimeStampToDate(this.currentBookingDateTS, true))
    },

    isShowBookingDate() {
      return this.currentFilters?.isPeriodSelection
        ? this.currentFilters?.fromDateTS !== this.currentFilters?.toDateTS
        : this.navigableBookingDates.length > 1
    },

    displayAvailableResources() {
      if (!this.currentResultData?.availableResources) return []

      return this.currentResultData.availableResources.map(resource => {
        const availableStartTimes = (resource.availableStartTimes || []).map(slot => ({
          ...slot,
          timeSlot: {
            ...slot.timeSlot,
            startTimeMinuteFormatted: formatTimeBasedOnMinutes({
              minutes: slot.timeSlot.startTimeMinute,
              prefix:  this.$t('general.next-day-text'),
              format:  slot.timeSlot.isNextDay ? 'HH:mm' : 'hh:mm A',
            }),
          },
        }))

        return {
          ...resource,
          availableStartTimes,
        }
      })
    },

    hasAvailableResources() {
      return this.currentResultData?.availableResources?.length > 0
    },

    numberOfResources() {
      return this.currentResultData?.bookingResourceSetupIds?.length ?? 0
    },

    isShowResourceName() {
      return this.numberOfResources === 0 || this.numberOfResources > 1
    },

    canNavigatePrevious() {
      return this.navigableBookingDates.length > 0 && this.currentDateIndex > 0
    },

    canNavigateNext() {
      return this.navigableBookingDates.length > 0
        && this.currentDateIndex < this.navigableBookingDates.length - 1
    },
  },

  methods: {
    ...mapActions('_calendar/bookingAction', [
      'openBookingActionBySlot',
    ]),

    ...mapActions('_calendar/bookingAction/booking', [
      'updateBookedResource',
      'addBookedItemsToBookedResource',
    ]),

    ...mapMutations('_calendar/bookingAction/booking', [
      'setBookingDateTS',
    ]),

    initializeDateIndex() {
      // Initialize currentDateIndex based on resultData or default to 0
      if (this.resultData?.bookingDateTS && this.navigableBookingDates.length) {
        const index = this.navigableBookingDates.findIndex(date => date === this.resultData.bookingDateTS)
        this.currentDateIndex = index !== -1 ? index : 0
      } else {
        this.currentDateIndex = 0
      }

      // Validate index is within bounds
      if (this.currentDateIndex >= this.navigableBookingDates.length) {
        this.currentDateIndex = Math.max(0, this.navigableBookingDates.length - 1)
      }
    },

    onShow() {
      this.currentFilters = this.savedFilters
      this.currentResultData = this.resultData
      this.initializeDateIndex()
    },

    onHide() {
      this.$emit(EVENTS.CANCEL)
    },

    onCancel() {
      this.$refs.modalAhaAiResultAvailableTimes.hide()
    },

    onSelectAgain() {
      this.$emit(EVENTS.SELECT_AGAIN)
    },

    navigateToDate(direction) {
      this.currentDateIndex += direction
      // Fetch available times for the date
      this.onFetchAvailableTimes({ bookingDates: [this.currentBookingDateTS] })
    },

    onPreviousAvailableDate() {
      if (!this.canNavigatePrevious) return
      this.navigateToDate(-1)
    },

    onNextAvailableDate() {
      if (!this.canNavigateNext) return
      this.navigateToDate(1)
    },

    async onFetchAvailableTimes(newFilters = {}) {
      try {
        this.preLoader()

        const bookingResourceSetupIds = this.currentFilters.bookingResourceSetupIds.map(resource => resource.value)
        const payload = {
          ...this.currentFilters,
          ...newFilters,
          bookingResourceSetupIds,
        }
        const response = await getAvailableTimes(payload)

        if(!response.data.isOK) {
          this._showDialogAlert(response.data.errorMessages)
          return
        }

        this.currentResultData = response.data.result
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async onSelectAvailableTime(resource, slot) {

      const selectedSlotData = {
        date:      convertTimeStampToDate(this.currentBookingDateTS, true),
        startTime: slot.timeSlot.startTimeMinute,
        resource:  {
          id:            resource.bookingResourceSetupId,
          resource_id:   resource.resourceId,
          resource_name: resource.resourceName,
        },
        estimatedTime: this.currentFilters.estimatedTime,
      }

      // TODO: Consider using Vuex state instead of DOM query to check modal visibility
      const isBookingActionModalOpen = !!document.querySelector('.booking-action__modal.show')
      if (this.isSearchAvailableTimesFromBookingItems && this.selectedBookedResource) {
        isBookingActionModalOpen
          ? await this.updateBookedResourceFromSlot(selectedSlotData)
          : await this.openBookingActionBySlot(selectedSlotData)
      } else {
        // Close modal-client-information before opening booking action
        CalendarEventBus.$emit(EVENTS.CLOSE_CLIENT_INFO_ON_SELECT)
        await this.openBookingActionBySlot(selectedSlotData)

        // Add booked items from search available times if available
        await this.addBookedItemsFromSearchAvailableTimes()
      }

      // Close modal-aha-ai-result-available-times
      this.onCancel()
    },

    async addBookedItemsFromSearchAvailableTimes() {
      if (!this.searchAvailableTimesItemsData) {
        return
      }

      const bookedItems = this.buildBookedItemsFromSearchAvailableTimes()
      if (bookedItems.length === 0) {
        return
      }

      // Get the first booked resource from the booking
      const bookedResource = this.bookedResources?.[0]
      if (!bookedResource) {
        return
      }

      try {
        await this.addBookedItemsToBookedResource({
          bookedItems,
          bookedResource,
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    buildBookedItemsFromSearchAvailableTimes() {
      const { servicesAndBookingItems, selectedServiceItems, selectedBookingItems } = this.searchAvailableTimesItemsData
      const bookedItems = []

      // Add exact match service items
      const exactServiceItems = servicesAndBookingItems?.servicesAndBookingItemsExactMatch?.serviceItems || []
      for (const serviceItem of exactServiceItems) {
        const bookedItem = this.createBookedItemFromService(serviceItem)
        bookedItems.push(bookedItem)
      }

      // Add exact match booking items
      const exactBookingItems = servicesAndBookingItems?.servicesAndBookingItemsExactMatch?.bookingItems || []
      for (const bookingItem of exactBookingItems) {
        const bookedItem = this.createBookedItemFromBookingItem(bookingItem)
        bookedItems.push(bookedItem)
      }

      // Add selected relative match service items
      if (selectedServiceItems) {
        for (const selectedServiceItem of Object.values(selectedServiceItems)) {
          const bookedItem = this.createBookedItemFromService(selectedServiceItem)
          bookedItems.push(bookedItem)
        }
      }

      // Add selected relative match booking items
      if (selectedBookingItems) {
        for (const selectedBookingItem of Object.values(selectedBookingItems)) {
          const bookedItem = this.createBookedItemFromBookingItem(selectedBookingItem)
          bookedItems.push(bookedItem)
        }
      }

      // Sort booked items by orderByInput
      return bookedItems.sort((a, b) => a.orderByInput - b.orderByInput)
    },

    createBookedItemFromService(service) {
      const bookedItem = new BookedItem()
      bookedItem.setIsNew(true)
      bookedItem.bookedRefId = service.serviceId
      bookedItem.bookedRefName = service.serviceName
      bookedItem.orderByInput = service.orderByInput
      bookedItem.bookedType = BOOKING_ITEM_TYPE.SERVICE_ITEM
      bookedItem.setEsimatedTime(service.estimatedTime ?? 0)
      return bookedItem
    },

    createBookedItemFromBookingItem(bookingItem) {
      const bookedItem = new BookedItem()
      bookedItem.setIsNew(true)
      bookedItem.bookedRefId = bookingItem.id
      bookedItem.bookedRefName = bookingItem.bookingItemName
      bookedItem.orderByInput = bookingItem.orderByInput
      bookedItem.bookedType = BOOKING_ITEM_TYPE.BOOKING_ITEM
      bookedItem.setEsimatedTime(bookingItem.estimatedTime ?? 0)
      return bookedItem
    },

    async updateBookedResourceFromSlot(selectedSlotData) {
      try {
        const updatedBookedResource = this.selectedBookedResource.clone()

        // Update booking resource properties
        // Note: startTimeInMinutes setter automatically updates startTime and isNextDay
        // From: src/models/booking/bookedResource.js ( lines 48-51 )
        updatedBookedResource.startTimeInMinutes = selectedSlotData.startTime
        updatedBookedResource.bookingResourceSetupId = selectedSlotData.resource.id

        // Replace bookedItems with new items from searchAvailableTimesItemsData
        if (this.searchAvailableTimesItemsData) {
          const newBookedItems = this.buildBookedItemsFromSearchAvailableTimes()
          // Set bookedItemId for each item (similar to addBookedItemsToBookedResource in store)
          for (const bookedItem of newBookedItems) {
            bookedItem.bookedItemId = guid()
          }
          updatedBookedResource.bookedItems = newBookedItems
          // Recalculate estimatedTime based on bookedItems
          updatedBookedResource.estimatedTime = updatedBookedResource.bookedItemsEstimatedTime
        } else {
          updatedBookedResource.estimatedTime = selectedSlotData.estimatedTime
        }

        // Update booking date if selected date is different
        this.setBookingDateTS(this.currentBookingDateTS)

        await this.updateBookedResource(updatedBookedResource)
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },
  },
}
</script>

<style lang="scss">
@import './modal-aha-ai-result-available-times.scss';
</style>
