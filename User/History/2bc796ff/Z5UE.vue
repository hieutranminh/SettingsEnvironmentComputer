<template>
  <div class="return-detail-action-wrapper">
    <b-modal
      :id="modalId"
      v-bind="$attrs"
      :title="modalTitle"
      :no-close-on-backdrop="true"
      static
      size="xl"
      hide-footer
      v-on="$listeners"
      @hide="onCancel()"
      @show="onLoadForm()"
    >
      <!-- BEGIN MODAL BODY -->
      <div class="modal-body">
        <div class="modal-body__header">
          <h3>{{ $t('receivings.return') }}</h3>
          <span>{{ $t('receivings.created-datetime', { createdDatetime: returnCreatedDatetime }) }}</span>
        </div>
        <div class="receiving-information row">
          <div class="col-4">
            <span>{{ $t('receivings.supplier') }}: </span>
            <span>{{ returnVM.supplier_name }}</span>
          </div>
          <div class="col-8">
            <span>{{ $t('general.date') }}: </span>
            <span>{{ formatTSToDate(returnVM.receiving_date_ts) }}</span>
          </div>
          <div class="col-12">
            <p>{{ $t('receivings.notes') }} :</p>
            <p>{{ returnVM.notes }}</p>
          </div>
        </div>
        <div class="table">
          <view-table :data="tableData">
            <template
              slot="unit_price"
              slot-scope="{row}"
            >
              <span>{{ formatMoney(row.unit_price, 0) }}</span>
            </template>
            <template
              slot="quantity"
              slot-scope="{row}"
            >
              <span>{{ formatMoney(row.quantity, 0) }}</span>
            </template>
            <template
              slot="amount"
              slot-scope="{row}"
            >
              <span>{{ formatMoney(row.amount, 0) }}</span>
            </template>
          </view-table>
        </div>
      </div>
      <!-- END MODAL BODY -->

      <!-- BEGIN MODAL FOOTER -->
      <div class="modal-footer">
        <aha-button
          v-if="!isReadOnly"
          id="btn-detail-edit"
          variant="blue"
          @click="onReturnEdit"
        >
          {{ $t('general.edit') }}
        </aha-button>

        <aha-button
          v-if="!isReadOnly"
          id="btn-detail-delete"
          variant="blue"
          @click="onClickDeleteReturn"
        >
          {{ $t('general.delete') }}
        </aha-button>

        <aha-button
          variant="blue-light"
          @click="onCancel"
        >
          {{ $t('general.close') }}
        </aha-button>
      </div>
    </b-modal>
    <!-- END MODAL FOOTER -->

    <alert-confirm
      :id="alertConfirmDeleteReturnId"
      :label_no="$t('general.cancel')"
      :label_yes="$t('general.delete')"
      :data_alerts="[$t('general.warning-delete')]"
      yes-button-variant="red"
      @confirm="onAlertConfirmDeleteReturn"
    />
  </div>
</template>

<script>
const DELETED_RECEIVING_EVENT_NAME = 'deleted-receiving'

// Utils
import moment from 'moment'
import {
  convertTimeStampToDate,
  formatMoney,
} from 'CommonHelpers'
import { ApiError } from 'HTTPHelpers'
import cloneDeep from 'lodash/cloneDeep'
import { mapGetters, mapMutations } from 'vuex'
import ReceivingApi from 'API/inventory/receiving-api.js'
import { common_options } from 'Options/common-options.js'
import { formatTSToUTCDate, getCurrentTimezoneTS } from 'DatetimeHelpers'
import ReceivingViewModel from 'ViewModels/inventory/receivings/receiving-view-model.js'

// Components
import ViewTable from 'CommonComponents/view-table/view-table.vue'
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ReturnAction from 'Components/inventory/receivings/return-action/return-action.vue'
import { options } from 'OptionsHelpers'

export default {
  components: {
    ViewTable,
    AlertConfirm,
    ReturnAction,
  },

  extends: ComponentBase,

  props: {
    isReadOnly: {
      type:    Boolean,
      default: false,
    },

    modalId: {
      type:    String,
      default: 'return-detail-action-modal',
    },
  },

  data() {
    return {
      common_options,
      returnApi:                  {},
      returnVM:                   {},
      returnActionModalId:        'return-action-modal',
      alertConfirmDeleteReturnId: 'alert-confirm-delete-receiving-id-modal',
    }
  },
  computed: {
    ...mapGetters('receiving', {
      returnAction: 'getReturnAction',
    }),

    modalTitle() { return this.$t('receivings.return-detail') },

    tableData() {
      return {
        fields: [
          { field: 'product_code', label: 'receivings.product-code', width: '20%', sortable: false },
          { field: 'product_name', label: 'receivings.product-name', width: '20%', sortable: false },
          { field: 'unit_price', label: 'receivings.unit-price', width: '20%', sortable: false, expand: true },
          { field: 'quantity', label: 'receivings.quantity', width: '20%', sortable: false, expand: true },
          { field: 'amount', label: 'receivings.amount', width: '20%', sortable: false, expand: true },
        ],
        rows:    this.returnVM.receiving_items,
        options: {
          pagination: false,
        },
      }
    },

    returnCreatedDatetime() {
      return formatTSToUTCDate(this.returnVM.fields.created_date_time_ts, common_options.standard_date_format.ymdh)
    },
  },

  created() {
    this.returnApi = new ReceivingApi()
    this.returnVM = new ReceivingViewModel()
  },

  methods: {
    ...mapMutations('receiving', [
      'setReturnAction',
    ]),
    formatMoney,

    hideModal() {
      this.hideDialogById(this.modalId)
    },

    onCancel() {
      this.hideModal()
    },

    async onLoadForm() {
      if (this.returnAction?.options?.hasReceivingDetail) {
        this.returnVM = this.returnAction.data
        return
      }

      try {
        const query = {
          id:      this.returnAction.data.receiving_id,
          shop_id: this.returnAction.data.shop_id,
        }

        this.preLoader()
        const response = await this.returnApi.getReceivingDetailAsync(query)

        if (!response.is_ok) {
          throw new ApiError(response.error_messages)
        }

        const tmpReturnViewModel = cloneDeep(response.data)
        const returnAction = {
          action: common_options.form_actions.edit,
          data:   tmpReturnViewModel,
        }
        this.setReturnAction(cloneDeep(returnAction))
        this.returnVM = this.returnAction.data

      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    // edit
    onReturnEdit() {
      this.showDialogById(this.returnActionModalId)
    },

    // delete
    onClickDeleteReturn() {
      this.showDialogById(this.alertConfirmDeleteReturnId)
    },

    onAlertConfirmDeleteReturn() {
      this.onDeleteReturnAsync()
    },

    async onDeleteReturnAsync() {
      const query = {
        receiving_id:         this.returnVM.receiving_id,
        deleted_date_time_ts: getCurrentTimezoneTS(),
        user_id:              this.x_user.user_id,
        user_name:            this.x_user.user_name,
        shop_id:              this.shop_data.shop_id,
      }

      try {
        this.preLoader()
        const response = await this.returnApi.deleteReceivingAsync(query)
        if (!response.is_ok) {
          this._showDialogAlert(response.error_messages)
          return
        }

        this.$emit(DELETED_RECEIVING_EVENT_NAME, this.returnVM)
        this.hideModal()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }

    },

    formatTSToDate(createDate) {
      return moment.utc(convertTimeStampToDate(createDate)).format(options.standard_date_format.ymd)
    },
  },
}
</script>

<style lang="scss">
@import './return-detail-action.scss';
</style>
