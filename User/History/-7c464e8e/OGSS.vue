<!-- Fix eslint Bug for spacings + css pre, pre-line after upgrade Node v20.18.1 : https://gitlab.com/ahasoft-leaders1/ahaplus-shop/-/issues/67 -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<template>
  <div :class="naverInfoClass">
    <div class="naver-info__description">
      <ul class="naver-info__description-list">
        <template v-if="hasRefund">
          <li class="naver-info__description-item">
            <div class="naver-info__description-name naver-info__description-name--refund">
              [{{ $t("naver-booking-description.refund") }}]
            </div>
            <div class="naver-info__description-value naver-info__description-value--refund">
              {{ refundAmount | formatMoney }}
            </div>
            (<span>{{ refundDateTS | formatDate }}xxx</span>)
          </li>
        </template>

        <li class="naver-info__header">
          <span class="naver-info__title">[{{ $t('naver-booking-description.naver') }}] </span>
          <span>{{ bookedItemText }}</span>
        </li>
        <!-- <li class="naver-info__description-item">
          <div class="naver-info__description-name">Booked items:</div>
          <div class="naver-info__description-value">{{ bookedItemText }}</div>
        </li> -->

        <template v-if="isCouponShown">
          <li class="naver-info__description-item naver-info__description-item--coupon">
            <span class="naver-info__description-name">
              [{{ $t('naver-booking-description.coupon.coupon') }}]&nbsp;{{ couponDetail }}
            </span>
          </li>
        </template>

        <li class="naver-info__description-item">
          <div class="naver-info__description-name">
            [{{ totalAmountTitle }}]
          </div>
          <div class="naver-info__description-value">
            {{ totalAmount | formatMoney }}
          </div>
        </li>

        <template v-if="hasBookingDeposit">
          <li class="naver-info__description-item">
            <div class="naver-info__description-name">
              [{{ $t("naver-booking-description.booking-deposit") }}]
            </div>
            <div class="naver-info__description-value">
              {{ bookingDeposit | formatMoney }}
            </div>
          </li>
        </template>

        <template v-if="isNaverBookingPayAtSalon">
          <li class="naver-info__description-item">
            <div class="naver-info__description-name">
              [{{ $t("naver-booking-description.pay-at-salon") }}]
            </div>
            <div class="naver-info__description-value">
              {{ payAtSalon | formatMoney }}
            </div>
          </li>

          <li class="naver-info__description-item">
            <div class="naver-info__description-name">
              [{{ $t("naver-booking-description.payment-method") }}]&nbsp;{{ extSystemSelectedPaymentProviderName }}
            </div>
          </li>
        </template>
      </ul>
    </div>

    <naver-additional-information
      v-if="isAdditionalInformationShow"
      :additional-information="additionalInformation"
    />

    <template v-if="requestMessage">
      <div class="naver-info__request">
        <h3 class="naver-info__request-title">
          {{ $t("naver-booking-description.requests") }}
        </h3>

        <a-content-collapse
          v-if="isMobileDevice"
          :line-height="18"
          class="naver-info__request-message"
        >{{ requestMessage }}</a-content-collapse>
        <div
          v-else
          class="naver-info__request-message"
        >{{ requestMessage }}</div>
      </div>
    </template>

    <naver-visitor-info
      v-if="isVisitorInfoShow"
      :visitor-information="visitorInformation"
    />
  </div>
</template>

<script>
// Utilities
import moment from 'moment'
import { formatMoney } from 'CommonHelpers'

// Components
import AContentCollapse from 'Modules/aha/a-content-collapse/a-content-collapse.vue'
import NaverVisitorInfo from './components/naver-visitor-info/naver-visitor-info.vue'
import NaverAdditionalInformation from './components/naver-additional-information/naver-additional-information.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import { generateBookingRules } from 'Modules/calendar/mixins/booking'

// Models
import ExternalSystemCouponInfo from 'Models/booking/externalSystemCouponInfo'

// Constants
import { BOOKING_EXTERNAL_SYSTEM_SELECTED_PAYMENT_PROVIDER } from 'Constant'

