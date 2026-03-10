<template>
  <main>
    <h3>
      {{ $t('common.welcome') }}
    </h3>
    <Button severity="success" :label="$t('common.click')" />
    <LanguageSwitcher />
  </main>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
main {
  color: var(--p-text-color);
}
</style>
