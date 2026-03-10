<template>
  <main class="home-view">
    <h1>Home</h1>
    <p>Welcome to the application</p>

    <nav class="navigation">
      <h2>Available Routes:</h2>
      <ul class="route-list">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/forgot-password">Forgot Password</router-link></li>
        <li><router-link to="/reset-password">Reset Password</router-link></li>
        <li><router-link to="/users">Users</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
      </ul>
    </nav>

    <div class="demo-section">
      <h3>SCSS Variables & Mixins Demo (Auto-injected!)</h3>
      <div class="demo-grid">
        <div class="demo-card primary">Primary Color</div>
        <div class="demo-card secondary">Secondary Color</div>
        <div class="demo-card success">Success Color</div>
        <div class="demo-card warning">Warning Color</div>
        <div class="demo-card danger">Danger Color</div>
      </div>
    </div>

    <Button label="Click" />
  </main>
</template>

<script setup lang="ts">
// Home page logic will be added here
</script>

<style scoped lang="scss">
// No manual imports needed! Variables and mixins are auto-injected by Vite

.home-view {
  @include container($container-max-width, $spacing-4);
  padding-top: $spacing-8;
  padding-bottom: $spacing-8;

  h1 {
    @include font-size($font-size-4xl, $line-height-tight);
    color: $primary-color;
    margin-bottom: $spacing-6;
  }

  p {
    @include font-size($font-size-lg, $line-height-normal);
    color: $gray-600;
    margin-bottom: $spacing-8;
  }
}

.navigation {
  margin-bottom: $spacing-8;

  h2 {
    @include font-size($font-size-2xl, $line-height-tight);
    color: $gray-800;
    margin-bottom: $spacing-4;
  }
}

.route-list {
  list-style: none;
  padding: 0;

  li {
    margin-bottom: $spacing-2;

    a {
      @include font-size($font-size-base, $line-height-normal);
      color: $primary-color;
      text-decoration: none;
      transition: color $transition-fast;

      &:hover {
        color: $primary-dark;
      }
    }
  }
}

.demo-section {
  margin-bottom: $spacing-8;

  h3 {
    @include font-size($font-size-xl, $line-height-tight);
    color: $gray-800;
    margin-bottom: $spacing-4;
  }
}

.demo-grid {
  @include grid-auto-fit(200px, $spacing-4);
}

.demo-card {
  @include flex-center;
  @include rounded-lg;
  @include shadow-md;
  @include hover-lift(4px);

  height: 100px;
  font-weight: $font-weight-medium;
  color: $white;
  cursor: pointer;
  transition: all $transition-base;

  &.primary {
    background-color: $primary-color;

    &:hover {
      background-color: $primary-dark;
    }
  }

  &.secondary {
    background-color: $secondary-color;

    &:hover {
      background-color: $secondary-dark;
    }
  }

  &.success {
    background-color: $success-color;

    &:hover {
      background-color: $success-dark;
    }
  }

  &.warning {
    background-color: $warning-color;

    &:hover {
      background-color: $warning-dark;
    }
  }

  &.danger {
    background-color: $danger-color;

    &:hover {
      background-color: $danger-dark;
    }
  }
}
</style>
