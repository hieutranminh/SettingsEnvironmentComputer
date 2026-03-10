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

<style scoped lang="scss">
  .result-item {
    margin-bottom: 12px;
    .items {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
      li {
          background-color: $white;
          border-radius: 10px;
          padding: 10px;
          flex: 0 0 calc((100% - 30px) / 4);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          &:hover {
            p.item-name {
              color: $blue;
            }
          }
          p.item-name {
            margin-bottom: 8px;
            word-break: break-all;
          }
        }
        li.active {
          background-color: $blue-lighten;
        }
    }
  }
</style>
