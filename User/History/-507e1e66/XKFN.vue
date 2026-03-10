<template>
  <div class="about">
    <h1>{{ $t('about.title') }}</h1>
    <p>{{ $t('about.description') }}</p>
    
    <div class="tech-stack">
      <h2>{{ $t('about.techStack.title') }}</h2>
      <ul>
        <li v-for="tech in techStack" :key="tech">{{ tech }}</li>
      </ul>
    </div>
    
    <div class="features-list">
      <h2>{{ $t('about.features.title') }}</h2>
      <ul>
        <li v-for="feature in features" :key="feature">{{ feature }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const techStack = computed(() => [
  t('about.techStack.vue'),
  t('about.techStack.typescript'),
  t('about.techStack.vite'),
  t('about.techStack.pinia'),
  t('about.techStack.vueRouter'),
  t('about.techStack.vueI18n'),
  t('about.techStack.axios'),
  t('about.techStack.dayjs'),
  t('about.techStack.scss')
])

const features = computed(() => [
  t('about.features.i18n'),
  t('about.features.stateManagement'),
  t('about.features.routing'),
  t('about.features.httpClient'),
  t('about.features.dateTime'),
  t('about.features.styling'),
  t('about.features.linting')
])
</script>

<style lang="scss" scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    color: $primary-color;
    margin-bottom: 1rem;
  }
  
  h2 {
    color: $secondary-color;
    margin: 2rem 0 1rem 0;
  }
  
  .tech-stack,
  .features-list {
    margin: 2rem 0;
    padding: 1.5rem;
    background: $light-bg;
    border-radius: 8px;
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        padding: 0.5rem 0;
        border-bottom: 1px solid $border-color;
        
        &:last-child {
          border-bottom: none;
        }
        
        &::before {
          content: '✓';
          color: $primary-color;
          font-weight: bold;
          margin-right: 0.5rem;
        }
      }
    }
  }
}
</style> 