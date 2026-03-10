<template>
  <div class="booked-resources">
    <ul class="booked-resources__list">
      <li
        v-for="(bookedResource, index) in bookedResources"
        :key="`booked_resource_${bookedResource.bookedResourceId}_${index}`"
        class="booked-resources__item"
      >
        <booked-resource
          :index="index"
          :deletable="isDeletable"
          :booked-resource="bookedResource"
          :has-repeat-booking="hasRepeatBooking"
          @add-booked-resource="handleAddBookedResourceClick"
        />
      </li>
    </ul>

    <!-- <b-button
      v-if="isAddable"
      variant="outline-primary"
      class="booked-resources__btn-add"
      @click.prevent="handleAddBookedResourceClick"
    >
      +
    </b-button> -->
  </div>
</template>

<script>
// Utilities
import { guid } from 'CommonHelpers'
import { mapActions, mapState } from 'vuex'

// Components
import BookedResource from '../booked-resource/booked-resource.vue'

// Model
import BookedResourceModel from 'Models/booking/bookedResource'

export default {
  components: {
    BookedResource,
  },

  computed: {
    ...mapState('_calendar', [
      'timeSlot',
      'bookingResources',
    ]),

    ...mapState('_calendar/bookingAction', [
      'booking',
    ]),

    bookedResources() {
      return this.booking?.bookedResources ?? []
    },

    isAddable() {
      return this.bookedResources.length < this.bookingResources.length
    },

    isDeletable() {
      return this.bookedResources.length > 1
    },

    hasRepeatBooking() {
      return this.booking?.repeatBooking && this.booking?.repeatBooking?.repeatTimes > 0
    },
  },

  methods: {
    ...mapActions('_calendar/bookingAction/booking', [
      'addBookedResource',
    ]),

    handleAddBookedResourceClick() {
      const bookedResource = new BookedResourceModel()
      bookedResource.bookedResourceId = guid()
      if (this.bookedResources.length > 0) {
        const [firstBookedResource] = this.bookedResources
        bookedResource.startTime = firstBookedResource.startTime
        bookedResource.isNextDay = firstBookedResource.isNextDay
        bookedResource.estimatedTime = this.timeSlot
      }
      bookedResource.setIsNew(true)
      bookedResource.setDefaultEstimatedTime(this.timeSlot)
      this.addBookedResource(bookedResource)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './booked-resources.scss';
</style>

