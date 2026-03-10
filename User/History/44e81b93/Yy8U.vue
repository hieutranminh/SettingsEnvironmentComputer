<template>
  <div :class="bookedResourceClass">
    <div class="booked-resource__container">
      <a-form-col class="booked-resource__resource-form">
        <div class="booked-resource__form-group booked-resource__form-group--resource-name">
          <a-form-field
            :name="`bookedResources.${index}.bookingResourceSetupId`"
            class="booking-resource__form-control"
          >
            <template #default="{ onChange }">
              <a-form-control :label="$t('bookings.resource')">
                <select-resource
                  :exclude="bookedResourceIds"
                  :placeholder="$t('general.search')"
                  :value="bookedResource.bookingResourceSetupId"
                  @select-resource-mounted="handleSelectResourceMounted($event)"
                  @input="event => onChange(handleBookingResourceSetupChange)(event)"
                />
              </a-form-control>
              <div class="booked-resource__group-button">
                <aha-button
                  :disabled="isOutOfResource"
                  variant="white"
                  class="booked-resources__btn-add"
                  @click="$emit('add-booked-resource')"
                >
                  +
                </aha-button>
                <aha-button
                  v-if="deletable"
                  variant="white"
                  class="booked-resources__btn-remove"
                  @click.prevent="handleRemoveBookedResourceClick"
                >
                  x
                </aha-button>
              </div>
            </template>
          </a-form-field>
        </div>

        <div class="booked-resource__form-group-wrapper">
          <div class="booked-resource__form-group">
            <a-form-control :label="$t('bookings.start-time')">
              <select-start-time
                :value="bookedResource.startTimeInMinutes"
                @input="handleStartTimeChange"
              />
            </a-form-control>
          </div>

          <div class="booked-resource__form-group">
            <a-form-control :label="$t('bookings.estimated-time')">
              <select-estimated-time
                :value="bookedResource.estimatedTime"
                @input="handleEsimatedTimeChange"
              />
            </a-form-control>
          </div>
        </div>
      </a-form-col>

      <div class="divider pb-2" />

      <div class="booked-resource__booking-items">
        <booking-items
          :enable="isEnableBookedItems"
          :has-repeat-booking="hasRepeatBooking"
          :booking-date-ts="bookingDateTS"
          :booked-resource="bookedResource"
          :booked-items="bookedResource.bookedItems"
          @booked-item-remove="handleBookedItemRemove"
        />
      </div>
    </div>
    <!-- <a v-if="deletable" class="booked-resource__remove" @click.prevent="handleRemoveBookedResourceClick">
      <b-icon-trash class="booked-resource__remove-icon" />
    </a> -->
  </div>
</template>

<script>
// Utilities
import { mapActions, mapState } from 'vuex'

// Components
import { BIconTrash } from 'bootstrap-vue'
import BookingItems from '../booking-items/booking-items.vue'
import SelectResource from '../select-resource/select-resource.vue'
import SelectStartTime from '../select-start-time/select-start-time.vue'
import { AFormField, AFormControl, AFormCol } from 'Modules/aha/a-form/a-form'
import SelectEstimatedTime from '../select-estimated-time/select-estimated-time.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

// Models
import BookedResource from 'Models/booking/bookedResource'

export default {
  components: {
    AFormCol,
    AFormField,
    AFormControl,

    BIconTrash,
    BookingItems,
    SelectResource,
    SelectStartTime,
    SelectEstimatedTime,
  },

  mixins: [DeviceMixin],

  props: {
    index: {
      type:    Number,
      default: 0,
    },

    deletable: {
      type:    Boolean,
      default: true,
    },

    bookedResource: {
      type:    Object,
      default: () => new BookedResource(),
    },
  },

  data() {
    return {
      bookingResourceSetup: [],
    }
  },

  computed: {
    ...mapState('_calendar/bookingAction', [
      'booking',
    ]),

    ...mapState('_calendar', [
      'timeSlot',
    ]),

    isEnableBookedItems() {
      return !!this.bookedResource.bookingResourceSetupId
    },

    bookedResourceClass() {
      return ['booked-resource', {
        'booked-resource--mobile': this.isMobileDevice,
      }]
    },

    bookedResources() {
      return this.booking?.bookedResources ?? []
    },

    bookedResourceIds() {
      return this.bookedResources.map(bookedResource => bookedResource.bookingResourceSetupId)
    },

    isOutOfResource () {
      return this.bookingResourceSetup.length === this.bookedResourceIds.filter(Boolean).length
    },

    hasRepeatBooking() {
      console.log('this.booking', this.booking)
      return !!this.booking?.originalBookingId || (this.booking?.repeatBooking && this.booking?.repeatBooking?.repeatTimes > 0)
    },

    bookingDateTS() {
      return this.booking?.bookingDateTS
    },
  },

  methods: {
    ...mapActions('_calendar/bookingAction/booking', [
      'updateBookedResource',
      'removeBookedResource',
      'removeBookedItemFromBookedResource',
    ]),

    updateBookedResourceByField(field, value) {
      const bookedResource = new BookedResource()
      bookedResource.copy(this.bookedResource)

      if(field === 'startTime') {
        bookedResource.startTimeInMinutes = value
      } else {
        bookedResource[field] = value
      }

      this.updateBookedResource(bookedResource)
    },

    handleStartTimeChange(startTime) {
      this.updateBookedResourceByField('startTime', startTime)
    },

    handleEsimatedTimeChange(estimatedTime) {
      this.updateBookedResourceByField('estimatedTime', estimatedTime)
    },

    handleBookingResourceSetupChange(bookingResourceSetupId) {
      this.updateBookedResourceByField('bookingResourceSetupId', bookingResourceSetupId)
    },

    handleRemoveBookedResourceClick() {
      this.removeBookedResource(this.bookedResource)
    },

    handleBookedItemRemove(bookedItem) {
      this.removeBookedItemFromBookedResource({
        bookedItem,
        bookedResource: this.bookedResource,
      })
    },

    handleSelectResourceMounted(bookingSetup) {
      this.bookingResourceSetup = bookingSetup.booking_resources_setup.items
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./booked-resource.scss";
</style>
