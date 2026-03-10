<template>
  <div
    v-if="errors && errors.length > 0"
    class="form-error-list"
    role="alert"
    aria-live="assertive"
  >
    <ul class="form-error-list__items">
      <li
        v-for="(error, index) in errors"
        :key="index"
        class="form-error-list__item"
      >
        <span v-html="'asdasd'" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  errors?: string[]
  title?: string
  showIcon?: boolean
}

withDefaults(defineProps<Props>(), {
  errors: () => [],
})
</script>

<style scoped lang="scss">
.form-error-list {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--p-red-200, #fecaca); /* red-200 */
  background-color: var(--p-red-50, #fff1f2); /* red-50 */
  border-radius: 0.375rem;
  color: var(--p-red-800, #991b1b); /* red-800 */

  &__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
    font-weight: 600;
  }

  &__items {
    margin: 0;
    padding-left: 1rem;
  }

  &__item {
    list-style: disc;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  &--empty {
    padding: 0.5rem 0; /* reserve a small space to avoid layout shift when errors appear */
    border: 1px dashed transparent;
    background: transparent;
  }
}
</style>
