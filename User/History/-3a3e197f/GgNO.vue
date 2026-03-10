<template>
  <div :class="prepaidServiceClass">
    <form
      class="prepaid-service__form"
      @submit="handleFormSubmit"
    >
      <b-tabs @activate-tab="handleTabActive">
        <b-tab :title="$t('sales-prepaid-service-tab.remaining')">
          <div class="prepaid-service__form-group">
            <label class="prepaid-service__form-label">{{ $t('sales-prepaid-service-tab.current-remaining') }}</label>

            <div class="prepaid-service__form-control">
              <a-input
                v-if="value.isQuantityNoLimit"
                :value="$t('general.no-limit')"
                disabled
                class="prepaid-service__form-input"
              />
              <aha-input-money
                v-else
                :disabled="true"
                :value="value.quantity"
                :class="amountInputClass"
              />
            </div>
          </div>

          <div class="prepaid-service__form-group">
            <label class="prepaid-service__form-label">{{ $t('sales-prepaid-service-tab.new-remaining') }}</label>

            <div class="prepaid-service__form-control prepaid-service__form-control--quantity">
              <a-input
                v-if="isQuantityNoLimit"
                :value="$t('general.no-limit')"
                disabled
                class="prepaid-service__form-input"
              />
              <a-input-money
                v-else
                v-model="clientPrepaidService.quantity"
                :class="amountInputClass"
                :disabled="isQuantityNoLimit"
                :max-length="maxLengthInputMoney"
                :accept-empty-string-value="true"
              />

              <b-form-checkbox v-model="isQuantityNoLimit">
                {{ $t('general.no-limit') }}
              </b-form-checkbox>
            </div>
          </div>

          <div class="prepaid-service__form-group">
            <label class="prepaid-service__form-label">{{ $t('general.notes') }}</label>

            <div class="prepaid-service__form-control">
              <b-textarea
                v-model="notes"
                :rows="3"
                :no-resize="true"
                :maxlength="maxNoteLength"
                :disabled="remainingNotesDisabled"
              />
            </div>
          </div>
        </b-tab>

        <b-tab :title="$t('sales-prepaid-service-tab.expiry-date')">
          <div class="prepaid-service__form-group">
            <label class="prepaid-service__form-label">{{ $t('sales-prepaid-service-tab.current-expiry-date') }}</label>

            <div class="prepaid-service__form-control">
              <a-input
                v-if="value.isExpiryNoLimit"
                :value="$t('general.no-limit')"
                disabled
                class="prepaid-service__form-input"
              />
              <aha-date-picker
                v-else
                :disabled="true"
                :value="currentExpiryDate"
                :input-props="expiryDateInputAttrs(true)"
                :popover-visibility="expiryDatePopoverVisibility(true)"
                :class="{'prepaid-service__form-input--disabled': true}"
                class="custom-date-input"
              />
            </div>
          </div>

          <div class="prepaid-service__form-group">
            <label class="prepaid-service__form-label">{{ $t('sales-prepaid-service-tab.new-expiry-date') }}</label>

            <div class="prepaid-service__form-control prepaid-service__form-control--expiry">
              <a-input
                v-if="isExpiryDateNoLimit"
                :value="$t('general.no-limit')"
                disabled
                class="prepaid-service__form-input"
              />
              <aha-date-picker
                v-else
                v-model="expiryDate"
                :input-props="expiryDateInputAttrs(isExpiryDateNoLimit)"
                class="custom-date-input"
              />

              <b-form-checkbox v-model="isExpiryDateNoLimit">
                {{ $t('general.no-limit') }}
              </b-form-checkbox>
            </div>
          </div>

          <div class="prepaid-service__form-group">
            <label class="prepaid-service__form-label">{{ $t('general.notes') }}</label>

            <div class="prepaid-service__form-control">
              <b-textarea
                v-model="notes"
                :rows="3"
                :no-resize="true"
                :maxlength="maxNoteLength"
                :disabled="expiryNotesDisabled"
              />
            </div>
          </div>
        </b-tab>

        <b-tab :title="$t('sales-prepaid-service-tab.revenue-per-service')">
          <div class="prepaid-service__form-group">
            <label class="prepaid-service__form-label">
              {{ $t('sales-prepaid-service-tab.current-revenue-per-service') }}
            </label>

            <div class="prepaid-service__form-control">
              <aha-input-money
                :disabled="true"
                :class="amountInputClass"
                :value="value.relatedServiceUnitPrice"
                :max-length="maxNewRelatedServiceUnitPriceLength"
              />
            </div>
          </div>

          <div class="prepaid-service__form-group">
            <label class="prepaid-service__form-label">
              {{ $t('sales-prepaid-service-tab.new-revenue-per-service') }}
            </label>

            <div class="prepaid-service__form-control">
              <aha-input-money
                v-model="clientPrepaidService.relatedServiceUnitPrice"
                :class="amountInputClass"
                :max-length="maxNewRelatedServiceUnitPriceLength"
                accept-empty-string-value
              />
            </div>
          </div>

          <div class="prepaid-service__form-group">
            <label class="prepaid-service__form-label">
              {{ $t('general.notes') }}
            </label>

            <div class="prepaid-service__form-control">
              <b-textarea
                v-model="notes"
                :rows="maxRows"
                :no-resize="true"
                :maxlength="maxNoteLength"
              />
            </div>
          </div>
        </b-tab>
      </b-tabs>

      <a-error-box :errors="errors" />

      <div class="prepaid-service__actions">
        <a-button
          variant="primary"
          type="submit"
          class="prepaid-service__actions-button prepaid-service__actions-button--submit"
        >
          {{ $t('general.save') }}
        </a-button>

        <a-button
          primary="cancel"
          class="prepaid-service__actions-button prepaid-service__actions-button--cancel text-white"
          @click="$emit('cancel', $event)"
        >
          {{ $t('general.cancel') }}
        </a-button>
      </div>
    </form>
  </div>
