<template>
  <div class="custom-dialog">
    <div class="dialog-header">
      <h3>{{ title }}</h3>
    </div>

    <div class="dialog-content">
      <p>{{ message }}</p>

      <div class="form-group">
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-input"
          placeholder="Enter your name"
        />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="Enter your email"
        />
      </div>
    </div>

    <div class="dialog-footer">
      <BaseButton @click="handleCancel" variant="secondary">
        Cancel
      </BaseButton>
      <BaseButton @click="handleSubmit" variant="primary">
        Submit
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  message: string
}

defineProps<Props>()

const formData = ref({
  name: '',
  email: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', formData.value)
  // Close the dialog by emitting close event
  // The dialog system will handle this automatically
}

const handleCancel = () => {
  console.log('Dialog cancelled')
  // Close the dialog by emitting close event
  // The dialog system will handle this automatically
}
</script>

<style lang="scss" scoped>
.custom-dialog {
  padding: 1rem;

  .dialog-header {
    margin-bottom: 1rem;

    h3 {
      margin: 0;
      color: #333;
    }
  }

  .dialog-content {
    margin-bottom: 1.5rem;

    p {
      margin-bottom: 1rem;
      color: #666;
    }

    .form-group {
      margin-bottom: 1rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #333;
      }

      .form-input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
}
</style>
