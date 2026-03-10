<template>
  <div class="calendar-setup-menu">
    <calendar-search-client
      v-if="!isMobileDevice"
    />

    <calendar-aha-ai />

    <a-dropdown
      v-bind="$attrs"
      :options="options"
      :class="setupClass"
      :drop-list="dropList"
      placement="right"
      v-on="$listeners"
    >
      <template #toggle="{ toggle }">
        <a
          :class="[
            'setup__toggle',
            {
              'setup__toggle--disabled': isActionsNotAllowed,
            }
          ]"
          @click="!isActionsNotAllowed && toggle()"
        >
          <img
            :src="calendarSetupMenu"
            alt="setup-menu"
          >
        </a>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
// Utilities
import { mapState } from 'vuex'
import {sales_options} from 'Options/sales-options'
import { isPermittedBySetupRole } from 'CommonHelpers'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

// Components
import { BIconList } from 'bootstrap-vue'
import ADropdown from 'Modules/aha/a-dropdown/a-dropdown.vue'
import CalendarSearchClient from 'Modules/calendar/components/calendar/calendar-setup/components/calendar-search-client/calendar-search-client.vue'

export default {
  components: {
    BIconList,
    ADropdown,
    CalendarSearchClient,
  },

  mixins: [
    DeviceMixin,
  ],

  props: {
    dropList: {
      type:    Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState('_calendar', [
      'isCalendarSlotAccessible',
    ]),

    isActionsNotAllowed() {
      return this.isCalendarSlotAccessible
    },

    setupClass() {
      return ['setup', {
        'setup--mobile': this.isMobileDevice,
      }]
    },

    options_master() {
      if(localStorage.getItem('hideWaiting') === 'true') {
        let options = [
          { value: 'booking-list', text: this.$t('bookings.booking-list'), event: 'open-booking-list' },
          { value: 'booking-deposit-list', text: this.$t('booking-deposit.booking-deposit-list'), event: 'open-booking-deposit-list'},
          { value: 'calendar', text: this.$t('bookings.work-calendar'), event: 'open-work-calendar' },
          { value: 'setup', text: this.$t('bookings.setup'), event: 'go-to-setup' },
        ]

        // Add "notes" before "setup" if isMobileDevice is true
        if (this.isMobileDevice || (this.isAndroidSmallTablet && this.isPortraitMode)) {
          options.splice(options.length - 1, 0, { value: 'notes', text: this.$t('bookings.notes'), event: 'open-notes' })
        }

        return options
      }

      let options = [
        { value: 'booking-list', text: this.$t('bookings.booking-list'), event: 'open-booking-list' },
        { value: 'add-waiting', text: this.$t('bookings.add-waiting'), event: 'add-waiting-click' },
        { value: 'waiting-list', text: this.$t('bookings.waiting-list'), event: 'open-waiting-list'},
        { value: 'booking-deposit-list', text: this.$t('booking-deposit.booking-deposit-list'), event: 'open-booking-deposit-list'},
        { value: 'calendar', text: this.$t('bookings.work-calendar'), event: 'open-work-calendar' },
        { value: 'setup', text: this.$t('bookings.setup'), event: 'go-to-setup' },
      ]

      // Add "notes" before "setup" if isMobileDevice is true
      if (this.isMobileDevice || (this.isAndroidSmallTablet && this.isPortraitMode)) {
        options.splice(options.length - 1, 0, { value: 'notes', text: this.$t('bookings.notes'), event: 'open-notes' })
      }

      return options
    },

    options_staff() {
      let options = [
        { value: 'booking-list', text: this.$t('bookings.booking-list'), event: 'open-booking-list' },
        { value: 'add-waiting', text: this.$t('bookings.add-waiting'), event: 'add-waiting-click' },
        { value: 'waiting-list', text: this.$t('bookings.waiting-list'), event: 'open-waiting-list'},
        { value: 'booking-deposit-list', text: this.$t('booking-deposit.booking-deposit-list'), event: 'open-booking-deposit-list'},
        { value: 'calendar', text: this.$t('bookings.work-calendar'), event: 'open-work-calendar' },
        { value: 'setup', text: this.$t('bookings.setup'), event: 'go-to-setup' },
      ]

      // Add "notes" before "setup" if isMobileDevice is true
      if (this.isMobileDevice || (this.isAndroidSmallTablet && this.isPortraitMode)) {
        options.splice(options.length - 1, 0, { value: 'notes', text: this.$t('bookings.notes'), event: 'open-notes' })
      }

      return options
    },

    options() {
      return this.isPermittedBySetupRole(sales_options.security_level_enum.manager_or_higher)
        ? this.options_master
        : this.options_staff
    },

    calendarSetupMenu() {
      if(this.isMobileDevice) {
        return 'template/images/menu-mobile.svg'
      }
      return 'template/images/calendar-menu-pc.svg'
    },
  },

  methods: {
    isPermittedBySetupRole,
  },
}
</script>

<style lang="scss" scoped>
@import './calendar-setup-menu.scss';
</style>
