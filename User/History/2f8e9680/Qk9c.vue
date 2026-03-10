<template>
  <b-modal
    :id="modal_id"
    :modal-class="modal_id"
    :title="$t('user-command-history.label-result')"
    size="lg"
    hide-footer
    no-close-on-backdrop
    static
  >
    <div class="content-box">
      <p>Hello</p>
    </div>

    <footer class="modal-footer">
      <slot name="footer">
        <button
          type="button"
          class="btn2 green"
          block
          @click="hideModal"
        >
          {{ $t('general.cancel') }}
        </button>
      </slot>
    </footer>
  </b-modal>
</template>

<script>
import component_base from '../common/component-base/component-base'

export default {
  extends: component_base,

  data() {
    return {
      modal_id: 'modal-user-command-history-result',
    }
  },

  methods: {
    hideModal() {
      this.hideDiaglogById(this.modal_id)
    },
  },
}
</script>

