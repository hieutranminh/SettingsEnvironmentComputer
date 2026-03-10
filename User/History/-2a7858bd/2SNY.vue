<template>
  <div class="result-item">
    <p>
      {{
        $t('aha-ai.message-found-similar-booking-items', {
          itemName: bookingGroup.bookingItemNameAI,
          count: bookingGroup.bookingItems.length,
        })
      }}
    </p>
    <ul class="items">
      <li
        v-for="item in bookingGroup.bookingItems"
        :key="item.bookingItemId"
        :class="{ active: isSelected(item.bookingItemId) }"
        @click="onSelectItem(item)"
      >
        <p class="item-name">
          {{ item.bookingItemName }} {{ selectedBookingItemId }}
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
