<template>
  <div class="not-found">
    <div class="not-found__content">
      <h1 class="not-found__title">404</h1>
      <h2 class="not-found__subtitle">{{ t('errors.notFound') }}</h2>
      <p class="not-found__description">
        {{ t('common.error') }}
      </p>
      <router-link to="/" class="not-found__link">
        {{ t('navigation.home') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;

  &__content {
    max-width: 500px;
  }

  &__title {
    font-size: 6rem;
    font-weight: bold;
    color: #e74c3c;
    margin: 0 0 1rem;
  }

  &__subtitle {
    font-size: 2rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 1rem;
  }

  &__description {
    font-size: 1.1rem;
    color: #7f8c8d;
    margin: 0 0 2rem;
  }

  &__link {
    display: inline-block;
    padding: 0.75rem 2rem;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #2980b9;
    }
  }
}
</style>
