<template>
  <main class="app-content">
    <section class="content home-page">
      <div class="inner">
        <!-- Board Service -->
        <!-- Todo Check -->
        <article class="row-info">
          <template v-if="hasNotChain">
            <ul class="single-shop">
              <home-board-client-support
                :data="client_support_data_view"
                :is-error="is_load_payment_shop_ussage_failed"
                :is-loading="is_loading_payment_shop_ussage_data"
                class="client-support"
              />
              <home-board
                :data="system_notice_data_view"
                :is_error="is_load_home_board_failed"
                :is_loading="is_loading_home_board_data"
                class="system-notice"
                @click="onSetBoardPage(options.boards_enum.board_type.sys_notice)"
              />
              <home-board
                :data="salon_qna_data_view"
                :is_error="is_load_home_board_failed"
                :is_loading="is_loading_home_board_data"
                class="salon-qna"
                @click="onSetBoardPage(options.boards_enum.board_type.sys_board)"
              />
            </ul>
          </template>
          <template v-if="hasChain">
            <ul class="chain-shop-first-line">
              <home-board-client-support
                :data="client_support_data_view"
                :is-error="is_load_payment_shop_ussage_failed"
                :is-loading="is_loading_payment_shop_ussage_data"
                class="client-support"
              />
              <home-board
                :data="system_notice_data_view"
                :is_error="is_load_home_board_failed"
                :is_loading="is_loading_home_board_data"
                class="system-notice"
                @click="onSetBoardPage(options.boards_enum.board_type.sys_notice)"
              />
              <home-board
                :data="headquater_notice_data_view"
                :is_error="is_load_home_board_failed"
                :is_loading="is_loading_home_board_data"
                class="headquater-notice"
                @click="onSetBoardPage(options.boards_enum.board_type.chn_notice)"
              />
            </ul>
            <ul class="chain-shop-second-line">
              <home-board
                :data="salon_qna_data_view"
                :is_error="is_load_home_board_failed"
                :is_loading="is_loading_home_board_data"
                class="salon-qna"
                @click="onSetBoardPage(options.boards_enum.board_type.sys_board)"
              />
              <home-board
                v-if="board_type != options.boards_enum.branch_board_type.none"
                :data="chain_board_data_view"
                :is_error="is_load_home_board_failed"
                :is_loading="is_loading_home_board_data"
                class="branch-board"
                @click="onSetBoardPage(options.boards_enum.board_type.chn_board)"
              />
            </ul>
          </template>
        </article>

        <article
          v-if="hasNotChain"
          class="row-sales"
        >
          <ul>
            <li
              v-if="!isHide"
              class="report-sales-today"
            >
              <sales-today
                :items="sales_today_data_view"
                :is_loading="is_loading_sales_today"
                :head_title="$t('home.sales-today')"
                :total_title="$t('sales.sales-total')"
                :total="x_sales_today_data.net_sales_total"
                :is_error="is_load_sales_today_reports_failed"
              />
            </li>
            <li class="report-booking-today">
              <sales-today
                :items="booking_today_data_view"
                :is_loading="is_loading_booking_today"
                :head_title="$t('home.booking-today')"
                :is_error="is_load_booking_today_reports_failed"
              />
            </li>
            <li class="report-client-today">
              <sales-today
                :total="client_today_total"
                :items="client_today_data_view"
                :total_title="$t('home.total')"
                :is_loading="is_loading_client_today"
                :head_title="$t('home.client-today')"
                :is_error="is_load_client_today_reports_failed"
              />
            </li>
          </ul>
        </article>
      </div>
    </section>
    <AlertConfirm
      :id="expirationModalId"
      :hide-header-close="false"
      :label_no="$t('general.close')"
      :data_alerts="alertExpireMessage"
      :hide_yes="isMobileApp"
      :label_yes="$t('home.service-extend')"
      :yes_button_style="alertExpireYesButtonStyle"

      @confirm="onClickConfirm"
    />
    <home-tax-invoice-modal :shop_name="shop_data.shop_name" />
    <home-text-sender-phone-modal :shop_name="shop_data.shop_name" />
    <home-service-agreement-modal />
    <home-owner-mobile-verify-modal />
    <home-welcome-payment-modal :left_day="shop_expiry_date_diff" />
    <popup-view-modal
      v-for="popupData in popup_data_list"
      :key="popupData.modal_id"
      :popup_info="popupData"
      :modal_id="popupData.unique_modal_id"
    />
  </main>
</template>