</template>

<script>
// Utilities
import { checkNullAndEmptyAndUndefined } from 'CommonHelpers'
import { convertTimestampToDate, convertDateToMomentUTC, convertTimestampToMomentUTC } from 'Modules/calendar/utils/index'

// Components
import AInput from 'Modules/aha/a-input/a-input.vue'
import AButton from 'Modules/aha/a-button/a-button.vue'
import AErrorBox from 'Modules/aha/a-error-box/a-error-box.vue'
import AInputMoney from 'Modules/aha/a-input-money/a-input-money.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import AhaDatePicker from 'CommonComponents/aha-date-picker/aha-date-picker.vue'
import AhaInputMoney from 'CommonComponents/aha-input-money/aha-input-money.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

// Models
import ClientPrepaidService from 'Models/client/clientPrepaidService'

// Constants
import { options } from 'OptionsHelpers'
import { sales_options } from 'Options/sales-options'
import { PREPAID_SERVICE_DATA_RULES } from 'SystemDataRules'

const MAXROWS = 3
const MAX_NOTES_LENGTH = 200
const MAX_LENGTH_INPUT_MONEY = 4

export default {
  components: {
    AInput,
    AButton,
    AErrorBox,
    AInputMoney,
    AhaDatePicker,
    AhaInputMoney,
  },

  extends: ComponentBase,

  mixins: [DeviceMixin],

  props: {
    value: {
      type:    ClientPrepaidService,
      default: () => new ClientPrepaidService(),
    },
  },

  data() {
    return {
      notes:                     '',
      errors:                    [],
      maxRows:                   MAXROWS,
      isQuantityNoLimit:         false,
      isExpiryDateNoLimit:       false,
      prepaidServiceHistoryType: sales_options.prepaid_service_history_type_enum.quantity_edit,

      clientPrepaidService: new ClientPrepaidService(),
    }
  },

  computed: {
    prepaidServiceClass() {
      return ['prepaid-service', {
        'prepaid-service--mobile': this.isMobileDevice,
      }]
    },

    amountInputClass() {
      return [
        'form-control',
        'prepaid-service__form-input',
        'prepaid-service__form-input--amount',
      ]
    },

    expiryDate: {
      get() {
        if (!this.clientPrepaidService.expiryDateTS) {
          return null
        }

        return convertTimestampToDate(this.clientPrepaidService.expiryDateTS)
      },

      set(expiryDate) {
        this.clientPrepaidService.expiryDateTS = convertDateToMomentUTC(expiryDate).endOf('day').unix()
      },
    },

    currentExpiryDate() {
      return convertTimestampToDate(this.value.expiryDateTS)
    },

    remainingNotesDisabled() {
      return this.value.quantity === options.enum_no_limit && this.isQuantityNoLimit
    },

    expiryNotesDisabled() {
      return this.value.expiryDateTS === options.enum_no_limit && this.isExpiryDateNoLimit
    },

    maxLengthInputMoney () {
      return MAX_LENGTH_INPUT_MONEY
    },

    maxNewRelatedServiceUnitPriceLength(){
      return PREPAID_SERVICE_DATA_RULES.MAX_SALES_PRICE_LENGTH
    },

    maxNoteLength() {
      return MAX_NOTES_LENGTH
    },
  },

  watch: {
    value: {
      deep:      true,
      immediate: true,
      handler(value) {
        if (value instanceof ClientPrepaidService && value.diff(this.clientPrepaidService)) {
          this.clientPrepaidService = value.clone()

          this.clientPrepaidService.quantity = ''
          this.clientPrepaidService.expiryDateTS = ''
          this.clientPrepaidService.relatedServiceUnitPrice = ''
          this.isQuantityNoLimit = value.quantity === options.enum_no_limit
          this.isExpiryDateNoLimit = value.expiryDateTS === options.enum_no_limit
        }
      },
    },

    isQuantityNoLimit(newValue, oldValue) {
      if (oldValue && !newValue) {
        this.clientPrepaidService.quantity = null
      }
    },

    isExpiryDateNoLimit(newValue, oldValue) {
      if (oldValue && !newValue) {
        this.clientPrepaidService.expiryDateTS = 0
      }
    },
  },

  methods: {
    expiryDateInputAttrs(disabled = false) {
      return {
        disabled,
        placeholder: '',
        class:       [
          'prepaid-service__form-input',
          'prepaid-service__form-input--date',
        ],
      }
    },

    expiryDatePopoverVisibility(disabled = false) {
      return disabled ? 'hidden' : 'focus'
    },

    handleTabActive(activeTab) {
      if (activeTab === 0) {
        this.prepaidServiceHistoryType = sales_options.prepaid_service_history_type_enum.quantity_edit
      } else if (activeTab === 1) {
        this.prepaidServiceHistoryType = sales_options.prepaid_service_history_type_enum.expiry_date_edit
      } else if (activeTab === 2) {
        this.prepaidServiceHistoryType = sales_options.prepaid_service_history_type_enum.revenue_per_service_edit
      }

      this.errors = []
      this.clientPrepaidService = this.value.clone()

      this.clientPrepaidService.quantity = ''
      this.clientPrepaidService.expiryDateTS = ''
      this.clientPrepaidService.relatedServiceUnitPrice = ''

      this.isQuantityNoLimit = this.value.quantity === options.enum_no_limit
      this.isExpiryDateNoLimit = this.value.expiryDateTS === options.enum_no_limit

    },

    handleFormSubmit(event) {
      event.preventDefault()

      this.errors = []

      const isQuantityEdited = this.prepaidServiceHistoryType === sales_options.prepaid_service_history_type_enum.quantity_edit
      const isExpiryDateEdited = this.prepaidServiceHistoryType === sales_options.prepaid_service_history_type_enum.expiry_date_edit
      const isRevenuePerServiceEdited =
        this.prepaidServiceHistoryType === sales_options.prepaid_service_history_type_enum.revenue_per_service_edit

      const requiredText = this.$t('validate_messages.require')
      const newRemaining = this.$t('sales-prepaid-service-tab.new-remaining')
      const newExpiryDate = this.$t('sales-prepaid-service-tab.new-expiry-date')
      const newRevenuePerServiceText = this.$t('sales-prepaid-service-tab.new-revenue-per-service')
      const currentRevenuePerServiceText = this.$t('sales-prepaid-service-tab.current-revenue-per-service')
      let newRevenuePerServiceIsRequired = this.$t('validate_messages.required-new-revenue-per-service')
      const differentCurrentRelatedServiceText =
        this.$t('sales-prepaid-service-tab.new_related_service_unit_price-different-current_related_service_unit_price', {
          new:     newRevenuePerServiceText,
          current: currentRevenuePerServiceText,
        })

      if (isQuantityEdited) {
        if (this.clientPrepaidService.quantity !== 0 && !this.clientPrepaidService.quantity && !this.isQuantityNoLimit) {
          this.errors.push(requiredText.replace('{field}', `<span>${newRemaining}</span>`))
        } else if (
          this.clientPrepaidService.quantity === this.value.quantity ||
          (this.isQuantityNoLimit && this.value.quantity === options.enum_no_limit)
        ) (
          this.errors.push(this.$t('sales-prepaid-service-tab.new-remaining-different-current-remaining'))
        )
      }

      if (isExpiryDateEdited) {
        if (!this.clientPrepaidService.expiryDateTS && !this.isExpiryDateNoLimit) {
          this.errors.push(requiredText.replace('{field}', `<span>${newExpiryDate}</span>`))
        } else {
          const isSameNoLimit = this.value.expiryDateTS === options.enum_no_limit && this.isExpiryDateNoLimit

          const expiryDate = convertTimestampToMomentUTC(this.value.expiryDateTS)
          const newExpiryDate = convertTimestampToMomentUTC(this.clientPrepaidService.expiryDateTS)

          if (isSameNoLimit || expiryDate.isSame(newExpiryDate, 'date')) {
            this.errors.push(this.$t('sales-prepaid-service-tab.new-expiry-different-current-expiry'))
          }
        }
      }
      checkNullAndEmptyAndUndefined
      if (isRevenuePerServiceEdited) {
        const unitPrice = this.clientPrepaidService.relatedServiceUnitPrice

        if (checkNullAndEmptyAndUndefined(unitPrice)) {
          this.errors.push(
            newRevenuePerServiceIsRequired.replace('{field}', `<span>${newRevenuePerServiceText}</span>`),
          )
        } else if (Number(unitPrice) === this.value.relatedServiceUnitPrice) {
          this.errors.push(differentCurrentRelatedServiceText)
        }
      }

      if (this.isQuantityNoLimit && this.isExpiryDateNoLimit) {
        this.errors.push(this.$t('sales-prepaid-service-tab.no-limit-error-message'))
      }

      if (this.errors.length > 0) {
        return
      }

      if (isQuantityEdited && this.isQuantityNoLimit) {
        this.clientPrepaidService.quantity = options.enum_no_limit
      }

      if (isExpiryDateEdited && this.isExpiryDateNoLimit) {
        this.clientPrepaidService.expiryDateTS = options.enum_no_limit
      }

      this.$emit('submit', {
        notes:                     this.notes,
        id:                        this.clientPrepaidService.id,
        clientId:                  this.clientPrepaidService.clientId,
        clientName:                this.clientPrepaidService.clientName,
        prepaidServiceHistoryType: this.prepaidServiceHistoryType,
        prepaidServiceOwnerId:     this.clientPrepaidService.clientId,

        quantity:                isQuantityEdited ? this.clientPrepaidService.quantity : this.value.quantity,
        expiryDateTS:            isExpiryDateEdited ? this.clientPrepaidService.expiryDateTS : this.value.expiryDateTS,
        relatedServiceUnitPrice: isRevenuePerServiceEdited ? this.clientPrepaidService.relatedServiceUnitPrice : this.value.relatedServiceUnitPrice,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./prepaid-service-form.scss";
</style>
