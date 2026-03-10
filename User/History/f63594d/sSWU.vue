<template>
  <div class="ai-message-result-list">
    <div
      v-for="(item, index) in items"
      :key="`ai-message-result-${index}`"
      class="ai-message-result-list__item"
    >
      <div class="ai-message-result-list__content">
        {{ item }}
      </div>
      <div class="ai-message-result-list__actions">
        <p>asd</p>
        <a-button
          variant="blue-light"
          class="ai-message-result-list__use-button"
          @click="handleUseMessage(index)"
        >
          {{ $t('aha-ai.use-message') }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
// Components
import ComponentBase from 'Components/common/component-base/component-base.vue'
import AButton from 'Modules/aha/a-button/a-button.vue'

export default {
  extends: ComponentBase,

  components: {
    AButton,
  },

  props: {
    items: {
      type:    Array,
      default: () => [],
    },
  },

  data() {
    return {
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    handleClickOutside(event) {
      const saveWrapper = this.$el.querySelectorAll('.ai-message-result-list__save-wrapper')
      let clickedInside = false

      saveWrapper.forEach((wrapper) => {
        if (wrapper.contains(event.target)) {
          clickedInside = true
        }
      })

      if (!clickedInside) {
        this.activeSaveMenuIndex = null
      }
    },
    handleDelete(index) {
      this.$emit('delete', index)
    },

    handleSaveToMyMessages(index) {
      this.$emit('save-to-my-messages', index)
    },

    handleUseMessage(index) {
      this.$emit('use-message', index)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './ai-message-result-list.scss';
</style>
