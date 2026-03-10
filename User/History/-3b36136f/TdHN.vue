<script setup lang="ts">
import { ref, computed } from 'vue'
import { generateFakeData, generateFormData } from '../utils/fakeDataGenerator'
import type { FakeDataType, DataTypeConfig, DataCategory, CategoryConfig } from '../types'

// Categories configuration
const categories: CategoryConfig[] = [
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'contact', label: 'Contact', icon: '📧' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'security', label: 'Security', icon: '🔐' },
  { id: 'misc', label: 'Misc', icon: '🎲' },
]

// Data types configuration
const dataTypes: DataTypeConfig[] = [
  { id: 'fullName', label: 'Full Name', icon: '👤', category: 'personal' },
  { id: 'firstName', label: 'First Name', icon: '📝', category: 'personal' },
  { id: 'lastName', label: 'Last Name', icon: '📝', category: 'personal' },
  { id: 'email', label: 'Email', icon: '📧', category: 'contact' },
  { id: 'phone', label: 'Phone', icon: '📱', category: 'contact' },
  { id: 'address', label: 'Address', icon: '🏠', category: 'contact' },
  { id: 'city', label: 'City', icon: '🌆', category: 'contact' },
  { id: 'country', label: 'Country', icon: '🌍', category: 'contact' },
  { id: 'zipCode', label: 'Zip Code', icon: '📮', category: 'contact' },
  { id: 'company', label: 'Company', icon: '🏢', category: 'business' },
  { id: 'jobTitle', label: 'Job Title', icon: '💼', category: 'business' },
  { id: 'username', label: 'Username', icon: '👤', category: 'security' },
  { id: 'password', label: 'Password', icon: '🔑', category: 'security' },
  { id: 'creditCard', label: 'Credit Card', icon: '💳', category: 'security' },
  { id: 'date', label: 'Date', icon: '📅', category: 'misc' },
  { id: 'uuid', label: 'UUID', icon: '🔗', category: 'misc' },
  { id: 'lorem', label: 'Lorem Ipsum', icon: '📄', category: 'misc' },
]

// State
const activeCategory = ref<DataCategory>('personal')
const generatedValue = ref<string>('')
const lastGeneratedType = ref<string>('')
const copiedToClipboard = ref<boolean>(false)
const isGenerating = ref<boolean>(false)

// Computed
const filteredDataTypes = computed((): DataTypeConfig[] => {
  return dataTypes.filter((dt): boolean => dt.category === activeCategory.value)
})

// Methods
function generateData(type: FakeDataType): void {
  isGenerating.value = true
  lastGeneratedType.value = type

  // Small delay for animation effect
  setTimeout((): void => {
    const value = generateFakeData(type)
    generatedValue.value = String(value)
    isGenerating.value = false
  }, 100)
}

async function copyToClipboard(): Promise<void> {
  if (!generatedValue.value) return

  try {
    await navigator.clipboard.writeText(generatedValue.value)
    copiedToClipboard.value = true
    setTimeout((): void => {
      copiedToClipboard.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

async function fillCurrentForm(): Promise<void> {
  const formData = generateFormData()

  // Send message to content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'fillForm',
      formData,
    })
  }
}

function regenerate(): void {
  if (lastGeneratedType.value) {
    generateData(lastGeneratedType.value as FakeDataType)
  }
}
</script>

<template>
  <div class="popup-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🎲</span>
          <h1 class="logo-text">Fake Data</h1>
        </div>
        <button class="fill-form-btn" @click="fillCurrentForm" title="Auto-fill current form">
          <span class="btn-icon">⚡</span>
          <span>Fill Form</span>
        </button>
      </div>
    </header>

    <!-- Category Tabs -->
    <nav class="category-tabs">
      <button
        v-for="category in categories"
        :key="category.id"
        class="category-tab"
        :class="{ active: activeCategory === category.id }"
        @click="activeCategory = category.id"
      >
        <span class="tab-icon">{{ category.icon }}</span>
        <span class="tab-label">{{ category.label }}</span>
      </button>
    </nav>

    <!-- Data Type Grid -->
    <div class="data-types-grid">
      <button
        v-for="(dataType, index) in filteredDataTypes"
        :key="dataType.id"
        class="data-type-btn animate-fade-in"
        :style="{ animationDelay: `${index * 50}ms` }"
        @click="generateData(dataType.id)"
      >
        <span class="data-type-icon">{{ dataType.icon }}</span>
        <span class="data-type-label">{{ dataType.label }}</span>
      </button>
    </div>

    <!-- Generated Value Display -->
    <div class="generated-section" :class="{ active: generatedValue }">
      <div class="generated-header">
        <span class="generated-label">Generated Value</span>
        <div class="generated-actions">
          <button
            class="action-btn"
            @click="regenerate"
            :disabled="!lastGeneratedType"
            title="Regenerate"
          >
            <span :class="{ spinning: isGenerating }">🔄</span>
          </button>
          <button
            class="action-btn"
            @click="copyToClipboard"
            :disabled="!generatedValue"
            :class="{ copied: copiedToClipboard }"
            title="Copy to clipboard"
          >
            <span>{{ copiedToClipboard ? '✅' : '📋' }}</span>
          </button>
        </div>
      </div>
      <div class="generated-value mono" :class="{ loading: isGenerating }">
        {{ generatedValue || 'Click a button above to generate data' }}
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <span class="footer-text">Right-click on any input field for quick access</span>
    </footer>
  </div>
</template>

<style scoped>
.popup-container {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  background: var(--color-bg-primary);
  background-image: 
    radial-gradient(ellipse at top right, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
}

/* Header */
.header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-icon {
  font-size: 1.5rem;
  animation: pulse 2s infinite;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.fill-form-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--gradient-primary);
  color: var(--color-bg-primary);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.85rem;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.fill-form-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.fill-form-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1rem;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-bg-tertiary);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.category-tab:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-hover);
  border-color: var(--color-border);
}

.category-tab.active {
  color: var(--color-accent-primary);
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--color-accent-primary);
}

.tab-icon {
  font-size: 1rem;
}

.tab-label {
  font-size: 0.8rem;
}

/* Data Types Grid */
.data-types-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  flex: 1;
}

.data-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  opacity: 0;
}

.data-type-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-accent-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.15);
}

.data-type-btn:active {
  transform: translateY(0);
}

.data-type-icon {
  font-size: 1.5rem;
}

.data-type-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-align: center;
}

/* Generated Section */
.generated-section {
  margin: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.generated-section.active {
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.1);
}

.generated-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.generated-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
}

.generated-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.action-btn:hover:not(:disabled) {
  background: var(--color-bg-hover);
  transform: scale(1.1);
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-btn.copied {
  background: rgba(16, 185, 129, 0.2);
}

.action-btn .spinning {
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.generated-value {
  padding: var(--spacing-md);
  background: var(--color-bg-primary);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--color-text-primary);
  word-break: break-all;
  line-height: 1.6;
  min-height: 60px;
  transition: all var(--transition-fast);
}

.generated-value.loading {
  opacity: 0.5;
}

/* Footer */
.footer {
  padding: var(--spacing-md);
  text-align: center;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.footer-text {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}
</style>

