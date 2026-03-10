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
          :placeholder="promptPlaceholder"
          no-resize
          @keydown.enter="onEnterKeyDown"
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
            :errors="errors"
            @send="onSend"
            @cancel-voice="onCancelVoice"
            @start-voice="onStartVoice"
            @retry-voice="onRetryVoice"
          />
        </div>
      </div>

      <!-- Search Available Times Result -->
      <div
        v-if="hasRelativeMatchResult"
        class="modal-aha-ai-body__result"
      >
        <!-- Exact Match Display (sorted by orderByInput) -->
        <p
          v-for="item in sortedExactMatchItems"
          :key="item.type === BOOKING_ITEM_TYPE.SERVICE_ITEM
            ? `service-${item.serviceId}`
            : `booking-${item.id}`"
        >
          {{
            $t('aha-ai.message-found', {
              itemName: item.type === BOOKING_ITEM_TYPE.SERVICE_ITEM
                ? item.serviceName
                : item.bookingItemName
            })
          }}
        </p>

        <!-- Relative Match Display (sorted by orderByInput) -->
        <template v-for="item in sortedRelativeMatchItems">
          <result-service-group
            v-if="item.type === BOOKING_ITEM_TYPE.SERVICE_ITEM"
            :key="`service-${item.serviceNameAI}`"
            :service-group="item"
            :selected-service-id="getSelectedServiceId(item.serviceNameAI)"
            @select="onSelectServiceItem(item.serviceNameAI, $event)"
          />
          <result-booking-group
            v-else
            :key="`booking-${item.bookingItemNameAI}`"
            :booking-group="item"
            :selected-booking-item-id="getSelectedBookingItemId(item.bookingItemNameAI)"
            @select="onSelectBookingItem(item.bookingItemNameAI, $event)"
          />
        </template>
      </div>
    </div>

    <error-box :errors="errors" />

    <!-- Footer -->
    <div class="modal-footer modal-aha-ai-footer">
      <a-button
        v-if="hasRelativeMatchResult"
        :disabled="!hasConfirmableItems"
        variant="primary"
        @click="onConfirmSearchAvailableTimes"
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
// Constants
import { MODE_AI_ACTION, STORAGE_AHA_AI_DEFAULT_INPUT_MODE, DEFAULT_INPUT_MODE, BOOKING_ITEM_TYPE } from 'Constant'

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
    openedFromSearchAvailableTimes: {
      type:    Boolean,
      default: false,
    },
    isBookingActionVisible: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      MAX_LENGTH_TEXTAREA,
      MAX_ROW_TEXTAREA,
      MODE_AI_ACTION,
      BOOKING_ITEM_TYPE,

      mode:   MODE_AI_ACTION.IDLE,
      prompt: '',
      errors: [],

      // Search available times data
      searchAvailableTimesData:                 null,
      dataServicesAndBookingItemsExactMatch:    {},
      dataServicesAndBookingItemsRelativeMatch: {},

      // Selected items: { [groupNameAI]: selectedItem }
      selectedServiceItems: {},
      selectedBookingItems: {},
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
      this.prompt = ''
      this.setModeFromPrompt()

      // Focus on textarea after canceling voice
      this.$nextTick(() => {
        const textarea = this.$refs.promptTextarea
        if (textarea && textarea.$el) {
          textarea.$el.focus()
        }
      })
    },

    onRetryVoice() {
      this.prompt = ''
      this.onStartVoice()
    },

    onSend() {
      this.$emit('send', this.prompt)
    },

    onEnterKeyDown(event) {
      // On PC: only trigger when Enter is pressed without Shift/Ctrl/Alt (for new line)
      // On Mobile: trigger on any Enter key press
      const isExactEnter = !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey
      const shouldTrigger = this.isMobileDevice || isExactEnter

      if (shouldTrigger && this.hasPrompt && this.currentMode === MODE_AI_ACTION.TYPING) {
        event.preventDefault()
        this.onSend()
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
      this.resetSearchAvailableTimesData()
    },

    // Search available times methods
    setSearchAvailableTimesData(resultData) {
      this.searchAvailableTimesData = resultData
      const { servicesAndBookingItemsExactMatch, servicesAndBookingItemsRelativeMatch } = resultData.servicesAndBookingItems
      this.dataServicesAndBookingItemsExactMatch = servicesAndBookingItemsExactMatch
      this.dataServicesAndBookingItemsRelativeMatch = servicesAndBookingItemsRelativeMatch
    },

    resetSearchAvailableTimesData() {
      this.searchAvailableTimesData = null
      this.dataServicesAndBookingItemsExactMatch = {}
      this.dataServicesAndBookingItemsRelativeMatch = {}
      this.selectedServiceItems = {}
      this.selectedBookingItems = {}
    },

    getSelectedServiceId(groupNameAI) {
      const selectedItem = this.selectedServiceItems[groupNameAI]
      return selectedItem ? selectedItem.serviceId : null
    },

    getSelectedBookingItemId(groupNameAI) {
      const selectedItem = this.selectedBookingItems[groupNameAI]
      return selectedItem ? selectedItem.id : null
    },

    onSelectServiceItem(groupNameAI, item) {
      this.$set(this.selectedServiceItems, groupNameAI, item)
    },

    onSelectBookingItem(groupNameAI, item) {
      this.$set(this.selectedBookingItems, groupNameAI, item)
    },

    onConfirmSearchAvailableTimes() {
      const resultDataWithSelectedItems = {
        ...this.searchAvailableTimesData,
        selectedServiceItems: this.selectedServiceItems,
        selectedBookingItems: this.selectedBookingItems,
      }
      this.$emit('confirm-search-available-times', resultDataWithSelectedItems)
    },
  },

  computed: {
    promptPlaceholder() {
      if (this.isBookingActionVisible) {
        return this.$t('aha-ai.placeholder-aha-ai-search-available-times-only')
      }
      if (this.openedFromSearchAvailableTimes) {
        return this.$t('aha-ai.placeholder-aha-ai-from-search-available-times')
      }
      return this.$t('aha-ai.placeholder-aha-ai')
    },

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

    // Search available times computed properties
    relativeMatchServiceItems() {
      return this.dataServicesAndBookingItemsRelativeMatch?.serviceItems || []
    },

    relativeMatchBookingItems() {
      return this.dataServicesAndBookingItemsRelativeMatch?.bookingItems || []
    },

    sortedRelativeMatchItems() {
      const serviceItems = this.relativeMatchServiceItems.map(item => ({
        ...item,
        type: BOOKING_ITEM_TYPE.SERVICE_ITEM,
      }))
      const bookingItems = this.relativeMatchBookingItems.map(item => ({
        ...item,
        type: BOOKING_ITEM_TYPE.BOOKING_ITEM,
      }))

      return [...serviceItems, ...bookingItems].sort((a, b) => a.orderByInput - b.orderByInput)
    },

    hasRelativeMatchResult() {
      return this.relativeMatchServiceItems.length > 0 || this.relativeMatchBookingItems.length > 0
    },

    hasConfirmableItems() {
      const exactMatchCount = this.exactMatchServiceItems.length + this.exactMatchBookingItems.length
      const selectedCount = Object.keys(this.selectedServiceItems).length + Object.keys(this.selectedBookingItems).length
      return (exactMatchCount + selectedCount) > 0
    },

    exactMatchServiceItems() {
      return this.dataServicesAndBookingItemsExactMatch?.serviceItems || []
    },

    exactMatchBookingItems() {
      return this.dataServicesAndBookingItemsExactMatch?.bookingItems || []
    },

    sortedExactMatchItems() {
      const serviceItems = this.exactMatchServiceItems.map(item => ({
        ...item,
        type: BOOKING_ITEM_TYPE.SERVICE_ITEM,
      }))
      const bookingItems = this.exactMatchBookingItems.map(item => ({
        ...item,
        type: BOOKING_ITEM_TYPE.BOOKING_ITEM,
      }))

      return [...serviceItems, ...bookingItems].sort((a, b) => a.orderByInput - b.orderByInput)
    },
  },
}
</script>

<style lang="scss">
@import './modal-aha-ai.scss';
</style>
