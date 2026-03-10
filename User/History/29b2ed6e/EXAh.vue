<template>
  <a-config-provider
  >
   xxxxxxxxxxxxxasd asdas {{ count }}  asdasd
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)  
console.log('count', count.value)    
</script>      