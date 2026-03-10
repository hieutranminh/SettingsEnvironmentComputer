<template>
  <b-modal
    ref="modalAhaAiSetup"
    :visible="visible"
    :modal-class="modalClass"
    :title="$t('aha-ai.setup')"

    static
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    @show="onShow"
    @hide="onHide"
  >
    <!-- Body -->
    <div class="modal-aha-ai-setup-body">
      <pre>{{ form }}</pre>
      <div class="settings">
        <!-- Outside Settings -->
        <div class="settings__group settings__group--outside">
          <!-- Shop Name -->
          <div class="field">
            <div class="field__label">
              <label for="shop-name">{{ $t('aha-ai.shop-name-for-ai') }}</label>
            </div>
            <div class="field__item">
              <a-input v-model="form.shopName" />
            </div>
          </div>

          <!-- Default Input Mode -->
          <div class="field">
            <div class="field__label">
              <label for="default-input-mode">{{ $t('aha-ai.default-input-mode') }}</label>
            </div>
            <div class="field__item">
              <b-form-radio-group
                v-model="form.defaultInputMode"
                :options="defaultInputModeOptions"
                class="custom-radio-group"
              />
            </div>
          </div>

          <!-- Optimal Booking Time Recommendation -->
          <div class="field">
            <div class="field__label">
              <label for="optimal-booking-time-recommendation">{{ $t('aha-ai.optimal-booking-time-recommendation') }}</label>
            </div>
            <div class="field__item">
              <switch-checkbox
                v-model="form.isOptimalBookingTimeRecommendation"
                :options="optimalBookingTimeRecommendationOptions"
                :disabled="isDisabledOptimalBookingTimeRecommendation"
              />
            </div>
          </div>
        </div>

        <!-- Inside Settings -->
        <div
          v-if="form.isOptimalBookingTimeRecommendation"
          class="settings__group settings__group--inside"
        >
          <!-- Ensure Available Time Slots -->
          <div class="field">
            <div class="field__label">
              <label for="ensure-available-time-slots">{{ $t('aha-ai.ensure-available-time-slots') }}</label>
            </div>
            <div class="field__item">
              <div class="field__item__progress">
                {{ FROM_WEIGHT }}
                <a-input
                  v-model.number="form.ensureAvailableTimeSlotsWeight"
                  type="range"
                  :min="FROM_WEIGHT"
                  :max="TO_WEIGHT"
                />
                {{ TO_WEIGHT }}
              </div>

              <div class="field__item__note">
                <span>{{ FROM_WEIGHT }}: {{ $t('aha-ai.off') }}</span>
                <span>{{ TO_WEIGHT }}: {{ $t('aha-ai.full-application') }}</span>
              </div>
            </div>
          </div>

          <!-- Prioritize Non-Peak Slots -->
          <div class="field">
            <div class="field__label">
              <label for="prioritize-non-peak-slots">{{ $t('aha-ai.prioritize-non-peak-slots') }}</label>
            </div>
            <div class="field__item">
              <div class="field__item__progress">
                {{ FROM_WEIGHT }}
                <a-input
                  v-model.number="form.prioritizeNonPeakSlotsWeight"
                  type="range"
                  :min="FROM_WEIGHT"
                  :max="TO_WEIGHT"
                />
                {{ TO_WEIGHT }}
              </div>

              <div class="field__item__sub-item">
                <label for="long-booking-threshold">{{ $t('aha-ai.long-booking-threshold') }}</label>
                <a-multi-select
                  v-model="longBookingThresholdModel"
                  :options="longBookingThresholdOptions"
                  :multiple="false"
                  :searchable="false"
                  :show-labels="false"
                  :allow-empty="false"
                  label="text"
                  track-by="value"
                />
              </div>
            </div>
          </div>

          <!-- Distribute Evenly -->
          <div class="field">
            <div class="field__label">
              <label for="distribute-evenly">{{ $t('aha-ai.distribute-evenly') }}</label>
            </div>
            <div class="field__item">
              <div class="field__item__progress">
                {{ FROM_WEIGHT }}
                <a-input
                  v-model.number="form.distributeEvenlyWeight"
                  type="range"
                  :min="FROM_WEIGHT"
                  :max="TO_WEIGHT"
                />
                {{ TO_WEIGHT }}
              </div>
            </div>
          </div>

          <!-- Resources to Exclude from Recommendations -->
          <div class="field">
            <div class="field__label">
              <label for="resources-to-exclude-from-recommendations">{{ $t('aha-ai.resources-to-exclude-from-recommendations') }}</label>
            </div>
            <div class="field__item">
              <select-multi-resource-checkbox
                v-model="form.excludedResourceIds"
                class="select-resource-checkbox"
                :placeholder="$t('bookings.select-resource')"
                :options="resourcesOptions"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer modal-aha-ai-setup-footer">
        <a-button
          variant="primary"
          @click="onSave"
        >
          {{ $t('general.save') }}
        </a-button>

        <a-button
          variant="blue-light"
          @click="onCancel"
        >
          {{ $t('general.cancel') }}
        </a-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import AInput from 'Modules/aha/a-input/a-input.vue'
