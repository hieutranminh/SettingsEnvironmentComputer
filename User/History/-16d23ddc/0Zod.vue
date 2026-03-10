<!-- Fix eslint Bug for spacings + css pre, pre-line after upgrade Node v20.18.1 : https://gitlab.com/ahasoft-leaders1/ahaplus-shop/-/issues/67 -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<template>
  <main class="client-info-summary">
    <!-- Pc -->
    <div class="info-box-top clearfix pc">
      <!-- client left -->
      <div
        :class="{ 'modal-box': type === options.page_modal_check.modal }"
        class="box box1 fll"
      >
        <div class="client-name-info">
          <div class="client-name-info-left">
            <client-image
              :client="client"
              :is-initing-data="isInitingData"
              :is-readonly="isModalDisplayType"
            />
            <div class="fll client-text">
              <div class="client-basic-info">
                <div class="client-basic-info__info-wrapper">
                  <span class="client-basic-info__client-name">{{ client.client_name }}</span>
                  <!-- text should stay in html tag to avoid iOS whitespace issue -->
                  <span
                    v-if="clientRatingAndGroupInfo.length > 0 && !isMobileDevice"
                    class="client-basic-info__sub-info"
                  >({{ clientRatingAndGroupInfo }})</span>
                  <span
                    v-else
                    class="client-basic-info__sub-info"
                  >{{ clientRatingAndGroupInfo }}</span>
                  <template v-if="isShowDebug">
                    <b-badge
                      id="popover-client-account"
                      pill
                      variant="info"
                    >
                      i
                    </b-badge>
                    <b-popover
                      target="popover-client-account"
                      triggers="hover"
                      class="popover-client-account"
                    >
                      <span>client_id : {{ client.id }}</span><br>
                      <span>registration_date_ts : {{ client.registration_date_ts }}  ({{ formatDateTime(client.registration_date) }})</span><br>
                      <span>client_input_date_time : {{ client.client_input_date_ts }}  ({{ client.client_input_date }})</span><br>
                      <span>first_visit_date_time_ts : {{ client.first_visit_date_time_ts }}  ({{ formatDateTime(client.first_visit_date_time) }})</span><br>
                      <span>recent_visit_date_ts : {{ client.recent_visit_date_time_ts }}  ({{ formatDateTime(client.recent_visit_date_time) }})</span><br>
                      <span>recent_visit_sales_id : {{ client.recent_visit_sales_id }}</span><br>
                      <span>number_of_visit : {{ client.number_of_visit }}</span><br>
                      <span>number_of_recommendations : {{ client.number_of_recommendations }}</span><br>
                    </b-popover>
                  </template>
                </div>
              </div>
              <p
                v-if="shareClient && !isClientOfCurrentShop"
                class="mb15"
              >
                <span class="color-blue">({{ client.shop_name }})</span>
              </p>
              <p class="m-phone">
                <template v-if="!checkNullAndEmpty(client.mobile_number)">
                  <span @click="onSendCall(true)">{{ hiddenClientInformation(client.mobile_number) }}</span>
                  <span
                    v-if="isSendCall"
                    class="d-none d-md-block call-w-icon"
                    @click="onSendCall(true)"
                  />
                  <span
                    v-if="!hideSendTextMessageButton() && !isNotAllowSendMessage(client)"
                    class="message-w-icon message-custom"
                    @click="onSendMessage"
                  />
                  <span
                    v-if="!hideSendTextMessageButton() && isNotAllowSendMessage(client)"
                    class="message-custom-allow-icon"
                  >
                    <img
                      :src="messageIcon"
                      class="message-allow-icon"
                      @click="onSendMessage"
                    ></span>
                </template>
                <template v-if="!checkNullAndEmpty(client.phone_number)">
                  <span @click="onSendCall(false)"> <span v-if="!isMobileDevice">/</span> {{ hiddenClientInformation(client.phone_number) }}</span>
                  <span
                    v-if="isSendCall"
                    class="d-none d-md-block call-w-icon"
                    @click="onSendCall(false)"
                  />
                </template>
              </p>

              <div
                v-if="canEditClientInfo && isActiveClient"
                class="client-basic-info__actions d-md-none"
              >
                <b-dropdown
                  class="client-basic-info__dropdown"
                  boundary="viewport"
                  right
                >
                  <template #button-content>
                    <img
                      :src="clientDropdownAction"
                      alt="menu-action"
                    >
                  </template>
                  <b-dropdown-item
                    v-if="canEditClientInfo && isActiveClient"
                    @click="onClientAction(options.form_actions.edit, clientId)"
                  >
                    <span>{{ $t('clients.client-edit') }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="onFamilyAction(client.family_id)">
                    <span>{{ $t('client-information.family') }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isClientOfCurrentShop"
                    @click="openConsentFormModal"
                  >
                    <span>{{ $t('consent.client-consent-form-modal-title') }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="onClickLoyaltyPoints">
                    <span>{{ $t('loyalty-points-history.points-history') }}</span>
                  </b-dropdown-item>
                  <b-dropdown-item @click="handleOutstandingEditButtonClick">
                    <span>{{ $t('sales.outstanding-history') }}</span>
                  </b-dropdown-item>
                </b-dropdown>
              </div>

              <div v-if="!is_mobile">
                <div
                  :class="{'is-kr': isKrShop}"
                  class="client-basic-info__wrapper"
                >
                  <div class="client-basic-info__item">
                    <span class="client-basic-info__label">{{ $t('client-information.client-number-no') }}</span>
                    <span>{{ client.member_number }}</span>
                  </div>
                  <div
                    :class="{'empty-value': !client.preferred_staff_name}"
                    class="client-basic-info__item"
                  >
                    <span class="client-basic-info__label">{{ $t('client-information.preferred-staff') }}</span>
                    <span>{{ client.preferred_staff_name }}</span>
                  </div>
                  <div
                    :class="{'empty-value': !client.birth_dd}"
                    class="client-basic-info__item"
                  >
                    <template v-if="isPetSalon">
                      <span class="client-basic-info__label">{{ $t('client-information.age-birth-date') }}</span>
                      <span v-html="renderClientAge" />
                    </template>
                    <template v-else>
                      <span class="client-basic-info__label">{{ $t('client-information.birth-date') }}</span>
                      <span v-if="client.birth_dd !== 0">{{ clientBirthdayText }}</span>
                    </template>
                  </div>
                </div>

                <div class="client-basic-info__sales-info d-md-none">
                  <ul>
                    <li>
                      <span class="client-basic-info__sales-item">{{ $t('client-information.loyalty-points') }}<span v-if="client.family_id > 0"> ({{ $t('client-information.family') }})</span><span>: </span></span>
                      <span class="loyalty-points-family">
                        <span
                          class="loyalty-points"
                          @click="onClickLoyaltyPoints"
                        >{{ formatMoney(clientPoints, 0) }}</span>
                        <i
                          v-if="canEditClientInfo && isActiveClient"
                          class="family-icon-mobile"
                          @click="onFamilyAction(client.family_id)"
                        />
                      </span>
                    </li>
                    <li v-if="client.balance && client.balance > 0 || client.family_balance && client.family_balance > 0">
                      <span class="client-basic-info__sales-item">{{ $t('client-information.balance') }}:</span>
                      <span>{{ formatMoney(client.balance, 0) }}</span>
                      <span v-if="client.family_id > 0">({{ $t('client-information.family-sum') }} {{ formatMoney(client.family_balance, 0) }})</span>
                    </li>
                    <li
                      v-if="showClientOutStanding"
                      class="client-basic-info__outstanding"
                      @click="handleOutstandingEditButtonClick"
                    >
                      <span class="client-basic-info__sales-item">{{ $t('client-information.outstanding') }}: </span>
                      <span class="client-basic-info__outstanding--amount">{{ formatMoney(client.outstanding, 0) }}</span>
                    </li>

                    <li class="client-basic-info__recent-visit-date">
                      <span class="client-basic-info__sales-item">{{ $t('bookings.recent-visit-date') }}: </span>
                      <span v-if="client.recent_visit_date_time_ts > 0">{{ formatRecentVisitDate(client.recent_visit_date_time) }} </span><span v-if="passDay > 0">({{ passDayText }})</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="canEditClientInfo && isActiveClient"
            class="edit-family-button-box"
          >
            <aha-button
              variant="blue"
              class="d-none d-md-block edit-btn"
              @click="onClientAction(options.form_actions.edit, clientId)"
            >
              {{ $t('general.edit') }}
            </aha-button>

            <aha-button
              variant="blue"
              class="d-none d-md-block family-btn"
              @click="onFamilyAction(client.family_id)"
            >
              {{ $t('client-information.family') }}
            </aha-button>

            <aha-button
              v-if="isClientOfCurrentShop"

              variant="blue"
              class="d-none d-md-block family-btn"

              @click="openConsentFormModal"
            >
              {{ $t('consent.client-consent-form-modal-title') }}
            </aha-button>
          </div>
        </div>

        <div v-if="is_mobile">
          <client-summary-mobile v-bind="mergeClientProps" />
        </div>

        <div
          id="client-note-box"
          :class="noteBoxClass"
          @click="onNoteRegister"
        >
          <aha-note-with-tooltip
            v-if="client.notes"
            :disabled="is_mobile"
            :value="client.notes"
            placement="bottom"
            boundary="note-box"
            container="client-note-box"
            tooltip-id="client-sales-note-tooltip"
            custom-class="client-sales-note-tooltip"
          />
        </div>
        <footer-action-bar
          v-if="!isModalDisplayType"
          :class="salesActionMobileModeClass"
        >
          <template v-if="(isAddingBookingToSales && !isViewClientInfoAction) || canAddBookingToSales">
            <slot name="add-booking-to-sales">
              <a
                class="add-booking-to-sales"
                @click="$emit('add-booking-to-sales')"
              >{{ $t('bookings.add-booking-to-sales') }}</a>
            </slot>
            <a
              class="cancel-booking-to-sales"
              @click="$emit('cancel-booking-to-sales')"
            >{{ $t('general.close') }}</a>
          </template>
          <template v-else>
            <template v-if="!isShowSalesActions && isAddingBookingToSales">
              <slot name="add-booking-to-sales">
                <a
                  class="add-booking-to-sales"
                  @click="$emit('add-booking-to-sales')"
                >{{ $t('bookings.add-booking-to-sales') }}</a>
              </slot>
            </template>

            <a
              v-if="isShowSalesActions"
              class="add-sales"
              @click="onActionSalesMixin(options.form_actions.add)"
            >{{ $t('sales.add-sales') }}</a>

            <a
              v-if="isShowSalesActions"
              class="add-refund"
              @click="onActionRefund(options.form_actions.add)"
            >{{ $t('sales.add-refund') }}</a>

            <a
              v-if="!isShowCloseButton"
              :class="closeButtonClassName"
              @click="$emit('cancel-booking-to-sales')"
            >{{ $t('general.close') }}</a>

            <client-sales-image
              v-if="isClientExisted"
              :client="client"
              :upload-input-id="'mobile_image_upload_input'"
              :upload-modal-id="'mobile_image_upload_modal'"
              @on-add-image-success="onAddClientSalesImageSuccess"
            />
          </template>
        </footer-action-bar>
      </div>

      <!-- client right -->
      <div class="box box2 fll por">
        <div class="sales-info">
          <dl :class="{'is-kr': isKrShop}">
            <dd>
              <span class="total-sales">
                {{ $t('client-information.total-sales') }}
              </span>
              <span>
                {{ formatMoney(client.total_sales_amount, 0) }}
              </span>
            </dd>
            <dd class="client-loyalty-points">
              <span class="sales-info__label">{{ $t('client-information.loyalty-points') }} <span v-if="client.family_id > 0">({{ $t('client-information.family') }})</span></span>
              <span
                class="loyalty-points"
                @click="onClickLoyaltyPoints"
              > {{ formatMoney(clientPoints, 0) }}</span>
              <span
                v-if="canEditPoints"
                class="action edit-loyalty-points"
                @click="onClickLoyaltyPoints"
              >
                <a-icon name="edit" />
              </span>
            </dd>
            <dd class="d-flex">
              <span class="sales-info__label">{{ $t('client-information.balance') }}</span>
              <span class="ml-1">
                <span>{{ formatMoney(client.balance, 0) }}</span>
                <span v-if="client.family_id > 0">({{ $t('client-information.family-sum') }} {{ formatMoney(client.family_balance, 0) }})</span>
              </span>
            </dd>
            <dd class="client-outstanding">
              <span class="sales-info__label">{{ $t('client-information.outstanding') }}</span>
              <span
                class="sales-outstand"
                @click="handleOutstandingEditButtonClick"
              > {{ formatMoney(client.outstanding, 0) }}</span>
              <span
                v-if="canEditPoints"
                class="action edit-outstanding"
                @click="handleOutstandingEditButtonClick"
              >
                <a-icon name="edit" />
              </span>
            </dd>
            <dd>
              <span class="sales-info__label">{{ $t('bookings.recent-visit-date') }}</span>
              <span v-if="client.recent_visit_date_time_ts > 0">{{ formatRecentVisitDate(client.recent_visit_date_time) }} </span><span v-if="passDay > 0">({{ passDayText }})</span>
            </dd>
          </dl>

          <div
            v-if="!isModalDisplayType"
            :class="salesActionNotMobileModeClass"
          >
            <template v-if="(isAddingBookingToSales && !isViewClientInfoAction) || canAddBookingToSales">
              <slot name="add-booking-to-sales">
                <a
                  class="add-booking-to-sales"
                  @click="$emit('add-booking-to-sales')"
                >{{ $t('bookings.add-booking-to-sales') }}</a>
              </slot>
            </template>
            <template v-else>
              <template v-if="!isShowSalesActions && isAddingBookingToSales">
                <slot name="add-booking-to-sales">
                  <a
                    class="add-booking-to-sales"
                    @click="$emit('add-booking-to-sales')"
                  >{{ $t('bookings.add-booking-to-sales') }}</a>
                </slot>
              </template>

              <a
                v-if="isShowSalesActions"
                class="add-sales"
                @click="onActionSalesMixin(options.form_actions.add)"
              >{{ $t('sales.add-sales') }}</a>

              <a
                v-if="isShowSalesActions"
                :class="{'client-info-summary__add-refund--small': isClientExisted }"
                class="add-refund"
                @click="onActionRefund(options.form_actions.add)"
              >{{ $t('sales.add-refund') }}</a>

              <client-sales-image
                v-if="isClientExisted"
                :client="client"
                :class="{ 'client-info-summary__client-sales-image--with-add-sales-button' : isShowSalesActions }"
                :upload-input-id="'image_upload_input'"
                :upload-modal-id="'image_upload_modal'"
                @on-add-image-success="onAddClientSalesImageSuccess"
              />
            </template>
          </div>
          <span
            v-if="isShowCloseButton"
            class="d-none d-md-block sales-info__remove-client remove-client"
            @click="onRemoveClient"
          >X</span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <client-action
      v-show="actionVisiable"

      :modal_id="clientActionModalId"
      :force-hide-delete="!allowDelete"
      :has-update-client-name-or-mobile="true"

      @deleted="handleDeletedClient"
      @hidden="handleHiddenClientModal"
      @update-client-name-or-mobile="handleUpdatedClient"
    />

    <family-action
      :client="client"
      :modal-id="familyActionModalId"
      @finished-family-action="onFinishedFamilyAction"
    />

    <note-register-action
      :data="note"
      :modal-id="noteRegisterActionModalId"
      @on-updated-note-successfully="onUpdatedClientNoteSuccessfully"
    />

    <loyalty-points-history-modal
      :table-id="tableId"
      :client-id="client.id"
      :has-family="isClientHasFamily"
      :can-edit-points="canEditPoints"
      :modal-id="loyaltyPointsHsitoryModalId"
      :table-data="loyaltyPointHistoryTableDataMapped"

      @on-view-sales-detail="onViewSalesDetail"
      @on-view-refund-detail="onViewRefundDetail"
      @on-edit-loyalty-points="onActionLoyaltyPoints"
      @edit-notes-success="handleLoyaltyPointsUpdatedNotes"
      @on-change-page="onChangePageOfLoyaltyPointsHistory"
    />

    <outstanding-history
      ref="outstandingHistoryTableRef"
      :modal-id="outstandingModalId"
      :show-button-edit="canEditPoints"
      :client-account-data="clientAccountData"

      @edit-outstanding="openEditOutstanding"
      @view-outstanding-sales-detail="viewSalesDetailOutstandingHistory"
    />

    <outstanding-editing-action
      :modal-id="editOutStandingModalId"
      @edited-outstanding="updatedOustandingAmount"
    />

    <loyalty-points-action
      :client="client"
      :modal-id="loyaltyPointsModalId"
      @updated-loyalty-points="onUpdatedLoyaltyPoints"
    />

    <sales-detail
      :modal_id="salesDetailId"
      :visible="isVisibleSalesDetailDialog"
      :is-outstanding-history="isOutstandingHistory"
      @hidden="handleHiddenSalesDetail"
    />

    <refund-detail :modal_id="refundDetailOfLoyaltyPointsHistory" />

    <send-call-modal
      :call-number="callNumber"
      :modal-id="sendCallModalId"
      :is-hide-call-number="isHideClientInfo"
    />

    <send-message-modal
      :data="client.id"
      :modal-id="sendMessageModalId"
      :is-hide-call-number="isHideClientInfo"
      :type="options.messages_enums.send_page.client"
      :is-not-allow-send-message-client="isClientCheckDontSendMessage"

      @on-add-text-message-success="onAddTextMessageSuccess"
    />

    <alert-confirm
      :id="phoneCallAlertId"
      :label_no="$t('general.no')"
      :label_yes="$t('general.yes')"
      :data_alerts="[$t('client-information.phone-call-confirm')]"

      @confirm="onConfirmCalling"
    />

    <client-consent-form-modal
      ref="clientConsentModalRef"

      :client="client"
      :visible="isConsentFormModalShow"
      :is-hide-client-info="isHideClientInfo"

      @hide="closeConsentFormModal"
    />
  </main>
</template>

<script>
// Constants
import {
  PAGINATION,
  CLIENT_STATUS,
  PAGE_MODAL_CHECK,
  PERMISSION_TYPE,
  NOTIFICATON_TYPE,
  BUSINESS_TYPE_CODE,
} from 'Constant'
import { options } from 'OptionsHelpers'
import { sales_options } from 'Options/sales-options.js'

// Utilities
import Vue from 'vue'
import {
  guid,
  emptyValue,
  formatDate,
  addDateZero,
  formatMoney,
  hideMobilePhone,
  checkNullAndEmpty,
  convertTimeStampToDate,
  isPermittedBySetupRole,
  formatMobileAndPhoneNumber,
  getHideClientInfoPermission,
  calculateClientAge,
} from 'CommonHelpers'
import moment from 'moment'
import isEmpty from 'lodash/isEmpty'
import { ApiError } from 'HTTPHelpers'
import cloneDeep from 'lodash/cloneDeep'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import { getDiffDateRange, getStartOfTimezoneDateTS } from 'DatetimeHelpers'
import { convertTimestampToDate, convertDateToMomentUTC } from 'Modules/calendar/utils/index'
import { isPermissionGranted } from 'PermissionHelpers'

// Apis
import BalancePointsEditHistoryApi from 'API/sales/balance-points-edit-history-api'

// View Models
import ClientViewModel from 'ViewModels/clients/client-view-model.js'
import SalesBriefViewModel from 'ViewModels/sales/sales/sales-brief-view-model'

// Mixins
import SalesMixin from 'Mixins/sales-mixin.js'
import RefundMixin from 'Mixins/refund-mixin.js'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'
import EnvironmentMixin from 'Mixins/environment-setup-mixin.js'
import ClientCacheMixin from 'Modules/cache/mixins/client_cache'
import ClientDictionaryMixin from 'Mixins/client-dictionary-mixin'
import SalesClientAccountMixin from 'Mixins/sales-client-account-mixin.js'

// Components
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import FamilyAction from 'Components/clients/family/family-action.vue'
import SalesDetail from 'Components/sales/sales-detail/sales-detail.vue'
import ClientImage from 'Components/clients/client-image/client-image.vue'
import RefundDetail from 'Components/sales/refund-detail/refund-detail.vue'
import ClientAction from 'Components/clients/client-action/client-action.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import SendCallModal from 'Components/common/header-block/cid-send-call-action.vue'
import FooterActionBar from 'Components/common/footer-action-bar/footer-action-bar.vue'
import NoteRegisterAction from 'Components/clients/client-information/note-register.vue'
import ClientSalesImage from 'Components/clients/client-sales-image/client-sales-image.vue'
import SendMessageModal from 'Components/messages/send-message-modal/send-message-modal.vue'
import OutstandingHistory from 'Components/sales/outstanding-history/outstanding-history.vue'
import LoyaltyPointsAction from 'Components/clients/client-information/loyalty-points-action.vue'
import AhaNoteWithTooltip from 'CommonComponents/aha-note-with-tooltip/aha-note-with-tooltip.vue'
import ClientSummaryMobile from 'Components/clients/client-information/client-summary-mobile.vue'
import LoyaltyPointsHistoryModal from 'Components/clients/client-information/loyalty-points-history-modal.vue'
import OutstandingEditingAction from 'Components/sales/outstanding-editing-action/outstanding-editing-action.vue'

const NoHasConsentFormAlarm = () => import('Modules/consent/components/client-consent-form/components/no-has-consent-form-alarm/no-has-consent-form-alarm.vue')

export default {
  components: {
    ClientImage,
    SalesDetail,
    RefundDetail,
    AlertConfirm,
    ClientAction,
    FamilyAction,
    SendCallModal,
    FooterActionBar,
    ClientSalesImage,
    SendMessageModal,
    OutstandingHistory,
    NoteRegisterAction,
    AhaNoteWithTooltip,
    LoyaltyPointsAction,
    ClientSummaryMobile,
    OutstandingEditingAction,
    LoyaltyPointsHistoryModal,

    ClientConsentFormModal: () => import('Modules/consent/components/client-consent-form/client-consent-form.vue'),
  },

  extends: ComponentBase,

  mixins: [
    SalesMixin,
    RefundMixin,
    SalesCacheMixin,
    EnvironmentMixin,
    ClientCacheMixin,
    ClientDictionaryMixin,
    SalesClientAccountMixin,
  ],

  props: {
    type: {
      type:    Number,
      default: PAGE_MODAL_CHECK.MODAL,
    },

    canEditClientInfo: {
      type:    Boolean,
      default: false,
    },

    canAddBookingToSales: {
      type:    Boolean,
      default: false,
    },

    isInitingData: {
      type:    Boolean,
      default: false,
    },

    isAddingBookingToSales: {
      type:    Boolean,
      default: false,
    },

    isShowSalesActions: {
      type:    Boolean,
      default: true,
    },

    showCloseButton: {
      type:    Boolean,
      default: true,
    },

    allowDelete: {
      type:    Boolean,
      default: true,
    },

    client: {
      type:    Object,
      default: () => new ClientViewModel().fields,
    },

    isViewClientInfoAction: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      formShowed: false,

      clientsSetup: {},

      callNumber:                                            '',
      actionVisiable:                                        false,
      allowEditBalanceRoyaltyPointsPrepaidServicesRemaining: sales_options.security_level_enum.master,

      is_mobile: this.isMobile(),

      // loyalty points history
      loyaltyPointHistoryTableFilter: {
        shopId:     0,
        clientId:   0,
        pageNumber: 1,
        pageSize:   PAGINATION.DEFAULT,
      },

      loyaltyPointHistoryTableData: {
        rows:       [],
        fields:     [],
        pagination: {
          total_pages: 1,
        },
        options: {
          pagination: true,
        },
      },
      salesDetailId:                      'sales-detail-of-loyalty-points-history-and-outstanding-history',
      refundDetailOfLoyaltyPointsHistory: 'refund-detail-of-loyalty-points-history',

      //outstandingHistory
      isOutstandingHistory:       false,
      isVisibleSalesDetailDialog: false,

      isConsentFormModalShow: false,
      isShowClientStoreInput: false,
      tableId:                '',
    }
  },

  computed: {
    ...mapGetters('shop', {
      shopEnvironmentData: 'getShopEnvironment',
    }),

    ...mapGetters('device', [
      'isMobileDevice',
    ]),

    ...mapState('app', [
      'isShowDebug',
    ]),

    isKrShop() {
      return this.app_language === 'ko'
    },

    clientDropdownAction() {
      return '/template/images/calendar-menu-svg.svg'
    },

    isClientCheckDontSendMessage() {
      return this.client.allowed_message_type === options.allowed_message_type.not_message
    },

    options() {
      return options
    },

    sales_options() {
      return sales_options
    },

    uid() {
      return guid()
    },

    messageIcon() {
      return '/template/images/not-allow-message.png'
    },

    isPetSalon() {
      return this.shop_data.business_type_code === BUSINESS_TYPE_CODE.PET_SALON
    },

    renderClientAge() {
      const year = this.client?.birth_year
      const month = this.client?.birth_month
      const day = this.client?.birth_dd
      const birthday = this.clientBirthdayText

      return calculateClientAge(year, month, day, birthday)
    },

    clientBirthdayText(){
      const birthdayTime = [this.client.birth_year,this.client.birth_month,this.client.birth_dd]
        .filter(Boolean)
        .map((birthday)=>{
          return addDateZero(birthday)
        }).join('-')
      return birthdayTime
    },

    phoneCallAlertId() {
      return `${this.uid}_phone-call-confirm-alert`
    },

    clientActionModalId() {
      return `${this.uid}_action-client-modal-client-info-summary`
    },

    outstandingModalId() {
      return `${this.uid}_client-outstanding-history-modal`
    },

    editOutStandingModalId() {
      return `${this.uid}_edit-outstanding-outstanding`
    },

    sendCallModalId() {
      return `${this.uid}_cid-send-call-modal-from-client-info-summary`
    },

    sendMessageModalId() {
      return `${this.uid}_send-message-modal-from-client-info-summary`
    },

    familyActionModalId() {
      return `${this.uid}_family-action-modal`
    },

    loyaltyPointsModalId() {
      return `${this.uid}_loyalty-points-modal`
    },

    noteRegisterActionModalId() {
      return `${this.uid}_note-register-modal`
    },

    clientId() {
      return this.client.id || this.client.client_id
    },

    clientShopId() {
      return this.client.shop_id || this.client.client_shop_id
    },

    isClientExisted(){
      return !!this.clientId
    },

    isClientOfCurrentShop() {
      return this.isClientExisted && this.shop_data.shop_id === this.clientShopId
    },

    isAllowEditBalanceBySetupRole() {
      if (this.isStaffRole || this.isManagerRole) {
        const permissionType = this.isStaffRole
          ? PERMISSION_TYPE.STAFF
          : PERMISSION_TYPE.MANAGER

        return isPermissionGranted(permissionType, this.allowEditBalanceRoyaltyPointsPrepaidServicesRemaining)
      }

      return true
    },

    canEditPoints(){
      return this.isClientOfCurrentShop && !this.isModalDisplayType && this.isAllowEditBalanceBySetupRole
    },

    isModalDisplayType() {
      return this.type === PAGE_MODAL_CHECK.MODAL
    },

    clientRatingAndGroupInfo() {
      const result = []
      if (this.client?.client_rating_id && this.client?.client_rating_name) {
        result.push(this.client.client_rating_name)
      }

      if (this.client.client_group_id > 0 && this.client.client_group_name) {
        result.push(this.client.client_group_name)
      }

      const isClientGroupExisted = this.client?.client_group_id && this.client?.client_group_name
      const isClientRatingExisted = this.client?.client_rating_id && this.client?.client_rating_name

      return [
        ...(isClientRatingExisted ? [this.client.client_rating_name] : []),
        ...(isClientGroupExisted ? [this.client.client_group_name] : []),
      ].join(', ')
    },

    isActiveClient() {
      return this.client && this.client.status === CLIENT_STATUS.ACTIVE
    },

    loyaltyPointHistoryTableFields(){
      let tmpFields = [
        {field: 'mobile', label: '', width: 'auto', sortable: false, expand: true, tdClass: 'mobile', thClass: 'mobile', column_expand: true},
        {field: 'registrationDateTS', label: 'loyalty-points-history.created-date', width: '10%', sortable: false, expand: true},
      ]

      if(this.client.family_id > 0){
        tmpFields = [
          ...tmpFields,
          {field: 'clientName', label: 'loyalty-points-history.client-name', width: '20%', sortable: false},
        ]
      }

      tmpFields = [
        ...tmpFields,
        {field: 'clientPointsHistoryType', label: 'loyalty-points-history.action', width: '10%', sortable: false, expand: true},
        {field: 'change', label: 'loyalty-points-history.change', width: '15%', sortable: false, expand: true},
        {field: 'balance', label: 'loyalty-points-history.balance', width: '15%', sortable: false, expand: true},
        {field: 'notes', label: 'general.notes', width: '30%', sortable: false, expand: true},
        {field: 'historyId', label: 'general.detail', width: '10%', sortable: false, expand: true},
      ]

      return tmpFields
    },

    loyaltyPointHistoryTableDataMapped(){
      return {
        ...this.loyaltyPointHistoryTableData,
        fields: this.loyaltyPointHistoryTableFields,
      }
    },

    isShowCloseButton() {
      return this.showCloseButton && this.type === this.options.page_modal_check.page
    },

    isClientHasFamily() {
      return this?.client?.fields?.family_id > 0
    },

    loyaltyPointsHsitoryModalId() {
      return this.isAddingBookingToSales ? 'loyalty-points-history-modal-add-booking-to-sales' : 'loyalty-points-history-modal'
    },

    clientPoints() {
      return this.client.family_id ? this.client.family_loyalty_points : this.client.loyalty_points
    },

    note() {
      return {
        client_id: this.client.id,
        shop_id:   this.client.shop_id,
      }
    },

    cidSetup () {
      return this.shopEnvironmentData?.data?.fields?.cid
    },

    isSendCall() {
      return (!!this.cidSetup || this.is_mobile)
    },

    shareClient() {
      return this.shop_data?.chain_sharing_settings?.share_client
    },

    isAllowToEditNotes(){
      return this.canEditClientInfo && this.isClientOfCurrentShop
    },

    noteBoxClass(){
      return [
        'note-box',
        {
          'not-client-of-current-shop': !this.isClientOfCurrentShop,
          'note-box--pointer':          this.isAllowToEditNotes,
        },
      ]
    },

    closeButtonClassName() {
      return [
        'close-modal',
        {
          'close-modal--width-45': this.isShowSalesActions || this.isViewClientInfoAction,
        },
      ]
    },

    salesActionMobileModeClass() {
      return [
        'd-md-none',
        'sales-actions',
        {
          'no-show': !this.isAddingBookingToSales && this.isViewClientInfoAction && !this.isShowSalesActions,
        },
      ]
    },

    salesActionNotMobileModeClass() {
      return [
        'sales-actions',
        {
          'no-show': !this.isAddingBookingToSales && this.isViewClientInfoAction && !this.isShowSalesActions,
        },
      ]
    },

    isHideClientInfo() {
      return !isEmpty(this.clientsSetup) && getHideClientInfoPermission(
        this.clientsSetup?.environments?.contact_info_to_manager,
        this.clientsSetup?.environments?.contact_info_to_staff,
        this.client?.registration_date,
      )
    },

    clientAccountData() {
      return this.getClientAccountById(this.clientId)
    },

    showClientOutStanding() {
      return this.client.outstanding !== 0
    },

    passDay() {
      if(this.client.recent_visit_date_time_ts === 0) {
        return 0
      }
      const recentVisitDateTime = convertTimestampToDate(this.client.recent_visit_date_time_ts)
      const recentVisitDateTimetimeTS = convertDateToMomentUTC(recentVisitDateTime).startOf('day').unix()
      const currentTime = getStartOfTimezoneDateTS()
      const passDate = getDiffDateRange(recentVisitDateTimetimeTS, currentTime, 'day')
      return Math.round(passDate)
    },

    passDayText() {
      return this.$t('client-information.recent-visit-pass-date', {date: this.passDay})
    },

    mergeClientProps() {
      return {
        balance:             this.client.balance,
        familyId:            this.client.family_id,
        birthDay:            this.clientBirthdayText,
        birth_year:          this.client.birth_year,
        birth_month:         this.client.birth_month,
        birth_dd:            this.client.birth_dd,
        outstanding:         this.client.outstanding,
        clientNumber:        this.client.member_number,
        loyaltyPoint:        this.client.loyalty_points,
        familyBalance:       this.client.family_balance,
        preferredStaff:      this.client.preferred_staff_name,
        familyLoyaltyPoints: this.client.family_loyalty_points,
        recentVisitDateTime: this.client.recent_visit_date_time,
        recentVisitDateTS:   this.client.recent_visit_date_time_ts,
      }
    },
  },

  watch: {
    clientId: {
      handler: function (clientId) {
        clientId && this.initClientSetup()
      },
      immediate: true,
    },
  },

  created() {
    this.$signalR.on(NOTIFICATON_TYPE.SALES_TRANSFER_CLIENT, this.onTransferClient)
  },

  beforeDestroy() {
    this.$signalR.off(NOTIFICATON_TYPE.SALES_TRANSFER_CLIENT, this.onTransferClient)
  },

  methods: {
    formatDate,
    convertTimeStampToDate,
    ...mapActions('client', [
      'setClientActionDataAsync',
    ]),

    ...mapMutations('client', [
      'setBookingClient',
      'clearClientInformation',
    ]),

    ...mapMutations('client_photo',[
      'setClientAvatarAction',
    ]),

    ...mapMutations('sales',[
      'setClientIdUsingSales',
    ]),

    emptyValue,
    formatMoney,
    addDateZero,
    checkNullAndEmpty,
    isPermittedBySetupRole,

    onTransferClient(client) {
      if(this.$route && this.$route?.name === 'client-sales'
       && this.$route.params.clientId
       && parseInt(this.$route.params?.clientId) === client?.clientTransfer?.clientId) {
        this.setClientIdUsingSales(null)
        this.$router.push({ name: 'sales' })
        this._showDialogAlert(this.$t('clients.client-has-been-transferred-to-another-branch'))
        return
      }
    },

    async initClientSetup() {
      this.clientsSetup = await this.$clientCacheMixin_getClientShopInfo({
        shopId: this.shop_data.shop_id,
      })

      if(this.isNullObject(this.clientsSetup)) {
        this.showMissingClientsSetupAlert()
      }

      const environmentSetup = await this.$salesCacheMixin_getEnvironmentSetup({
        shopId:      this.shop_data.shop_id,
        countryCode: this.shop_data.country,
      })

      if(this.isNullObject(environmentSetup)) {
        this.showMissingSalesSetupAlert()
      } else {
        this.allowEditBalanceRoyaltyPointsPrepaidServicesRemaining = environmentSetup?.data_protection_security?.fields?.allow_edit_balance_royalty_points_prepaid_services_remaining
      }
    },

    isNotAllowSendMessage(client) {
      return client.allowed_message_type === options.allowed_message_type.not_message
    },

    handleHiddenClientModal(){
      this.actionVisiable = false
    },

    setData(){
      this.cid_setup = this.shopEnvironmentData?.data?.fields?.cid
      this.shop_id = this.shop_data?.shop_id
    },

    // Client
    async onClientAction(action, clientId = 0){
      try {
        this.preLoader()

        this.actionVisiable=true

        const payload = {
          action:    action,
          client_id: clientId,
          shop_id:   this.shop_data.shop_id,
        }

        const response = await this.setClientActionDataAsync(payload)

        if (response && !response.is_ok) {
          this._showDialogAlert(response.error_messages)
          return
        }

        this.showDialogById(this.clientActionModalId)
      } catch (error) {
        this._showDialogAlert([error.message])
      } finally {
        this.preLoader(false)
      }
    },

    handleUpdatedClient(updatedClient, isUpdateClientNameOrMobileOrMemberNumber = false) {
      this.$emit('on-updated-client', isUpdateClientNameOrMobileOrMemberNumber)
    },

    handleDeletedClient(){
      this.$emit('delete-client-success')
      this.onRemoveClient()
    },

    onRemoveClient(){
      // reset booking_client from client vuex store
      this.setBookingClient(new ClientViewModel().fields)

      if (this.$route && this.$route.name !== 'calendar') { // avoid reset client information modal when deleting client on calendar page
        this.clearClientInformation()
      }

      if (this.$route && this.$route.name === 'client-sales') {
        this.setClientIdUsingSales(null) // avoid user click back on browser to select previous deleted client at sales page
        this.$router.push({ name: 'sales' })
      }
    },

    onNoteRegister() {
      if (this.isAllowToEditNotes) {
        this.showDialogById(this.noteRegisterActionModalId)
      }
    },

    onUpdatedClientNoteSuccessfully(updatedClient) {
      this.handleUpdatedClient(updatedClient)
    },

    // Client Sales Image
    onAddClientSalesImageSuccess(addedImage) {
      this.$emit('added-client-sales-image', addedImage)
    },

    // Client Account
    async reloadClientAccount(){ // ref by family-action at onActionFamilyMemberFinished
      await this.$parent.loadClientAccountAsync()
    },

    // Family
    onFamilyAction() {
      this.showDialogById(this.familyActionModalId)
    },

    onFinishedFamilyAction(){
      this.$emit('finished-family-action')
    },

    // Points
    onActionLoyaltyPoints() {
      if (this.canEditPoints) {
        this.showDialogById(this.loyaltyPointsModalId)
      }
    },
    onUpdatedLoyaltyPoints(){
      this.getLoyaltyPointHistoryTableDateAsync(1)
      this.$emit('updated-loyalty-points')
    },

    // Points History
    onClickLoyaltyPoints(){
      this.tableId = guid()
      this.showDialogById(this.loyaltyPointsHsitoryModalId)
      this.getLoyaltyPointHistoryTableDateAsync(1)
    },

    async getLoyaltyPointHistoryTableDateAsync(page) {
      try {
        this.preLoader()

        this.loyaltyPointHistoryTableFilter.pageNumber = page
        this.loyaltyPointHistoryTableFilter.clientId = this.client?.id
        this.loyaltyPointHistoryTableFilter.shopId = this.client?.shop_id

        const balancePointsEditHistoryApi = new BalancePointsEditHistoryApi()
        const response = await balancePointsEditHistoryApi.getClientLoyaltyPointsHistoryAsync(this.loyaltyPointHistoryTableFilter)

        if(!response.is_ok){
          throw new ApiError(response.error_messages)
        }

        this.loyaltyPointHistoryTableData = {
          ...this.loyaltyPointHistoryTableData,
          rows:       response?.data?.items,
          pagination: response?.data?.pagination,
        }

      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    onChangePageOfLoyaltyPointsHistory(page){
      this.getLoyaltyPointHistoryTableDateAsync(page)
    },

    onViewSalesDetail(sales) {
      const sales_vm = new SalesBriefViewModel()
      sales_vm.fields.shop_id = sales.salesShopId
      sales_vm.fields.ref_status = sales.salesStatus
      sales_vm.fields.sales_number = sales.salesNumber
      this.onActionSalesBriefMixin(options.form_actions.view, sales_vm.getFields(), sales_vm.fields.ref_status, null, true)
      this.isVisibleSalesDetailDialog = true
    },

    viewSalesDetailOutstandingHistory(salesItem) {
      this.isOutstandingHistory = true
      const sales = new SalesBriefViewModel()
      sales.fields.shop_id = salesItem.shop_id
      sales.fields.ref_id = salesItem.history_ref_id
      this.onActionSalesBriefMixin(options.form_actions.view, sales.getFields(), null, null, true)
      this.isVisibleSalesDetailDialog = true

    },

    onViewRefundDetail(row){
      const refundAction = {
        action: options.form_actions.view,
        data:   {
          shop_id: row.refundShopId,
          ref_id:  row.refundId,
        },
        options: {
          sales_goods_type: sales_options.sales_goods_type.service,
        },
      }

      this.setRefundAction(refundAction)
      this.showDialogById(this.refundDetailOfLoyaltyPointsHistory)
    },

    hiddenClientInformation(mobile) {
      return formatMobileAndPhoneNumber(mobile, this.isHideClientInfo)
    },

    hideSendTextMessageButton(){
      if(!isEmpty(this.clientsSetup)) {
        if(this.clientsSetup.environments.allow_send_text_message_to_staff) {
          return false
        }

        return !isPermittedBySetupRole(sales_options.security_level_enum.manager_or_higher)
      }

      return true
    },

    hideInfoByPermission(){
      return hideMobilePhone(this.client.mobile_number)
    },

    onSendMessage() {
      this.$nextTick(() => {
        this.showDialogById(this.sendMessageModalId)
      })
    },

    onSendCall(isMobileNumber){
      const valid = this.$isValidAllowCallingClient()
      if(!valid) {
        return
      }
      if(isMobileNumber) this.callNumber = this.client.mobile_number
      if(!isMobileNumber) this.callNumber = this.client.phone_number

      if (this.is_mobile) {
        this.showDialogById(this.phoneCallAlertId)
      } else {
        this.$nextTick(() => {
          this.showDialogById(this.sendCallModalId)
        })
      }
    },

    onAddTextMessageSuccess() {
      this.$emit('added-text-message')
    },

    onConfirmCalling() {
      const link = document.createElement('a')
      link.href = `tel:${this.callNumber}`
      // window.open(`tel:${this.callNumber}`)
      document.body.appendChild(link)
      link.click()
    },

    openEditOutstanding() {
      this.showDialogById(this.editOutStandingModalId)
    },

    updatedOustandingAmount(clientOutstanding) {
      const clientOutstandingData = clientOutstanding.getFields()

      if (!this.$refs.outstandingHistoryTableRef) {
        this.hideDialogById(this.outstandingModalId)
      } else {
        this.$refs.outstandingHistoryTableRef.pagination.page_number = 1
        this.$refs.outstandingHistoryTableRef.loadDataTableAsync()
      }

      const updatedClientInformation = { ...cloneDeep(this.client), outstanding: clientOutstandingData.outstanding}
      const updatedClientAccount = {...cloneDeep(this.clientAccountData), outstanding: clientOutstandingData.outstanding}

      this.clientDictionaryMixin_setClient(updatedClientInformation)
      this.clientDistionaryMixin_setClientAccount(updatedClientAccount)
    },

    formatDateTime(date){
      if(date !== null && date !== 0)
        return moment(date).format(options.standard_date_format.ymdh)
    },
    // format
    formatRecentVisitDate(date) {
      if(date !== null && date !== 0)
        return moment(date).format(options.standard_date_format.ymd)
    },

    handleOutstandingEditButtonClick() {
      this.showDialogById(this.outstandingModalId)
    },

    handleHiddenSalesDetail() {
      this.isOutstandingHistory = false
      this.isVisibleSalesDetailDialog = false
    },

    /**
     * Consent form
     */
    async openConsentFormModal() {
      const consentForms = await this.$refs.clientConsentModalRef.checkConsentForm()

      if (!consentForms) {
        return
      }

      if (consentForms?.length) {
        this.isConsentFormModalShow = true

        return
      }

      return await this._showDialogEmbedComponentAlert({
        component: Vue.component('ResendMessageConfirmWrapper', {
          render(createElement) {
            return createElement(NoHasConsentFormAlarm, {
              on: this.$listeners,
            })
          },
        }),

        dialogClass: 'modal-ssm-priority',
        title:       this.$i18n.t('general.alarm'),
      })
    },

    closeConsentFormModal() {
      this.isConsentFormModalShow = false
    },

    handleLoyaltyPointsUpdatedNotes() {
      this.getLoyaltyPointHistoryTableDateAsync(1)
    },
  },
}
</script>

<style lang="scss">
@import './client-info-summary.scss';
</style>

<style lang="scss" scoped>
::v-deep .client-sales-note-tooltip .tooltip-inner {
  max-width: 500px;
}
</style>
