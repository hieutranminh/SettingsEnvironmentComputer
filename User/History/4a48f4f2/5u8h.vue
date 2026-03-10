<template>
  <button
    :type="type"
    v-bind="$attrs"
    :class="buttonClass"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    ghost: {
      type:    Boolean,
      default: false,
    },

    type: {
      type:    String,
      default: 'button',
    },

    size: {
      type:      String,
      default:   'medium',
      validator: function(value) {
        return ['small', 'medium', 'large'].includes(value)
      },
    },

    variant: {
      type:      String,
      default:   'normal',
      validator: function (value) {
        return [
          'normal', 'primary', 'secondary', 'warning',
          'danger', 'cancel', 'out-line', 'blue-light',
          'orange',
        ].includes(value)
      },
    },
  },

  computed: {
    buttonClass() {
      return [
        'a-button',
        `a-button--${this.size}`,
        `a-button--${this.variant}`, {
          [`a-button--${this.variant}--ghost`]: this.ghost,
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./a-button.scss";
</style>
