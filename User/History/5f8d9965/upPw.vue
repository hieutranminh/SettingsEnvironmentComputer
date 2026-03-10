<template>
  <div
    :class="bookingFilterClass"
    class="row"
  >
    <a-form
      :data="formData"
      :validate-schema="formValidateSchema"

      class="booking-filter__form col-md-10"
      @submit="handleFormSubmit"
    >
      <div class="booking-filter__form-group flex-wrap">
        <div class="booking-filter__form-group booking-filter__form-group--registered-date">
          <booking-date-type
            v-model="bookingDateType"
            class="booking-filter__form-select"
          />
        </div>
        <div class="booking-filter__form-group booking-filter__form-group--date-type">
          <div class="booking-filter__form-label">
            <b-form-radio
              v-model="typeDate"
              :value="optionDate"
            >
              {{ $t('booking-list.date') }}
            </b-form-radio>

            <b-form-radio
              v-model="typeDate"
              :value="optionDateRange"
            >
              {{ $t('booking-list.date-range') }}
            </b-form-radio>
          </div>

          <div class="booking-filter__form-control">
            <a-form-field
              name="fromBookingDateTS"
              class="booking-filter__form-field"
            >
              <template #default="{ error }">
                <a-form-control :error="error">
                  <aha-date-picker
                    v-model="fromBookingDate"
                    :error="!!error"
                    class="booking-filter__form-date-picker custom-date-input"
                  />
                </a-form-control>
              </template>
            </a-form-field>
            <div v-if="isToBookingDateShown">
              ~
            </div>
            <a-form-field
              v-if="isToBookingDateShown"
              name="toBookingDateTS"
              class="booking-filter__form-field"
            >
              <template #default="{ error }">
                <a-form-control :error="error">
                  <aha-date-picker
                    v-model="toBookingDate"
                    :error="!!error"
                    :min-date="fromBookingDate"
                    :popover-align="isMobileDevice ? 'right' : 'left'"
                    class="booking-filter__form-date-picker custom-date-input"
                  />
                </a-form-control>
              </template>
            </a-form-field>
          </div>
        </div>
      </div>

      <div class="booking-filter__form-group col-12 flex-wrap">
        <div class="booking-filter__form-group booking-filter__form-group--resource">
          <div class="booking-filter__form-label">
            {{ $t('booking-list.resource') }}
          </div>
          <!-- <div class="row"> -->
          <div class="booking-filter__form-control">
            <select-resource
              v-model="bookingResourceSetupId"
              :is-all-placeholder="true"
              :not-selected="$t('general.all')"
              has-all-option
              class="waiting-filter__select-resource"
            />
          </div>
          <!-- </div> -->
        </div>

        <div class="booking-filter__form-group booking-filter__form-group--source">
          <div class="booking-filter__form-label">
            {{ $t('booking-list.source') }}
          </div>

          <div class="booking-filter__form-control">
            <booking-source
              v-model="bookingSource"
              has-all-option
              class="waiting-filter__select-source"
            />
          </div>
        </div>

        <div class="booking-filter__form-group booking-filter__form-group--status">
          <div class="booking-filter__form-label">
            {{ $t('booking-list.status') }}
          </div>

          <div class="booking-filter__form-control">
            <booking-status
              v-model="status"
              :booking-source="bookingSource"

              has-all-option
              class="waiting-filter__select-status"
            />
          </div>
        </div>

        <div class="booking-filter__form-group booking-filter__form-group--client-name">
          <div class="booking-filter__form-control">
            <a-input
              v-model="nameOrMobile"
              :placeholder="$t('booking-list.client-name-or-mobile')"
              @keyup.enter="handleFormSubmit"
            />
          </div>
        </div>
      </div>
    </a-form>

    <div
      class="booking-filter__form-group booking-filter__form-group--submit col-sm-12 col-md-2"
    >
      <a-button
        type="submit"
        variant="primary"
        class="booking-filter__form-button booking-filter__form-button--submit"

        @click="handleFormSubmit"
      >
        {{ $t('booking-list.search') }}
      </a-button>
    </div>
  </div>
</template>

<script>
// Utilities
import { convertDateToTimezone, convertDateToMomentUTC, convertTimestampToDate } from 'Modules/calendar/utils/index'

// Validator
import BookingListValidator from 'Validators/list/bookingValidator.js'

// Components
import AInput from 'Modules/aha/a-input/a-input.vue'
import AButton from 'Modules/aha/a-button/a-button.vue'
import BookingSource from '../booking-source/booking-source.vue'
import BookingStatus from '../booking-status/booking-status.vue'
import BookingDateType from '../booking-date-type/booking-date-type.vue'
import { AForm, AFormField, AFormControl } from 'Modules/aha/a-form/a-form'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import AhaDatePicker from 'CommonComponents/aha-date-picker/aha-date-picker.vue'
import SelectResource from 'Modules/calendar/components/booking-action/components/select-resource/select-resource.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

// Constant
import { options } from 'OptionsHelpers'

const now = convertDateToTimezone()
const toBookingDateTSDefault = convertDateToMomentUTC(now).add(1, 'month').startOf('day').unix() // To get the timestamp of the previous day at 23:59:59
const BOOKING_DATE = 0
const REGISTERED_DATE = 1

