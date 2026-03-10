<template>
  <div class="sales-detail__container">
    <sales-detail
      v-if="isSalesDetailComponentLoaded"

      :is_readonly="false"
      :is_call_api="false"
      :visible="isSalesDetailShown"
      :is-from-calendar="isFromCalendar"

      @on-edit-sales="handleEditSalesClick"
      @hidden="handleSalesDetailModalHidden"
      @on-add-payment="handleAddPaymentClick"
      @on-delete-sales="handleDeleteSalesClick"
      @on-delete-refund-sales="handleSalesDeleteRefund"
    />

    <draft-sales-action
      v-if="isDraftSalesActionComponentLoaded"

      ref="draftSalesAction"
      :visible="isSalesActionShown"

      @edited="handleSalesEdited"
      @hidden="handleSalesActionModalHidden"
      @handle-revise-payment="handleRevisePayment"
      @hide-naver-payment-request="hideNaverPaymentRequest"
      @on-edited-sales-when-requesting-payment="handleNaverBookingPaymentRequesting"
      @update-sales-detail-after-revise-payment-completed="handleUpdateSalesAfterRevisePaymentCompleted"
    />
  </div>
</template>

<script>
// Utilities
import i18n from 'Translate'
import { cloneDeep } from 'lodash'
import { mapMutations, mapState, mapActions } from 'vuex'
import { convertDateToTimezone, convertDateToMomentUTC } from 'Modules/calendar/utils/index'

// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Apis
import * as salesApi from 'Modules/api/sales/sales-api'

// Models
import Booking from 'Models/booking/booking'

// View Models
import SalesViewModel from 'ViewModels/sales/sales/sales-view-model'
import SalesDeleteViewModel from 'ViewModels/sales/sales/sales-delete-view-model'

// Mixins
import ClientSalesInventory from 'Modules/clients/mixins/client-sales-inventory.js'

// Constant
import { ADMIN_ENUMS } from 'Constant'
import { options } from 'OptionsHelpers'
import { sales_options } from 'Options/sales-options'

