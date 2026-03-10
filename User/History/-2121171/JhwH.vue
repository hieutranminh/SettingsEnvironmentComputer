<template>
  <div id="app">
    <header class="app-header">
      <nav class="nav">
        <router-link to="/" class="nav-link">{{ $t('nav.home') }}</router-link>
        <router-link to="/about" class="nav-link">{{ $t('nav.about') }}</router-link>
      </nav>
      <div class="language-switcher">
        <button @click="switchLanguage('en')" :class="{ active: currentLocale === 'en' }">
          EN
        </button>
        <button @click="switchLanguage('ko')" :class="{ active: currentLocale === 'ko' }">
          KO
        </button>
      </div>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>&copy; 2024 Vue Cursor AI. {{ $t('footer.rights') }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)

const switchLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: $primary-color;
  color: white;
  
  .nav {
    display: flex;
    gap: 2rem;
    
    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
      
      &.router-link-active {
        font-weight: bold;
      }
    }
  }
  
  .language-switcher {
    display: flex;
    gap: 0.5rem;
    
    button {
      padding: 0.5rem 1rem;
      border: 1px solid white;
      background: transparent;
      color: white;
      cursor: pointer;
      border-radius: 4px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      &.active {
        background: white;
        color: $primary-color;
      }
    }
  }
}

.app-main {
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  background-color: $secondary-color;
  color: white;
}
</style> 