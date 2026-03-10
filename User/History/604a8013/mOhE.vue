<template>
  <div>
    <b-modal
      ref="modalSendMessageAhaAi"
      :visible="visible"
      :modal-class="modalClass"
      :title="$t('aha-ai.title')"

      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      @shown="onShown"
      @hide="onHide"
      @hidden="onHidden"
    >
      <!-- Main wrapper: Two-column layout -->
      <div class="modal-wrapper">
        <!-- Left Panel: Input/Configuration -->
        <div class="modal-wrapper__left">
          <!-- Purpose and Content Section -->
          <div class="section section__purpose-content">
            <div class="section__title">
              <p>{{ $t('aha-ai.purpose-content') }} <span>*</span></p>
            </div>
            <div class="section__field">
              <b-form-textarea
                ref="purposeContentTextarea"
                v-model="formData.purposeContent"
                :rows="MAX_ROW_TEXTAREA"
                :placeholder="$t('aha-ai.purpose-content-placeholder')"
                no-resize
                @input="onInputPurposeContent"
                @keydown.enter="onEnterKeyDownPurposeContent"
              />
            </div>
          </div>

          <!-- Style Section -->
          <div class="section section__style">
            <div class="section__title">
              <p>{{ $t('aha-ai.style-title') }} <span>*</span></p>
              <span class="section__subtitle">{{ $t('aha-ai.style-subtitle') }}</span>
            </div>
            <div class="section__field">
              <b-form-radio-group
                v-model="formData.toneStyle"
                :options="styleOptions"
              />
            </div>
          </div>

          <div class="section section__bottom">
            <!-- AI Message Generation Guide Section -->
            <div class="section__guide">
              <div class="section__title">
                <b>{{ $t('aha-ai.guide-title') }}</b>
              </div>
              <div class="section__content">
                <ul class="guide-list">
                  <li>{{ $t('aha-ai.guide-item-1') }}</li>
                  <li>{{ $t('aha-ai.guide-item-2') }}</li>
                </ul>
              </div>
            </div>

            <!-- Generate Button -->
            <div class="section__actions">
              <a-button
                v-if="isDesktopDevice"
                ref="generateButton"
                v-b-tooltip="{
                  title: generatedResults.length
                    ? $t('aha-ai.tooltip-generate-another-ai-message')
                    : $t('aha-ai.tooltip-generate-ai-message'),
                  customClass: 'tooltip-generate-ai-message',
                  triggers: 'hover',
                  boundary: 'viewport',
                }"
                variant="orange"
                :disabled="!canGenerate"
                @click.prevent="onGenerate"
              >
                {{
                  generatedResults.length
                    ? $t('aha-ai.generate-button-another-message')
                    : $t('aha-ai.generate-button')
                }}
              </a-button>

              <a-button
                v-else
                ref="generateButton"
                variant="orange"
                :disabled="!canGenerate"
                @click.prevent="onGenerate"
              >
                {{
                  generatedResults.length
                    ? $t('aha-ai.generate-button-another-message')
                    : $t('aha-ai.generate-button')
                }}
              </a-button>
            </div>
          </div>
        </div>

        <!-- Right Panel: Result Display -->
        <div
          ref="resultPanel"
          class="modal-wrapper__right"
        >
          <div class="result-section">
            <div class="result-section__title">
              <p>{{ $t('aha-ai.result-title') }}</p>
            </div>
            <div class="result-section__content">
              <!-- Initial State: Centered placeholder text -->
              <div
                v-if="resultState === RESULT_STATE.INITIAL"
                class="result-section__empty"
              >
                <p>{{ $t('aha-ai.result-placeholder') }}</p>
              </div>

              <!-- Loading State: EMPTY text -->
              <div
                v-else-if="resultState === RESULT_STATE.LOADING"
                class="result-section__loading"
              >
                <div class="result-section__loading-image">
                  <img
                    src="/template/images/image-ai-search.svg"
                    alt="loading"
                  >
                </div>
                <p>{{ $t('aha-ai.result-generating') }}</p>
              </div>

              <!-- Result State: Show result list -->
              <ai-message-result-list
                v-else-if="resultState === RESULT_STATE.RESULT"
                :items="generatedResults"
                @delete="handleDeleteResult"
                @save-to-my-messages="handleSaveToMyMessages"
                @use-message="handleUseMessage"
              />
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <modal-add-my-message
      :visible="isShowAddMyMessageModal"
      @confirm="onConfirmSaveMyMessage"
      @cancel="isShowAddMyMessageModal = false"
    />
  </div>
