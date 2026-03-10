<template>
  <Card>
    <template #content>
      <div class="release-filter">
        <div class="release-filter__field">
          <SelectField
            :model-value="selectedYear"
            name="year"
            :options="yearOptions"
            @update:model-value="onYearChange"
          />
        </div>

        <div class="release-filter__actions">
          <Button
            :label="$t('release.create')"
            icon="pi pi-plus"
            severity="success"
            @click="emit('create')"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { SelectField } from '@/components/common'

interface Props {
  selectedYear: number
}

defineProps<Props>()

const currentYear = new Date().getFullYear()
const yearOptions = [
  { label: String(currentYear), value: currentYear },
  { label: String(currentYear - 1), value: currentYear - 1 },
  { label: String(currentYear - 2), value: currentYear - 2 },
]

const emit = defineEmits<{
  (event: 'update:selectedYear', value: number): void
  (event: 'create'): void
}>()

const onYearChange = (value: unknown): void => {
  emit('update:selectedYear', value as number)
}
</script>

<style scoped lang="scss">
.release-filter {
  display: flex;
  align-items: end;
  gap: 1rem;

  &__field {
    min-width: 220px;
  }

  &__actions {
    display: flex;
    align-items: center;
  }
}
</style>
