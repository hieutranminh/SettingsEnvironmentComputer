<template>
  <div class="consent-table-wrapper">
    <p class="consent-table-wrapper__record">
      {{ $tc('consent.total-records', paginationInfo.totalItems, { record: paginationInfo.totalItems }) }}
    </p>

    <div class="consent-table-wrapper__table">
      <consent-form-table
        :data="consentFormItems"
        :pagination="paginationInfo"

        @change-page="changePageNumber"
        @send-message="handleSendMessage"
        @sign-consent="handleSignConsent"
        @store-input="handleStoreInput"
        @store-input-message="handleStoreInputMessage"
        @view-signed-history="handleShowSignedHistory"
      />
    </div>

    <client-consent-form-detail-action
      :visible="isConsentFormDetailShow"
      :is-hide-client-info="isHideClientInfo"

      @hide="hideConsentFormDetailModal"
    />

    <send-message-modal
      ref="sendMessageModalRef"
      :data="client.id"
      :consent="consentMessageInfo"
      :store-input-answer="storeInputAnswer"
      :type="consentFormMessageType"
      :modal-id="sendMessageModalId"
      :is-hide-call-number="isHideClientInfo"
      :is-not-allow-send-message-client="isClientCheckDontSendMessage"
      :has-aha-ai-button="false"

      @on-add-text-message-success="sendTextMessageSuccess"
    />

    <signed-history-modal
      :client="client"
      :visible="isSignedHistoryModalShow"

      @hide="hideSignedHistoriesModal"
      @view-history="handleLoadSignedConsentFormDetail"
    />

    <sign-consent-form-modal
      :client="client"
      :link-key="linkKey"
      :visible="isSignConsentFormModalShow"
      :is-hide-client-info="isHideClientInfo"

      @sign="handleSign"
      @hide="hideSignConsentFormModal"
    />

    <signature-modal
      :visible="isSignatureModalShow"
      :client-answer="clientAnswer"
      @hide="hideSignatureModal"
      @handle-success="hideConsentFormContainer"
    />
    <client-store-input
      :client="client"
      :consent="signConsentForm"
      :visible="isClientStoreInputShow"
      :from-send-message="storeInputSendMessage"

      @hidden="onHideClientStoreInput"
      @show-client-consent-form="onSignConsent"
      @client-consent-form="onShowClientConsentForm"
      @send-message-consent-form="onSendConsentMessage"
    />
  </div>
</template>

<script>
// Utils
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'

// Constants
import { options } from 'OptionsHelpers'
import { CONSENT_MESSAGE_STATUS_ENUM, PAGINATION, COUNTRY, MESSAGES_ENUMS } from 'Constant'

// Apis
import { getConsentSetupByClient, getMessageLinkKey } from 'Modules/api/consent/consent-api.js'

// ViewModel
import { ClientConsentFormSetup } from 'Modules/view-model/consent/client-consent-form.js'

// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

const NoHasConsentMessageSetupAlarm = () => import('Modules/consent/components/client-consent-form/components/no-has-consent-message-setup-alarm/no-has-consent-message-setup-alarm.vue')

