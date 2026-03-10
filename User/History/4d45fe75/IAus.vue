<template>
  <b-modal
    ref="modal"

    v-bind="$attrs"
    :visible="true"
    :title="modalTitle"
    :dialog-class="modalDialogClass"

    hide-footer
    no-close-on-backdrop
    modal-class="dialog-confirm__modal"
    body-class="dialog-confirm__modal-body"

    :hide-header-close="hideHeaderClose"
    v-on="$listeners"
    @hidden="handleModalHidden"
  >
    <component
      :is="component"
      v-if="component"
      :messages="messages"
    />
    <div
      v-else
      class="dialog-confirm__content content"
    >
      <p
        v-for="(message, index) in messages"
        :key="`dialog_confirm_message_${index}`"
        class="content__text"
        v-html="message"
      />
    </div>

    <div class="dialog-confirm__actions">
      <aha-button
        :variant="confirmBtnColor"
        @click="handleConfirmClick"
      >
        {{ confirmBtnText }}
      </aha-button>

      <aha-button
        v-if="!isOnlyConfirmBtn"
        :variant="cancelBtnColor"
        @click="handleCancelClick"
      >
        {{ cancelBtnText }}
      </aha-button>
    </div>
  </b-modal>
</template>

<script>

export default {
  props: {
    id: {
      default: '',
      type:    String,
    },

    title: {
      default: '',
      type:    String,
    },

    messages: {
      type:    Array,
      default: () => [],
    },

    component: {
      default: () => null,
      type:    [Object, Function],
    },

    dialogClass: {
      type:    String,
      default: '',
    },

    confirmBtnText: {
      default: '',
      type:    String,
    },

    confirmBtnColor: {
      type:    String,
      default: 'blue',
    },

    cancelBtnText: {
      default: '',
      type:    String,
    },

    cancelBtnColor: {
      type:    String,
      default: 'blue-light',
    },

    isOnlyConfirmBtn: {
      type:    Boolean,
      default: false,
    },

    onConfirm: {
      type:    Function,
      default: () => null,
    },

    onclose: {
      type:    Function,
      default: () => { /* noop */ },
    },

    hideHeaderClose: {
      type:    Boolean,
      default: false,
    },
  },

  computed: {
    modalTitle() {
      return this.title ?? this.$t('general.alert')
    },

    modalDialogClass() {
      return [
        this.dialogClass,
        'dialog-confirm__modal-dialog',
      ]
    },
  },

  methods: {
    handleConfirmClick() {
      this.onConfirm(true)
      this.$refs.modal.hide()
    },

    handleCancelClick() {
      this.onConfirm(false)
      this.$refs.modal.hide()
    },

    handleModalHidden() {
      this.onConfirm(false)
      if (typeof this.onclose === 'function') {
        this.onclose()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./dialog-confirm.scss";
</style>
