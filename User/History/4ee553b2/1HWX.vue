<template>
  <div class="estimated-time">
    <div class="estimated-time__grid">
      <button
        v-for="option in mainOptions"
        :key="option.value"
        :class="['estimated-time__button', { 'estimated-time__button--active': selectedValue === option.value }]"
        @click="selectOption(option.value)"
      >
        {{ $t(`aha-ai.${option.text}`) }}
      </button>

      <div class="estimated-time__dropdown-wrapper">
        <button
          :class="['estimated-time__dropdown-button', { 'estimated-time__dropdown-button--active': isMoreOptionSelected }]"
          @click="toggleDropdown"
        >
          <span class="estimated-time__dropdown-button-text">{{ $t(`aha-ai.${selectedMoreOptionText}`) || $t('aha-ai.more') }}</span>
          <span class="estimated-time__dropdown-arrow" />
        </button>

        <div
          v-if="showDropdown"
          class="estimated-time__dropdown-menu"
        >
          <button
            v-for="option in moreOptions"
            :key="option.value"
            :class="['estimated-time__dropdown-item', { 'estimated-time__dropdown-item--active': selectedValue === option.value }]"
            @click="selectOption(option.value)"
          >
            {{ $t(`aha-ai.${option.text}`) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ESTIMATED_TIME_OPTIONS } from 'Constant'

export default {
  props: {
    value: {
      type:    Number,
      default: 0,
    },
  },

  data() {
    return {
      showDropdown: false,
    }
  },

  computed: {
    estimatedTimeOptions() {
      return ESTIMATED_TIME_OPTIONS
    },

    mainOptions() {
      return this.estimatedTimeOptions.slice(0, 6)
    },

    moreOptions() {
      return this.estimatedTimeOptions.slice(6)
    },

    selectedValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },

    isMoreOptionSelected() {
      return this.selectedValue > 0 && !this.mainOptions.find(opt => opt.value === this.selectedValue)
    },

    selectedMoreOptionText() {
      if (!this.isMoreOptionSelected) {
        return null
      }
      const selectedOption = this.moreOptions.find(opt => opt.value === this.selectedValue)
      return selectedOption ? selectedOption.text : null
    },
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    selectOption(value) {
      this.selectedValue = value
      this.showDropdown = false
    },

    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },

    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showDropdown = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './estimated-time.scss';
</style>
