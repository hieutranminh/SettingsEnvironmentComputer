<template>
  <div class="unauthorized-container">
    <div class="unauthorized-card">
      <h1>Unauthorized Access</h1>
      <p>You don't have permission to access this page.</p>
      <div class="actions">
        <router-link to="/" class="btn-primary">Go Home</router-link>
        <router-link to="/login" class="btn-secondary">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed
</script>

<style scoped lang="scss">
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.unauthorized-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
}

.actions {
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