export default {
  filters: {
    formatMoney(value) {
      return formatMoney(value, 0)
    },

    formatDate(value) {
      return moment.unix(value).utc().format('YYYY-MM-DD')
    },
  },

  components: {
    AContentCollapse,
    NaverVisitorInfo,
    NaverAdditionalInformation,
  },

  mixins: [
    DeviceMixin,
    generateBookingRules('booking'),
  ],

  props: {
    booking: {
      type:    Object,
      default: () => null,
    },
  },

  computed: {
    naverInfoClass() {
      return ['naver-info', {
        'naver-info--mobile': this.isMobileDevice,
      }]
    },

    bookedItems() {
      return this.extSystemBookingDescriptionBase.bookedItems ?? []
    },

    bookedItemText() {
      return this.bookedItems.join(', ')
    },

    totalAmount() {
      return this.extSystemBookingDescriptionBase.totalAmount
    },

    totalAmountTitle() {
      if (this.isNaverBookingGeneral) {
        return this.$t('naver-booking-description.estimated-amount')
      }

      if (this.isNaverBookingPrePayment) {
        return this.$t('naver-booking-description.prepayment')
      }

      return this.$t('naver-booking-description.amount')
    },

    couponDetail() {
      // Gift Coupon
      if(this.externalSystemCouponInfo.isGiftCoupon) {
        return this.externalSystemCouponInfo?.getFormattedCouponName
      }

      return this.$t('naver-booking-description.coupon.description-coupon-amount', {
        couponName: this.externalSystemCouponInfo.getFormattedCouponName,
        amount:     this.$options.filters.formatMoney(this.externalSystemCouponInfo.discountAmountCoupon),
      })
    },

    isCouponShown() {
      if (!this.externalSystemCouponInfo) return false

      return !this.isNaverBookingPayAtSalon || !this.externalSystemCouponInfo.isGiftCoupon
    },

    hasRefund() {
      return this.refundAmount !== null && this.refundAmount !== undefined
    },

    refundAmount() {
      return this.extSystemBookingDescriptionBase.refundAmount
    },

    refundDateTS() {
      return this.extSystemBookingDescriptionBase.refundDateTimeTS
    },

    bookingDeposit() {
      return this.extSystemBookingDescriptionBase.bookingDeposit
    },

    hasBookingDeposit() {
      return this.isNaverBookingPayAtSalon && this.bookingDeposit
    },

    payAtSalon() {
      return this.extSystemBookingDescriptionBase.payAtSalon
    },

    extSystemSelectedPaymentProviderName() {
      if (this.booking.extSystemSelectedPaymentProvider === BOOKING_EXTERNAL_SYSTEM_SELECTED_PAYMENT_PROVIDER.NONE) {
        return this.$t('naver-booking-description.cash-or-card-payment')
      }

      if (this.booking.extSystemSelectedPaymentProvider === BOOKING_EXTERNAL_SYSTEM_SELECTED_PAYMENT_PROVIDER.NAVER_PAY) {
        return this.$t('naver-booking-description.npay-payment')
      }

      return ''
    },

    requestMessage() {
      return this.extSystemBookingDescriptionBase.requestMessage
    },

    additionalInformation() {
      return this.extSystemBookingDescriptionBase?.additionalInformation ?? []
    },

    isAdditionalInformationShow() {
      return this.additionalInformation.length > 0
    },

    externalSystemCouponInfo() {
      if (!this.extSystemBookingDescriptionBase.externalSystemCouponInfo) return null

      return ExternalSystemCouponInfo.build(this.extSystemBookingDescriptionBase.externalSystemCouponInfo)
    },

    extSystemBookingDescriptionBase() {
      return this.booking.extSystemBookingDescriptionBase
    },

    isVisitorInfoShow() {
      return this.visitorInformation !== null
    },

    visitorInformation() {
      return this.extSystemBookingDescriptionBase?.externalSystemVisitorInfo || null
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./booking-naver-info.scss";
</style>