export default {
  components: {
    AForm,
    AInput,
    AButton,
    AFormField,
    AFormControl,
    BookingStatus,
    AhaDatePicker,
    BookingSource,
    SelectResource,
    BookingDateType,
  },

  extends: ComponentBase,

  mixins: [DeviceMixin],

  props: {
    value: {
      type:    Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      status:                 null,
      nameOrMobile:           '',
      ascOrdering:            true,
      bookingDateType:        0,
      bookingSource:          null,
      bookingResourceSetupId: null,
      typeDate:               options.type_date.date_range,
      fromBookingDateTS:      convertDateToMomentUTC(now).startOf('day').unix(),
      toBookingDateTS:        toBookingDateTSDefault,
    }
  },

  computed: {
    optionDate() {
      return options.type_date.date
    },

    optionDateRange() {
      return options.type_date.date_range
    },

    isToBookingDateShown() {
      return this.typeDate === this.optionDateRange
    },

    toBookingDate: {
      get() {
        if (this.toBookingDateTS === 0) {
          return null
        }
        return convertTimestampToDate(this.toBookingDateTS)
      },

      set(toBookingDate) {
        if (toBookingDate === null || toBookingDate === undefined) {
          this.toBookingDateTS = null
        } else {
          this.toBookingDateTS = convertDateToMomentUTC(toBookingDate).startOf('day').unix()
        }
      },
    },

    fromBookingDate: {
      get() {
        return convertTimestampToDate(this.fromBookingDateTS)
      },

      set(fromBookingDate) {
        this.fromBookingDateTS = convertDateToMomentUTC(fromBookingDate).startOf('day').unix()

        if (this.typeDate === options.type_date.date || (this.toBookingDateTS !== null && this.toBookingDateTS < this.fromBookingDateTS)) {
          this.toBookingDateTS = convertDateToMomentUTC(fromBookingDate).endOf('day').unix()
        }
      },
    },

    bookingFilterClass() {
      return ['booking-filter', {
        'booking-filter--mobile': this.isMobileDevice,
      }]
    },

    formData() {
      return {
        ...this.value,
        status:                 this.status,
        typeDate:               this.typeDate,
        ascOrdering:            this.ascOrdering,
        nameOrMobile:           this.nameOrMobile,
        bookingSource:          this.bookingSource,
        toBookingDateTS:        this.toBookingDateTS,
        fromBookingDateTS:      this.fromBookingDateTS,
        bookingResourceSetupId: this.bookingResourceSetupId,
      }
    },

    formValidateSchema() {
      const validation = new BookingListValidator()

      return validation.schemaTS
    },

    filterDateOptions() {
      return [
        { value: REGISTERED_DATE, label: this.$t('booking-list.registered-date') },
        { value: BOOKING_DATE, label: this.$t('booking-list.booking-date') },
      ]
    },
  },

  watch: {
    value: {
      deep:      true,
      immediate: true,
      handler(value) {
        this.status = value?.status
        this.nameOrMobile = value?.nameOrMobile ?? ''
        this.bookingSource = value?.bookingSource ?? null
        this.typeDate = value?.typeDate ?? options.type_date.date_range
        this.bookingResourceSetupId = value?.bookingResourceSetupId ?? null

        const now = convertDateToTimezone()
        if (value?.toBookingDateTS !== undefined) {
          this.toBookingDateTS = value.toBookingDateTS
        } else {
          this.toBookingDateTS = convertDateToMomentUTC(now).endOf('day').unix()
        }
        this.fromBookingDateTS = value?.fromBookingDateTS ?? convertDateToMomentUTC(now).startOf('day').unix()
      },
    },

    isToBookingDateShown() {
      const now = convertDateToTimezone()
      this.fromBookingDateTS = convertDateToMomentUTC(now).startOf('day').unix(),
      this.toBookingDateTS = toBookingDateTSDefault
    },

    bookingDateType: {
      handler(value) {
        this.handleChangeDateType(value)
      },
    },

    typeDate: {
      handler(value) {
        if(this.bookingDateType === REGISTERED_DATE && value === options.type_date.date_range) {
          this.fromBookingDateTS = convertDateToMomentUTC(now).subtract(6, 'day').startOf('day').unix()
          this.toBookingDateTS = convertDateToMomentUTC(now).startOf('day').unix()
        } else {
          this.fromBookingDateTS = convertDateToMomentUTC(now).startOf('day').unix()
          this.toBookingDateTS = toBookingDateTSDefault
        }
      },
    },
  },

  methods: {
    handleChangeDateType(dateType) {
      if(dateType === REGISTERED_DATE) {
        this.ascOrdering = false
        this.typeDate = options.type_date.date_range
        this.fromBookingDateTS = convertDateToMomentUTC(now).subtract(6, 'day').startOf('day').unix()
        this.toBookingDateTS = convertDateToMomentUTC(now).startOf('day').unix()
      } else {
        this.ascOrdering = true
        this.fromBookingDateTS = convertDateToMomentUTC(now).startOf('day').unix()
        this.toBookingDateTS = toBookingDateTSDefault
      }
    },

    handleResetClick() {
      Object.assign(this.$data, this.$options.data.call(this))
    },

    handleFormSubmit() {
      try {
        const validate = new BookingListValidator()

        const isValid = validate.validate({
          toBookingDate:   this.toBookingDate,
          fromBookingDate: this.fromBookingDate,
        })

        if(isValid.length) {
          throw new Error(isValid)
        }

        this.$emit('input', {
          ...this.value,
          status:                 this.status,
          typeDate:               this.typeDate,
          ascOrdering:            this.ascOrdering,
          nameOrMobile:           this.nameOrMobile,
          bookingSource:          this.bookingSource,
          filterDateType:         this.bookingDateType,
          toBookingDateTS:        this.toBookingDateTS,
          fromBookingDateTS:      this.fromBookingDateTS,
          bookingResourceSetupId: this.bookingResourceSetupId,
        })

      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./booking-filter.scss";
</style>
