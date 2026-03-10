<template>
  <div>
    <!-- Modal - Work Calendar -->
    <b-modal
      :visible="visible"
      :no-enforce-focus="true"
      :modal-class="modalClass"
      :title="$t('bookings.work-calendar')"
      no-close-on-esc
      no-close-on-backdrop

      static
      hide-footer

      @hide="onCancel()"
      @show="onLoadForm()"
    >
      <!-- Header -->
      <div class="work-calendar__header">
        <!-- Month picker / Select resource -->
        <div class="work-calendar__header-filter">
          <div class="work-calendar__month-picker">
            <month-picker
              :has-navigation="true"
              :default-value="monthValue"
              @on-change-month="onChangeMonth($event)"
            />
          </div>

          <div class="work-calendar__select-resource">
            <a-multi-select
              v-model="_filterResourceId"
              :options="optionsResource"
              :multiple="true"
              :searchable="false"
              :show-labels="false"
              :allow-empty="false"

              label="text"
              track-by="value"
            />
          </div>
        </div>

        <!-- Title -->
        <div class="work-calendar__header-title">
          <h3>{{ $t('bookings.work-calendar') }}</h3>
        </div>

        <!-- Actions -->
        <div class="work-calendar__header-actions">
          <a-button
            class="btn-add"
            variant="primary"
            @click="openWorkScheduleSetup(filterResourceId)"
          >
            {{ $t('bookings.add-edit-work-schedule') }}
          </a-button>

          <a-button
            class="btn-print"
            variant="primary"
            @click="openPrintWorkCalendar"
          >
            {{ $t('general.print') }}
          </a-button>
        </div>
      </div>

      <!-- Body -->
      <div
        ref="workCalendarPrintPreview"
        class="work-calendar__body"
      >
        <work-calendar
          ref="workCalendar"
          :key="uidToReRenderWorkCalendar"
          :data-shop-regular-off-days="shopRegularOffDays"
          :data-shop-specific-off-days="shopSpecificOffDays"
          :data-resource-setup-days="resourceSetupDays"
          :filter-resource-id="filterResourceId"
          @on-resource-regular-off-day-clicked="handleResourceRegularOffDayClicked"
          @on-resource-specific-working-day-clicked="handleResourceSpecificWorkingDayClicked"
        />
      </div>

      <!-- Footer -->
      <div class="work-calendar__footer">
        <div class="work-calendar__footer-left">
          <p
            v-if="!isStaffRole"
            @click="onClickDescriptionLink"
            v-html="messageNoteWorkCalendar"
          />
        </div>

        <div class="work-calendar__footer-right">
          <ul>
            <li class="annotate-regular-off-day">
              <span />
              {{ $t('bookings.regular-off-day') }}
            </li>
            <li class="annotate-specific-off-day">
              <span />
              {{ $t('bookings.specific-off-day') }}
            </li>
            <li class="annotate-specific-working-day">
              <span />
              {{ $t('bookings.specific-working-day') }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Action -->
      <div class="work-calendar__actions">
        <a-button
          variant="blue-light"
          @click="onCancel"
        >
          {{ $t('general.close') }}
        </a-button>
      </div>
    </b-modal>

    <!-- Modal - Work Schedule Setup -->
    <modal-work-schedule-setup
      :visible="isWorkScheduleSetupModalVisible"
      :filter-resource-id="currentFilterResourceId"
      :current-specific-day-type="currentSpecificDayType"
      :current-work-calendar-day="currentWorkCalendarDay"
      :from-page="defaultFromPage"
      @cancel="onHideModalWorkScheduleSetup"
    />

    <!-- Modal - Print Preview -->
    <report-print-preview-modal
      :header_text="workCalendarHeaderText"
      :print_sections="workCalendarPrintSections"
      :modal_id="workCalendarPrintPreviewModalId"
      :only_pdf="true"
    />
  </div>
</template>

<script>
import moment from 'moment'
// Store
import { mapActions, mapGetters, mapState } from 'vuex'
// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import AMultiSelect from 'Modules/aha/a-multi-select/a-multi-select.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import MonthPicker from 'Modules/calendar/components/work-calendar/partials/month-picker/month-picker.vue'
import WorkCalendar from 'Modules/calendar/components/work-calendar/partials/work-calendar/work-calendar.vue'
import ModalWorkScheduleSetup from 'Modules/calendar/components/work-calendar/modal-work-schedule-setup/modal-work-schedule-setup.vue'
import ReportPrintPreviewModal from 'CommonComponents/report-print-preview-modal/report-print-preview-modal.vue'
// Constants
import { SPECIFIC_DAY_TYPE, STANDARD_DATE_FORMAT } from 'Constant'
import print_options from 'Options/print-options'

const DEFAULT_SHOP_FILTER = -1

export default {
  components: {
    AMultiSelect,
    ReportPrintPreviewModal,
    AButton,
    MonthPicker,
    WorkCalendar,
    ModalWorkScheduleSetup,
  },

  extends: ComponentBase,

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      monthValue:                      new Date(),
      uidToReRenderWorkCalendar:       String(new Date().getTime()),
      filterResourceId:                DEFAULT_SHOP_FILTER,
      currentClickedResourceId:        DEFAULT_SHOP_FILTER,
      currentSpecificDayType:          SPECIFIC_DAY_TYPE.OFF_DAY,
      currentWorkCalendarDay:          null,
      isWorkScheduleSetupModalVisible: false,
      workCalendarPrintPreviewModalId: 'report-print-preview-modal',
      defaultFromPage:                 {
        month: new Date().getMonth() + 1,
        year:  new Date().getFullYear(),
      },
      filterParams: {
        shopId: '',
        year:   null,
        month:  null,
      },
      workCalendarPrintSections: [],
    }
  },

  computed: {
    // States
    ...mapState('_calendar', ['bookingResources']),

    // Getters
    ...mapGetters('device', [
      'isMobileDevice',
      'isAllTabletDevice',
      'isPortraitMode',
      'isLandscapeMode',
    ]),
    ...mapGetters('_calendar/workCalendar', ['getWorkCalendarSetupData']),

    isTabletPortraitDevice() {
      return this.isAllTabletDevice && this.isPortraitMode
    },

    isTabletLandscapeDevice() {
      return this.isAllTabletDevice && this.isLandscapeMode
    },

    modalClass() {
      return ['work-calendar', {
        'work-calendar--mobile':           this.isMobileDevice,
        'work-calendar--tablet':           this.isAllTabletDevice,
        'work-calendar--tablet-portrait':  this.isTabletPortraitDevice,
        'work-calendar--tablet-landscape': this.isTabletLandscapeDevice,
      }]
    },

    isShopOption () {
      return this.filterResourceId === DEFAULT_SHOP_FILTER
    },

    optionsResource() {
      const defaultOption = { value: DEFAULT_SHOP_FILTER, text: this.$t('bookings.filter-shop') }
      const resourcesItemActives = this.bookingResources.map(item => ({ value: item.id, text: item.resource_name }))

      return [
        defaultOption,
        ...resourcesItemActives,
      ]
    },

    messageNoteWorkCalendar() {
      return this.$i18n.t('bookings.message-note-work-calendar')
        .replace('{link_01}', `<span class="link-desc" id="link-booking-setup">${this.$t('bookings.booking-setup')}</span>`)
        .replace('{link_02}', `<span class="link-desc" id="link-booking-setup-resource">${this.$t('bookings.booking-setup-resource')}</span>`)
    },

    workCalendarHeaderText() {
      return [
        this.$t('bookings.work-calendar'),
        `(${moment(this.monthValue).format(STANDARD_DATE_FORMAT.YM)})`,
      ]
    },

    _filterResourceId: {
      get() {
        return this.optionsResource.find(option => option.value === this.filterResourceId)
      },
      set(option) {
        this.filterResourceId = option.value
      },
    },

    /**
     * currentFilterResourceId represents the selected resource in the modal-work-schedule-setup component
     * -- If a resource is clicked from the work calendar, currentClickedResourceId `is used`
     * -- Otherwise, if the resource is selected from the resource selector in the work calendar, filterResourceId is used.
     * @returns {number}
     */
    currentFilterResourceId() {
      return this.currentClickedResourceId !== DEFAULT_SHOP_FILTER
        ? this.currentClickedResourceId
        : this.filterResourceId
    },

    /**
     * Mapped Data for rendering the Work Calendar
     * shopRegularOffDays
     * shopSpecificOffDays
     * resourceSetupDays
     */
    shopRegularOffDays() {
      const offDayOfWeek = this.getWorkCalendarSetupData?.bookingOpeningHoursSetup?.offDaysOfWeek

      // Because the weekdays in v-calendar have an index from 1 to 7
      // So it must be increased by 1 day
      return offDayOfWeek.length
        ? offDayOfWeek.map(day => day + 1)
        : []
    },

    shopSpecificOffDays() {
      const specificOffDayTS = this.getWorkCalendarSetupData?.bookingOpeningHoursSetup?.specificOffDayTS

      // Because dates attribute in v-calendar expects timestamps in milliseconds, not seconds
      // So we have to convert timestamps to milliseconds
      return specificOffDayTS.length
        ? specificOffDayTS.map(dayTS => dayTS * 1000)
        : []
    },

    resourceSetupDays() {
      const bookingResourcesSetup = this.isShopOption
        ? this.getWorkCalendarSetupData?.bookingResourcesSetup
        : this.getWorkCalendarSetupData?.bookingResourcesSetup.filter(item => item.bookingResourceId === this.filterResourceId)

      return bookingResourcesSetup.length
        ? bookingResourcesSetup
        : []
    },
  },

  methods: {
    ...mapActions('_calendar/workCalendar', [
      'fetchWorkCalendarSetupData',
    ]),

    setWorkCalendarPrintSections() {
      const workCalendarElement = this.$refs.workCalendarPrintPreview
      if (!workCalendarElement) return []

      // Calculate the optimal height for each section (e.g., A4 page height in pixels)
      const optimalHeight = 595.28 // 595.28 is the width of a4
      const totalHeight = workCalendarElement.scrollHeight
      const sectionsCount = Math.ceil(totalHeight / optimalHeight)

      if (sectionsCount <= 1) {
        // If content fits in one page, use the simple approach
        this.workCalendarPrintSections = [
          {
            ref_type:    print_options.print_ref_type.canvas,
            section_ref: workCalendarElement,
          },
        ]
      } else {
        // If content needs to be split, create virtual sections
        for (let i = 0; i < sectionsCount; i++) {
          this.workCalendarPrintSections.push({
            ref_type:        print_options.print_ref_type.canvas,
            section_ref:     workCalendarElement,
            capture_options: {
              y:       i * optimalHeight,
              height:  Math.min(optimalHeight, totalHeight - (i * optimalHeight)),
              scrollY: i * optimalHeight,
            },
          })
        }
      }
    },

    onCancel () {
      this.$emit('cancel')
    },

    async onLoadForm () {
      this.uidToReRenderWorkCalendar = String(new Date().getTime())

      // Set default month and shop filter
      this.monthValue = new Date()
      this.filterResourceId = DEFAULT_SHOP_FILTER

      this.defaultFromPage = {
        month: this.monthValue.getMonth() + 1,
        year:  this.monthValue.getFullYear(),
      }

      this.$refs.workCalendar.onMoveToMonth({
        month: this.monthValue.getMonth() + 1,
        year:  this.monthValue.getFullYear(),
      })

      // Fetch work calendar setup data
      this.filterParams = {
        shopId: this.shop_data.shop_id,
        year:   this.monthValue.getFullYear(),
        month:  this.monthValue.getMonth() + 1,
      }
      await this.fetchWorkCalendarSetupData(this.filterParams)
    },

    // This function is also opened from the calendar.vue component when clicking on the work calendar
    openWorkScheduleSetup (resourceId, currentSelectedDateFromCalendar) {
      if (currentSelectedDateFromCalendar) {
        this.defaultFromPage.month = currentSelectedDateFromCalendar.getMonth() + 1
        this.defaultFromPage.year = currentSelectedDateFromCalendar.getFullYear()
      }
      this.filterResourceId = resourceId
      this.isWorkScheduleSetupModalVisible = true
      this.currentSpecificDayType = SPECIFIC_DAY_TYPE.OFF_DAY
    },

    openPrintWorkCalendar () {
      this.workCalendarPrintSections = []

      // Handle open print work calendar
      this.$nextTick(() => {
        this.setWorkCalendarPrintSections()
        this.showDialogById(this.workCalendarPrintPreviewModalId)
      })
    },

    onClickDescriptionLink(e) {
      const clickedElId = e.target.id
      if (clickedElId === 'link-booking-setup') {
        this.$router.push({ name: 'booking-opening-hours' })
      }
      if (clickedElId === 'link-booking-setup-resource') {
        this.$router.push({ name: 'booking-resources' })
      }
    },

    async onChangeMonth(newMonth) {
      this.monthValue = newMonth
      this.defaultFromPage = {
        month: newMonth.getMonth() + 1,
        year:  newMonth.getFullYear(),
      }

      this.$refs.workCalendar.onMoveToMonth({
        month: newMonth.getMonth() + 1,
        year:  newMonth.getFullYear(),
      })

      await this.fetchWorkCalendarSetupData({
        shopId: this.shop_data.shop_id,
        month:  newMonth.getMonth() + 1,
        year:   newMonth.getFullYear(),
      })
    },

    onHideModalWorkScheduleSetup() {
      this.currentWorkCalendarDay = null
      this.isWorkScheduleSetupModalVisible = false
      this.currentClickedResourceId = DEFAULT_SHOP_FILTER
    },

    handleResourceRegularOffDayClicked(resource) {
      this.currentClickedResourceId = resource.bookingResourceId
      this.currentSpecificDayType = SPECIFIC_DAY_TYPE.OFF_DAY
      this.isWorkScheduleSetupModalVisible = true
    },

    handleResourceSpecificWorkingDayClicked(calendarDay, resource) {
      this.currentClickedResourceId = resource.bookingResourceId
      this.currentWorkCalendarDay = calendarDay
      this.currentSpecificDayType = SPECIFIC_DAY_TYPE.WORKING_DAY
      this.isWorkScheduleSetupModalVisible = true
    },
  },
}
</script>

<style lang="scss">
@import './modal-work-calendar.scss';
</style>
