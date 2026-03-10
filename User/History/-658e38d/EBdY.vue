<template>
  <div class="actions__right">
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

export default {
  components: {
    BIconArrowUpShort,
    BIconX,
    BIconMic,
  },
}
</script>

<style lang="scss">
@import './actions-right.scss';
</style>

