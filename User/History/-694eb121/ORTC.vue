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
        <!-- ======= EXACT MATCH DISPLAY (sorted by orderByInput) ======= -->
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

        <!-- ======= RELATIVE MATCH DISPLAY (sorted by orderByInput) ======= -->
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
import { mapActions } from 'vuex'
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
import { MODE_AI_ACTION, BOOKING_ITEM_TYPE } from 'Constant'
// Models
import BookedItem from 'Models/booking/bookedItem'

const MAX_LENGTH_TEXTAREA = 100
const MAX_ROW_TEXTAREA = 3
const MAX_BOOKED_ITEMS = 10

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
      BOOKING_ITEM_TYPE,

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

    // Combined and sorted relative match items by orderByInput
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

    exactMatchServiceItems() {
      return this.dataServicesAndBookingItemsExactMatch?.serviceItems || []
    },

    exactMatchBookingItems() {
      return this.dataServicesAndBookingItemsExactMatch?.bookingItems || []
    },

    // Combined and sorted exact match items by orderByInput
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

  methods: {
    ...mapActions('_calendar/bookingAction/booking', [
      'addBookedItemsToBookedResource',
    ]),

    onLoadForm() {
      this.reset()

      this.onStartVoice()
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
        this.resetResultData()

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
        return [this.$t('aha-ai.validate-ai-content-not-found')]
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
      const bookedItems = this.buildBookedItems()

      if((bookedItems.length + (this.selectedBookedResource?.bookedItems?.length || 0)) > MAX_BOOKED_ITEMS) {
        this.errors = [this.$t('bookings.warning_can_not_exceed_booked_items_max', { items_max: MAX_BOOKED_ITEMS })]
        return
      }

      this.addBookedItemsToBookedResource({
        bookedItems,
        bookedResource: this.selectedBookedResource,
      })

      this.$refs.modalAhaAi.hide()
    },

    buildBookedItems() {
      const bookedItems = []

      // Add exact match service items
      for (const serviceItem of this.exactMatchServiceItems) {
        const bookedItem = this.createBookedItemFromService(serviceItem)
        bookedItems.push(bookedItem)
      }

      // Add exact match booking items
      for (const bookingItem of this.exactMatchBookingItems) {
        const bookedItem = this.createBookedItemFromBookingItem(bookingItem)
        bookedItems.push(bookedItem)
      }

      // Add selected relative match service items
      for (const selectedServiceItem of Object.values(this.selectedServiceItems)) {
        const bookedItem = this.createBookedItemFromService(selectedServiceItem)
        bookedItems.push(bookedItem)
      }

      // Add selected relative match booking items
      for (const selectedBookingItem of Object.values(this.selectedBookingItems)) {
        const bookedItem = this.createBookedItemFromBookingItem(selectedBookingItem)
        bookedItems.push(bookedItem)
      }

      // Sort booked items by orderByInput
      return bookedItems.sort((a, b) => a.orderByInput - b.orderByInput)
    },

    createBookedItemFromService(service) {
      const bookedItem = new BookedItem()
      bookedItem.setIsNew(true)
      bookedItem.bookedRefId = service.serviceId
      bookedItem.bookedRefName = service.serviceName
      bookedItem.orderByInput = service.orderByInput
      bookedItem.bookedType = BOOKING_ITEM_TYPE.SERVICE_ITEM
      bookedItem.setEsimatedTime(service.estimatedTime ?? 0)
      return bookedItem
    },

    createBookedItemFromBookingItem(bookingItem) {
      const bookedItem = new BookedItem()
      bookedItem.setIsNew(true)
      bookedItem.bookedRefId = bookingItem.id
      bookedItem.bookedRefName = bookingItem.bookingItemName
      bookedItem.orderByInput = bookingItem.orderByInput
      bookedItem.bookedType = BOOKING_ITEM_TYPE.BOOKING_ITEM
      bookedItem.setEsimatedTime(bookingItem.estimatedTime ?? 0)
      return bookedItem
    },

    setModeFromPrompt() {
      this.mode = this.hasPrompt ? MODE_AI_ACTION.TYPING : MODE_AI_ACTION.IDLE
    },

    reset() {
      this.$mixinSpeechRecognition_reset()
      this.mode = MODE_AI_ACTION.IDLE
      this.prompt = ''
      this.errors = []
      this.resetResultData()
    },

    resetResultData() {
      this.dataServicesAndBookingItemsExactMatch = {}
      this.dataServicesAndBookingItemsRelativeMatch = {}
      this.selectedServiceItems = {}
      this.selectedBookingItems = {}
    },

    handleResultFromAhaAi(result) {
      const { servicesAndBookingItemsExactMatch, servicesAndBookingItemsRelativeMatch } = result
      this.dataServicesAndBookingItemsExactMatch = servicesAndBookingItemsExactMatch
      this.dataServicesAndBookingItemsRelativeMatch = servicesAndBookingItemsRelativeMatch

      if(!this.hasRelativeMatchResult) {
        this.onConfirm()
      }
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
  },
}
</script>

<style lang="scss">
@import './modal-aha-ai-booking-items.scss';
</style>
