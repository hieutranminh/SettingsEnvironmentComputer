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
          :placeholder="$t('aha-ai.placeholder-aha-ai-booking-items')"
          no-resize
          @keydown.enter.exact="onEnterKeyDown"
        />

        <!-- Actions -->
        <div class="actions">
          <actions-left
            :mode="currentMode"
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

      <div
        v-if="hasRelativeMatchResult"
        class="modal-aha-ai-body__result"
      >
        <!-- Service Items -->
        <result-service-group
          v-for="serviceGroup in relativeMatchServiceItems"
          :key="`service-${serviceGroup.serviceNameAI}`"
          :service-group="serviceGroup"
          :selected-service-id="getSelectedServiceId(serviceGroup.serviceNameAI)"
          @select="onSelectServiceItem(serviceGroup.serviceNameAI, $event)"
        />

        <!-- Booking Items -->
        <result-booking-group
          v-for="bookingGroup in relativeMatchBookingItems"
          :key="`booking-${bookingGroup.bookingItemNameAI}`"
          :booking-group="bookingGroup"
          :selected-booking-item-id="getSelectedBookingItemId(bookingGroup.bookingItemNameAI)"
          @select="onSelectBookingItem(bookingGroup.bookingItemNameAI, $event)"
        />
      </div>
    </div>

    <error-box :errors="errors" />

    <pre>{{ selectedBookedResource }}</pre>
    <pre>{{ selectedServiceItems }}</pre>
    <pre>{{ selectedBookingItems }}</pre>

    <!-- Footer -->
    <div class="modal-footer modal-aha-ai-footer">
      <a-button
        v-if="hasRelativeMatchResult"
        variant="primary"
        @click="onConfirm"
      >
        {{ $t('general.confirm') }}
      </a-button>

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
import ResultServiceGroup from './partials/result-service-group.vue'
import ResultBookingGroup from './partials/result-booking-group.vue'
// APIs
import { getAhaAIServiceAndBookingItemAgent } from 'Modules/api/aha-ai/aha-ai-api'
// Constants
import { MODE_AI_ACTION, STORAGE_AHA_AI_DEFAULT_INPUT_MODE, DEFAULT_INPUT_MODE } from 'Constant'
// Helpers
import { formatMoney } from 'CommonHelpers'

const MAX_LENGTH_TEXTAREA = 100
const MAX_ROW_TEXTAREA = 3

