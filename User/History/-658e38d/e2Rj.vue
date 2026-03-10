<template>
  <div class="actions__right">
    <!-- Send -->
    <a
      class="action action--send"
    >
      <b-icon-arrow-up-short />
    </a>

    <!-- Cancel -->
    <a
      class="action action--cancel"
    >
      <b-icon-x />
    </a>

    <!-- Voice -->
    <a
      class="action action--voice"
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

