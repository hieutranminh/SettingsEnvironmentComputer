<template>
  <main>
    <h1>{{ t('navigation.link_home') }}</h1>
    <p>{{ t('general_example.subtitle_welcome') }}</p>

    <div class="i18n-demo">
      <h2>{{ t('general_example.title_i18n-demo') }}</h2>
      <div class="demo-grid">
        <div class="demo-item">
          <strong>{{ t('common.loading') }}</strong>
        </div>
        <div class="demo-item">
          <strong>{{ t('common.message_success') }}</strong>
        </div>
        <div class="demo-item">
          <strong>{{ t('common.message_error') }}</strong>
        </div>
        <div class="demo-item">
          <strong>{{ t('auth.title_login') }}</strong>
        </div>
        <div class="demo-item">
          <strong>{{ t('auth.link_register') }}</strong>
        </div>
        <div class="demo-item">
          <strong>{{ t('validation.message_required') }}</strong>
        </div>
      </div>
    </div>

    <nav>
      <h2>{{ t('general_example.title_available-routes') }}</h2>
      <ul>
        <li><router-link to="/">{{ t('navigation.link_home') }}</router-link></li>
        <li><router-link to="/login">{{ t('auth.title_login') }}</router-link></li>
        <li><router-link to="/register">{{ t('auth.link_register') }}</router-link></li>
        <li><router-link to="/forgot-password">{{ t('auth.link_forgotPassword') }}</router-link></li>
        <li><router-link to="/reset-password">{{ t('auth.link_resetPassword') }}</router-link></li>
        <li><router-link to="/users">{{ t('navigation.link_users') }}</router-link></li>
        <li><router-link to="/profile">{{ t('navigation.link_profile') }}</router-link></li>
      </ul>
    </nav>

    <Button label="Test Multiple Errors" @click="testMultipleErrors" severity="danger" />
    <Button label="Mixed Messages" @click="testMixedMessages" />
  </main>
</template>

<script setup lang="ts">
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()
const { showError, showInfo, showWarning } = useMessageDialog()

const testMultipleErrors = () => {
  // 3 lỗi sẽ hiển thị lần lượt
  showError('Lỗi 1', 'Không thể kết nối database')
  showError('Lỗi 2', 'Session hết hạn')
  showError('Lỗi 3', 'Không có quyền truy cập')
}

const testMixedMessages = () => {
  showError('Lỗi', 'Có lỗi xảy ra')
  showWarning('Cảnh báo', 'Dữ liệu không chính xác')
  showInfo('Thông tin', 'Quá trình hoàn tất')
}
</script>

<style scoped lang="scss">
main {
  h1 {
    background-color: $primary-color;
  }
}

.i18n-demo {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.demo-item {
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #eee;
  text-align: center;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  margin: 5px 0;
}

nav a {
  text-decoration: none;
  color: #007bff;
}

nav a:hover {
  text-decoration: underline;
}
</style>

