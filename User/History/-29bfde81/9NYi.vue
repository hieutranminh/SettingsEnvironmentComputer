<template>
  <div class="user-list-container">
    <header class="user-list-header">
      <h1>User Management</h1>
      <router-link to="/users/create" class="btn-primary">Add User</router-link>
    </header>

    <main class="user-list-content">
      <div class="user-list-card">
        <p>User list functionality will be implemented here.</p>
        <div class="mock-users">
          <div class="user-item">
            <span class="user-name">John Doe</span>
            <span class="user-email">john@example.com</span>
            <span class="user-role">Admin</span>
            <div class="user-actions">
              <router-link to="/users/1" class="btn-small">View</router-link>
              <router-link to="/users/1/edit" class="btn-small">Edit</router-link>
            </div>
          </div>
          <div class="user-item">
            <span class="user-name">Jane Smith</span>
            <span class="user-email">jane@example.com</span>
            <span class="user-role">User</span>
            <div class="user-actions">
              <router-link to="/users/2" class="btn-small">View</router-link>
              <router-link to="/users/2/edit" class="btn-small">Edit</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// User list functionality will be implemented later
</script>

<style scoped lang="scss">
.user-list-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.user-list-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
}

.user-list-content {
  padding: 2rem;
}

.user-list-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mock-users {
  margin-top: 2rem;
}

.user-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
}

.user-name {
  font-weight: bold;
}

.user-email {
  color: #666;
}

.user-role {
  background-color: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-align: center;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.875rem;

  &:hover {
    background-color: #545b62;
  }
}
</style>
