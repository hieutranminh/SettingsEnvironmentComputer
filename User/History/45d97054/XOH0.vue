<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>Profile</h1>
      <div class="profile-info">
        <div class="info-group">
          <label>Name:</label>
          <span>{{ authStore.user?.name }}</span>
        </div>
        <div class="info-group">
          <label>Email:</label>
          <span>{{ authStore.user?.email }}</span>
        </div>
        <div class="info-group">
          <label>Roles:</label>
          <span>{{ authStore.user?.roles.join(', ') }}</span>
        </div>
      </div>

      <div class="profile-actions">
        <router-link to="/settings" class="btn-primary">Edit Profile</router-link>
        <router-link to="/dashboard" class="btn-secondary">Back to Dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped lang="scss">
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.profile-info {
  margin: 2rem 0;
}

.info-group {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  label {
    font-weight: bold;
    color: #333;
  }

  span {
    color: #666;
  }
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  display: inline-block;
}

.btn-primary {
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
}

.btn-secondary {
  background-color: #6c757d;
  color: white;

  &:hover {
    background-color: #545b62;
  }
}
</style>
