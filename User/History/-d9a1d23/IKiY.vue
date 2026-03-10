<template>
  <div class="user-create-container">
    <div class="user-create-card">
      <h1>Create User</h1>
      <p>User creation functionality will be implemented here.</p>
      <div class="user-create-actions">
        <router-link to="/users" class="btn-secondary">Back to Users</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// User creation functionality will be implemented later
</script>

<style scoped lang="scss">
.user-create-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.user-create-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
}

.user-create-actions {
  margin-top: 2rem;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: #545b62;
  }
}
</style>
