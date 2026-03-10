<template>
  <main>
    <h1>Home</h1>
    <p>Welcome to the application</p>

    <nav>
      <h2>Available Routes:</h2>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/forgot-password">Forgot Password</router-link></li>
        <li><router-link to="/reset-password">Reset Password</router-link></li>
        <li><router-link to="/users">Users</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
      </ul>
    </nav>

    <Button @click="showDialog" label="Click" />
  </main>
</template>

<script setup lang="ts">
// Home page logic will be added here
import BaseButton from '@/components/common/BaseButton.vue';
import { useDialog } from 'primevue/usedialog';
const dialog = useDialog();

const showDialog = () => {
  dialog.open(BaseButton, {
    header: 'Dialog',
  });
};
</script>

<style scoped lang="scss">
main {
  h1 {
    background-color: $primary-color;
  }
}
</style>
