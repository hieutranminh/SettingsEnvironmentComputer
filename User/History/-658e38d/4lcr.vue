<template>
  <div class="actions__right">
    <!-- Send -->
    <a
      class="action action--send"
      @click.prevent="onSend"
    >
      <b-icon-arrow-up-short />
    </a>

    <!-- Cancel -->
    <a
      class="action action--cancel"
      @click.prevent="onCancel"
    >
      <b-icon-x />
    </a>

    <!-- Voice -->
    <a
      class="action action--voice"
      @click.prevent="onVoice"
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

  methods: {
    onSend() {
      this.$emit('send')
    },
    onCancel() {
      this.$emit('cancel')
    },
    onVoice() {
      this.$emit('voice')
    },
  },
}
</script>

<style lang="scss">
@import './actions-right.scss';
</style>

