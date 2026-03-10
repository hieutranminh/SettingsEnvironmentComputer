<!-- Fix eslint Bug for spacings + css pre, pre-line after upgrade Node v20.18.1 : https://gitlab.com/ahasoft-leaders1/ahaplus-shop/-/issues/67 -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<template>
  <div
    ref="bookings"
    class="bookings"
  >
    <div class="bookings__total">
      {{ $t('sales-booking-tab.all', { records: totalItems }) }}
    </div>
    <slot name="view-old-data" />
    <div class="bookings__container">
      <!-- Mobile -->
      <div
        v-if="isMobileDevice || isAndroidSmallTablet"
        class="bookings__wrapper"
      >
        <template v-if="items.length">
          <div
            v-for="booking in items"
            :key="booking.bookingId"
            :class="{'booking__inner--active': booking.bookingId === selectedBookingId}"
            class="booking__inner"
            @click="handleBookingClick(booking.bookingId)"
          >
            <!-- bookingDate -->
            <div v-html="checkShowBookingDataEarly(booking.bookingDate, booking.bookedResources)" />

            <!-- bookingResource -->
            <template v-for="bookedResource in booking.bookedResources">
              <p
                v-for="item in bookedResource.bookedItems"
                :key="item.bookedItemId"
                class="booked__resources"
              >
                {{ item.bookedRefName }} <span>{{ bookedResource.resourceName }}</span><br>
              </p>
            </template>

            <!-- notes -->
            <div
              class="booking__notes"
              @click="handleShowPopupNotes(booking)"
            ><span>{{ booking.notes }}</span></div>

            <!-- Expanded data-->
            <template v-if="expandedIds.includes(booking.bookingId)">
              <!-- status -->
              <p class="booking__status">
                {{ $t('general.status') }}: <a-booking-status-text :booking="booking" />
              </p>

              <!-- registeredDate -->
              <p class="booking__registered-date">
                {{ $t('sales-booking-tab.registered-date') }}: {{ booking.registrationDateTS | formatDate }}
              </p>
            </template>

            <!-- Action show more -->
            <div
              :class="{'booking__show-more--active': expandedIds.includes(booking.bookingId)}"
              class="booking__show-more"
              @click="handleShowMoreClick(booking.bookingId)"
            >
              >
            </div>
          </div>
        </template>

        <template v-else>
          <div class="booking__table-empty">
            {{ $t('general.table-empty') }}
          </div>
        </template>
      </div>

      <!-- Desktop -->
      <table
        v-else
        v-fix-header
        class="bookings__table thead-sticky"
      >
        <thead>
          <tr>
            <th v-if="hasChainAndShareClient">{{ $t('general.loc') }}</th>
            <th>{{ $t('sales-booking-tab.booking-date') }}</th>
            <th>{{ $t('sales-booking-tab.booking-time') }}</th>
            <th>{{ $t('sales-booking-tab.booking-items') }}</th>
            <th>{{ $t('sales-booking-tab.resource-name') }}</th>
            <th>{{ $t('sales-booking-tab.status') }}</th>
            <th>{{ $t('sales-booking-tab.registered-date') }}</th>
            <th width="18%">{{ $t('sales-booking-tab.notes') }}</th>
          </tr>
        </thead>

        <template v-if="!hasBookings">
          <tbody>
            <tr>
              <td :colspan="!hasChainAndShareClient ? '7' : '8'">{{ $t('general.table-empty') }}</td>
            </tr>
          </tbody>
        </template>
        <template>
          <tbody
            v-for="booking in items"
            :key="`booking_${booking.bookingId}`"
          >
            <tr
              v-for="(bookedResource, index) in booking.bookedResources"
              :key="`booked_resource__${bookedResource.bookedResourceId}`"
            >
              <td
                v-if="hasChainAndShareClient && index === 0"
                :rowspan="booking.bookedResources.length"
              >
                <div
                  v-b-tooltip.hover.right
                  :title="booking.shopName"
                >
                  {{ getBranchNumber(booking.branchNumber, booking.shopId) }}
                </div>
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
              >
                {{ booking.bookingDateTS | formatDate }}
              </td>

              <td>
                <p>
                  <small v-if="bookedResource.isNextDay">{{ $t('general.next-day-text') }}</small>
                  {{ bookedResource.startTime | formatStartTime }}
                </p>
                <p v-if="isRepeatBooking(booking)">({{ $t('booking-list.repeat') }})</p>
              </td>

              <td>
                <ul class="bookings__booked-items">
                  <li
                    v-for="bookedItem in bookedResource.bookedItems"
                    :key="`booked_item_${bookedItem.bookedItemId}`"
                  >
                    {{ bookedItem.bookedRefName }}
                  </li>
                </ul>
              </td>

              <td>{{ bookedResource.resourceName }}</td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
              >
                <a-booking-status-text :booking="booking" />
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
              >
                <div
                  :ref="`booking_date_${booking.bookingId}`"
                  class="bookings__booking-date"
                >{{ booking.createdDateTimeTS | formatByDate }}</div>
                <b-tooltip
                  :target="getBookingDateTargetRef(booking)"

                  placement="bottom"
                  boundary="registered-date"
                >
                  <div class="bookings__booking-date-tooltip text-left">
                    <span>{{ $t('sales-booking-tab.registered-by') }}</span> <span>{{ booking.createdByName }}</span><br>
                    {{ booking.registrationDateTS | formatByDate }}
                  </div>
                </b-tooltip>
              </td>

              <td
                v-if="index === 0"
                :rowspan="formatRowSpan(booking)"
                class="bookings__notes"
                @click="handleShowPopupNotes(booking)"
              >
                <template v-if="booking.notes">
                  <aha-note-with-tooltip
                    :value="booking.notes"
                    :tooltip-id="`bookings__notes-tooltip-${booking.bookingId}`"
                    placement="left"
                    custom-class="bookings__notes-tooltip"
                  />
                </template>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>

    <pagination
      :pagination="pagination"
      @change-page="$emit('change-page', $event)"
    />
  </div>
