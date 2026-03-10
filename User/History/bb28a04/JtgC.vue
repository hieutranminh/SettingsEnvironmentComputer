<template>
  <div class="result-item">
    <p>
      {{
        $t('aha-ai.message-found-similar', {
          itemName: bookingGroup.bookingItemNameAI,
          count: bookingGroup.bookingItems.length,
        })
      }}
    </p>
    <ul class="items">
      <li
        v-for="item in bookingGroup.bookingItems"
        :key="item.id"
        :class="{ active: isSelected(item.id) }"
        role="button"
        tabindex="0"
        @click="onSelectItem(item)"
        @keydown.enter="onSelectItem(item)"
        @keydown.space.prevent="onSelectItem(item)"
      >
        <p class="item-name">
          {{ item.bookingItemName }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    bookingGroup: {
      type:     Object,
      required: true,
    },
    selectedBookingItemId: {
      type:    Number,
      default: null,
    },
  },

  methods: {
    isSelected(bookingItemId) {
      return this.selectedBookingItemId === bookingItemId
    },

    onSelectItem(item) {
      this.$emit('select', item)
    },
  },
}
</script>