export default {
  components: {
    SignatureModal:                () => import('Modules/consent/components/signature-modal/signature-modal.vue'),
    SendMessageModal:              () => import('Components/messages/send-message-modal/send-message-modal.vue'),
    SignConsentFormModal:          () => import('Modules/consent/components/sign-consent-form-modal/sign-consent-form-modal.vue'),
    ConsentFormTable:              () => import('Modules/consent/components/client-consent-form/components/consent-form-table/consent-form-table.vue'),
    SignedHistoryModal:            () => import('Modules/consent/components/client-consent-form/components/signed-history-modal/signed-history-modal.vue'),
    ClientConsentFormDetailAction: () => import('Modules/consent/components/client-consent-form/components/client-consent-form-detail-action/client-consent-form-detail-action.vue'),
    ClientStoreInput:              () => import ('Modules/consent/components/client-consent-form/components/consent-store-input/store-input.vue'),
  },

  extends: ComponentBase,

  props: {
    client: {
      type:    Object,
      default: () => ({}),
    },

    isHideClientInfo: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      hasConsentFormError: false,
      consentFormItems:    [],
      signConsentForm:     {},
      paginationInfo:      {
        pageSize:   0,
        pageNumber: 0,
        totalItems: 0,
      },

      pageNumber: 1,

      consentMessageInfo: {},

      isSignatureModalShow:       false,
      isClientStoreInputShow:     false,
      isConsentFormDetailShow:    false,
      isSignedHistoryModalShow:   false,
      isSignConsentFormModalShow: false,
      linkKey:                    '',

      storeInputSendMessage: false,
      clientAnswer:          [],
      storeInputAnswer:      [],
    }
  },

  computed: {
    ...mapState('consent', ['clientInfo']),

    sendMessageModalId() {
      return 'consent-send-message-modal'
    },

    consentFormMessageType() {
      return options.messages_enums.send_page.consent_form
    },

    isClientCheckDontSendMessage() {
      return this.client.allowed_message_type === options.allowed_message_type.not_message
    },

    countryCode() {
      if(this.x_user.language === options.language.korean) {
        return COUNTRY.KR
      }
      return COUNTRY.VN
    },
  },

  methods: {
    ...mapMutations('consent', [
      'resetClientInfo',
      'setSignedHistory',
      'resetSignedHistory',
      'setClientConsentFormList',
      'setClientSignedHistoryAction',
      'setClientSignedConsentFormDetail',

    ]),

    ...mapActions('consent', [
      'getClientConsentFormList',
      'getClientConsentFormSignedDetail',
    ]),

    resetConsentFormTable() {
      Object.assign(this.$data, this.$options.data.call(this))
    },

    async loadConsentSetupByClient() {
      try {
        this.preLoader()

        if (this.hasConsentFormError) {
          this.hasConsentFormError = false
        }

        const payload = {
          clientId:   this.client.id,
          pageNumber: this.pageNumber,
          pageSize:   PAGINATION.DEFAULT,
          shopId:     this.shop_data.shop_id,
        }

        const response = await getConsentSetupByClient(payload)

        const consentFormItems = response?.data?.result?.items ?? []
        this.consentFormItems = consentFormItems.map(item => ClientConsentFormSetup.build(item))
        this.paginationInfo = response?.data?.result?.pagingInfo ?? { totalItems: 0 }

      } catch(error) {
        this.hasConsentFormError = true
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    changePageNumber(pageNumber) {
      this.pageNumber = pageNumber

      this.loadConsentSetupByClient()
    },

    /**
     * @description Handle Consent Send Message
     * @param {Object} consent
     * @param {String} consent.title
     * @param {Number} consent.consentFormId
     */
    handleSendMessage(consent) {
      if (!this.client.mobile_number) {
        this._showDialogAlert(this.$t('consent.mobile-number-does-not-exist'))
        return
      }

      this.consentMessageInfo = {
        title: consent.title,
        id:    consent.consentFormId,
      }

      this.$nextTick(async () => {
        try {
          this.preLoader()

          const content = await this.$refs.sendMessageModalRef?.checkValidMessageContent?.(MESSAGES_ENUMS.SEND_PAGE.CONSENT_FORM)

          if (content) {
            this.showDialogById(this.sendMessageModalId)

            return
          }

          return await this._showDialogEmbedComponentAlert({
            component: Vue.component('ResendMessageConfirmWrapper', {
              render(createElement) {
                return createElement(NoHasConsentMessageSetupAlarm, {
                  on: this.$listeners,
                })
              },
            }),

            dialogClass: 'modal-ssm-priority',
            title:       this.$i18n.t('general.alarm'),
          })

        } catch (error) {
          this._showDialogAlert(error.message)
        } finally {
          this.preLoader(false)
        }
      })
    },

    sendTextMessageSuccess() {
      this.consentMessageInfo = {}
      this.hideDialogById(this.sendMessageModalId)

      this.loadConsentSetupByClient()
    },

    /**
     * @description Handle View Consent Form Detail
     * @param {Object} consent
     * @param {Number} consent.shopId
     * @param {Number} consent.status
     * @param {Number} consent.clientId
     * @param {Number} consent.pageSize
     * @param {Number} consent.pageNumber
     * @param {Number} consent.consentFormId
     */
    async handleShowSignedHistory(consent) {
      try {
        this.preLoader()

        const payload = {
          pageNumber:    1,
          shopId:        consent.shopId,
          clientId:      this.client.id,
          pageSize:      PAGINATION.DEFAULT,
          consentFormId: consent.consentFormId,
          status:        CONSENT_MESSAGE_STATUS_ENUM.SIGNED,
        }

        // const consentItem = await this.getClientConsentFormList(payload)
        await this.getClientConsentFormList(payload)

        this.isSignedHistoryModalShow = true
        this.setClientSignedHistoryAction({
          shopId:        consent.shopId,
          clientId:      this.client.id,
          consentFormId: consent.consentFormId,
          status:        CONSENT_MESSAGE_STATUS_ENUM.SIGNED,
        })

      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    /**
     * @description Get signed consent form detail
     * @param {Object} clientConsentForm
     * @param {Number} clientConsentForm.shopId
     * @param {Number} clientConsentForm.clientConsentFormId
     */
    async handleLoadSignedConsentFormDetail(clientConsentForm) {
      try {
        this.preLoader()

        const payload = {
          shopId:              clientConsentForm.shopId,
          clientConsentFormId: clientConsentForm.clientConsentFormId,
        }

        await this.getClientConsentFormSignedDetail(payload)
        this.isConsentFormDetailShow = true

      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    hideConsentFormDetailModal() {
      this.isConsentFormDetailShow = false
    },

    hideSignedHistoriesModal() {
      this.resetSignedHistory()
      this.isSignedHistoryModalShow = false
    },

    handleStoreInput(consent) {
      this.signConsentForm = consent
      this.isClientStoreInputShow = true
    },

    /**
     * @description sign consent form
     */
    async handleSignConsent(consent) {
      try {
        this.preLoader()
        const payload = {
          clientId:      this.client.id,
          shopId:        this.shop_data.shop_id,
          consentFormId: consent.consentFormId,
          solutionId:    this.shop_data.solution_id,
          countryCode:   this.countryCode,
        }
        const data = await getMessageLinkKey(payload)

        await this.clientInfo.getClientByLinkKey(data.data.result.messageLinkKey, this.countryCode)
        this.isSignConsentFormModalShow = true

      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleSign(clientAnswer) {
      this.clientAnswer = clientAnswer
      this.isSignatureModalShow = true
      this.isSignConsentFormModalShow = false
    },

    hideSignConsentFormModal() {
      this.isSignConsentFormModalShow = false
    },

    hideSignatureModal() {
      this.resetClientInfo()
      this.isSignatureModalShow = false
    },

    hideConsentFormContainer() {
      this.hideSignatureModal()
      this.$emit('hide')
    },

    onHideClientStoreInput() {
      this.isClientStoreInputShow = false
      this.storeInputSendMessage = false
    },

    onSignConsent() {
      this.handleSignConsent(this.signConsentForm)
    },

    handleStoreInputMessage(consent) {
      this.signConsentForm = consent
      this.isClientStoreInputShow = true
      this.storeInputSendMessage = true
    },

    onSendConsentMessage(storeInput) {
      this.storeInputAnswer = storeInput
      this.handleSendMessage(this.signConsentForm)
      this.isClientStoreInputShow = false
    },

    onShowClientConsentForm() {
      this.isClientStoreInputShow = false
      this.isSignConsentFormModalShow = true
    },
  },
}
</script>

<style lang="scss" scoped>
    @import './consent-form-table-container.scss';
</style>
