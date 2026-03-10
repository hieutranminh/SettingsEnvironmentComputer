<template>
  <div class="user-edit-container">
    <div class="user-edit-card">
      <h1>Edit User</h1>
      <p>User edit functionality will be implemented here.</p>
      <div class="user-edit-actions">
        <router-link to="/users" class="btn-secondary">Back to Users</router-link>
        <router-link to="/users/1" class="btn-primary">View User</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// User edit functionality will be implemented later
</script>

<style scoped lang="scss">
.user-edit-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.user-edit-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
}

.user-edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 4px;
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
