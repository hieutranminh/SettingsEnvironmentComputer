<template>
  <b-modal
    ref="modalAhaAi"
    :visible="visible"
    :modal-class="modalClass"
    :title="$t('aha-ai.title')"

    static
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    @show="onLoadForm()"
    @shown="onShown"
    @hide="onHide"
  >
    <!-- Top -->
    <div class="modal-aha-ai-top">
      <div class="modal-aha-ai-top__title">
        <b>{{ $t('aha-ai.title') }}</b>
        <a
          class="question-icon"
          @click.prevent="onShowHelpModal"
        >
          <i class="fail-code-img" />
        </a>
      </div>

      <a
        v-if="!isStaffRole"
        class="setting-icon"
        @click.prevent="onShowSettingModal"
      >
        <b-icon-gear-fill />
      </a>
    </div>

    <!-- Body -->
    <div class="modal-aha-ai-body">
      <!-- Textarea -->
      <div class="modal-aha-ai-body__textarea">
        <b-form-textarea
          ref="promptTextarea"
          v-model="prompt"
          autofocus
          :disabled="mode === MODE_AI_ACTION.VOICE_LISTENING"
          :rows="MAX_ROW_TEXTAREA"
          :maxlength="MAX_LENGTH_TEXTAREA"
          :placeholder="openedFromSearchAvailableTimes
            ? $t('aha-ai.placeholder-aha-ai-from-search-available-times')
            : $t('aha-ai.placeholder-aha-ai')"
          no-resize
        />

        <!-- Actions -->
        <div class="actions">
          <actions-left
            :mode="currentMode"
            @show-search-available-times-modal="onShowSearchAvailableTimesModal"
          />

          <actions-right
            :mode="currentMode"
            :has-prompt="hasPrompt"
            @send="onSend"
            @cancel-voice="onCancelVoice"
            @start-voice="onStartVoice"
          />
        </div>
      </div>
    </div>

    <error-box :errors="errors" />

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
</template>

<script>
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import SpeechRecognitionMixin from 'Modules/calendar/mixins/speech-recognition'
// Components
import { BIconGearFill } from 'bootstrap-vue'
import ErrorBox from 'CommonComponents/form/error-box/error-box.vue'
import ComponentBase from 'Components/common/component-base/component-base.vue'
import AButton from 'Modules/aha/a-button/a-button.vue'
import ActionsLeft from './partials/actions-left.vue'
import ActionsRight from './partials/actions-right.vue'
// Constants
import { MODE_AI_ACTION, STORAGE_AHA_AI_DEFAULT_INPUT_MODE, DEFAULT_INPUT_MODE } from 'Constant'

const MAX_LENGTH_TEXTAREA = 100
const MAX_ROW_TEXTAREA = 3

