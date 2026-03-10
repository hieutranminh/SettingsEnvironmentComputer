<template>
  <b-modal
    ref="modalAhaAiHelp"
    :visible="visible"
    :modal-class="modalClass"
    :title="$t('aha-ai.help.title')"

    static
    hide-footer
    no-close-on-esc
    no-close-on-backdrop
    @hide="onHide"
  >
    <!-- Body -->
    <div class="modal-aha-ai-help-body">
      <!-- Section 1: Aha AI Booking Assistant -->
      <div class="help-section">
        <h4 class="help-section__title">
          <b>{{ $t('aha-ai.help.booking-assistant.title') }}</b>
        </h4>
        <p class="help-section__content">
          {{ $t('aha-ai.help.booking-assistant.description') }}
        </p>
      </div>

      <!-- Section 2: What is Optimal Booking Time Recommendation? -->
      <div class="help-section">
        <h4 class="help-section__title">
          <b>{{ $t('aha-ai.help.optimal-booking.title') }}</b>
        </h4>
        <p class="help-section__content">
          {{ $t('aha-ai.help.optimal-booking.description-1') }}
        </p>
        <ul class="help-section__list">
          <li>{{ $t('aha-ai.help.optimal-booking.bullet-1') }}</li>
          <li>{{ $t('aha-ai.help.optimal-booking.bullet-2') }}</li>
          <li>{{ $t('aha-ai.help.optimal-booking.bullet-3') }}</li>
          <li>{{ $t('aha-ai.help.optimal-booking.bullet-4') }}</li>
          <li>{{ $t('aha-ai.help.optimal-booking.bullet-5') }}</li>
        </ul>
      </div>

      <!-- Section 3: Client Lookup -->
      <div class="help-section">
        <h4 class="help-section__title">
          <b>{{ $t('aha-ai.help.client-lookup.title') }}</b>
        </h4>
        <p class="help-section__content">
          {{ $t('aha-ai.help.client-lookup.description') }}
        </p>
        <p class="help-section__content">
          {{ $t('aha-ai.help.examples') }}
        </p>
        <p class="help-section__examples">
          {{ $t('aha-ai.help.client-lookup.example-1') }}
        </p>
      </div>

      <!-- Section 4: Booking Lookup -->
      <div class="help-section">
        <h4 class="help-section__title">
          <b>{{ $t('aha-ai.help.booking-lookup.title') }}</b>
        </h4>
        <p class="help-section__content">
          {{ $t('aha-ai.help.booking-lookup.description') }}
        </p>
        <p class="help-section__content">
          {{ $t('aha-ai.help.examples') }}
        </p>
        <p class="help-section__examples">
          {{ $t('aha-ai.help.booking-lookup.example-1') }}
        </p>
      </div>

      <!-- Section 5: Search for Available Booking Times -->
      <div class="help-section">
        <h4 class="help-section__title">
          <b>{{ $t('aha-ai.help.available-times.title') }}</b>
        </h4>
        <p class="help-section__content">
          {{ $t('aha-ai.help.examples') }}
        </p>
        <ul class="help-section__list">
          <li>{{ $t('aha-ai.help.available-times.example-1') }}</li>
          <li>{{ $t('aha-ai.help.available-times.example-2') }}</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div class="modal-footer modal-aha-ai-help-footer">
      <a-button
        variant="blue-light"
        @click="onCancel"
      >
        {{ $t('general.close') }}
      </a-button>
    </div>
  </b-modal>
</template>

<script>
// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
// Components
import AButton from 'Modules/aha/a-button/a-button.vue'
import ComponentBase from 'Components/common/component-base/component-base.vue'
import { options } from 'OptionsHelpers'

export default {
  components: {
    AButton,
    ComponentBase,
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

  methods: {
    onHide() {
      this.$emit('cancel')
    },
    onCancel() {
      this.$refs.modalAhaAiHelp.hide()
    },
  },

  computed: {
    modalClass() {
      return ['modal-aha-ai-help', {
        'modal-aha-ai-help--mobile': this.isMobileDevice,
      }]
    },

    isKorean () {
      return this.app_language === options.language.korean
    },
  },
}
</script>

<style lang="scss">
@import './modal-aha-ai-help.scss';
</style>
