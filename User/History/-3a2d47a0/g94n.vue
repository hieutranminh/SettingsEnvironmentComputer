<template>
  <div class="client-aha-popup-ai-wrapper">
    <b-modal
      ref="modalAhaAi"
      :visible="visible"
      :title="$t('aha-ai.title')"
      modal-class="modal-aha-ai--client-popup-ai"
      static
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      @shown="onLoadForm"
      @hide="onHide"
    >
      <!-- Top Section -->
      <div class="modal-aha-ai-top">
        <div class="modal-aha-ai-top__title">
          <b>{{ $t('aha-ai.title') }}</b>
          <span
            class="question-icon"
            @click.prevent="onShowHelp"
          >
            <i class="fail-code-img" />
          </span>
        </div>

        <span
          class="setting-icon"
          @click.prevent="onShowSettings"
        >
          <b-icon-gear-fill />
        </span>
      </div>

      <!-- Body -->
      <div class="modal-aha-ai-body">
        <div class="modal-aha-ai-body__textarea">
          <b-form-textarea
            ref="promptTextarea"
            v-model="prompt"
            autofocus
            :rows="4"
            :maxlength="maxPromptLength"
            :placeholder="ahaPlaceHolderExample"
            no-resize
            @keydown.enter="onEnterKeyDown"
          />

          <div class="aha-ai-body__action">
            <actions-left :mode="currentMode" />

            <!-- Microphone Icon -->
            <div class="textarea-actions">
              <actions-right
                :mode="currentMode"
                :has-prompt="hasPrompt"
                @send="onSend"
                @cancel-voice="onCancelVoice"
                @start-voice="onStartVoice"
                @retry-voice="onRetryVoice"
              />
            </div>
          </div>
        </div>
        <error-box :errors="errors" />
      </div>

      <!-- Footer -->
      <div class="modal-footer modal-aha-ai-footer">
        <a-button
          variant="blue-light"
          @click="onCancel"
        >
          {{ $t('general.cancel') }}
        </a-button>
      </div>
    </b-modal>
    <modal-aha-ai-setup
      :visible="ahaAiSetupVisible"
      @cancel="ahaAiSetupVisible = false"
    />

    <modal-aha-ai-client-helper
      :visible="ahaAiHelperVisible"
      @cancel="ahaAiHelperVisible = false"
    />

    <modal-aha-ai-client-search-result
      :data="data"
      :visible="ahaAiClientSearchResultVisible"
      @cancel="cancelSearchResult"
    />
    <modal-aha-ai-search-error
      :visible="ahaAiSearchErrorVisible"
      @cancel="cancelSearchError"
    />
  </div>
</template>

<script>
// Components
import ErrorBox from 'Components/common/form/error-box/error-box.vue'
import ModalAhaAiSearchError from 'Modules/clients/components/client-management/components/aha-popup-ai/components/modal-aha-ai-search-error.vue'
import ModalAhaAiClientSearchResult from 'Modules/clients/components/client-management/components/aha-popup-ai/components/modal-aha-ai-client-search-result/modal-aha-ai-client-search-result.vue'
import ActionsLeft from 'Modules/calendar/components/modal-aha-ai-notes/partials/actions-left.vue'
import ActionsRight from 'Modules/calendar/components/modal-aha-ai/partials/actions-right.vue'
import ModalAhaAiClientHelper from 'Modules/clients/components/client-management/components/aha-popup-ai/components/modal-aha-ai-client-helper/modal-aha-ai-client-helper.vue'
import ComponentBase from 'Components/common/component-base/component-base.vue'
import AButton from 'Modules/aha/a-button/a-button.vue'
import { BIconGearFill, BIconMic } from 'bootstrap-vue'
import ModalAhaAiSetup from 'Modules/calendar/components/modal-aha-ai-setup/modal-aha-ai-setup.vue'

// Apis
import { getClientManagementSearchAgent } from 'Modules/api/client/client-management-api'

// Mixins
import SpeechRecognitionMixin from 'Modules/calendar/mixins/speech-recognition'
import { DEFAULT_INPUT_MODE, MODE_AI_ACTION, STORAGE_AHA_AI_DEFAULT_INPUT_MODE } from 'Constant'

// Utils
import { mapMutations, mapActions } from 'vuex'

// Constants
import { options } from 'OptionsHelpers'
import { parseTimezoneToNumber } from 'CommonHelpers'

const MAX_PROMPT_LENGTH = 500
const LANGUAGE = {
  EN: 0,
  KR: 1,
}
const AI_SEARCH_ERROR_CODES = 'AEC44A'