export default {
  components: {
    ErrorBox,
    BIconGearFill,
    AButton,
    ActionsLeft,
    ActionsRight,
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    SpeechRecognitionMixin,
  ],

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
    openedFromSearchAvailableTimes: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      MAX_LENGTH_TEXTAREA,
      MAX_ROW_TEXTAREA,
      MODE_AI_ACTION,

      mode:   MODE_AI_ACTION.IDLE,
      prompt: '',
      errors: [],
    }
  },

  methods: {
    onLoadForm() {
      this.reset()

      // Detect default input mode
      const defaultInputMode = Number(localStorage.getItem(STORAGE_AHA_AI_DEFAULT_INPUT_MODE)) || DEFAULT_INPUT_MODE.TEXT
      if (defaultInputMode === DEFAULT_INPUT_MODE.VOICE) this.onStartVoice()

      // Detect if opened from search available times modal
      if (this.openedFromSearchAvailableTimes) this.onStartVoice()
    },

    onShown() {
      const textarea = this.$refs.promptTextarea
      if (textarea && textarea.$el) {
        textarea.$el.focus()
        this.attachEnterHandlers()
      }
    },

    onHide() {
      this.detachEnterHandlers()
      this.reset()
      this.$emit('cancel')
    },

    onCancel() {
      this.$refs.modalAhaAi.hide()
    },

    onShowHelpModal() {
      this.$emit('show-help-popup')
    },

    onShowSettingModal() {
      this.$emit('show-setup-popup')
    },

    onShowSearchAvailableTimesModal() {
      this.$emit('show-search-available-times-popup')
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

    onCancelVoice() {
      this.$mixinSpeechRecognition_cleanup()
      this.setModeFromPrompt()

      // Focus on textarea after canceling voice
      this.$nextTick(() => {
        const textarea = this.$refs.promptTextarea
        if (textarea && textarea.$el) {
          textarea.$el.focus()
        }
      })
    },

    onSend() {
      this.$emit('send', this.prompt)
    },

    attachEnterHandlers() {
      const textarea = this.$refs.promptTextarea
      if (!textarea || !textarea.$el) return

      const textareaEl = textarea.$el

      // PRIMARY: beforeinput handler (Input Events Level 2 - W3C Standard)
      // Fires BEFORE content is inserted into the DOM
      // - Reliable on iOS Safari (including after paste)
      // - Supported in all modern browsers
      // - Can be prevented to stop newline insertion
      const handleBeforeInput = (event) => {
        // inputType 'insertLineBreak' = user pressed Enter
        // inputType 'insertParagraph' = some browsers use this for Enter
        if (event.inputType === 'insertLineBreak' || event.inputType === 'insertParagraph') {
          // Get shift key state from the event's source KeyboardEvent (if available)
          // On mobile, we can check getTargetRanges for context
          const isShiftEnter = event.shiftKey || false

          // Allow Shift+Enter to insert newline
          if (isShiftEnter) return

          // Submit if we have content
          if (this.hasPrompt && this.currentMode === MODE_AI_ACTION.TYPING) {
            event.preventDefault() // Prevent the newline insertion
            this.onSend()
          }
        }
      }

      // FALLBACK: keydown handler
      // For browsers with incomplete beforeinput support
      // Also provides better Shift+Enter detection
      const handleKeyDown = (event) => {
        // Only handle Enter key
        if (event.key !== 'Enter') return

        // Don't interfere with IME composition (Asian languages)
        if (event.isComposing) return

        // Allow Shift+Enter for multiline
        if (event.shiftKey) return

        // Submit if we have content
        if (this.hasPrompt && this.currentMode === MODE_AI_ACTION.TYPING) {
          event.preventDefault()
          this.onSend()
        }
      }

      // Store references for cleanup
      this._handleBeforeInput = handleBeforeInput
      this._handleKeyDown = handleKeyDown

      // Attach listeners
      textareaEl.addEventListener('beforeinput', handleBeforeInput)
      textareaEl.addEventListener('keydown', handleKeyDown)
    },

    detachEnterHandlers() {
      const textarea = this.$refs.promptTextarea
      if (!textarea || !textarea.$el) return

      if (this._handleBeforeInput) {
        textarea.$el.removeEventListener('beforeinput', this._handleBeforeInput)
        this._handleBeforeInput = null
      }

      if (this._handleKeyDown) {
        textarea.$el.removeEventListener('keydown', this._handleKeyDown)
        this._handleKeyDown = null
      }
    },

    setModeFromPrompt() {
      this.mode = this.hasPrompt ? MODE_AI_ACTION.TYPING : MODE_AI_ACTION.IDLE
    },

    reset() {
      this.$mixinSpeechRecognition_reset()
      this.mode = MODE_AI_ACTION.IDLE
      this.prompt = ''
      this.errors = []
    },
  },

  beforeDestroy() {
    this.detachEnterHandlers()
  },

  computed: {
    modalClass() {
      return ['modal-aha-ai', {
        'modal-aha-ai--mobile': this.isMobileDevice,
      }]
    },

    hasPrompt() {
      return this.prompt && this.prompt.trim().length > 0
    },

    currentMode() {
      // Voice listening mode has priority
      if (this.mode === MODE_AI_ACTION.VOICE_LISTENING) {
        return this.mode
      }
      // Has prompt = typing mode, otherwise idle
      return this.hasPrompt ? MODE_AI_ACTION.TYPING : MODE_AI_ACTION.IDLE
    },
  },
}
</script>

<style lang="scss">
@import './modal-aha-ai.scss';
</style>