export default {
  components: {
    ErrorBox,
    BIconGearFill,
    AButton,
    ActionsLeft,
    ActionsRight,
    ResultServiceGroup,
    ResultBookingGroup,
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
    selectedBookedResource: {
      type:    Object,
      default: null,
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

      dataServicesAndBookingItemsExactMatch:    {},
      dataServicesAndBookingItemsRelativeMatch: {},

      // Selected items: { [groupNameAI]: selectedItem }
      selectedServiceItems: {},
      selectedBookingItems: {},
    }
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

    relativeMatchServiceItems() {
      return this.dataServicesAndBookingItemsRelativeMatch?.serviceItems || []
    },

    relativeMatchBookingItems() {
      return this.dataServicesAndBookingItemsRelativeMatch?.bookingItems || []
    },

    hasRelativeMatchResult() {
      return this.relativeMatchServiceItems.length > 0 || this.relativeMatchBookingItems.length > 0
    },
  },

  methods: {
    formatMoney,

    onLoadForm() {
      this.reset()

      // Detect default input mode
      const defaultInputMode = Number(localStorage.getItem(STORAGE_AHA_AI_DEFAULT_INPUT_MODE)) || DEFAULT_INPUT_MODE.TEXT
      if (defaultInputMode === DEFAULT_INPUT_MODE.VOICE) this.onStartVoice()
    },

    onShown() {
      const textarea = this.$refs.promptTextarea
      if (textarea && textarea.$el) {
        textarea.$el.focus()
      }
    },

    onHide() {
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

    async onSend() {
      if(this.prompt.length > MAX_LENGTH_TEXTAREA) {
        this.errors = [this.$t('aha-ai.validate-max-length-characters-allowed', { maxLength: MAX_LENGTH_TEXTAREA })]
        return
      }

      try {
        this.preLoader()
        this.errors = []

        const payload = {
          shopId:  this.shop_data.shop_id,
          command: this.prompt,
        }

        const response = await getAhaAIServiceAndBookingItemAgent(payload)
        if(!response.data.isOK) {
          this.errors = response.data.errorMessages
          return
        }

        const validationError = this.validateAhaAiResult(response.data.result)
        if (validationError) {
          this.errors = validationError
          return
        }

        this.handleResultFromAhaAi(response.data.result)
      } catch (error) {
        this.errors = [error.message]
      } finally {
        this.preLoader(false)
      }
    },

    validateAhaAiResult(result) {
      const { output, servicesAndBookingItemsNotExist } = result

      // Check if output is empty or invalid after parsing
      const parsedOutput = this.parseAIOutput(output)
      if (!parsedOutput || !parsedOutput.services || parsedOutput.services.length === 0) {
        return [this.$t('aha-ai.validate-ai-content-not-found', { content: this.prompt })]
      }

      // Check if servicesAndBookingItemsNotExist has data
      if (servicesAndBookingItemsNotExist && servicesAndBookingItemsNotExist.length > 0) {
        return servicesAndBookingItemsNotExist.map(itemName =>
          this.$t('aha-ai.validate-not-found-item', { itemName }),
        )
      }

      return null
    },

    parseAIOutput(output) {
      try {
        return JSON.parse(output)
      } catch {
        return null
      }
    },

    onEnterKeyDown(event) {
      if (this.hasPrompt && this.currentMode === MODE_AI_ACTION.TYPING) {
        event.preventDefault()
        this.onSend()
      }
    },

    onConfirm() {
      console.log('onConfirm')
    },

    setModeFromPrompt() {
      this.mode = this.hasPrompt ? MODE_AI_ACTION.TYPING : MODE_AI_ACTION.IDLE
    },

    reset() {
      this.$mixinSpeechRecognition_reset()
      this.mode = MODE_AI_ACTION.IDLE
      this.prompt = ''
      this.errors = []

      this.dataServicesAndBookingItemsExactMatch = {}
      this.dataServicesAndBookingItemsRelativeMatch = {}

      this.selectedServiceItems = {}
      this.selectedBookingItems = {}
    },

    handleResultFromAhaAi(result) {
      const { servicesAndBookingItemsExactMatch, servicesAndBookingItemsRelativeMatch } = result
      this.dataServicesAndBookingItemsExactMatch = servicesAndBookingItemsExactMatch
      this.dataServicesAndBookingItemsRelativeMatch = servicesAndBookingItemsRelativeMatch

      console.log('servicesAndBookingItemsExactMatch', servicesAndBookingItemsExactMatch)
      console.log('servicesAndBookingItemsRelativeMatch', servicesAndBookingItemsRelativeMatch)
      // Reset selected items
      this.selectedServiceItems = {}
      this.selectedBookingItems = {}
    },

    getSelectedServiceId(groupNameAI) {
      const selectedItem = this.selectedServiceItems[groupNameAI]
      return selectedItem ? selectedItem.serviceId : null
    },

    getSelectedBookingItemId(groupNameAI) {
      const selectedItem = this.selectedBookingItems[groupNameAI]
      return selectedItem ? selectedItem.bookingItemId : null
    },

    onSelectServiceItem(groupNameAI, item) {
      this.$set(this.selectedServiceItems, groupNameAI, item)
    },

    onSelectBookingItem(groupNameAI, item) {
      this.$set(this.selectedBookingItems, groupNameAI, item)
    },
  },
}
</script>

<style lang="scss">
@import './modal-aha-ai-booking-items.scss';
</style>
