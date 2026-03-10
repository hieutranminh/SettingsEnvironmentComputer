<template>
  <Card class="card-note">
    <template #content>
      <p>{{ $t('clients-by-period.note-1') }}</p>
      <p>{{ $t('clients-by-period.note-2') }}</p>
      <p>{{ $t('clients-by-period.note-3') }}</p>
      <ul>
        <li>{{ $t('clients-by-period.note-3-sub-1') }}</li>
        <li>{{ $t('clients-by-period.note-3-sub-2') }}</li>
      </ul>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.card-note {
  ul {
    li {
      margin-left: 1rem;
    }
  }
}
</style>
