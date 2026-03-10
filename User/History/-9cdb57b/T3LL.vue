<template>
  <div class="booking-items">
    <div class="booking-items__container">
      <div class="booking-items__button-group">
        <div class="booking-items__text">
          {{ $t('bookings.select-items') }}
        </div>

        <button
          :disabled="isDisabled"

          type="button"
          class="booking-items__button"

          @click="() => handleAddBookingItemClick(serviceType)"
        >
          {{ $t('bookings.service') }}
        </button>

        <button
          v-if="isBookingItemsShown"

          :disabled="isDisabled"

          type="button"
          class="booking-items__button"

          @click="() => handleAddBookingItemClick(bookingType)"
        >
          {{ $t('bookings.booking-item') }}
          <!-- <b-icon-plus v-if="!isMobileDevice" class="booking-items__button-icon" /> -->
        </button>

        <div class="booking-items__actions-right">
          <a
            v-b-tooltip.hover.bottom
            :title="$t('aha-ai.search-available-times')"
            :class="actionSearchAvailableTimesClass"
            @click="onShowSearchAvailableTimesModal"
          >
            <b-icon-calendar-2-range-fill />
          </a>

          <a
            :class="actionVoiceClass"
            @click.prevent="onStartVoice"
          >
            <b-icon-mic />
          </a>
        </div>
      </div>

      <div
        v-if="hasBookedItems"
        class="booking-items__selected"
      >
        <ul class="booking-items__list">
          <li
            v-for="(bookedItem, index) in bookedItems"
            :key="`booked_item_${bookedItem.bookedItemId}_${index}`"
            class="booking-items__item"
          >
            <booking-item
              v-bind="bookedItem"
              class="biooking-items-action__booking-item"
              @remove="handleBookedItemRemove(bookedItem)"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// Utils
import { CalendarEventBus } from 'Modules/calendar/utils'

// Components
import { BIconPlus, BIconCalendar2RangeFill, BIconMic } from 'bootstrap-vue'
import BookingItem from '../booking-item/booking-item.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import BookingCacheMixin from 'Modules/cache/mixins/booking_cache'

// Constant
import { BOOKING_ITEM_TYPE, GOODS_STATUS } from 'Constant'

// Models
import BookedResource from 'Models/booking/bookedResource'

const MAX_BOOKED_ITEMS = 10

export default {
  components: {
    BIconPlus,
    BIconCalendar2RangeFill,
    BIconMic,
    BookingItem,
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    BookingCacheMixin,
  ],

  props: {
    enable: {
      type:    Boolean,
      default: true,
    },

    bookedItems: {
      type:    Array,
      default: () => [],
    },

    bookedResource: {
      type:    Object,
      default: () => new BookedResource(),
    },
  },

  data() {
    return {
      allCalendarSetup: null,
    }
  },

  computed: {
    isDisabled() {
      return !this.enable
    },

    serviceType() {
      return BOOKING_ITEM_TYPE.SERVICE_ITEM
    },

    bookingType() {
      return BOOKING_ITEM_TYPE.BOOKING_ITEM
    },

    hasBookedItems() {
      return this.bookedItems.length > 0
    },

    itemsCanBeAdded() {
      return MAX_BOOKED_ITEMS - Number(this.bookedItems.length || 0)
    },

    isBookingItemsShown() {
      const bookingItems = this.allCalendarSetup?.booking_items_setup?.items || []
      return bookingItems.find(bookingItem => bookingItem.status === GOODS_STATUS.ACTIVE)
    },

    actionVoiceClass() {
      return [
        'action',
        'action--voice',
      ]
    },

    actionSearchAvailableTimesClass() {
      return [
        'action',
        'action--search-available-times',
      ]
    },
  },

  async created() {
    this.allCalendarSetup = await this.$bookingCacheMixin_getAllCalendarSetup({
      shopId: this.shop_data.shop_id,
    })
  },

  methods: {
    handleAddBookingItemClick(itemType) {
      try {
        if(!this.itemsCanBeAdded) {
          throw new Error(this.$t('bookings.warning_can_not_exceed_booked_items_max', {
            items_max: MAX_BOOKED_ITEMS,
          }))
        }

        CalendarEventBus.$emit('select-items-on-booking', {
          itemType,
          itemVisible:     true,
          bookedResource:  this.bookedResource,
          itemsCanBeAdded: this.itemsCanBeAdded,
        })
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    handleBookedItemRemove(bookedItem) {
      this.$emit('booked-item-remove', bookedItem)
    },

    onShowSearchAvailableTimesModal() {
      CalendarEventBus.$emit('show-search-available-times-popup-from-booking-items', this.bookedResource)
    },

    onStartVoice() {
      // TODO: Implement voice functionality
    },
  },
}
</script>

<style lang="scss" scoped>
@import './booking-items.scss';
</style>
