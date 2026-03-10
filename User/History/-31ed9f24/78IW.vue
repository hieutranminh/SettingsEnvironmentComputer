<template>
  <multiselect
    ref="multiselect"
    v-model="selectedValues"
    :options="optionsWithFirst"
    :multiple="true"
    :searchable="false"
    :close-on-select="false"
    :clear-on-select="false"
    :show-labels="false"
    :preserve-search="true"
    :disabled="disabled"
    :placeholder="placeholder"
    label="text"
    track-by="value"
    class="multi-checkbox select-multi-resource"
    @input="onInput"
    @open="onOpen"
    @mouseleave.native="onMouseleave"
  >
    <template
      slot="selection"
      slot-scope="{ values }"
    >
      <span
        v-if="values.length === actualOptionsLength"
        class="selected"
      >
        {{ $t('general.all') }}
      </span>
      <span
        v-else-if="values.length < actualOptionsLength && values.length > 0"
        class="selected"
      >
        {{ values.length }} {{ $t('general.items') }} {{ $t('general.selected') }}
      </span>
    </template>
  </multiselect>
</template>

<script>
import multiselect from 'vue-multiselect'

export default {
  components: {
    multiselect,
  },
  props: {
    value: {
      type:    Array,
      default: () => [],
    },
    options: {
      type:    Array,
      default: () => [],
    },
    disabled: {
      type:    Boolean,
      default: false,
    },
    placeholder: {
      type:    String,
      default: '',
    },
    selectText: {
      type:    String,
      default: '',
    },
  },
  computed: {
    selectedValues: {
      get() {
        return this.value
      },
      set(newValues) {
        this.$emit('input', newValues)
      },
    },
    firstItem() {
      return {
        text:        this.selectText || this.$t('bookings.select-resource'),
        $isDisabled: true,
      }
    },
    actualOptionsLength() {
      return this.options.length
    },
    optionsWithFirst() {
      return [this.firstItem, ...this.options]
    },
  },
  methods: {
    onInput(newValues) {
      this.$emit('input', newValues)
    },
    onOpen() {
      this.$nextTick(() => {
        const multiselectElement = this.$refs.multiselect.$el
        if (multiselectElement) {
          // Remove the 'above' class to force dropdown below
          multiselectElement.classList.remove('multiselect--above')
          const contentWrapper = multiselectElement.querySelector('.multiselect__content-wrapper')
          if (contentWrapper) {
            contentWrapper.style.top = '100%'
            contentWrapper.style.bottom = 'auto'
            contentWrapper.style.marginTop = '1px'
            contentWrapper.style.marginBottom = '0'
          }
        }
      })
    },
    onMouseleave() {
      if (this.$refs.multiselect.isOpen) {
        this.$refs.multiselect.toggle()
        this.$emit('mouseleave-event', true)
      }
    },
  },
}
</script>

<style lang="scss">
.multiselect.multi-checkbox.select-multi-resource {
  min-height: auto;
  .multiselect__select:before {
    border-width: 8px 4.5px 0;
    border-color: rgba(0,0,0,0.6) transparent transparent;
  }
  .multiselect__tags {
    width: 200px;
    margin-top: 0;
    border: 1px solid $gray;
    border-radius: 0;
    .selected {
      color: $gray-dark;
    }
  }
  .multiselect__content {
    .multiselect__element {
      &:first-child {
        .multiselect__option.multiselect__option--disabled {
          background: transparent !important;
          cursor: pointer;
          span:before {
            display: none;
          }
        }
      }
      .multiselect__option.multiselect__option--disabled {
        background: $gray-lighten !important;
        pointer-events: none;
        cursor: not-allowed;
      }
    }
  }
  // Force dropdown to display below instead of above
  &.multiselect--above {
    .multiselect__content-wrapper {
      top: 100% !important;
      bottom: auto !important;
      margin-top: 1px;
      margin-bottom: 0;
    }
  }
  .multiselect__content-wrapper {
    top: 100% !important;
    bottom: auto !important;
    margin-top: 1px;
    margin-bottom: 0;
  }
}
</style>