import AMultiSelect from 'Modules/aha/a-multi-select/a-multi-select.vue'
import SwitchCheckbox from 'CommonComponents/form/checkbox/switch-checkbox/switch-checkbox.vue'
import SelectMultiResourceCheckbox from 'CommonComponents/form/select/select-multi-resource-checkbox/select-multi-resource-checkbox.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
// Constants
import { DEFAULT_INPUT_MODE, IS_OPTIMAL_BOOKING_TIME_RECOMMENDATION, STORAGE_AHA_AI_DEFAULT_INPUT_MODE } from 'Constant'
// APIs
import { getAhaAISetup, updateAhaAISetup } from 'Modules/api/aha-ai/aha-ai-api'

const FROM_WEIGHT = 0
const TO_WEIGHT = 9
const DEFAULT_WEIGHT = 5

export default {
  components: {
    AButton,
    AInput,
    AMultiSelect,
    SwitchCheckbox,
    SelectMultiResourceCheckbox,
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
  ],

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      DEFAULT_INPUT_MODE,
      IS_OPTIMAL_BOOKING_TIME_RECOMMENDATION,
      FROM_WEIGHT,
      TO_WEIGHT,
      DEFAULT_WEIGHT,

      form: {
        shopId:                             0,
        shopName:                           '',
        defaultInputMode:                   DEFAULT_INPUT_MODE.TEXT,
        isOptimalBookingTimeRecommendation: IS_OPTIMAL_BOOKING_TIME_RECOMMENDATION.ON,
        ensureAvailableTimeSlotsWeight:     DEFAULT_WEIGHT,
        prioritizeNonPeakSlotsWeight:       DEFAULT_WEIGHT,
        distributeEvenlyWeight:             DEFAULT_WEIGHT,
        longBookingThreshold:               0,
        excludedResourceIds:                [],
      },
    }
  },

  methods: {
    onShow() {
      this.loadDefaultInputModeFromLocalStorage()
      this.fetchAhaAISetup()
    },

    loadDefaultInputModeFromLocalStorage() {
      try {
        const savedValue = localStorage.getItem(STORAGE_AHA_AI_DEFAULT_INPUT_MODE)
        if (savedValue && Object.values(DEFAULT_INPUT_MODE).includes(savedValue)) {
          this.form.defaultInputMode = savedValue
        }
      } catch (error) {
        // Ignore localStorage errors
      }
    },

    saveDefaultInputModeToLocalStorage() {
      try {
        localStorage.setItem(STORAGE_AHA_AI_DEFAULT_INPUT_MODE, this.form.defaultInputMode)
      } catch (error) {
        // Ignore localStorage errors
      }
    },

    onHide() {
      this.$emit('cancel')
    },

    onCancel() {
      this.$refs.modalAhaAiSetup.hide()
    },

    async onSave() {
      if (this.form.excludedResourceIds.length === this.resourcesOptions.length) {
        this._showDialogAlert(this.$t('aha-ai.message-you-cannot-select-all-resources'))
        return
      }

      try {
        this.preLoader()
        const payload = {
          ...this.form,
          excludedResourceIds: this.form.excludedResourceIds.map(resource => resource.value),
        }
        const response = await updateAhaAISetup(payload)

        if (!response?.data?.isOK) {
          this._showDialogAlert(response.data.errorMessages)
          return
        }

        this.saveDefaultInputModeToLocalStorage()
        this.onCancel()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async fetchAhaAISetup() {
      try {
        this.preLoader()
        const response = await getAhaAISetup({ shopId: this.shop_data.shop_id })

        if (!response?.data?.isOK) {
          this._showDialogAlert(response.data.errorMessages)
          return
        }

        const excludedResourceIdsFromApi = response.data.result.excludedResourceIds || []
        const mappedExcludedResourceIds = this.mapResourceIdsToOptions(excludedResourceIdsFromApi)

        const defaultInputModeFromApi = response.data.result.defaultInputMode
        const defaultInputModeToUse = defaultInputModeFromApi || this.form.defaultInputMode

        this.form = {
          ...this.form,
          ...response.data.result,
          defaultInputMode:    defaultInputModeToUse,
          excludedResourceIds: mappedExcludedResourceIds,
        }

        this.saveDefaultInputModeToLocalStorage()

      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    mapResourceIdsToOptions(resourceIds) {
      if (!resourceIds || !resourceIds.length || !this.resourcesOptions.length) {
        return []
      }

      const resourceMap = new Map(this.resourcesOptions.map(option => [option.value, option]))
      return resourceIds
        .map((resourceId) => resourceMap.get(resourceId))
        .filter((resource) => resource !== undefined)
    },
  },

  computed: {
    ...mapState('_calendar', ['bookingResources']),

    modalClass() {
      return ['modal-aha-ai-setup', {
        'modal-aha-ai-setup--mobile': this.isMobileDevice,
        'modal-aha-ai-setup--tablet': this.isAllTabletDevice,
      }]
    },

    defaultInputModeOptions() {
      return [
        { value: DEFAULT_INPUT_MODE.TEXT, text: this.$t('aha-ai.text-radio-button') },
        { value: DEFAULT_INPUT_MODE.VOICE, text: this.$t('aha-ai.voice-radio-button') },
      ]
    },

    optimalBookingTimeRecommendationOptions() {
      return [
        { value: IS_OPTIMAL_BOOKING_TIME_RECOMMENDATION.ON, text: 'aha-ai.on' },
        { value: IS_OPTIMAL_BOOKING_TIME_RECOMMENDATION.OFF, text: 'aha-ai.off' },
      ]
    },

    resourcesOptions() {
      return this.bookingResources.map(resource => ({ value: resource.id, text: resource.resource_name }))
    },

    longBookingThresholdOptions() {
      return [
        { value: 60, text: `60 ${this.$t('aha-ai.mins-or-more')}` },
        { value: 90, text: `90 ${this.$t('aha-ai.mins-or-more')}` },
        { value: 120, text: `120 ${this.$t('aha-ai.mins-or-more')}` },
        { value: 150, text: `150 ${this.$t('aha-ai.mins-or-more')}` },
        { value: 180, text: `180 ${this.$t('aha-ai.mins-or-more')}` },
        { value: 210, text: `210 ${this.$t('aha-ai.mins-or-more')}` },
        { value: 240, text: `240 ${this.$t('aha-ai.mins-or-more')}` },
      ]
    },

    longBookingThresholdModel: {
      get() {
        return this.longBookingThresholdOptions.find(option => option.value === this.form.longBookingThreshold)
      },
      set(option) {
        this.form.longBookingThreshold = option.value
      },
    },

    isDisabledOptimalBookingTimeRecommendation() {
      return this.form.ensureAvailableTimeSlotsWeight === FROM_WEIGHT
      && this.form.prioritizeNonPeakSlotsWeight === FROM_WEIGHT
      && this.form.distributeEvenlyWeight === FROM_WEIGHT
    },
  },

  watch: {
    'form.defaultInputMode'(newValue) {
      if (newValue && Object.values(DEFAULT_INPUT_MODE).includes(newValue)) {
        this.saveDefaultInputModeToLocalStorage()
      }
    },
  },
}
</script>

<style lang="scss">
@import './modal-aha-ai-setup.scss';
</style>