</template>

<script>
// Utilities
import {mapGetters} from 'vuex'
import { getBranchNumber, formatByDate } from 'CommonHelpers'
import { convertTimestampToMomentUTC } from 'Modules/calendar/utils'
import { getEarliestBookingResourceTime } from 'Utils/booking-utils'

// Components
import { options } from 'OptionsHelpers'
import Pagination from 'CommonComponents/pagination/pagination.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ABookingStatusText from 'Modules/aha/a-booking-status-text/a-booking-status-text.vue'
import AhaNoteWithTooltip from 'CommonComponents/aha-note-with-tooltip/aha-note-with-tooltip.vue'

export default {
  filters: {
    formatDate(dateTS, formatter = 'YYYY-MM-DD') {
      return convertTimestampToMomentUTC(dateTS).format(formatter)
    },

    formatStartTime(startTime) {
      const [hour, minute] = startTime.split(':')
      return `${hour}:${minute}`
    },

    formatByDate(value) {
      return formatByDate(value)
    },
  },

  components: {
    Pagination,
    ABookingStatusText,
    AhaNoteWithTooltip,
  },

  extends: ComponentBase,

  props: {
    items: {
      type:    Array,
      default: () => [],
    },

    pagingInfo: {
      type:    Object,
      default: () => ({
        pageSize:   0,
        pageNumber: 0,
        totalItems: 0,
      }),
    },
  },

  data() {
    return {
      options,
      expandedIds:       [],
      selectedBookingId: null,
    }
  },

  computed: {
    ...mapGetters('device', ['isMobileDevice', 'isAndroidSmallTablet']),

    pagination() {
      return {
        page_size:   this.pagingInfo.pageSize,
        page_number: this.pagingInfo.pageNumber,
        total_items: this.pagingInfo.totalItems,
        total_pages: Math.ceil(this.pagingInfo.totalItems / this.pagingInfo.pageSize),
      }
    },

    totalItems() {
      return this.pagingInfo.totalItems
    },

    hasBookings() {
      return this.items.length > 0
    },

    hasChainAndShareClient () {
      return this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client
    },
  },

  methods: {
    getBranchNumber,
    getNotesTargetRef(booking) {
      return () => this.$refs?.[`notes_${booking.bookingId}`][0]
    },

    getBookingDateTargetRef(booking) {
      return () => this.$refs?.[`booking_date_${booking.bookingId}`][0]
    },

    formatRowSpan(booking) {
      return booking?.bookedResources?.length ?? 1
    },

    isRepeatBooking(booking) {
      return !!booking.originalBookingId
    },

    handleShowPopupNotes(booking) {
      this.$emit('show-popup-notes', booking)
    },

    handleBookingClick(bookingId) {
      this.selectedBookingId = bookingId
    },

    handleShowMoreClick(bookingId) {
      const index = this.expandedIds.indexOf(bookingId)

      if (index > -1) {
        this.expandedIds.splice(index, 1)
      } else {
        this.expandedIds.push(bookingId)
      }
    },

    checkShowBookingDataEarly(bookingDate, bookingResource) {
      const result = getEarliestBookingResourceTime(bookingDate, bookingResource)
      if(result?.isNextDay) {
        return `<p>${result.dateString} <span>${this.app_language == options.language.korean ? '익일 ' : '+D1 '}</span><span>${result.timeString}</span></p>`
      } else{
        return `<p>${result.dateString} <span>${result.timeString}</span></p>`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./client-bookings.scss";
</style>
