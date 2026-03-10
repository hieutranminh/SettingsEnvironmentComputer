<template>
  <Card>
    <template #content>
      <div class="my-issues-filter">
        <SelectField
          v-model="store.filters.projectId"
          name="projectName"
          label="Project Name"
          :options="projectOptions"
          placeholder="Select a project"
          :loading="store.loadingProjects"
          filter
          show-clear
          @update:model-value="onProjectChange"
        />

        <InputNumberField
          v-model="store.filters.releaseNumber"
          name="releaseNumber"
          label="Release Number"
          placeholder="Enter release number"
          :precision="0"
          :min="1"
        />

        <SelectField
          v-model="store.filters.region"
          name="region"
          label="Region"
          :options="regionOptions"
          placeholder="Select region"
          show-clear
        />

        <SelectField
          v-model="store.filters.status"
          name="status"
          label="Status"
          :options="statusOptions"
          placeholder="Select status"
          show-clear
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { REGION_OPTIONS, STATUS_OPTIONS, useMyIssuesStore } from '@/stores/myIssues'

import { InputNumberField, SelectField } from '@/components/common'

const store = useMyIssuesStore()

const projectOptions = computed(() =>
  store.projects.map((project) => ({
    label: project.name,
    value: project.id,
  })),
)

const regionOptions = [...REGION_OPTIONS]
const statusOptions = [...STATUS_OPTIONS]

function onProjectChange(): void {
  void store.fetchIssues()
}
</script>

<style scoped lang="scss">
.my-issues-filter {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  align-items: end;
}
</style>
