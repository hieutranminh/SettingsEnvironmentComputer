<template>
  <div class="user-detail-container">
    <div class="user-detail-card">
      <h1>User Details</h1>
      <p>User detail functionality will be implemented here.</p>
      <div class="user-detail-actions">
        <router-link to="/users" class="btn-secondary">Back to Users</router-link>
        <router-link to="/users/1/edit" class="btn-primary">Edit User</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// User detail functionality will be implemented later
</script>

<style scoped lang="scss">
.user-detail-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.user-detail-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
}

.user-detail-actions {
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
