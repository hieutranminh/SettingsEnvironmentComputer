<template>
  <div class="not-found">
    <div class="error-content">
      <h1>404</h1>
      <h2>{{ $t('notFound.title') }}</h2>
      <p>{{ $t('notFound.description') }}</p>
      <router-link to="/" class="btn btn-primary">
        {{ $t('notFound.goHome') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this component
</script>

<style lang="scss" scoped>
@use "sass:color";

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  
  .error-content {
    text-align: center;
    
    h1 {
      font-size: 6rem;
      color: $primary-color;
      margin: 0;
      font-weight: bold;
    }
    
    h2 {
      color: $secondary-color;
      margin: 1rem 0;
    }
    
    p {
      color: $text-primary;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
    
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: $primary-color;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      
      &:hover {
        background: color.adjust($primary-color, $lightness: -10%);
      }
    }
  }
}
</style> 