</template>

<script>
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
// Components
import ComponentBase from 'Components/common/component-base/component-base.vue'
import AButton from 'Modules/aha/a-button/a-button.vue'
import AiMessageResultList from './partials/ai-message-result-list.vue'
import ModalAddMyMessage from 'Components/messages/modal-add-my-message/modal-add-my-message.vue'
// APIs
import { getMessageAgent } from 'Modules/api/aha-ai/aha-ai-api'
import TextMyMessageApi from 'API/messages/text-my-message-api'
// Constants
import { options } from 'OptionsHelpers'
import { AHA_AI_TONE_STYLE, AHA_AI_LANGUAGE } from 'Constant'
// Helpers
import { guid, realLength, realSubstring } from 'CommonHelpers'
import MessageHelper from '../../../helpers/message-helper.js'

const RESULT_STATE = {
  INITIAL: 'initial',
  LOADING: 'loading',
  RESULT:  'result',
}
const ERROR_CODES = {
  ERR_COM_API_SERVER_ERROR: 'ERR_COM_API_SERVER_ERROR',
  AEC16A:                   'AEC16A',
}

const MAX_LENGTH_TEXTAREA = 1000
const MAX_ROW_TEXTAREA = 6

export default {
  extends: ComponentBase,

  components: {
    AButton,
    AiMessageResultList,
    ModalAddMyMessage,
  },

  mixins: [
    DeviceMixin,
  ],

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
    textFee: {
      type:    Object,
      default: () => ({}),
    },
    messageType: {
      type:    Number,
      default: options.messages_enums.message_type.lms,
    },
  },

  data() {
    return {
      MAX_LENGTH_TEXTAREA,
      MAX_ROW_TEXTAREA,
      RESULT_STATE,

      isShowAddMyMessageModal: false,
      pendingUseMessageItem:   null,

      formData: {
        purposeContent: '',
        toneStyle:      AHA_AI_TONE_STYLE.FORMAL_NOTIFICATION,
        language:       AHA_AI_LANGUAGE.ENGLISH,
      },
      resultState:       RESULT_STATE.INITIAL,
      generatedResults:  [],
      currentResultItem: {},
    }
  },

  computed: {
    modalClass() {
      return ['modal-send-message-aha-ai', {
        'modal-send-message-aha-ai--mobile': this.isMobileDevice,
      }]
    },

    canGenerate() {
      return this.formData.purposeContent.trim().length > 0 && this.formData.toneStyle !== null
    },

    styleOptions() {
      return [
        {
          value: AHA_AI_TONE_STYLE.FORMAL_NOTIFICATION,
          text:  this.$t('aha-ai.style-formal'),
        },
        {
          value: AHA_AI_TONE_STYLE.FRIENDLY_CONVERSATIONAL,
          text:  this.$t('aha-ai.style-friendly'),
        },
        {
          value: AHA_AI_TONE_STYLE.EMOTIONAL_EMPATHY,
          text:  this.$t('aha-ai.style-emotional'),
        },
        {
          value: AHA_AI_TONE_STYLE.HUMOROUS_CASUAL,
          text:  this.$t('aha-ai.style-humorous'),
        },
        {
          value: AHA_AI_TONE_STYLE.PROFESSIONAL_INFORMATIVE,
          text:  this.$t('aha-ai.style-professional'),
        },
      ]
    },
  },

  watch: {
    canGenerate(newValue) {
      // Hide tooltip when button becomes disabled to prevent tooltip from hanging
      if (!newValue) {
        this.$root.$emit('bv::hide::tooltip')
      }
    },
  },

  methods: {
    focusRef(refName) {
      const element = this.$refs[refName]
      if (element && element.$el) {
        element.$el.focus()
      }
    },

    blurRef(refName) {
      const element = this.$refs[refName]
      if (element && element.$el) {
        element.$el.blur()
      }
    },

    scrollToResultPanel() {
      const resultPanel = this.$refs.resultPanel
      if (!resultPanel) return

      const viewportHeight = window.innerHeight
      const resultPanelHeight = resultPanel.offsetHeight

      // If result panel fits within viewport, scroll to show entire result (bottom)
      // If result panel exceeds viewport, scroll to show Result title (top)
      const blockPosition = resultPanelHeight <= viewportHeight ? 'end' : 'start'
      resultPanel.scrollIntoView({ behavior: 'smooth', block: blockPosition })
    },

    onShown() {
      this.focusRef('purposeContentTextarea')
    },

    onHide() {
      this.$emit('cancel')
    },

    onHidden() {
      if (this.pendingUseMessageItem) {
        this.$emit('use-message', this.pendingUseMessageItem)
        this.pendingUseMessageItem = null
      }
    },

    async onGenerate() {
      // Blur elements to hide tooltip and keyboard
      this.blurRef('generateButton')
      this.blurRef('purposeContentTextarea')

      if (!this.canGenerate) {
        this._showDialogAlert(this.$t('aha-ai.validate-purpose-content-required'))
        return
      }

      try {
        this.preLoader()
        this.resultState = RESULT_STATE.LOADING

        // Scroll to result panel on mobile after result is rendered
        if (this.isMobileDevice) {
          this.$nextTick(() => {
            this.scrollToResultPanel()
          })
        }

        const userLanguage = this.x_user.language === options.language.english
          ? AHA_AI_LANGUAGE.ENGLISH
          : AHA_AI_LANGUAGE.KOREAN
        const businessTypeCode = this.shop_data.business_type_code
        const maxBytes = this.messageType === options.messages_enums.message_type.sms
          ? this.textFee.sms_max_bytes
          : this.textFee.lms_max_bytes

        const payload = {
          shopId:           this.shop_data.shop_id,
          purposeContent:   this.formData.purposeContent,
          toneStyle:        this.formData.toneStyle,
          language:         userLanguage,
          businessTypeCode: businessTypeCode,
          maxBytes:         maxBytes,
        }

        const response = await getMessageAgent(payload)
        const textMessage = response.data.result.textMessage

        const newResult = {
          id:                 guid(),
          content:            textMessage,
          isSavedToMyMessage: false,
        }
        this.generatedResults.unshift(newResult)
        this.resultState = RESULT_STATE.RESULT
      } catch (error) {
        console.log('xxx', error)
        if (error?.codes?.includes(ERROR_CODES.ERR_COM_API_SERVER_ERROR)) {
          this._showDialogAlert(this.$t('aha-ai.message-ai-could-not-generate'))
          return
        }

        this._showDialogAlert(this.$t('aha-ai.validate-ai-generation-failed'), {
          confirmButtonText: this.$t('general.confirm'),
        })
      } finally {
        this.resultState = this.generatedResults.length
          ? RESULT_STATE.RESULT
          : RESULT_STATE.INITIAL
        this.preLoader(false)
      }
    },

    async handleDeleteResult(item) {
      const isConfirm = await this._showDialogConfirm(this.$t('aha-ai.validate-delete-result'),{ confirmBtnText: this.$t('general.confirm') })
      if (!isConfirm) return

      const index = this.generatedResults.findIndex((result) => result.id === item.id)
      if (index !== -1) {
        this.generatedResults.splice(index, 1)
      }
      if (this.generatedResults.length === 0) this.resultState = RESULT_STATE.INITIAL
    },

    handleSaveToMyMessages(item) {
      this.currentResultItem = item
      this.isShowAddMyMessageModal = true
    },

    async handleUseMessage(item) {
      const isConfirm = await this._showDialogConfirm(this.$t('aha-ai.validate-confirm-use-message'),{ confirmBtnText: this.$t('general.confirm') })
      if (!isConfirm) return

      this.pendingUseMessageItem = item
      this.onHide()
    },

    getMessageTypeByBytes(content) {
      const messageHelper = new MessageHelper(
        this.messageType,
        this.textFee.sms_max_bytes,
        this.textFee.lms_max_bytes,
      )
      const contentBytes = messageHelper.calculate_byte(content)

      if (contentBytes <= this.textFee.sms_max_bytes) {
        return options.messages_enums.message_type.sms
      }
      return options.messages_enums.message_type.lms
    },

    async onConfirmSaveMyMessage(myMessageCategoryId) {
      try {
        this.preLoader()

        const { shop_id, solution_id, country } = this.shop_data
        const textMyMessageApi = new TextMyMessageApi()

        // If messageType is LMS, always save as LMS
        // If messageType is SMS, determine based on content bytes
        const messageTypeToSave = this.messageType === options.messages_enums.message_type.lms
          ? this.messageType
          : this.getMessageTypeByBytes(this.currentResultItem.content)

        await textMyMessageApi.createTextMyMessageAsync({
          id:                     this.currentResultItem.id,
          contents:               this.currentResultItem.content,
          message_type:           messageTypeToSave,
          shop_id:                shop_id,
          solution_id:            solution_id,
          country_code:           country,
          my_message_category_id: myMessageCategoryId,
        })

        // Update isSavedToMyMessage flag
        const resultItem = this.generatedResults.find((result) => result.id === this.currentResultItem.id)
        if (resultItem) {
          resultItem.isSavedToMyMessage = true
        }

        this.isShowAddMyMessageModal = false
        this.$emit('confirm-save-my-message-success', myMessageCategoryId)
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async onInputPurposeContent(value) {
      const graphemeLength = realLength(value, this.shop_data.country)
      if (graphemeLength > MAX_LENGTH_TEXTAREA) {
        this.blurRef('purposeContentTextarea')

        const isConfirm = await this._showDialogConfirm(
          this.$t('aha-ai.validate-maximum-note-length'),
          {
            confirmBtnText:   this.$t('general.confirm'),
            isOnlyConfirmBtn: true,
          },
        )

        if (isConfirm) {
          this.formData.purposeContent = realSubstring(value, 0, MAX_LENGTH_TEXTAREA, this.shop_data.country)
          this.focusRef('purposeContentTextarea')
        }
      }
    },

    onEnterKeyDownPurposeContent(event) {
      // On PC: only trigger when Enter is pressed without Shift/Ctrl/Alt (for new line)
      // On Mobile: trigger on any Enter key press
      const isExactEnter = !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey
      const shouldTrigger = this.isMobileDevice || isExactEnter

      if (shouldTrigger && this.canGenerate) {
        event.preventDefault()
        this.onGenerate()
      }
    },

    reset() {
      this.formData = {
        purposeContent: '',
        toneStyle:      AHA_AI_TONE_STYLE.FORMAL_NOTIFICATION,
        language:       AHA_AI_LANGUAGE.ENGLISH,
      }
      this.resultState = RESULT_STATE.INITIAL
      this.generatedResults = []
      this.currentResultItem = {}
      this.pendingUseMessageItem = null
    },
  },
}
</script>

<style lang="scss">
@import './modal-send-message-aha-ai.scss';
</style>
