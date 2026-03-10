<template>
  <a-form-context
    ref="formContext"
    :class="bookingActionFormClass"
    @submit="handleFormSubmit"
    @invalid="handleFormInValid"
  >
    <a-wizard
      :steps="wizardSteps"
      :enable="isMobileDevice"
      :active="activeWizardStep"
      @step-change="handleWizardStepChange"
    >
      <div class="booking-action__container">
        <device-view
          is-desktop-device
          is-tablet-device
        >
          <booking-search-client
            @client-added="handleResetErrors"
            @display-no-search-result="hasNoClientSearchedResult = true"
          />
        </device-view>

        <a-wizard-step name="client">
          <div
            :class="{'booking-action__form-no-client': hasNoClientSearchedResult }"
            class="booking-action__form-client col-12 col-lg-5"
          >
            <device-view is-mobile-device>
              <booking-search-client
                v-if="!isRegisteredClient"
                @client-added="onClientAdded"
                @display-no-search-result="hasNoClientSearchedResult = true"
              />
            </device-view>

            <booking-client
              v-if="visible"
              :has-no-client-searched-result="hasNoClientSearchedResult"
              class="booking-action__client"
              @client-close="isHideClientSearchBar = false"
            />
          </div>
        </a-wizard-step>

        <a-wizard-step name="resources">
          <div class="booking-action__form-booking col-12 col-lg-7">
            <device-view is-mobile-device>
              <div class="booking-action__booking-details">
                {{ $t('bookings.booking-details') }}
              </div>
            </device-view>
            <booking-date
              :booking-date="booking.bookingDate"
              class="booking-action__date"
              @repeat-click="handleRepeatClick"
            />

            <booked-resources class="booking-action__booked-resources" />

            <booking-configurations
              class="booking-action__booking-configurations"
              @edit-deposit-click="handleEditDepositClick"
              @deposit-required-change="handleDepositRequiredChange"
              @edit-deposit-payment-click="handleEditDepositPaymentClick"
            />

            <a-form-field
              :name="'notes'"
              :target="() => $refs.notes.$el"
              :class="'booking-action__booking-note'"
            >
              <a-form-control class="booking-action__booking-note-textarea">
                <a-textarea
                  ref="notes"
                  v-model="notes"
                  :rows="5"
                  :placeholder="$t('general.notes-placeholder')"
                  :disabled="temporarilyReadOnly"
                  @keyup="handleNotesInputWithLimit"
                />

                <a
                  class="action action--voice"
                  @click.prevent="onStartVoiceNotes"
                >
                  <b-icon-mic />
                </a>
              </a-form-control>
            </a-form-field>

            <a-error-box
              ref="errorRef"
              :errors="errors"
              class="booking-action__error-box mt-1"
            />

            <div
              v-if="!isMobileDevice"
              class="booking-action__form-submit"
            >
              <a-button
                v-click-only
                variant="primary"
                class="booking-action__button booking-action__button--submit"
                @click="handleConfirmClick"
              >
                {{ $t('general.save') }}
              </a-button>

              <a-button
                variant="blue-light"
                class="booking-action__button booking-action__button--cancel"
                @click="handleCancelClick"
              >
                {{ $t('general.cancel') }}
              </a-button>
            </div>
          </div>
        </a-wizard-step>
      </div>

      <template
        v-if="isMobileDevice && !hasNoClientSearchedResult"
        #actions="{ activeStep }"
      >
        <div
          ref="footer"
          class="booking-action__footer"
        >
          <div class="booking-action__footer-container">
            <template v-if="activeStep === 'client'">
              <a-button
                variant="primary"
                class="booking-action__footer-button booking-action__footer-button--submit"
                @click="handleNextStep"
              >
                {{ $t('bookings.next') }}
                <b-icon-arrow-right-short />
              </a-button>
              <a-button
                variant="secondary"
                class="booking-action__footer-button booking-action__footer-button--cancel"
                @click="handleCancelClick"
              >
                {{ $t('general.cancel') }}
              </a-button>
            </template>
            <template v-else>
              <template v-if="activeStep === 'resources'">
                <a-button
                  variant="primary"
                  class="booking-action__footer-button booking-action__footer-button--submit"
                  @click="handlePreviousStep"
                >
                  <b-icon-arrow-left-short />
                  {{ $t('bookings.previous') }}
                </a-button>

                <a-button
                  variant="primary"
                  class="booking-action__footer-button booking-action__footer-button--submit"
                  @click="handleConfirmClick"
                >
                  {{ $t('general.save') }}
                </a-button>

                <a-button
                  variant="secondary"
                  class="booking-action__footer-button booking-action__footer-button--cancel"
                  @click="handleCancelClick"
                >
                  {{ $t('general.cancel') }}
                </a-button>
              </template>
            </template>
          </div>
        </div>
      </template>
    </a-wizard>

    <booking-repeat-action
      :value="booking.repeatBooking"
      :visible="isBookingRepeatVisible"
      :booking-date="booking.bookingDate"
      @submit="handleBookingRepeatSubmit"
      @hidden="handleBookingRepeatModalHidden"
    />

    <booking-deposit-setup-alarm ref="bookingDepositSetupAlarm" />

    <booking-deposit-guide-alarm ref="bookingDepositGuideAlarm" />

    <booking-deposit-payment-confirmation-alarm ref="bookingDepositPaymentConfirmationAlarm" />

    <booking-deposit-action
      ref="bookingDeposit"
      :is-from-calendar="false"
    />

    <booking-deposit-edit-action
      ref="bookingDepositEdit"
      @delete="handleDeleteDepositClick"
    />

    <booking-deposit-payment-edit-action
      ref="bookingDepositPaymentEdit"
      @delete="handleBookingDepositPaymentDelete"
    />

    <bookable-items-action
      :booking-item-type="bookingItemType"
      :visible="isBookingItemsActionVisible"
      :items-can-be-added="itemsCanBeAdded"
      :total-booked-items="totalBookedItems"
      @hidden="handleBookingItemsActionHidden"
      @booked-items-add="handleBookedItemsAdd"
    />
  </a-form-context>