<script>
import {
  formatMoney,
  convertDateToTimezone,
  convertDateToTimeStamp,
  getCurrentSettingDateTimeTS,
  convertTimeStampPlusLocalzone,
  convertDateFromTimezoneToTimestamp,
  parseDateTSToMomentByShopSettingTimezone,
  checkMobileApp,
} from 'CommonHelpers'
import moment from 'moment'
import { ApiError } from 'HTTPHelpers'
import cloneDeep from 'lodash/cloneDeep'
import { mapGetters, mapMutations, mapActions } from 'vuex'

// Constants
import { options } from 'OptionsHelpers'
import { MINIMUM_LOADING_ANIMATION_TIME, ADMIN_ENUMS, ENVIRONMENT, USER_ROLES } from 'Constant'

// Mixins
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'

// API

import SalesApi from 'API/sales/sales-api'
import ReportApi from 'API/sales/report-api'
import HomepageApi from 'API/boards/homepage-api'
import BaseFeeApi from 'API/account/base-fee-api'
import TextSenderPhoneApi from 'API/messages/text-sender-phone-api'
import PaymentShopUsageApi from 'API/account/payment-shop-info-api'

// View Model
import ShopEnvironmentSetupViewModel from 'ViewModels/account/shop-environment-setup-view-model'

// Components
import HomeBoard from 'CommonComponents/home-board/home-board.vue'
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import SalesToday from 'CommonComponents/sales-today/sales-today.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import HomeTaxInvoiceModal from 'CommonComponents/home-tax-invoice-modal/home-tax-invoice-modal.vue'
import HomeBoardClientSupport from 'CommonComponents/home-board-client-support/home-board-client-support.vue'
import HomeTextSenderPhoneModal from 'CommonComponents/home-text-sender-phone-modal/home-text-sender-phone-modal.vue'
import HomeServiceAgreementModal from 'CommonComponents/home-service-agreement-modal/home-service-agreement-modal.vue'
import HomeOwnerMobileVerifyModal from 'CommonComponents/home-owner-mobile-verify-modal/home-owner-mobile-verify-modal.vue'
import HomeWelcomePaymentModal from 'Components/common/home-welcome-payment-modal/home-welcome-payment-modal.vue'
import PopupViewModal from '../../../pages/support/popup-view/popup-view.vue'

