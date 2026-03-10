<template>
  <div class="common-style">
    <b-modal
      :id="modalId"

      ref="modal"
      :size="size"
      :title="modalTitle"
      v-bind="$attrs"

      static
      hide-footer
      no-close-on-backdrop

      @show="onLoadForm"
      @hidden="hideModal"
      v-on="$listeners"
    >
      <send-message-action
        v-if="isSend"
        ref="send_text_message"

        :type="type"
        :data="data"
        :consent="consent"
        :multi_data="multiData"
        :call_number="callNumber"
        :booking-deposit="bookingDeposit"
        :store-input-answer="storeInputAnswer"
        :is-hide-call-number="isHideCallNumber"
        :is-send-message-by-client="isSendMessageByClient"
        :is-send-message-by-booking="isSendMessageByBooking"
        :is-not-allow-send-message-client="isNotAllowSendMessageClient"

        @reload-page="onReloadPage"
        @cancel-page="hideModal"
      />

      <send-message-histories
        v-if="!isSend"
        ref="send_text_message_histories"
        :is_page="false"
        :from_modal_id="'send_text_message_histories' + type"
      />
    </b-modal>
  </div>
</template>

<script>
// Constant
import { options } from 'OptionsHelpers'

// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import SendMessageAction from 'Components/messages/send-message-action/send-message-action.vue'

export default {
  components: {
    SendMessageAction,
    'send-message-histories': () => import('../../../pages/messages/send-message-histories/send-message-histories.vue'),
  },
  extends: ComponentBase,
  props:   {
    modalId: {
      type:    String,
      default: '',
    },

    data: {
      type:    Number, // Client Id
      default: 0,
    },

    type: {
      type:    Number,
      default: 0,
    },

    multiData: { // To BookingList, Client Management, Campaign
      type:    Array,
      default: () => [],
    },

    callNumber: {
      type:    String,
      default: null,
    },

    isHideCallNumber: {
      type:    Boolean,
      default: false,
    },

    bookingDeposit: {
      type:    Object,
      default: () => ({}),
    },

    consent: {
      type:    Object,
      default: () => ({}),
    },

    storeInputAnswer: {
      type:    Array,
      default: () => ([]),
    },

    isSendMessageByBooking: {
      type:    Boolean,
      default: true,
    },

    isSendMessageByClient: {
      type:    Boolean,
      default: true,
    },

    isNotAllowSendMessageClient: {
      type:    Boolean,
      default: false,
    },
  },
  data() {
    return {
      options,
      size:   'msg',
      isSend: true,
    }
  },
  computed: {
    modalTitle() {
      if(this.type == options.messages_enums.send_page.deposit_guide)
        return this.$t('messages.booking-deposit-guide-title')
      else if(this.type == options.messages_enums.send_page.deposit_payment_confirm)
        return this.$t('messages.booking-deposit-confirmation-title')
      else if(this.type == options.messages_enums.send_page.consent_form)
        return this.$t('messages.consent-message-title')
      else
        return this.$t('messages.send-text-messages')
    },
  },
  methods: {

    /**
     * @description Check valid message content have seted up yet
     */
    async checkValidMessageContent(type) {

      if (type === options.messages_enums.send_page.consent_form) {
        await this.$refs.send_text_message.onLoadConsentSetupAsync()

        return this.$refs.send_text_message.contents
      }
    },

    async onLoadForm() {
      this.isSend = true

      this.$nextTick(async () => {
        if(this.type == options.messages_enums.send_page.deposit_guide
      || this.type == options.messages_enums.send_page.deposit_payment_confirm
      || this.type == options.messages_enums.send_page.consent_form)
          this.size = 'llg'
        else
          this.size = 'msg'

        await this.$refs['send_text_message'].onLoadForm()
      })
    },

    async onReloadPage() {
      if(this.type == options.messages_enums.send_page.client
        || this.type == options.messages_enums.send_page.campaign
        || this.type == options.messages_enums.send_page.unregister_client
        || this.type == options.messages_enums.send_page.unregister_clients
        || this.type == options.messages_enums.send_page.cid_unregister_client
        || this.type == options.messages_enums.send_page.deposit_guide
        || this.type == options.messages_enums.send_page.deposit_payment_confirm
        || this.type == options.messages_enums.send_page.consent_form) {
        this.$emit('on-add-text-message-success')
        this.hideModal()
      } else if(this.type == options.messages_enums.send_page.client_management
      || this.type == options.messages_enums.send_page.multi_booking) {
        this.size = 'xl'
        this.isSend = false

        setTimeout(async () => {
          await this.$refs['send_text_message_histories'].initSetup()
        }, 1000)
      }
    },

    hideModal() {
      this.$refs.modal.hide()
    },
  },
}
</script>
