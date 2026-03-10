<template>
  <div class="home">
    <h1>{{ $t('home.title') }}</h1>
    <p>{{ $t('home.description') }}</p>
    
    <div class="features">
      <div class="feature-card">
        <h3>{{ $t('home.features.vue.title') }}</h3>
        <p>{{ $t('home.features.vue.description') }}</p>
      </div>
      <div class="feature-card">
        <h3>{{ $t('home.features.typescript.title') }}</h3>
        <p>{{ $t('home.features.typescript.description') }}</p>
      </div>
      <div class="feature-card">
        <h3>{{ $t('home.features.i18n.title') }}</h3>
        <p>{{ $t('home.features.i18n.description') }}</p>
      </div>
    </div>
    
    <div class="current-time">
      <h3>{{ $t('home.currentTime') }}</h3>
      <p>{{ formattedTime }}</p>
    </div>
    
    <div class="counter-section">
      <h3>{{ $t('home.counter.title') }}</h3>
      <p>{{ $t('home.counter.count', { count }) }}</p>
      <button @click="increment" class="btn btn-primary">
        {{ $t('home.counter.increment') }}
      </button>
      <button @click="decrement" class="btn btn-secondary">
        {{ $t('home.counter.decrement') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useCounterStore } from '@/store/counter'

const { t } = useI18n()
const counterStore = useCounterStore()

const count = computed(() => counterStore.count)
const currentTime = ref(dayjs())

const formattedTime = computed(() => {
  return currentTime.value.format('YYYY-MM-DD HH:mm:ss')
})

let timeInterval: ReturnType<typeof setInterval>

const increment = () => {
  counterStore.increment()
}

const decrement = () => {
  counterStore.decrement()
}

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = dayjs()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style lang="scss" scoped>
@use "sass:color";

.home {
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    color: $primary-color;
    margin-bottom: 1rem;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
    
    .feature-card {
      padding: 1.5rem;
      border: 1px solid $border-color;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      h3 {
        color: $primary-color;
        margin-bottom: 1rem;
      }
    }
  }
  
  .current-time {
    margin: 2rem 0;
    padding: 1rem;
    background: $light-bg;
    border-radius: 8px;
    
    p {
      font-family: monospace;
      font-size: 1.2rem;
      color: $text-primary;
    }
  }
  
  .counter-section {
    margin: 2rem 0;
    
    .btn {
      margin-right: 1rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      
      &.btn-primary {
        background: $primary-color;
        color: white;
        
        &:hover {
          background: color.adjust($primary-color, $lightness: -10%);
        }
      }
      
      &.btn-secondary {
        background: $secondary-color;
        color: white;
        
        &:hover {
          background: color.adjust($secondary-color, $lightness: -10%);
        }
      }
    }
  }
}
</style> 