</template>

<script>
// Utilities
import moment from 'moment'
import i18n from 'Translate'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { CalendarEventBus } from 'Modules/calendar/utils/index'
import { BookingApiError } from 'Validators/booking/bookingValidator'
import { isOffDay, isHasSpecificAllowedBooking, getCurrentSettingDateTimeTS, checkNullAndEmptyAndUndefined, realLength, realSubstring } from 'CommonHelpers'

// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import BookingDate from '../booking-date/booking-date.vue'
import { AWizard, AWizardStep } from 'Modules/aha/a-wizard'
import ATextarea from 'Modules/aha/a-textarea/a-textarea.vue'
import DeviceView from 'Modules/device/components/device-view'
import AErrorBox from 'Modules/aha/a-error-box/a-error-box.vue'
import BookingClient from '../booking-client/booking-client.vue'
import AlertConfirm from 'Components/common/alert/alert-confirm.vue'
import BookedResources from '../booked-resources/booked-resources.vue'
import { BIconArrowRightShort, BIconArrowLeftShort } from 'bootstrap-vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import { AFormContext, AFormField, AFormControl } from 'Modules/aha/a-form/a-form'
import BookingConfigurations from '../booking-configurations/booking-configurations.vue'
import PerformanceResourceConfirm from 'Modules/calendar/components/common-form/performance-resource-confirm/performance-resource-confirm.vue'
// Models
import RepeatBooking from 'Models/booking/repeatBooking'
import BookingDeposit from 'Models/booking/bookingDeposit'
import ClientViewModel from 'ViewModels/clients/client-view-model'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import BookingCacheMixin from 'Modules/cache/mixins/booking_cache'
import NoteLengthValidatorMixin from 'Mixins/note-length-validator-mixin'