export default {
  components: {
    HomeBoard,
    SalesToday,
    AlertConfirm,
    HomeTaxInvoiceModal,
    HomeBoardClientSupport,
    HomeTextSenderPhoneModal,
    HomeServiceAgreementModal,
    HomeOwnerMobileVerifyModal,
    HomeWelcomePaymentModal,
    PopupViewModal,
  },
  extends: ComponentBase,
  mixins:  [ SalesCacheMixin ],

  data() {
    return {
      options,

      chain_id:                       0,
      board_type:                     0,
      salon_qna_data:                 null,
      shop_expiry_date:               '',
      chain_board_data:               null,
      system_notice_data:             null,
      post_on_top_system_notice_data: null,
      shop_auto_transfer:             false,
      shop_expiry_date_diff:          0,
      shop_netmoney_balance:          0,
      headquater_notice_data:         null,
      post_on_top_chain_notice_data:  null,

      load_today_sales_timer:             null,
      is_loading_sales_today:             true,
      is_load_sales_today_reports_failed: false,

      load_today_booking_timer:             null,
      is_loading_booking_today:             true,
      is_load_booking_today_reports_failed: false,

      load_today_client_timer:             null,
      is_loading_client_today:             true,
      is_load_client_today_reports_failed: false,

      load_home_board_timer:      null,
      is_loading_home_board_data: true,
      is_load_home_board_failed:  false,

      shop_info:                           {fields: {}},
      load_payment_shop_ussage_timer:      null,
      is_loading_payment_shop_ussage_data: true,
      is_load_payment_shop_ussage_failed:  false,

      is_basefee_exist:       false,
      searchDateRangeNumber:  null,
      shop_environment_setup: null,
      shopNetmoneyBalance:    0,
      currentOrder:           0,
      popup_data_list:        [],
      uniquePopupId:          '',
    }
  },

  computed: {
    // notice
    ...mapGetters('home', {
      x_sales_today_data:   'getSalesToday',
      x_booking_today_data: 'getBookingToday',
      x_client_today_data:  'getClientToday',
    }),

    ...mapGetters('shop', {
      shop_environment_data: 'getShopEnvironment',
      tax_invoice_info_data: 'getTaxInvoiceInfo',
      shop_info_data:        'getShopInfoAction',
    }),

    sales_today_data_view() {
      return [
        {
          text:  this.$t('home.service'),
          value: this.x_sales_today_data.service,
        },
        {
          text:  this.$t('home.product'),
          value: this.x_sales_today_data.product,
        },
        {
          text:  this.$t('home.prepaid-card'),
          value: this.x_sales_today_data.prepaid_card,
        },
        {
          text:  this.$t('home.prepaid-service'),
          value: this.x_sales_today_data.prepaid_service,
        },
        {
          text:  this.$t('sales.sales-total'),
          value: this.x_sales_today_data.sales_total,
        },
        {
          text:  this.$t('sales.refund'),
          value: this.x_sales_today_data.refund,
        },
      ]
    },

    booking_today_data_view() {
      return [
        {
          text:  this.$t('home.total'),
          value: this.x_booking_today_data.total,
        },
        {
          text:  this.$t('home.canceled'),
          value: this.x_booking_today_data.canceles,
        },
        {
          text:  this.$t('home.no-show'),
          value: this.x_booking_today_data.no_show,
        },
      ]
    },

    client_today_data_view() {
      return [
        {
          text:  this.$t('home.new'),
          value: this.x_client_today_data.new,
        },
        {
          text:  this.$t('home.repeat'),
          value: this.x_client_today_data.repeat,
        },
        {
          text:  this.$t('home.unregistered-client'),
          value: this.x_client_today_data.unregistered_client,
        },
      ]
    },

    client_today_total() {
      const { new: new_client = 0, repeat: repeat_client = 0, unregistered_client = 0 } = this.x_client_today_data
      return (new_client + repeat_client + unregistered_client)
    },

    client_support_data_view() {
      return {
        head_title:    this.$t('home.ahasoft'),
        expire_date:   this.shop_expiry_date,
        netmoney:      this.shop_netmoney_balance,
        auto_transfer: this.shop_auto_transfer,
      }
    },

    system_notice_data_view() {
      return {
        head_title:        this.$t('home.system-notice'),
        items:             this.system_notice_data,
        post_on_top_items: this.post_on_top_system_notice_data,
        board_code:        options.boards_enum.board_type.sys_notice,
      }
    },
    headquater_notice_data_view() {
      return {
        head_title:        this.$t('home.headquarter-notice'),
        items:             this.headquater_notice_data,
        post_on_top_items: this.post_on_top_chain_notice_data,
        board_code:        options.boards_enum.board_type.chn_notice,
      }
    },
    salon_qna_data_view() {
      return {
        head_title: this.$t('home.salon-qna'),
        items:      this.salon_qna_data,
        board_code: options.boards_enum.board_type.sys_board,
      }
    },

    chain_board_data_view() {
      return {
        head_title: this.$t('home.chain-board'),
        items:      this.chain_board_data,
        board_code: options.boards_enum.board_type.chn_board,
      }
    },

    alertExpireMessage() {
      if(this.isMobileApp && this.shop_expiry_date_diff == 0){
        return [this.$t('home.warning-expiration-date', {
          expired:     this.shop_expiry_date,
          leftdaytext: this.shop_expiry_date_diff == 0 ? this.$t('home.warning-service-end') : this.$t('home.warning-service-left-day').replace('{leftday}',this.shop_expiry_date_diff),
        }) + this.$t('home.warning-app-payment')]
      }
      else{
        return [this.$t('home.warning-expiration-date', {
          expired:     this.shop_expiry_date,
          leftdaytext: this.shop_expiry_date_diff == 0 ? this.$t('home.warning-service-end') : this.$t('home.warning-service-left-day').replace('{leftday}',this.shop_expiry_date_diff),
        })]
      }
    },

    alertExpireYesButtonStyle() {
      if(this.x_user.user_role_code === this.options.user_roles.staff) {
        return 'display : none'
      } else {
        return 'min-width :130px'
      }
    },
    isMobileApp() {
      return checkMobileApp()
    },
    hasNotChain() {
      return this.chain_id === 0
    },

    hasChain() {
      return this.chain_id > 0
    },

    expirationModalId() {
      return 'alert-expiration-date-modal'
    },

    isNotAllowed() {
      return this.searchDateRangeNumber === ENVIRONMENT.STAFF_MANAGER_CAN_SEARCH.NOT_ALLOWED
    },

    isStaffRole() {
      return this.x_user.user_role_code === USER_ROLES.STAFF
    },

    isHide() {
      return this.isStaffRole && this.isNotAllowed
    },
  },
  async mounted() {
    this.chain_id = this.shop_data.chain_id
    this.board_type = this.shop_data.chain_sharing_settings.chain_board_type
    if (!this.shop_info_data.is_ok) {
      await this.loadShopInfo()
    } else {
      this.shop_info.fields = Object.assign({}, this.shop_info_data.data)
      this.shop_auto_transfer = this.shop_info.fields.auto_transfer
    }
    this.loadBasefee()
    this.loadEnvironmentSetup()

    if(this.chain_id == 0){
      this.loadSalesTodayAsync()
      this.loadBookingTodayAsync()
      this.loadClientTodayAsync()
    }
    const modalPromises = [
      this.loadPaymentShopUsage(),
      this.loadBoardData(),
      this.loadTaxInvoice(),
      this.loadTextSenderPhone(),
      this.showNetmoneyAlert(),
    ]
    if(this.shop_data.country === options.country.kr
      && this.x_user.user_role_code === options.user_roles.master) {
      modalPromises.push(this.showServiceAgreementModal())
      modalPromises.push(this.showOwnerMobileVerifyModal())
    }

    await Promise.all(modalPromises)
    await this.$nextTick()

    setTimeout(() => {
      this.updateModalStyles()
    },350)
  },

  methods: {
    ...mapActions('shop', [
      'setShopInfoActionDataAsync',
      'setShopEnvironmentDataAsync',
    ]),

    ...mapMutations('home', [
      'setSalesTodayData',
      'setClientTodayData',
      'setBookingTodayData',
    ]),

    async loadEnvironmentSetup() {
      try {
        this.preLoader()
        const environmentSetup = await this.$salesCacheMixin_getEnvironmentSetup({
          shopId:      this.shop_data.shop_id,
          countryCode: this.shop_data.country,
        })
        if(this.isNullObject(environmentSetup)) {
          this.showMissingSalesSetupAlert()
        } else {
          this.searchDateRangeNumber = environmentSetup.data_protection_security.fields.sales_report_and_invoices_date_range_staff_can_search
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async showNetmoneyAlert() {
      return new Promise(async (resolve) => {
        try {
          const sendDataSetup = {
            shop_id:      this.shop_data.shop_id,
            country_code: this.shop_data.country,
          }

          const paymentShopUsageApi = new PaymentShopUsageApi()
          const shopUsageResult = await paymentShopUsageApi.getPaymentShopUsageAsync({shop_id: this.shop_data.shop_id})

          if(shopUsageResult.is_ok) {
            this.shop_netmoney_balance = shopUsageResult?.data.net_money_balance
          }

          this.shop_environment_setup = new ShopEnvironmentSetupViewModel()
          this.setShopEnvironmentDataAsync(sendDataSetup).then(() => {
            if(!this.shop_environment_data.is_ok) {
              throw new ApiError(this.shop_environment_data.error_messages)
            }
            this.shop_environment_setup = this.shop_environment_data.data
            if(this.shop_environment_setup.fields.netmoney_alarm && (this.shop_environment_setup.fields.netmoney_alarm_amount > this.shop_netmoney_balance))
            {
              this.alert_msg = this.$t('environment-setup.netmoney-alert-message')
              + '<p/>' + this.$t('environment-setup.netmoney-current-balance') + `${formatMoney(this.shop_netmoney_balance, 0)}`
              setTimeout(() => {
                this._showDialogAlert(this.alert_msg)
              }, 100)
              resolve()
            }
            else{
              resolve()
            }
          })
        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    async loadSalesTodayAsync() {
      try {
        if(this.load_today_sales_timer) {
          clearTimeout(this.load_today_sales_timer)
        }
        this.load_today_sales_timer = setTimeout(async () => {
          this.is_loading_sales_today = true
          const dateSetting = convertDateToTimezone(new Date())
          const fromDateTs = convertDateToTimeStamp(dateSetting)
          const toDateTs = convertDateToTimeStamp(cloneDeep(dateSetting).setDate(dateSetting.getDate() + 1)) - 1
          const payload = {
            toDateTs,
            fromDateTs,
            staffId: 0,
            shopId:  this.shop_data.shop_id,
          }
          const salesApi = new SalesApi()
          const response = await salesApi.getSalesBoardHomeReportAsync(payload)
          if(response.is_ok) {
            this.setSalesTodayData(response.data)
          }
          // minimum loading time is 200ms for better UI
          const minimumLoadingTimeout = response.response_time < MINIMUM_LOADING_ANIMATION_TIME ? MINIMUM_LOADING_ANIMATION_TIME : 0
          setTimeout(() => {
            this.is_loading_sales_today = false
            this.is_load_sales_today_reports_failed = !response.is_ok
          }, minimumLoadingTimeout)
        }, 300)
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async loadBookingTodayAsync() {
      try {
        if(this.load_today_booking_timer) {
          clearTimeout(this.load_today_booking_timer)
        }

        this.load_today_booking_timer = setTimeout(async () => {
          this.is_loading_booking_today = true
          const dateSetting = convertDateToTimezone(new Date())
          const currentTime = getCurrentSettingDateTimeTS()
          const fromDateTs = convertDateToTimeStamp(dateSetting)
          const toDateTs = convertDateToTimeStamp(cloneDeep(dateSetting).setDate(dateSetting.getDate() + 1)) - 1
          const payload = {
            toDateTs,
            fromDateTs,
            currentTime,
            shopId: this.shop_data.shop_id,
          }
          const reportApi = new ReportApi()
          const response = await reportApi.getBookingsSummaryByDateReportAsync(payload)
          if(response.is_ok) {
            this.setBookingTodayData(response.data)
          }
          // minimum loading time is 200ms for better UI
          const minimumLoadingTimeout = response.response_time < MINIMUM_LOADING_ANIMATION_TIME ? MINIMUM_LOADING_ANIMATION_TIME : 0
          setTimeout(() => {
            this.is_loading_booking_today = false
            this.is_load_booking_today_reports_failed = !response.is_ok
          }, minimumLoadingTimeout)
        }, 300)
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async loadClientTodayAsync() {
      try {
        if(this.load_today_client_timer) {
          clearTimeout(this.load_today_client_timer)
        }

        this.load_today_client_timer = setTimeout(async () => {
          this.is_loading_client_today = true
          const dateSetting = convertDateToTimezone(new Date())
          const fromDateTs = convertDateToTimeStamp(dateSetting)
          const toDateTs = convertDateToTimeStamp(cloneDeep(dateSetting).setDate(dateSetting.getDate() + 1)) - 1
          const payload = {
            toDateTs,
            fromDateTs,
            shopId: this.shop_data.shop_id,
          }
          const salesApi = new SalesApi()
          const response = await salesApi.getClientBoardHomeReportasync(payload)
          if(response.is_ok) {
            this.setClientTodayData(response.data)
          }
          // minimum loading time is 200ms for better UI
          const minimumLoadingTimeout = response.response_time < MINIMUM_LOADING_ANIMATION_TIME ? MINIMUM_LOADING_ANIMATION_TIME : 0
          setTimeout(() => {
            this.is_loading_client_today = false
            this.is_load_client_today_reports_failed = !response.is_ok
          }, minimumLoadingTimeout)
        }, 300)
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async loadBoardData() {
      try {
        if(this.load_home_board_timer) {
          clearTimeout(this.load_home_board_timer)
        }

        this.load_home_board_timer = setTimeout(async () => {
          // System Notice
          this.is_loading_home_board_data = true
          const tableFilter = {
            shop_id:            this.shop_data.shop_id,
            chain_id:           this.shop_data.chain_id,
            country_code:       this.shop_data.country,
            solution_id:        this.shop_data.solution_id,
            branch_type:        this.shop_data.branch_type,
            business_type_code: this.shop_data.business_type_code,
            today_ts:           convertDateFromTimezoneToTimestamp(convertDateToTimezone(new Date())),
          }
          const homepageApi = new HomepageApi()
          const homepageResult = await homepageApi.getHompageBoardsAsync(tableFilter)
          if(homepageResult.is_ok) {
            this.salon_qna_data = homepageResult.data.system_boards
            this.chain_board_data = homepageResult.data.chain_boards
            this.headquater_notice_data = homepageResult.data.chain_notices
            this.system_notice_data = homepageResult.data.system_notices // If the board
            this.post_on_top_system_notice_data = homepageResult.data.post_on_top_system_notices // If the board
            this.post_on_top_chain_notice_data = homepageResult.data.post_on_top_chain_notices
            //let routeData = {}
            const popupPromisesChain = homepageResult.data.chain_popups.map(async popup => {
              const uniquePopupId = `popup-chain-modal-${popup.popup_id}`
              const uniquePopupIdStorage = localStorage.getItem(uniquePopupId)
              if(!uniquePopupIdStorage) {
                await this.showPopupViewModal(popup,uniquePopupId)
              } else {
                const stored_expiry = JSON.parse(uniquePopupIdStorage)
                if(stored_expiry == null || !moment(new Date(stored_expiry), 'MM/DD/YY',true).isValid()) {
                  throw this.$t('popup-chain-modal', { stored_expiry })
                }
                const localDate= new Date(stored_expiry)
                if(Date.now() > localDate) {
                  localStorage.removeItem(uniquePopupId)
                  await this.showPopupViewModal(popup,uniquePopupId)
                }
              }
            })
            const popupPromisesSystem = homepageResult.data.system_popups.map(async popup => {
              const uniquePopupId = `popup-system-modal-${popup.popup_id}`
              const uniquePopupIdStorage = localStorage.getItem(uniquePopupId)
              if(!uniquePopupIdStorage) {
                await this.showPopupViewModal(popup,uniquePopupId)
              } else {
                const stored_expiry = JSON.parse(uniquePopupIdStorage)
                if(stored_expiry == null || !moment(new Date(stored_expiry), 'MM/DD/YY',true).isValid()) {
                  throw this.$t('popup-system-modal', { stored_expiry })
                }
                const localDate= new Date(stored_expiry)
                if(Date.now() > localDate) {
                  localStorage.removeItem(uniquePopupId)
                  await this.showPopupViewModal(popup,uniquePopupId)
                }
              }
            })

            await Promise.all(popupPromisesChain)
            await Promise.all(popupPromisesSystem)
          }
          // minimum loading time is 200ms for better UI
          const minimumLoadingTimeout = homepageResult.response_time < MINIMUM_LOADING_ANIMATION_TIME ? MINIMUM_LOADING_ANIMATION_TIME : 0
          setTimeout(() => {
            this.is_loading_home_board_data = false
            this.is_load_home_board_failed = !homepageResult.is_ok
          }, minimumLoadingTimeout)
        }, 300)
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },
    async showPopupViewModal(popup,uniquePopupId) {
      return new Promise((resolve) => {
        this.popup_data_list.push({
          popup_id:        popup.popup_id,
          unique_modal_id: uniquePopupId,
          country:         this.shop_data.country,
          title:           popup.title,
          is_system_popup: uniquePopupId.startsWith('popup-system-modal-') ? true : false,
        })
        this.$nextTick(() => {
          setTimeout(() => {
            this.showDialogById(uniquePopupId)
            resolve()
          }, 200)
        })
      })
    },
    async loadPaymentShopUsage() {
      return new Promise((resolve) => {
        try {
          if(this.load_payment_shop_ussage_timer) {
            clearTimeout(this.load_payment_shop_ussage_timer)
          }
          this.load_payment_shop_ussage_timer = setTimeout(async () => {
            this.is_loading_payment_shop_ussage_data = true

            this.preLoader(true)
            const paymentShopUsageApi = new PaymentShopUsageApi()
            const shopUsageResult = await paymentShopUsageApi.getPaymentShopUsageAsync({shop_id: this.shop_data.shop_id})
            this.preLoader(false)

            if(shopUsageResult.is_ok){
              this.shop_expiry_date = this.formatExpireDate(shopUsageResult.data.expiry_date_ts)
              this.shop_netmoney_balance = shopUsageResult.data.net_money_balance
              this.shop_expiry_date_diff = this.getDateDiff(this.shop_expiry_date)
              if((this.shop_expiry_date_diff >=0 && this.shop_expiry_date_diff <= 7))
                setTimeout(() => {
                  if((this.isMobileApp == true && this.shop_expiry_date_diff == 0) || this.isMobileApp == false){
                    this.showDialogById(this.expirationModalId)
                  }
                  resolve()
                }, 300)
              else {
                resolve()
              }
            }

            // minimum loading time is 200ms for better UI
            const minimum_loading_timeout = shopUsageResult.response_time < MINIMUM_LOADING_ANIMATION_TIME ? MINIMUM_LOADING_ANIMATION_TIME : 0
            setTimeout(() => {
              this.is_loading_payment_shop_ussage_data = false
              this.is_load_payment_shop_ussage_failed = !shopUsageResult.is_ok
            }, minimum_loading_timeout)
          }, 300)
        } catch (error) {
          this._showDialogAlert(error.message)
        }
      })
    },
    async loadTaxInvoice() {
      return new Promise(async (resolve) => {
        try{
          const taxInvoiceStorage = localStorage.getItem(options.local_storage_name.home_tax_invoice_modal)
          const promises = []
          if(!taxInvoiceStorage) {
            await promises.push(this.showTaxInvoiceModal())
          } else {
            const stored_expiry = JSON.parse(taxInvoiceStorage)
            if(stored_expiry == null || !moment(new Date(stored_expiry), 'MM/DD/YY',true).isValid()) {
              throw this.$t('tax-invoice-info.invalid-date', { stored_expiry })
            }

            const localDate= new Date(stored_expiry)
            if(Date.now() > localDate) {
              localStorage.removeItem(options.local_storage_name.home_tax_invoice_modal)
              await promises.push(this.showTaxInvoiceModal())
            }
            else{
              resolve()
            }
          }
          await Promise.all(promises)
          resolve()
        } catch(errors) {
          localStorage.removeItem(options.local_storage_name.home_tax_invoice_modal)
          this._showDialogAlert(errors)
          resolve()
        }
      })
    },
    async showTaxInvoiceModal() {
      return new Promise((resolve) => {
        if(this.shop_info_data.is_ok) {
          if((this.shop_info.fields.tax_invoice_request === 0 || this.shop_info.fields.tax_invoice_request === ADMIN_ENUMS.TAX_INVOICE_REQUEST.NOT_SELETED) && this.x_user.user_role_code === options.user_roles.master) {
            setTimeout(() => {
              this.showDialogById('home-tax-invoice-modal')
              resolve()
            }, 200)
          }
          else{
            resolve()
          }
        }
      })
    },
    async loadTextSenderPhone() {
      return new Promise(async (resolve) => {
        try{
          const textSenderPhoneStorage = localStorage.getItem(options.local_storage_name.home_text_sender_phone_modal)
          const promises = []
          if(!textSenderPhoneStorage) {
            await promises.push(this.showTextSenderPhoneModal())
          } else {
            const storedExpiry = JSON.parse(textSenderPhoneStorage)
            if(storedExpiry == null || !moment(new Date(storedExpiry), 'MM/DD/YY',true).isValid()) {
              this.$t('message-sender.invalid-date', { storedExpiry })
            }
            const localDate= new Date(storedExpiry)
            if(Date.now() > localDate) {
              localStorage.removeItem(options.local_storage_name.home_text_sender_phone_modal)
              await promises.push(this.showTextSenderPhoneModal())
            }
            else{
              resolve()
            }
          }
          await Promise.all(promises)
          resolve()
        } catch(errors) {
          localStorage.removeItem(options.local_storage_name.home_text_sender_phone_modal)
          this._showDialogAlert(errors)
          resolve()
        }
      })
    },
    async loadBasefee(){
      try {
        let data_send = {
          shop_id:                this.shop_data.shop_id,
          registration_date_from: 0,
          registration_date_to:   0,
          page_size:              1,
          page_number:            1,
        }
        let base_fee_api = new BaseFeeApi()
        this.preLoader()
        let result = await base_fee_api.getBaseFeesAsync(data_send)
        this.preLoader(false)
        if(!result.is_ok) {
          throw new ApiError(result.error_messages)
        }
        else {
          if(result.data.items.length > 0){
            this.is_basefee_exist = true
          }
          else{
            this.is_basefee_exist = false
          }
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },
    async showTextSenderPhoneModal() {
      return new Promise( async (resolve) => {
        try {
          const sendData = {
            page_number:    1,
            is_sender_list: true,
            shop_id:        this.shop_data.shop_id,
            page_size:      options.pagination.default,
          }
          const result = await (new TextSenderPhoneApi()).getTextSenderPhonesByShopAsync(sendData)
          if(!result.is_ok) {
            throw new ApiError(result.error_messages)
          }

          const sendDataSetup = {
            shop_id:      this.shop_data.shop_id,
            country_code: this.shop_data.country,
          }

          this.shop_environment_setup = new ShopEnvironmentSetupViewModel()
          await this.setShopEnvironmentDataAsync(sendDataSetup).then(() => {
            if(!this.shop_environment_data.is_ok) {
              throw new ApiError(this.shop_environment_data.error_messages)
            }

            this.shop_environment_setup = this.shop_environment_data.data
            if(this.shop_environment_setup.fields.is_text_sender_phone_popup && result.data.items.length == 0 && (this.x_user.user_role_code === options.user_roles.master || this.x_user.user_role_code === options.user_roles.manager)) {
              this.showDialogById('home-text-sender-phone-modal')
              resolve()
            }
            else{
              resolve()
            }
          })
        } catch (error) {
          this._showDialogAlert(error.message)
          resolve()
        }
      })
    },
    updateModalStyles(){
      const modalElements = Array.from(document.querySelectorAll('.modal-backdrop'))
      const hasPopupSystemModals = this.updateSystemModalStyle()

      const modalsWithZindex = modalElements.map((element)=> {
        const parentElement = element.parentElement
        let parentZIndex = 0
        if (parentElement) {
          parentZIndex = parseInt(window.getComputedStyle(parentElement).zIndex)
        }
        return { element: parentElement, zIndex: parentZIndex }
      })

      modalsWithZindex.sort((a,b) => a.zIndex - b.zIndex)
      modalsWithZindex.forEach((modal, index) => {
        
        const children = Array.from(modal.element.children)
        //console.log(`Element ID: ${modal.element.id}, Display: ${modal.zIndex}`)
        children.forEach((childElement) => {
          if (hasPopupSystemModals) {
            if (index === 0) {
              childElement.style.backgroundColor = 'transparent'
            } else if (index === 1) {
              childElement.style.backgroundColor = 'rgba(0,0,0,0.5)'
            } else {
              childElement.style.backgroundColor = 'transparent'
            }
          } else {
            if (index === 0) {
              childElement.style.backgroundColor = 'rgba(0,0,0,0.5)'
            } else {
              childElement.style.backgroundColor = 'transparent'
            }
          }
        })
      })
      // setTimeout(() => {
      //   this.updateSystemModalStyle()
      // }, 250)

    },
    updateSystemModalStyle(){
      const modalElements = Array.from(document.querySelectorAll('.modal-backdrop'))
      modalElements.forEach((element) => {
        if (element.id.startsWith('popup-system-modal-')) {
          element.style.display = 'none'
        }
      })
      const hasPopupSystemModals = modalElements.some(modal => {
        const idStartsWithPopupSystemModal = modal.id.startsWith('popup-system-modal-')
        return idStartsWithPopupSystemModal
      })
      if(hasPopupSystemModals){
        const ariaElements = Array.from(document.querySelectorAll('[aria-labelledby^="popup-system-modal-"]'))
        ariaElements.forEach((element) => {
          element.style.pointerEvents = 'none'
        })
        const modalContentElement = document.querySelector('[id^="popup-system-modal-"].modal-content')
        if (modalContentElement) {
          modalContentElement.removeAttribute('tabindex')
        }
      }
      return hasPopupSystemModals
    },
    showServiceAgreementModal() {
      return new Promise(async (resolve) => {
        if(this.shop_info_data.is_ok) {
          const standardTS = 1697551200 // (KR) 2023-10-17 23:00
          const registrationDateTS = convertTimeStampPlusLocalzone(convertDateToTimeStamp(this.shop_info.fields.registration_date, true, true))
          if(this.shop_info.fields.service_agree_date_time_ts === null
            && standardTS < registrationDateTS) {
            await this.showDialogById('home-service-agreement-modal')
            resolve()
          }
          else{
            resolve()
          }
        }
      })
    },
    showOwnerMobileVerifyModal() {
      return new Promise((resolve) => {
        if(this.shop_info_data.is_ok
        && !(this.shop_info.fields.owner_mobile_verify_date_time_ts > 0)
        && this.shop_info.fields.shop_level >= 0
        && !this.shop_info.fields.is_excluded_verify) {
          setTimeout(() => {
            this.showDialogById('home-owner-mobile-verify-modal')
          }, 300)
          resolve()
        }
        else{
          resolve()
        }
      })
    },
    async loadShopInfo() {
      try {
        const query = {
          shop_id: this.shop_data.shop_id,
        }
        await this.setShopInfoActionDataAsync(query)
        if(!this.shop_info_data.is_ok) {
          throw new ApiError(this.shop_environment_data.error_messages)
        }
        this.shop_info.fields = Object.assign({}, this.shop_info_data.data)
        this.shop_auto_transfer = this.shop_info.fields.auto_transfer
      } catch(errors) {
        this._showDialogAlert(errors)
      }
    },

    formatExpireDate(dateTs) {
      if (dateTs === 0) {
        return ''
      }

      return parseDateTSToMomentByShopSettingTimezone(dateTs).format(options.standard_date_format.ymd)
    },
    getDateDiff(dateExpired){
      const today = moment(convertDateToTimezone(new Date())).startOf('day')
      const expire = moment(dateExpired)
      const diff = expire.diff(today,'days')
      return diff
    },
    onClickConfirm() {
      this.$router.push({ name: 'account-payments', params: { purpose_check: options.admin_sales_enums.payment_purpose.base_fee }})
    },
  },
}
</script>

<style lang='scss' scoped>
@import "./home.scss";
</style>
