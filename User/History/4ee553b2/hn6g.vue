<template>
  <div class="estimated-time">
    <div class="estimated-time__grid">
      <button
        v-for="option in mainOptions"
        :key="option.value"
        :class="['estimated-time__button', { 'estimated-time__button--active': selectedValue === option.value }]"
        @click="selectOption(option.value)"
      >
        {{ option.text }}
      </button>

      <div class="estimated-time__dropdown-wrapper">
        <button
          :class="['estimated-time__dropdown-button', { 'estimated-time__dropdown-button--active': isMoreOptionSelected }]"
          @click="toggleDropdown"
        >
          <span class="estimated-time__dropdown-button-text">{{ selectedMoreOptionText || 'More' }}</span>
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
            {{ option.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      return [
        { text: '30 Mins', value: 30 },
        { text: '60 Mins', value: 60 },
        { text: '90 Mins', value: 90 },
        { text: '120 Mins', value: 120 },
        { text: '150 Mins', value: 150 },
        { text: '180 Mins', value: 180 },
        { text: '3 hours 30 mins', value: 210 },
        { text: '4 hours', value: 240 },
        { text: '4 hours 30 mins', value: 270 },
        { text: '5 hours', value: 300 },
        { text: '6 hours', value: 360 },
        { text: '7 hours', value: 420 },
        { text: '8 hours', value: 480 },
        { text: '9 hours', value: 540 },
        { text: '10 hours', value: 600 },
      ]
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
.estimated-time {
  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
  }

  &__button {
    padding: 7px 5px;
    border: 1px solid $gray;
    background-color: $white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    text-align: center;
    transition: all 0.2s linear;

    &:hover {
      border-color: $blue;
      background-color: $blue-lighten;
    }

    &--active {
      border-color: $blue;
      background-color: $blue;
      color: $white;

      &:hover {
        background-color: $blue-hover;
        border-color: $blue-hover;
      }
    }
  }

  &__dropdown-wrapper {
    position: relative;
    grid-column: span 2;
  }

  &__dropdown-button {
    width: 100%;
    padding: 7px 5px;
    border: 1px solid $gray;
    background-color: $white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s linear;

    &:hover {
      border-color: $blue;
      background-color: $blue-lighten;
    }

    &--active {
      border-color: $blue;
      background-color: $blue;
      color: $white;

      &:hover {
        background-color: $blue-hover;
        border-color: $blue-hover;
      }
    }
  }

  &__dropdown-button-text {
    flex: 1;
  }

  &__dropdown-arrow {
    border: 1px solid;
    border-width: 8px 4.5px 0;
    border-color: rgba(0, 0, 0, 0.6) transparent transparent;
    margin: 0 6px;
  }

  &__dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background-color: $white;
    border: 1px solid $gray;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
  }

  &__dropdown-item {
    width: 100%;
    padding: 7px 5px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 13px;
    text-align: left;
    transition: all 0.2s linear;

    &:hover {
      background-color: $blue-lighten;
    }

    &--active {
      background-color: $blue;
      color: $white;

      &:hover {
        background-color: $blue-hover;
      }
    }

    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}
</style>
