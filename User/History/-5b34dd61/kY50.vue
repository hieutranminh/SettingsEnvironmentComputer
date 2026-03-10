<template>
  <div class="result-item">
    <p>
      {{
        $t('aha-ai.message-found-similar-services', {
          itemName: serviceGroup.serviceNameAI,
          count: serviceGroup.serviceItems.length,
        })
      }}
    </p>
    <ul class="items">
      <li
        v-for="item in serviceGroup.serviceItems"
        :key="item.serviceId"
        :class="{ active: isSelected(item.serviceId) }"
        @click="onSelectItem(item)"
      >
        <p class="item-name">
          {{ item.serviceName }}
        </p>
        <p class="item-price">
          {{ formatMoney(item.price, 0) }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { formatMoney } from 'CommonHelpers'

export default {
  props: {
    serviceGroup: {
      type:     Object,
      required: true,
    },
    selectedServiceId: {
      type:    Number,
      default: null,
    },
  },

  methods: {
    formatMoney,

    isSelected(serviceId) {
      return this.selectedServiceId === serviceId
    },

    onSelectItem(item) {
      this.$emit('select', item)
    },
  },
}
</script>