export default {
  components: {
    AButton,
    ErrorBox,
    BIconMic,
    ActionsLeft,
    ActionsRight,
    BIconGearFill,
    ModalAhaAiSetup,
    ModalAhaAiSearchError,
    ModalAhaAiClientHelper,
    ModalAhaAiClientSearchResult,
  },

  extends: ComponentBase,

  mixins: [SpeechRecognitionMixin],

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },

    data: {
      type:    Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      errors:                         [],
      prompt:                         '',
      alertId:                        'client-aha-ai-helper',
      ahaAiSetupVisible:              false,
      ahaAiHelperVisible:             false,
      mode:                           MODE_AI_ACTION.IDLE,
      ahaAiClientSearchResultVisible: false,
      ahaAiSearchErrorVisible:        false,
    }
  },

  computed: {

    ahaPlaceHolderExample() {
      return `${this.$t('clients.aha-placeholder-text.example-1')}\n${this.$t('clients.aha-placeholder-text.example-2')}`
    },

    maxPromptLength() {
      return MAX_PROMPT_LENGTH
    },

    hasPrompt() {
      return this.prompt && this.prompt.trim().length > 0
    },

    currentMode() {
      if (this.mode === MODE_AI_ACTION.VOICE_LISTENING) {
        return this.mode
      }

      return this.hasPrompt ? MODE_AI_ACTION.TYPING : MODE_AI_ACTION.IDLE
    },

    language() {
      return this.app_language === options.language.english ? LANGUAGE.EN : LANGUAGE.KR
    },

  },

  methods: {
    ...mapMutations('clientManagement', [
      'setAISearchResult',
      'setAIResponse',
    ]),

    ...mapActions('clientManagement', [
      'applyAiSearchResult',
    ]),

    onHide() {
      this.reset()
      this.errors = []
      this.$emit('cancel')
    },

    onCancel() {
      this.$refs.modalAhaAi.hide()
    },

    onShowHelp() {
      this.ahaAiHelperVisible = true
    },

    onShowSettings() {
      this.ahaAiSetupVisible = true
    },

    reset() {
      this.prompt = ''
    },

    onLoadForm() {
      const defaultInputMode = Number(localStorage.getItem(STORAGE_AHA_AI_DEFAULT_INPUT_MODE)) || DEFAULT_INPUT_MODE.TEXT
      if (defaultInputMode === DEFAULT_INPUT_MODE.VOICE) this.onStartVoice()

      // Detect if opened from search available times modal
      if (this.openedFromSearchAvailableTimes) this.onStartVoice()

      const textareaRef = this.$refs.promptTextarea
      if (textareaRef && textareaRef.$el) {
        this.$nextTick(() => {
          textareaRef.$el.focus()

        })
      }
    },

    onCancelVoice() {
      this.$mixinSpeechRecognition_cleanup()
      this.prompt = ''
      this.setModeFromPrompt()

      this.$nextTick(() => {
        const textarea = this.$refs.promptTextarea
        if (textarea && textarea.$el) {
          textarea.$el.focus()
        }
      })
    },

    async onStartVoice() {
      this.errors = []

      await this.$mixinSpeechRecognition_startVoiceRecognition({
        currentText: this.prompt,

        onStart: () => {
          this.mode = MODE_AI_ACTION.VOICE_LISTENING
        },
        onResult: (updatedText) => {
          this.prompt = updatedText
        },
        onError: (error) => {
          this.errors = [error.message]
          this.mode = MODE_AI_ACTION.IDLE
        },
        onEnd: () => {
          this.setModeFromPrompt()
          this.onSend()
        },
      })
    },

    onEnterKeyDown(event) {
      const isExactEnter = !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey
      const shouldTrigger = this.isMobileDevice || isExactEnter

      if (shouldTrigger && this.hasPrompt && this.currentMode === MODE_AI_ACTION.TYPING) {
        event.preventDefault()
        this.onSend()
      }
    },

    async onSend() {
      try {
        this.errors = []
        const timezone = parseTimezoneToNumber(this.shop_data.timezone)
        this.preLoader()
        const payload = {
          shopId:       this.shop_data.shop_id,
          command:      this.prompt,
          shopTimeZone: timezone,
          language:     this.language,
        }
        const response = await getClientManagementSearchAgent(payload)
        if (!response.data.isOK) {
          this.errors = [response.data.errorMessages]
          return
        }

        // Apply AI search result to store
        this.setAIResponse(response.data.result)

        this.ahaAiClientSearchResultVisible = true
      } catch (error) {
        const code = error.codes?.[0]
        if (AI_SEARCH_ERROR_CODES.includes(code)) {
          this.ahaAiSearchErrorVisible = true
          return
        }

        this.errors = [error.message]
      } finally {
        this.preLoader(false)
      }
    },

    setModeFromPrompt() {
      this.mode = this.hasPrompt ? MODE_AI_ACTION.TYPING : MODE_AI_ACTION.IDLE
    },

    focusTextarea() {
      const textareaRef = this.$refs.promptTextarea
      if (textareaRef && textareaRef.$el) {
        this.$nextTick(() => {
          textareaRef.$el.focus()

        })
      }
    },

    onRetryVoice() {
      this.prompt = ''
      this.onStartVoice()
    },

    cancelSearchResult() {
      this.ahaAiClientSearchResultVisible = false
      this.focusTextarea()
    },

    cancelSearchError() {
      this.ahaAiSearchErrorVisible = false
      this.focusTextarea()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './client-aha-popup-ai.scss';
</style>
