<!-- Fix eslint Bug for spacings + css pre, pre-line after upgrade Node v20.18.1 : https://gitlab.com/ahasoft-leaders1/ahaplus-shop/-/issues/67 -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<template>
  <div
    ref="blocked-time"
    v-bind="$attrs"
    :style="blockedTimeStyle"
    :class="blockedTimeClass"
    v-on="$listeners"
    @click="handleMenuShow"
  >
    <div class="calendar-blocked-time__content">
      <div
        v-if="isNoteShown"
        class="calendar-blocked-time__notes"
      >{{ blockedTime.notes }}</div>

      <!-- <div class="calendar-blocked-time__duration">
        {{ startTimeText }} ~ {{ endTimeText }}
      </div> -->
    </div>

    <!-- <blocked-time-menu
      class="calendar-blocked-time__menu"

      @hide="handleMenuHide"
      @edit="handleBlockedTimeEdit"
      @mouseleave="handleClickOutside"
      @open-menu-options="handleMenuShow"
      @cancel="handleBlockedTimeCancel"
    /> -->

    <device-view
      is-desktop-device
      is-all-tablet-device
    >
      <blocked-time-resize
        v-if="isShowResizeBarTablet"
        :target="resizeTarget"
        :is-off-day="isOffDay"
        :blocked-time="blockedTime"

        class="calendar-blocked-time__resize"
        @start-resize="handleBlockTimeStartResize"
        @stop-resize="isBlockedTimeResizing = false"
      />
    <!-- start-resize and stop-resize - For future purpose: display duration time if needed -->
    </device-view>

    <ul
      v-show="isMenuShown"
      ref="menuBlockedTime"
      :style="blockTimePosition"
      class="calendar-blocked-time__menu-options"
    >
      <li
        v-for="menuOption in menuOptions"
        :key="menuOption.value"
      >
        <span @click="$emit(menuOption.event)">{{ menuOption.text }}</span>
      </li>
      <li v-if="isMobileAndTabletPortraitView">
        <!-- Close method is handleClickOutside -->
        <span><strong>x</strong> {{ $t('general.close') }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
// Utilities
import { mapGetters, mapState } from 'vuex'
import { isAmOrPm } from 'CommonHelpers'
import { convertTimeToMinutes, CalendarEventBus } from 'Modules/calendar/utils'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

// Components
import DeviceView from 'Modules/device/components/device-view'
import BlockedTimeMenu from './components/blocked-time-menu/blocked-time-menu.vue'
import BlockedTimeResize from './components/blocked-time-resize/blocked-time-resize.vue'

// Models
import BlockedTime from 'Models/blockedTime/blockedTime.js'

const MENU_WIDTH = 160
const MENU_HEIGHT = 76
const MENU_HEIGHT_MOBILE = 105
const LEFT_CONTAIN_MENU_POSITION = 10
const MENU_TABLET_DESKTOP_PADDING_BOTTOM = 16

export default {
  components: {
    DeviceView,
    BlockedTimeMenu,
    BlockedTimeResize,
  },

  mixins: [
    DeviceMixin,
  ],

  inject: ['startTime'],

  props: {
    isOffDay: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      isMenuShown:           false,
      isBlockedTimeResizing: false,
      blockTimePosition:     { top: 0, left: 0 },
      isShowResizeBarTablet: true,
    }
  },

  computed: {
    ...mapState('_calendar', [
      'timeSlot',
      'timeSlotHeight',
      'calendarDatesRef',
      'calendarSlotAccessOptions',
      'calendarDragPreviewElement',
      'isMouseMove',
    ]),

    ...mapState('_calendar/drag', {
      isDragging: 'isDragging',
    }),

    ...mapState('_calendar', {
      openingStartTime: 'startTime',
    }),

    ...mapGetters('_calendar', [
      'timeSlotWidth',
    ]),

    blockedTime() {
      return this.$attrs
    },

    blockedTimeClass() {
      return ['calendar-blocked-time', {
        'calendar-blocked-time--decrese-index': this.isDragging,
        'calendar-blocked-time--active':        this.isMenuShown,
        'calendar-blocked-time--resizing':      this.isBlockedTimeResizing,
        'calendar-blocked-time--no-overflow':   this.isMenuShown,
      }]
    },

    blockedStartTime() {
      return BlockedTime.getFromTimeInMinutes(this.blockedTime)
    },

    endTime() {
      return BlockedTime.getToTimeInMinutes(this.blockedTime)
    },

    startTimeText() {
      return isAmOrPm(this.startTime, false)
    },

    endTimeText() {
      return isAmOrPm(this.endTime, false)
    },

    isNoteShown() {
      return !!this.blockedTime.notes
    },

    timeSlotUnitHeight() {
      return Number(this.timeSlotHeight) / Number(this.timeSlot)
    },

    openingStartTimeInMinutes() {
      return convertTimeToMinutes(this.openingStartTime)
    },

    blockedTimeStyle() {
      // Calculate visible portion of blocked time (clip to opening time if blockedTime starts earlier)
      const visibleStartTime = Math.max(this.blockedStartTime, this.openingStartTimeInMinutes)
      const height = (this.endTime - visibleStartTime) * this.timeSlotUnitHeight
      const top = (Number(this.startTime) - Number(this.openingStartTimeInMinutes)) * this.timeSlotUnitHeight

      return {
        top:    `${top}px`,
        height: `${height}px`,
      }
    },

    resizeTarget() {
      return () => this.$refs['blocked-time']
    },

    menuOptions() {
      return [
        {value: 'cancel', event: 'cancel', text: this.$t('bookings.cancel-blocked-time')},
        {value: 'edit', event: 'edit', text: this.$t('bookings.edit-blocked-time')},
      ]
    },

    isMobileAndTabletPortraitView() {
      return this.isMobileDevice || (this.isAllTabletDevice && this.isPortraitMode)
    },
  },

  watch: {
    isMouseMove(isMouseMove) {
      if (isMouseMove) {
        this.isShowResizeBarTablet = true
      } else {
        this.isShowResizeBarTablet = false
      }
    },
  },

  created() {
    CalendarEventBus.$on('calendar-scroll', this.handleClickOutside)
    CalendarEventBus.$on('start-resize-blocked-time', this.handleBlockTimeStartResizeEventBus)
    document.addEventListener('mouseover', this.handleClickOutside)
  },

  mounted() {
    this.isShowResizeBarTablet = this.isAllTabletDevice && !this.isIpad ? false : true
  },

  beforeDestroy() {
    CalendarEventBus.$off('calendar-scroll', this.handleClickOutside)
    CalendarEventBus.$off('start-resize-blocked-time', this.handleBlockTimeStartResizeEventBus)
    document.removeEventListener('mouseover', this.handleClickOutside)
  },

  methods: {
    handleMenuHide() {
      this.isMenuShown = false
    },

    handleMenuShow(event) {
      if(this.calendarSlotAccessOptions) {
        return
      }
      const { clientX, clientY } = event
      const { top, left } = this.$refs['blocked-time'].getBoundingClientRect()

      let topPosition = clientY - top
      let leftPosition = clientX - left
      const height = this.isMobileDevice || (this.isAllTabletDevice && this.isPortraitMode) ? MENU_HEIGHT_MOBILE : MENU_HEIGHT
      // Adjust left and top position to ensure the menu does not overflow any edge of the window
      leftPosition = clientX + MENU_WIDTH > window.innerWidth ? leftPosition - MENU_WIDTH : leftPosition - LEFT_CONTAIN_MENU_POSITION // Add  pixel to contain menu

      topPosition = Math.max(0, clientY + height > window.innerHeight ? topPosition - height : topPosition)

      // Additional check for bottom edge overflow in specific conditions
      const calendarPaddingNeedtoBeExcluded = this.isDesktopDevice || this.isTabletDevice ? MENU_TABLET_DESKTOP_PADDING_BOTTOM : 0
      const checkMenuAtBottom = clientY + height > window.innerHeight - calendarPaddingNeedtoBeExcluded
      if (checkMenuAtBottom) {
        topPosition = clientY - top - height
      } else {
        topPosition = clientY - top
      }

      this.blockTimePosition = {
        top:  `${topPosition}px`,
        left: `${leftPosition}px`,
      }

      this.isMenuShown = !this.isMenuShown
    },

    handleBlockedTimeEdit() {
      this.$emit('edit')
    },

    handleBlockedTimeCancel() {
      this.$emit('cancel')
    },

    handleClickOutside(evt) {
      if (!this.$refs?.menuBlockedTime.contains(evt.target)) {
        this.isMenuShown = false
      }
    },

    handleTouchOutside() {
      if (this.isAllTabletDevice) {
        this.isMenuShown = false
      }
    },

    handleBlockTimeStartResize() {
      this.isBlockedTimeResizing = true
      this.isMenuShown = false
    },

    handleBlockTimeStartResizeEventBus() {
      this.isMenuShown = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./calendar-blocked-time.scss";
</style>
