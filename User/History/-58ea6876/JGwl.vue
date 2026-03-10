<template>
  <header
    v-if="true"
    class="app-header"
  >
    <div class="header-container">
      <div class="header-left">
        <h1 class="app-title">{{ t('general_example.title_app-title') }}</h1>
      </div>

      <div class="header-right">
        <!-- Language Switcher for authenticated users -->
        <div class="language-section">
          <label class="language-label">{{ t('general_example.label_language') }}:</label>
          <LanguageSwitcher />
        </div>

        <!-- User info -->
        <div class="user-section">
          <!-- <span class="user-name">{{ authStore.userFullName }}</span> -->
          <button
            @click="handleLogout"
            class="logout-btn"
          >
            {{ t('auth.button_logout') }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// import { useAuthStore } from '@/stores/auth/auth'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
// const authStore = useAuthStore()
const { t } = useTranslation()

const handleLogout = async () => {
  // await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 0;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.language-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #333;
  font-weight: 500;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}

/* Responsive */
@media (width <= 768px) {
  .header-container {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .app-title {
    font-size: 1.25rem;
  }
}
</style>
