<template>
  <div class="settings-container">
    <div class="settings-card">
      <h1>Settings</h1>
      <p>Settings page is under construction.</p>
      <div class="settings-actions">
        <router-link to="/profile" class="btn-secondary">Back to Profile</router-link>
        <router-link to="/dashboard" class="btn-primary">Dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Settings functionality will be implemented later
</script>

<style scoped lang="scss">
.settings-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.settings-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
}

.settings-actions {
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
