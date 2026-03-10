<template>
  <div class="actions__left">
    <!-- Search Available Times (show when IDLE or TYPING) -->
    <a
      v-if="!isVoiceMode"
      v-b-tooltip.hover.bottom
      :title="$t('aha-ai.search-available-times')"
      class="action action--search-available-times"
      @click="onShowSearchAvailableTimesModal"
    >
      <b-icon-calendar-2-range-fill />
    </a>

    <!-- Animate voice (show when VOICE_LISTENING or VOICE_PROCESSING) -->
    <a
      v-if="isVoiceMode"
      class="action action--animate-voice"
      :class="{ 'action--animate-voice--active': isVoiceMode }"
    >
      <div class="action--animate-voice__waves">
        <span
          v-for="index in 5"
          :key="index"
          class="wave-bar"
          :style="{ animationDelay: `${(index - 1) * 0.15}s` }"
        />
      </div>
      <b-icon-mic class="action--animate-voice__mic" />
    </a>
  </div>
</template>

<script>
import { BIconMic, BIconCalendar2RangeFill } from 'bootstrap-vue'
import { MODE_AI_ACTION } from 'Constant'

export default {
  components: {
    BIconMic,
    BIconCalendar2RangeFill,
  },

  props: {
    mode: {
      type:    String,
      default: MODE_AI_ACTION.IDLE,
    },
  },

  computed: {
    isVoiceMode() {
      return this.mode === MODE_AI_ACTION.VOICE_LISTENING
    },
  },

  methods: {
    onShowSearchAvailableTimesModal() {
      this.$emit('show-search-available-times-modal')
    },
  },
}
</script>

<style lang="scss">
@import './actions-left.scss';
</style>