// Constant
import { options } from 'OptionsHelpers'
import { BOOKING_STATUS, BOOKING_CLIENT_TYPE } from 'Constant'
import BookableItemsAction
  from 'Modules/calendar/components/common-form/bookable-items-action/bookable-items-action.vue'
import { BOOKING_DATA_RULES } from 'SystemDataRules'

export default {
  components: {
    BookableItemsAction,
    AFormField,
    AFormControl,
    AFormContext,

    AButton,
    AWizard,
    AErrorBox,
    ATextarea,
    DeviceView,
    AWizardStep,
    BookingDate,
    AlertConfirm,
    BookingClient,
    BookedResources,
    BIconArrowLeftShort,
    BIconArrowRightShort,
    BookingConfigurations,

    // Booking configurations
    BookingRepeatAction:                    () => import('../booking-repeat-action/booking-repeat-action.vue'),
    BookingSearchClient:                    () => import('../booking-search-client/booking-search-client.vue'),
    BookingDepositAction:                   () => import('Modules/calendar/components/booking-deposit-action/booking-deposit-action.vue'),
    BookingDepositSetupAlarm:               () => import('Modules/calendar/components/booking-deposit-setup-alarm/booking-deposit-setup-alarm.vue'),
    BookingDepositGuideAlarm:               () => import('Modules/calendar/components/send-message-action/components/booking-deposit-guide-alarm/booking-deposit-guide-alarm.vue'),
    BookingDepositEditAction:               () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-edit-action/booking-deposit-edit-action.vue'),
    BookingDepositPaymentEditAction:        () => import('Modules/calendar/components/booking-deposit-action/components/booking-deposit-payment-edit-action/booking-deposit-payment-edit-action.vue'),
    BookingDepositPaymentConfirmationAlarm: () => import('Modules/calendar/components/send-message-action/components/booking-deposit-payment-confirmation-alarm/booking-deposit-payment-confirmation-alarm.vue'),
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    BookingCacheMixin,
    NoteLengthValidatorMixin,
  ],

  data() {
    return {
      errors:                      [],
      searchClients:               [],
      hasNoClientSearchedResult:   false,
      isBookingRepeatVisible:      false,
      isClientSearchResultVisible: false,

      bookingSetup:          null,
      isHideClientSearchBar: false,

      bookedResource:                     null,
      itemsCanBeAdded:                    0,
      bookingItemType:                    0,
      isBookingItemsActionVisible:        false,
      isBookingExceedsWorkHoursConfirmed: false,
      isUnregisteredClientChecked:        false,
      temporarilyReadOnly:                false,
    }
  },

  computed: {
    ...mapState('_calendar/bookingAction', [
      'client',
      'booking',
      'visible',
      'isUnregisteredClientCheckedStore',
      'activeWizardStep',
    ]),

    ...mapGetters('selectedClients', {
      xRecentlySelectedClients: 'recentlySelectedClients',
    }),

    ...mapGetters('client', {
      bookingClient: 'getBookingClient',
    }),

    notes: {
      get() {
        return this.booking.notes
      },
      set(notes) {
        this.setNotes(notes)
      },
    },

    wizardSteps() {
      return ['client', 'resources']
    },

    isBookingEditing() {
      return !!this.booking.bookingId
    },

    isClientSearchShown() {
      return !this.isBookingEditing
    },

    bookingActionFormClass() {
      return ['booking-action__form', {
        'booking-action__form--mobile': this.isMobileDevice,
      }]
    },

    totalBookedItems() {
      return this.booking?.bookedResources.reduce((totalBookedItems, resource) => {
        return totalBookedItems + resource.bookedItems.length
      }, 0)
    },

    isRegisteredClient() {
      return this.booking?.clientId && this.booking?.clientId > 0
    },

    maxNoteLength() {
      return BOOKING_DATA_RULES.MAX_BIG_NOTES_LENGTH
    },
  },

  provide() {
    return {
      changeStep: this.handleWizardStepChange,
    }
  },

  watch: {
    errors: {
      handler(error) {
        if (error.length > 0) {
          this.$nextTick(() => {
            const errorBox = this.$refs.errorRef.$el
            if (errorBox && this.isMobileDevice) {
              errorBox.scrollIntoView({
                block:    'start',
                behavior: 'smooth',
              })

            }
          })
        }
      },
    },

    visible: {
      immediate: true,
      handler(visible) {
        this.errors = []

        if (!visible) {
          this.setActiveWizardStep('client')
          this.isUnregisteredClientChecked = false
        }
      },
    },
  },

  async created() {
    this.isUnregisteredClientChecked = this.isUnregisteredClientCheckedStore
    this.bookingSetup = await this.$bookingCacheMixin_getAllCalendarSetup({
      shopId: this.shop_data.shop_id,
    })
    const isClientNameEmpty = checkNullAndEmptyAndUndefined(this.bookingClient?.client_name)
    if (this.bookingClient?.id && !isClientNameEmpty && !this.booking.bookingId && !this.client.clientId) {
      await this.loadClientInfomartion(this.bookingClient?.id)
    }

    CalendarEventBus.$on('select-items-on-booking', this.handleBookingItemClick)
    CalendarEventBus.$on('is-booking-resource-section-shown', this.handleBookingResourceSectionShown)
    CalendarEventBus.$on('checked-unregistered-client', this.handleUnregisteredClientChecked)
    CalendarEventBus.$on('unchecked-unregistered-client', this.handleUnregisteredClientUnchecked)
  },

  beforeDestroy() {
    this.isUnregisteredClientChecked = false
    this.setIsUnregisteredClientCheckedStore(false)
    CalendarEventBus.$off('select-items-on-booking', this.handleBookingItemClick)
    CalendarEventBus.$off('is-booking-resource-section-shown', this.handleBookingResourceSectionShown)
    CalendarEventBus.$off('checked-unregistered-client', this.handleUnregisteredClientChecked)
    CalendarEventBus.$off('unchecked-unregistered-client', this.handleUnregisteredClientUnchecked)
  },

  methods: {
    ...mapMutations('_calendar/bookingAction', [
      'setBookingClients',
      'setActiveWizardStep',
      'setIsUnregisteredClientCheckedStore',
    ]),

    ...mapMutations('client', [
      'setBookingClient',
    ]),

    ...mapActions('_calendar/bookingAction', [
      'getClient',
      'addBooking',
      'updateBooking',
      'validateBooking',
      'closeBookingAction',
    ]),

    ...mapActions('_calendar/bookingAction/booking', [
      'addBookedItemsToBookedResource',
    ]),

    ...mapMutations('_calendar/bookingAction/booking', [
      'setNotes',
      'setStatus',
      'setRepeatBooking',
      'setBookingDeposit',
      'setEditedDateTimeTS',
      'setIsDepositRequired',
      'setCreatedDateTimeTS',
      'setBookingExceedsWorkHours',
      'setMustCheckPerformanceResource',
    ]),

    ...mapMutations('_calendar/bookingAction/client/prepaidServices', [
      'resetItemActive',
    ]),

    handleNotesInputWithLimit(event) {
      const value = event?.target?.value || ''

      if(!value) return

      if (this._notesLimitTimeout) {
        clearTimeout(this._notesLimitTimeout)
      }

      this._notesLimitTimeout = setTimeout(async () => {
        const currentValue = value
        const currentValueLength = realLength(currentValue, this.shop_data.country)

        const LIMIT_LENGTH = 5000

        if (currentValueLength > LIMIT_LENGTH) {
          if (this._isNotesLimitModalShowing) {
            return
          }

          this._isNotesLimitModalShowing = true
          this._onCloseNotesLimitModal = false

          const confirm = await this._showDialogConfirm(this.$t('bookings.maximum-note-length', { number: LIMIT_LENGTH }), {
            confirmButtonText: this.$t('general.confirm'),
            isOnlyConfirmBtn:  true,
            onclose:           () => {
              this._onCloseNotesLimitModal = true
            },
          })

          this.temporarilyReadOnly = true
          this._isNotesLimitModalShowing = false

          if (confirm || this._onCloseNotesLimitModal) {
            this.notes = realSubstring(this.notes, 0, LIMIT_LENGTH, this.shop_data.country)
            this.temporarilyReadOnly = false
            this.$nextTick(() => {
              const element = this.$refs.notes.$el
              if (element) {
                element.setSelectionRange(LIMIT_LENGTH, LIMIT_LENGTH)
                element.focus()
              }
            })
          }
        }
      }, 100)
    },

    handleBookingItemClick(data) {
      this.bookedResource = data.bookedResource
      this.bookingItemType = data.itemType
      this.itemsCanBeAdded = data.itemsCanBeAdded
      this.isBookingItemsActionVisible = data.itemVisible
    },

    handleBookingItemsActionHidden() {
      this.isBookingItemsActionVisible = false
    },

    handleBookedItemsAdd(bookedItems) {
      this.addBookedItemsToBookedResource({
        bookedItems,
        bookedResource: this.bookedResource,
      })
    },

    handleCancelClick() {
      this.isHideClientSearchBar = false
      this.errors = []
      this.resetItemActive()
      this.$emit('cancel')
      this.setActiveWizardStep('resources')
    },

    handleResetErrors() {
      this.errors = []

      this.hasNoClientSearchedResult = !this.client
    },

    handleWizardStepChange(activeWizardStep) {
      this.setActiveWizardStep(activeWizardStep)
    },

    handleShowClients(clients) {
      this.searchClients = clients
      this.isClientSearchResultVisible = true // Open modal search client result
    },

    handleClientAdded({ clientId }) {
      this.loadClientInfomartion(clientId)
    },

    handleSearchClientClick({ clientId }) {
      this.loadClientInfomartion(clientId)
    },

    async loadClientInfomartion(clientId) {
      try {
        this.preLoader()

        const shopId = this.shop_data.shop_id
        await this.getClient({ clientId, shopId })

        this.errors = []
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleSugguestionClientClick({ clientId }) {
      this.loadClientInfomartion(clientId)
    },

    handleRepeatClick() {
      this.isBookingRepeatVisible = true
    },

    handleBookingRepeatSubmit(repeatBooking = new RepeatBooking()) {
      this.setRepeatBooking(repeatBooking)
    },

    handleBookingRepeatModalHidden() {
      this.isBookingRepeatVisible = false
    },

    handleAddBookingDeposit(forceSetup = false) {
      const bookingDeposit = this.booking.bookingDeposit ?? new BookingDeposit()
      this.$refs.bookingDeposit.show({
        forceSetup,
        bookingDeposit,
      })(changedBookingDeposit => {
        if (!changedBookingDeposit) return

        this.showBookingDepositMessageSetupAlarm(changedBookingDeposit)

        changedBookingDeposit.bookingId = this.booking.bookingId
        this.setBookingDeposit(changedBookingDeposit)

        this.$refs.bookingDeposit.hide()
      })
    },

    /**@param {BookingDeposit} bookingDeposit */
    showBookingDepositMessageSetupAlarm(bookingDeposit) {
      if (bookingDeposit.depositType === options.deposit_type.not_paid_yet) {
        this.$refs.bookingDepositGuideAlarm.show()
      } else if (bookingDeposit.depositType === options.deposit_type.paid) {
        this.$refs.bookingDepositPaymentConfirmationAlarm.show()
      }
    },

    async handleDepositRequiredChange(isDepositRequired) {
      try {
        if (this.booking?.bookingDeposit?.status === options.booking_deposit_status.exist) {
          const isConfirm = await this._showDialogConfirm(this.$t('bookings.warning-delete-booking-deposit'), {
            confirmBtnColor: 'red',
            confirmBtnText:  this.$t('general.delete'),
          })

          if (isConfirm) {
            this.setIsDepositRequired(false)
          }
          return
        }

        if (!isDepositRequired) return

        this.preLoader()

        const bookingDepositDefaultSetup = await this.$bookingCacheMixin_getBookingDepositDefaultSetup({
          shopId: this.shop_data.shop_id,
        })

        const hasBookingDepositSetup = this.$bookingCacheMixin_checkHasBookingDepositSetup(bookingDepositDefaultSetup)

        if (!hasBookingDepositSetup) {
          this.$refs.bookingDepositSetupAlarm.show()(event => {
            const forceSetup = event === 'setup-now'
            this.handleAddBookingDeposit(forceSetup)
          })
        } else {
          this.handleAddBookingDeposit()
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleDeleteDepositClick() {
      this.setIsDepositRequired(false)
    },

    async handleEditDepositClick() {
      const bookingDeposit = this.booking.bookingDeposit ?? new BookingDeposit()
      this.$refs.bookingDepositEdit.show({ bookingDeposit })(changedBookingDeposit => {
        if (!changedBookingDeposit) return

        changedBookingDeposit.bookingId = this.booking.bookingId
        this.setBookingDeposit(changedBookingDeposit)

        this.$refs.bookingDepositEdit.hide()
      })
    },

    async handleEditDepositPaymentClick() {
      const bookingDeposit = this.booking.bookingDeposit ?? new BookingDeposit()
      this.$refs.bookingDepositPaymentEdit.show({ bookingDeposit })(changedBookingDeposit => {
        if (!changedBookingDeposit) return

        changedBookingDeposit.bookingId = this.booking.bookingId
        this.setBookingDeposit(changedBookingDeposit)

        this.$refs.bookingDepositPaymentEdit.hide()
      })
    },

    /**@param {BookingDeposit} bookingDeposit */
    async handleBookingDepositPaymentDelete(bookingDeposit) {
      /**@type {BookingDeposit} */
      const clonedBookingDeposit = bookingDeposit.clone()

      if (clonedBookingDeposit.bookingDepositPayment.status === options.booking_deposit_status.delete) {
        return
      }

      clonedBookingDeposit.depositType = options.deposit_type.not_paid_yet
      clonedBookingDeposit.bookingDepositPayment.status = options.booking_deposit_status.delete

      this.setBookingDeposit(clonedBookingDeposit)

      this.$refs.bookingDepositPaymentEdit.hide()
    },

    async handleAddBooking() {
      this.setCreatedDateTimeTS(getCurrentSettingDateTimeTS())
      return await this.addBooking()
    },

    async handleUpdateBooking() {
      this.setEditedDateTimeTS(getCurrentSettingDateTimeTS())

      const shouldForceUpdate = this.isBookingExceedsWorkHoursConfirmed
      return this.updateBooking(shouldForceUpdate)
    },

    async upsertBooking() {
      try {
        this.errors = await this.validateBooking()
        if (this.errors.length > 0) {
          return
        }

        this.preLoader()
        const bookingStatus = (() => {
          if (this.booking.status === BOOKING_STATUS.ARRIVED) {
            return BOOKING_STATUS.ARRIVED
          }

          if (this.booking.bookingClientType === BOOKING_CLIENT_TYPE.WALKING_CLIENT) {
            return BOOKING_STATUS.ARRIVED
          }

          return BOOKING_STATUS.COMPLETED
        })()

        this.setStatus(bookingStatus)

        this.validateBookingDate()
        if (this.booking.bookingId) {
          const updatedBooking = await this.handleUpdateBooking()
          this.$emit('booking-updated', updatedBooking)
        } else {
          // Check if adding case but no selected client or registered as unregistered client.
          if (this.booking.bookingClientType !== options.booking_client_type.walking_client && !this.booking.clientId && !this.isUnregisteredClientCheckedStore) {
            // Switch to client step on mobile to show the inline alert
            if (this.isMobileDevice && this.activeWizardStep !== 'client') {
              this.setActiveWizardStep('client')
            }
            // Emit validation error for unregistered client component
            CalendarEventBus.$emit('show-unregistered-client-validation-error', this.$t('bookings.select-client-or-register-as-unregistered-client'))
            return
          }

          const addedBooking = await this.handleAddBooking()
          this.$emit('booking-added', addedBooking)
        }

        this.setBookingClients(null)
        this.closeBookingAction()
      } catch (error) {
        if (error?.isApiError()) {
          return this.handleBookingActionError(new BookingApiError(error))
        }

        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    /**
     * Validates the booking date against off days and specific allowed bookings for each resource.
     * @returns {Promise<void>}
     * @throws {Error} If the booking date is an off day or not allowed for a specific resource.
    */
    validateBookingDate() {
      for (let bookedResource of this.booking?.bookedResources) {
        if (
          isOffDay(this.booking.bookingDate, bookedResource?.bookingResourceSetupId, this.bookingSetup) &&
          !isHasSpecificAllowedBooking(this.booking.bookingDate, bookedResource?.bookingResourceSetupId, this.bookingSetup.booking_resources_setup.items)
        ) {
          const dateFormatted = moment(this.booking?.bookingDate).format(options.standard_date_format.ymd)
          const offDateMessage = this.$t('bookings.off-date-can-not-make-booking', { 'date-time': dateFormatted })
          throw Error(offDateMessage)
        }
      }
    },

    async handleConfirmClick() {
      this.$refs.formContext.submit()
      this.setBookingClient(new ClientViewModel().fields)
    },

    async handleFormSubmit() {
      this.upsertBooking()
    },

    /**
     * @param {BookingApiError} error
     */
    async handleBookingActionError(error = new BookingApiError()) {
      if (error.hasUnacceptableErrors) {
        this.errors = error.unacceptableErrorMessages
        return
      }

      if (error.hasExceedWorkingHoursErrors) {
        const messages = [
          i18n.t('bookings.warning-booking-over-working-hours'),
          i18n.t('general.warning-really-save'),
        ]
        this.isBookingExceedsWorkHoursConfirmed = await this._showDialogConfirm(messages, {
          cancelBtnText:  i18n.t('general.no'),
          confirmBtnText: i18n.t('general.yes'),
        })
        if (!this.isBookingExceedsWorkHoursConfirmed) {
          this.errors = error.message
          return
        }
        this.setBookingExceedsWorkHours(true)
      }

      if (error.hasResourceNotPerformanceServiceErrors) {
        const isMustCheckPerformanceResourceConfirmed = await this._showDialogConfirm(error.resourceNotPerformanceServiceErrorsMessages, {
          title:          i18n.t('general.alert'),
          component:      PerformanceResourceConfirm,
          cancelBtnText:  i18n.t('general.no'),
          confirmBtnText: i18n.t('general.yes'),
        })
        if (!isMustCheckPerformanceResourceConfirmed) {
          this.errors = error.message
          return
        }
        this.setMustCheckPerformanceResource(false)
      }

      this.upsertBooking()
    },

    handleFormInValid(errors) {
      const hasClientErrors = errors.some(error => {
        return ['clientName', 'clientMobileNumber'].includes(error.context?.key)
      })

      this.errors = [...new Set(errors.map(error => error.message))]

      if (hasClientErrors) {
        this.setActiveWizardStep('client')
      }
    },

    handleNextStep() {
      if (!this.isHideClientSearchBar) {
        this.handleWizardStepChange('resources')
      }

      CalendarEventBus.$emit('show-mutiple-resources')
    },

    handlePreviousStep() {
      if (!this.isHideClientSearchBar) {
        this.handleWizardStepChange('client')
      }

      CalendarEventBus.$emit('action-previous-step')
    },

    onClientAdded(isHide) {
      this.isHideClientSearchBar = isHide
      this.hasNoClientSearchedResult = false
    },

    handleBookingResourceSectionShown() {
      this.hasNoClientSearchedResult = !this.client
    },

    handleUnregisteredClientChecked() {
      this.isUnregisteredClientChecked = true
    },

    handleUnregisteredClientUnchecked() {
      this.isUnregisteredClientChecked = false
    },

    onStartVoiceNotes() {
      console.log('onStartVoiceNotes')
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./booking-form.scss";
</style>