const SALES_TRANSFER_EXIST_ERROR = 'SA113C'
export default {
  components: {
    SalesDetail:      () => import('Components/sales/sales-detail/sales-detail.vue'),
    DraftSalesAction: () => import('Components/sales/draft/draft-sales-action/draft-sales-action.vue'),
  },

  extends: ComponentBase,
  mixins:  [
    ClientSalesInventory('_calendar/checkoutAction'),
  ],

  props: {
    isFromCalendar: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      sales:   {},
      booking: new Booking(),

      isSalesDetailShown: false,
      isSalesActionShown: false,

      isSalesDetailComponentLoaded:      false,
      isDraftSalesActionComponentLoaded: false,
      isSalesDeleteError:                false,
    }
  },

  computed: {
    ...mapState('authentication', [
      'user',
      'shop',
    ]),

    ...mapState('_calendar/bookings', [
      'bookingSet',
    ]),

    originalBooking() {
      if (this.sales?.bookingId) {
        return this.bookingSet?.[this.sales.bookingId]
      }

      return this.bookingSet?.[this.booking.bookingId]
    },
  },

  watch: {
    isSalesDetailShown: {
      handler(isSalesDetailShown) {
        this.isSalesDetailComponentLoaded = isSalesDetailShown || true
      },
    },

    isSalesActionShown: {
      handler(isSalesActionShown) {
        this.isDraftSalesActionComponentLoaded = isSalesActionShown || true
      },
    },
  },

  methods: {
    ...mapMutations('sales',[
      'setSalesAction',
    ]),

    ...mapActions('_calendar/bookings', [
      'updateBooking',
    ]),

    ...mapActions('_calendar/checkoutAction/client', [
      'getClientHistorySales',
    ]),

    /**@param {Booking} booking*/
    async showFromBooking(booking) {
      try {
        this.preLoader()

        const response = await salesApi.getSalesByBookingId({
          shopId:       booking.shopId,
          bookingId:    booking.bookingId,
          clientShopId: booking.clientShopId,
        })

        this.booking = booking
        this.sales = response?.data?.result

        const salesViewModel = new SalesViewModel()
        salesViewModel.mapFieldsFromApi(this.sales)

        const salesAction = {
          data:   salesViewModel.fields,
          action: options.form_actions.view,

          options: {
            status:           salesViewModel.fields.ref_status,
            sales_goods_type: sales_options.sales_goods_type.service,
          },
        }

        this.setSalesAction(salesAction)
        this.isSalesDetailShown = true
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async showFromSales(sales) {
      try {
        this.preLoader()

        const response = await salesApi.getSalesLive({
          shopId:       sales.shopId,
          status:       sales.refStatus,
          salesNumber:  sales.salesNumber,
          clientShopId: sales.clientShopId,
        })

        this.sales = response?.data?.result
        const hasSalesTransferHistory = sales?.hasSalesTransferHistory || false
        this.sales.hasSalesTransferHistory = hasSalesTransferHistory

        const salesViewModel = new SalesViewModel()
        salesViewModel.mapFieldsFromApi(this.sales)

        const salesAction = {
          data:   salesViewModel.fields,
          action: options.form_actions.view,

          options: {
            status:           salesViewModel.fields.ref_status,
            sales_goods_type: sales_options.sales_goods_type.service,
          },
        }
        this.setSalesAction(salesAction)
        this.isSalesDetailShown = true
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleEditSalesClick(action, sales) {
      const salesAction = {
        data:   sales,
        action: action,

        options: {
          status:           sales.ref_status,
          sales_goods_type: sales_options.sales_goods_type.service,
        },
      }

      this.setSalesAction(salesAction)

      // Condition to open Edit Cancellation Fee Sale Staff only
      const isCancelOrNoShow = sales.sales_type === ADMIN_ENUMS.SALES_TYPE.NONE
      if(action === options.form_actions.edit && isCancelOrNoShow) {
        return this.$emit('show-edit-cancellation-staff-only')
      }

      this.isSalesActionShown = true
    },

    handleSalesEdited(editedSales) {
      this.isSalesDetailShown = false
      this.$emit('sales-edited', editedSales)
    },

    async handleDeleteNaverSales(sales) {
      try {
        this.preLoader()

        const deleteSalesViewModel = new SalesDeleteViewModel()
        deleteSalesViewModel.setSalesDeleteFromSales(sales)

        const response = await salesApi.deleteSalesByPayAtSalon(deleteSalesViewModel.mapFieldsToNaverApi())

        if (!this.originalBooking) return

        const cloneBooking = cloneDeep(this.originalBooking)
        cloneBooking.extSystemBookingDescriptionBase.refundAmount = response?.data?.result?.externalSystemBookingRefund?.refundAmount
        cloneBooking.extSystemBookingDescriptionBase.refundDateTimeTS = response?.data?.result?.externalSystemBookingRefund?.refundDateTimeTS || 0

        this.updateBooking({
          booking: {
            ...cloneBooking,

            cancellationFee: null,
            salesId:         null,
            status:          response?.data?.result.bookingStatus ?? options.booking.booking_status.arrived,
          },
        })

        return response?.data?.result || null
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleDeleteSales(sales) {
      try {
        this.preLoader()

        const now = convertDateToTimezone()

        const respsonse = await salesApi.deleteSales({
          shopId:      sales.shopId,
          clientId:    sales.clientId,
          salesNumber: sales.salesNumber,

          deletedById:       this.user.user_id,
          deletedByName:     this.user.user_name,
          shopLocation:      this.shop.shop_location,
          sessionToken:      this.user.session_token,
          deletedDateTimeTS: convertDateToMomentUTC(now).unix(),
        })

        if (!this.originalBooking) return

        this.updateBooking({
          booking: {
            ...this.originalBooking,

            salesId:         null,
            cancellationFee: null,
            status:          this.originalBooking.cancellationFee
              ? options.booking.booking_status.no_show
              : options.booking.booking_status.arrived,
          },
        })

        return respsonse?.data?.result || null
      } catch (error) {
        if(error.isApiError()) {
          if(error.codes.includes(SALES_TRANSFER_EXIST_ERROR)) {
            return this._showDialogAlert(i18n.t('sales-transfer-history.cannot-delete-sales-has-sales-transfer-history'))
          }
          this._showDialogAlert(error.message)
          this.isSalesDeleteError = true
          return
        }
        this._showDialogAlert(error.message)
        this.isSalesDeleteError = true
      } finally {
        this.preLoader(false)
      }
    },

    async handleDeleteSalesClick() {
      try {
        const isDeleteConfirmed = await this._showDialogConfirm(i18n.t('general.warning-delete'), {
          confirmBtnColor: 'red',
          confirmBtnText:  i18n.t('general.delete'),
        })
        if (!isDeleteConfirmed) return

        if (this.sales.bookingSource === options.booking.booking_source.naver) {
          const salesViewModel = new SalesViewModel()
          salesViewModel.mapFieldsFromApi(this.sales)

          await this.handleDeleteNaverSales(salesViewModel.fields)
        } else {
          await this.handleDeleteSales(this.sales)
        }

        this.isSalesDetailShown = false
        await this.$emit('sales-deleted', this.isSalesDeleteError)
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async handleSalesDeleteRefund(sales, callback) {
      try {
        const isConfirmed = await this._showDialogConfirm(i18n.t('naver-sales-refund-payment.refund-delete-confirm-message'), {
          confirmBtnColor: 'red',
          confirmBtnText:  i18n.t('naver-sales-refund-payment.refund'),
        })

        if (!isConfirmed) return

        await this.handleDeleteNaverSales(sales)

        if (typeof callback === 'function') {
          callback()
        }

        this.isSalesDetailShown = false
        this.$emit('sales-deleted')
      } catch (error) {
        if(error.isApiError()) {
          if(error.codes.includes(SALES_TRANSFER_EXIST_ERROR)) {
            return this._showDialogAlert(i18n.t('sales-transfer-history.cannot-delete-sales-has-sales-transfer-history'))
          }
          this._showDialogAlert(error.message)
          return
        }
        this._showDialogAlert(error.message)
      }
    },

    handleSalesActionModalHidden() {
      this.isSalesActionShown = false
    },

    handleSalesDetailModalHidden() {
      Object.assign(this.$data, this.$options.data.call(this), {
        isSalesDetailComponentLoaded:      this.isSalesDetailComponentLoaded,
        isDraftSalesActionComponentLoaded: this.isDraftSalesActionComponentLoaded,
      })
    },

    handleRevisePayment() {
      /**
       * Emit event to reload sales history when revise payment is called
       * This event is emitted to checkout-form component
       * @event handle-revise-payment
      */
      this.$emit('handle-revise-payment')
    },

    hideNaverPaymentRequest() {
      /**
       * Emit event to reload sales history when cancel request payment is called
       * This event is emitted to checkout-form component
       * @event hide-naver-payment-request
      */
      this.$emit('hide-naver-payment-request')
    },

    handleAddPaymentClick(action, sales) {
      const salesAction = {
        data:    sales,
        action:  action,
        options: {
          sales_goods_type: sales_options.sales_goods_type.service,
        },
      }

      this.setSalesAction(salesAction)
      this.$emit('show-add-payment')
    },

    handleNaverBookingPaymentRequesting(addedSales, callback) {
      try {
        this.preLoader()

        this.booking.salesId = addedSales
        this.booking.draftDocumentId = null
        this.booking.status = options.booking.booking_status.checked_out

        this.updateBooking({
          booking: {
            ...this.originalBooking,
            salesId:         addedSales,
            draftDocumentId: null,
            status:          options.booking.booking_status.checked_out,
          },
        })

        this.setSalesAction({
          data:    addedSales,
          action:  options.form_actions.edit,
          options: {
            status:           addedSales.ref_status,
            sales_goods_type: sales_options.sales_goods_type.service,
          },
        })

        if (this.$refs?.draftSalesAction?.$salesActionRef_onLoadForm) {
          this.$refs?.draftSalesAction?.$salesActionRef_onLoadForm()
        }

        if (typeof callback === 'function') {
          callback()
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleUpdateSalesAfterRevisePaymentCompleted(sales, options) {
      try {
        this.preLoader()

        const response = await salesApi.getSalesByBookingId({
          shopId:    this.shop_data.shop_id,
          bookingId: sales.data.booking_id,
        })

        const salesData = response?.data?.result

        const salesViewModel = new SalesViewModel()
        salesViewModel.mapFieldsFromApi(salesData)

        const updatedSales = salesViewModel.fields || sales.data

        if(options?.isUpdateCoupon) {
          updatedSales.naver_sales_info.description_base.externalSystemCouponInfo = options?.updatedCouponInfo
          salesData.naverSalesInfo.descriptionBase.externalSystemCouponInfo = options?.updatedCouponInfo
        }

        this.setSalesAction({
          ...sales,
          data: updatedSales,
        })

        this.sales = salesData
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },
  },
}
</script>

