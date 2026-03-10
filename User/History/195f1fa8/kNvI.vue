<!--
  Example Vue component demonstrating custom ESLint rules
  
  This file shows examples of both good and bad patterns
  that will be caught by the custom ESLint rules.
-->

<template>
  <div class="example-component">
    <h1>{{ title }}</h1>
    <button @click="handleClick">Click Me</button>
    <input 
      @keydown="handleKeyDown" 
      @input="handleInput"
      v-model="inputValue"
    />
    <form @submit="handleSubmit">
      <input type="text" v-model="formData.name" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IUserData } from '@/types/user'

// ✅ Good: Using Composition API with <script setup>
const title = ref<string>('Example Component')
const inputValue = ref<string>('')
const formData = ref<IUserData>({
  name: '',
  email: '',
})

// ✅ Good: Event handlers with 'handle' prefix
const handleClick = (): void => {
  console.log('Button clicked')
}

const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    console.log('Enter pressed')
  }
}

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
}

const handleSubmit = (event: Event): void => {
  event.preventDefault()
  console.log('Form submitted:', formData.value)
}

// ✅ Good: Computed properties with explicit return types
const displayTitle = computed((): string => {
  return title.value.toUpperCase()
})

// ✅ Good: Functions with explicit return types
const validateForm = (): boolean => {
  return formData.value.name.length > 0 && formData.value.email.length > 0
}

// ✅ Good: Type imports
import type { IApiResponse } from '@/types/api'

// ✅ Good: Interface with 'I' prefix
interface IComponentProps {
  initialValue?: string
  disabled?: boolean
}

// ✅ Good: Function with explicit return type
const processData = (data: IUserData): IApiResponse<IUserData> => {
  return {
    data,
    status: 200,
    message: 'Success'
  }
}
</script>

<style scoped>
.example-component {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 5px;
}
</style>

<!--
  ❌ BAD EXAMPLES (These would trigger ESLint errors):
  
  <script lang="ts">
  // ❌ Bad: Using Options API instead of Composition API
  export default {
    data() {
      return {
        title: 'Example Component'
      }
    },
    methods: {
      // ❌ Bad: Event handlers without 'handle' prefix
      onClick() {
        console.log('Button clicked')
      },
      onKeyDown(event: KeyboardEvent) {
        console.log('Key pressed')
      }
    },
    computed: {
      // ❌ Bad: Computed without explicit return type
      displayTitle() {
        return this.title.toUpperCase()
      }
    }
  }
  </script>
  
  // ❌ Bad: Functions without explicit return types
  const getUserData = () => {
    return userData
  }
  
  // ❌ Bad: Interface without 'I' prefix
  interface UserData {
    name: string
    email: string
  }
  
  // ❌ Bad: Regular import instead of type import
  import { UserData } from '@/types/user'
  
  // ❌ Bad: Using 'any' type
  const data: any = fetchData()
-->
