<template>
  <b-modal
    :id="modalId"
    :modal-class="modalId"
    :title="$t('ai-setup.label-edit-prompt')"
    size="lg"
    hide-footer
    no-close-on-backdrop
    static
    @show="onLoadForm"
  >
    <div class="content-box">
      <b-form-group :label="$t('ai-setup.label-prompt')">
        <b-form-textarea
          v-model="localPrompt"
          rows="10"
          max-rows="20"
        />
      </b-form-group>
    </div>

    <footer class="modal-footer">
      <slot name="footer">
        <button
          type="button"
          class="btn2 green"
          @click="onSave"
        >
          {{ $t('general.save') }}
        </button>

        <button
          type="button"
          class="btn2 ml-2"
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
  props: {
    modalId: {
      type:    String,
      default: 'modal-edit-prompt',
    },
    prompt: {
      type:    String,
      default: '',
    },
  },

  extends: component_base,

  data() {
    return {
      localPrompt: '',
    }
  },

  methods: {
    onLoadForm() {
      this.localPrompt = this.prompt || ''
    },

    hideModal() {
      this.localPrompt = ''
      this.hideDiaglogById(this.modalId)
    },

    onSave() {
      this.$emit('save', this.localPrompt)
      this.hideModal()
    },
  },
}
</script>


