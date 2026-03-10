<template>
  <multiselect
    ref="multiselect"
    v-model="localValue"
    :options="groupedOptions"
    :multiple="true"
    :group-label="'groupLabel'"
    :group-values="'groupValues'"
    :group-select="true"
    :searchable="false"
    :close-on-select="false"
    :clear-on-select="false"
    :show-labels="false"
    :preserve-search="true"
    :disabled="options.length === 0"
    :placeholder="placeholder"
    label="text"
    track-by="value"
    class="multi-checkbox select-multiple-display-item"
    @mouseleave.native="onMouseleave"
    @input="onChange"
  >
    <template
      slot="selection"
      slot-scope="{ values }"
    >
      <span
        v-if="options.length === 0"
        class="selected"
      >
        {{ $t('general.no-data') }}
      </span>
      <span
        v-else-if="values.length > 0 && values.length === options.length"
        class="selected"
      >
        {{ $t('general.all') }}
      </span>
      <span
        v-else-if="values.length > 0"
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
    placeholder: {
      type:    String,
      default: '',
    },
    selectAllText: {
      type:    String,
      default: '',
    },
  },

  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },

    groupedOptions() {
      return [
        {
          groupLabel:  this.selectAllText || this.$t('general.select-all'),
          groupValues: this.options,
        },
      ]
    },
  },

  methods: {
    onMouseleave() {
      if (this.$refs.multiselect?.isOpen) {
        this.$refs.multiselect.toggle()
      }
    },

    onChange(event) {
      // Handle case when selecting more than available options (dedup)
      if (event?.length > this.options?.length) {
        const newSet = new Set(this.options)
        this.localValue = [...newSet]
      }
    },
  },
}
</script>

<style lang="scss">
@import './select-multiple-display-item.scss';
</style>
