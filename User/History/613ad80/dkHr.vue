<template>
  <div class="actions__left">
    <!-- Search Available Times -->
    <a
      v-b-tooltip.hover.bottom
      :title="$t('aha-ai.search-available-times')"
      class="action action--search-available-times"
      @click="onShowSearchAvailableTimesModal"
    >
      <b-icon-calendar-2-range-fill />
    </a>

    <!-- Animate voice -->
    <a
      class="action action--animate-voice"
      :class="{ 'action--animate-voice--active': true }"
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

export default {
  components: {
    BIconMic,
    BIconCalendar2RangeFill,
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

