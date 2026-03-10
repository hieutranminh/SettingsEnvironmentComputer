<template>
  <div
    id="ai-message-result-list"
    class="ai-message-result-list"
  >
    <div
      v-for="item in items"
      :key="item.id"
      class="ai-message-result-list__item"
    >
      <div class="ai-message-result-list__content">
        <p>{{ item.content }}</p>
      </div>
      <div class="ai-message-result-list__actions">
        <!-- Delete Button -->
        <a
          v-b-tooltip="{
            title: $t('general.delete'),
            placement: 'bottom',
          }"
          class="ai-message-result-list__delete-button"
          @click.prevent="handleDelete(item)"
        >
          <b-icon-trash />
        </a>

        <!-- Save Button -->
        <a
          v-b-tooltip="{
            title: $t('aha-ai.save-to-my-messages'),
            placement: 'bottom',
          }"
          class="ai-message-result-list__save-button"
          @click.prevent="handleSaveToMyMessages(item)"
        >
          <b-icon-bookmark />
          <b-icon-bookmark-fill />
        </a>

        <!-- Use Button -->
        <a-button
          variant="blue-light"
          class="ai-message-result-list__use-button"
          @click="handleUseMessage(item)"
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
import { BIconTrash, BIconBookmark } from 'bootstrap-vue'

export default {
  extends: ComponentBase,

  components: {
    AButton,
    BIconTrash,
    BIconBookmark,
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
    handleDelete(item) {
      this.$emit('delete', item)
    },

    handleSaveToMyMessages(item) {
      this.$emit('save-to-my-messages', item)
    },

    handleUseMessage(item) {
      this.$emit('use-message', item)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './ai-message-result-list.scss';
</style>
