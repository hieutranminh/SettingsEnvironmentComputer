<template>
  <!-- ✅ Valid: Using serialize function -->
  <div v-html="serializeHtml(userContent)"></div>
  
  <!-- ✅ Valid: Using serialize function with different name -->
  <div v-html="serializeContent(userContent)"></div>
  
  <!-- ✅ Valid: Using member expression with serialize prefix -->
  <div v-html="utils.serializeHtml(userContent)"></div>
  
  <!-- ✅ Valid: Using conditional expression with serialize functions -->
  <div v-html="isTrusted ? userContent : serializeHtml(userContent)"></div>
  
  <!-- ✅ Valid: Using logical expression with serialize functions -->
  <div v-html="userContent || serializeHtml(defaultContent)"></div>
  
  <!-- ❌ Invalid: Direct content without serialize function -->
  <div v-html="userContent"></div>
  
  <!-- ❌ Invalid: Using non-serialize function -->
  <div v-html="formatHtml(userContent)"></div>
  
  <!-- ❌ Invalid: Using function without serialize prefix -->
  <div v-html="sanitizeHtml(userContent)"></div>
  
  <!-- ❌ Invalid: Using variable without function call -->
  <div v-html="processedContent"></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const userContent = ref('<p>User content</p>')
const defaultContent = ref('<p>Default content</p>')
const processedContent = ref('<p>Processed content</p>')
const isTrusted = ref(false)

// Valid serialize functions
const serializeHtml = (content: string): string => {
  // Sanitize content here
  return content
}

const serializeContent = (content: string): string => {
  // Sanitize content here
  return content
}

// Invalid functions (not prefixed with serialize)
const formatHtml = (content: string): string => {
  return content
}

const sanitizeHtml = (content: string): string => {
  return content
}

// Utils object with serialize method
const utils = {
  serializeHtml: (content: string): string => {
    return content
  }
}
</script>
