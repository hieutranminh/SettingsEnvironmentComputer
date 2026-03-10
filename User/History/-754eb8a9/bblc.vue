<!-- components/dialogs/ErrorDetailsSection.vue -->
<template>
  <div class="error-details-section">
    <Button
      :label="toggleButtonLabel"
      severity="secondary"
      text
      @click="handleToggle"
      class="error-details-toggle"
    />

    <div v-if="isExpanded" class="error-details-content">
      <div
        v-for="(error, index) in errors"
        :key="index"
        class="error-detail-item"
      >
        <div class="error-code">
          <strong>Error Code:</strong> {{ error.errorCode }}
        </div>
        <div class="error-message">
          <strong>Error Message:</strong> {{ error.errorMessage }}
        </div>
        <div v-if="hasErrorValues(error)" class="error-values">
          <strong>Error Values:</strong>
          <ul>
            <li v-for="(value, valueIndex) in error.errorValues" :key="valueIndex">
              {{ value }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface ErrorDetail {
  errorCode: string;
  errorMessage: string;
  errorValues: string[];
}

interface ErrorDetailsSectionProps {
  errors: ErrorDetail[];
  isExpanded: boolean;
}

interface ErrorDetailsSectionEmits {
  toggle: [];
}

const props = defineProps<ErrorDetailsSectionProps>();
const emit = defineEmits<ErrorDetailsSectionEmits>();

const toggleButtonLabel = computed((): string => {
  return props.isExpanded ? 'Hide Error Details' : 'Show Error Details';
});

const hasErrorValues = (error: ErrorDetail): boolean => {
  return error.errorValues && error.errorValues.length > 0;
};

const handleToggle = (): void => {
  emit('toggle');
};
</script>

<style lang="scss" scoped>
.error-details-section {
  margin-top: 1rem;
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

.error-details-toggle {
  margin-bottom: 0.5rem;
}

.error-details-content {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-top: 0.5rem;
}

.error-detail-item {
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.error-code {
  margin-bottom: 0.5rem;
  color: #6c757d;
  font-family: monospace;
}

.error-message {
  margin-bottom: 0.5rem;
  color: #495057;
}

.error-values {
  margin-top: 0.5rem;

  ul {
    margin: 0.25rem 0 0 1rem;
    padding: 0;
  }

  li {
    margin-bottom: 0.25rem;
    color: #6c757d;
  }
}
</style>
