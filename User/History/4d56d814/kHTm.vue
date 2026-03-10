<template>
  <div class="actions__right">
    <!-- Voice retry (show when TYPING mode with errors) -->
    <a
      v-if="showVoiceRetry"
      class="action action--voice"
      @click.prevent="onRetryVoice"
    >
      <b-icon-mic />
    </a>

    <!-- Send (show when TYPING mode) -->
    <a
      v-if="showSend"
      class="action action--send"
      @click.prevent="onSend"
    >
      <b-icon-arrow-up-short />
    </a>

    <!-- Cancel voice (show when VOICE_LISTENING or VOICE_PROCESSING) -->
    <a
      v-if="showCancelVoice"
      class="action action--cancel"
      @click.prevent="onCancelVoice"
    >
      <b-icon-x />
    </a>

    <!-- Voice (show when IDLE mode) -->
    <a
      v-if="showVoice"
      class="action action--voice"
      @click.prevent="onStartVoice"
    >
      <b-icon-mic />
    </a>
  </div>
</template>

<script>
import { BIconArrowUpShort, BIconX, BIconMic } from 'bootstrap-vue'
import { MODE_AI_ACTION } from 'Constant'

export default {
  components: {
    BIconArrowUpShort,
    BIconX,
    BIconMic,
  },

  props: {
    mode: {
      type:    String,
      default: MODE_AI_ACTION.IDLE,
    },
    hasPrompt: {
      type:    Boolean,
      default: false,
    },
  },

  computed: {
    showSend() {
      return this.mode === MODE_AI_ACTION.TYPING && this.hasPrompt
    },
    showCancelVoice() {
      return this.mode === MODE_AI_ACTION.VOICE_LISTENING
    },
    showVoice() {
      return this.mode === MODE_AI_ACTION.IDLE
    },
  },

  methods: {
    onSend() {
      this.$emit('send')
    },
    onCancelVoice() {
      this.$emit('cancel-voice')
    },
    onStartVoice() {
      this.$emit('start-voice')
    },
  },
}
</script>

<style lang="scss">
@import './actions-right.scss';
</style>

