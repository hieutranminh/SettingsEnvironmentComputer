<template>
  <div>
    <select v-model="selectedCurrency" @change="changeCurrency">
      <option v-for="item in CURRENCIES" :key="item.code" :value="item.code">
        {{ item.name }}
      </option>
    </select>
    value : {{ selectedCurrency }}  
  </div>
</template>

<script setup lang="ts">
import { CURRENCIES } from '@/config/constants'  
import { useCurrencyStore } from '@/stores/currency.store'

const currencyStore = useCurrencyStore()
const selectedCurrency = ref(currencyStore.currency)

const changeCurrency = () => {
  currencyStore.setCurrency(selectedCurrency.value)
}
</script> 

<style scoped lang="scss"></style>
 