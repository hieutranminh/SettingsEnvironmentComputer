<template>
  <div class="ai-message-result-list">
    <div
      v-for="(item, index) in items"
      :key="`ai-message-result-${index}`"
      class="ai-message-result-list__item"
    >
      <div class="ai-message-result-list__content">
        <div class="ai-message-result-list__title">
          <b>{{ item.title }}</b>
        </div>
        <div class="ai-message-result-list__message">
          <p v-if="item.description">
            {{ item.description }}
          </p>
          <ul
            v-if="item.bullets && item.bullets.length"
            class="ai-message-result-list__bullets"
          >
            <li
              v-for="(bullet, bulletIndex) in item.bullets"
              :key="`bullet-${index}-${bulletIndex}`"
            >
              {{ bullet }}
            </li>
          </ul>
          <p v-if="item.footer">
            {{ item.footer }}
          </p>
        </div>
      </div>
      <div class="ai-message-result-list__actions">
        <div class="ai-message-result-list__action-icons">
          <span
            class="ai-message-result-list__icon ai-message-result-list__icon--delete"
            @click="handleDelete(index)"
          />
          <div class="ai-message-result-list__save-wrapper">
            <span
              ref="saveIcon"
              class="ai-message-result-list__icon ai-message-result-list__icon--save"
              @click="toggleSaveMenu(index)"
            />
            <div
              v-if="activeSaveMenuIndex === index"
              class="ai-message-result-list__save-menu"
            >
              <div
                class="ai-message-result-list__save-menu-item"
                @click="handleSaveToMyMessages(index)"
              >
                {{ $t('aha-ai.save-to-my-messages') }}
              </div>
            </div>
          </div>
        </div>
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
      activeSaveMenuIndex: null,
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

    toggleSaveMenu(index) {
      if (this.activeSaveMenuIndex === index) {
        this.activeSaveMenuIndex = null
      } else {
        this.activeSaveMenuIndex = index
      }
    },

    handleSaveToMyMessages(index) {
      this.$emit('save-to-my-messages', index)
      this.activeSaveMenuIndex = null
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
