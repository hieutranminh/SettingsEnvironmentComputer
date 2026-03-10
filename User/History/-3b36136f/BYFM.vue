<script setup lang="ts">
import { ref, computed } from 'vue'
import { generateFakeData, generateFormData } from '../utils/fakeDataGenerator'
import { generateClientPayload, createClient, createMultipleClients } from '../utils/apiClient'
import type {
  FakeDataType,
  DataTypeConfig,
  DataCategory,
  CategoryConfig,
  CreateClientPayload,
} from '../types'

// Tab state
type TabType = 'generator' | 'api'
const activeTab = ref<TabType>('generator')

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

// Generator State
const activeCategory = ref<DataCategory>('personal')
const generatedValue = ref<string>('')
const lastGeneratedType = ref<string>('')
const copiedToClipboard = ref<boolean>(false)
const isGenerating = ref<boolean>(false)

// API State
const clientCount = ref<number>(1)
const isCreatingClient = ref<boolean>(false)
const apiResults = ref<Array<{ success: boolean; message: string }>>([])
const previewPayload = ref<CreateClientPayload | null>(null)

// Computed
const filteredDataTypes = computed((): DataTypeConfig[] => {
  return dataTypes.filter((dt): boolean => dt.category === activeCategory.value)
})

// Generator Methods
function generateData(type: FakeDataType): void {
  isGenerating.value = true
  lastGeneratedType.value = type

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

// API Methods
function previewClientPayload(): void {
  previewPayload.value = generateClientPayload()
}

async function handleCreateClient(): Promise<void> {
  isCreatingClient.value = true
  apiResults.value = []

  try {
    if (clientCount.value === 1) {
      const payload = generateClientPayload()
      const result = await createClient(payload)
      apiResults.value = [
        {
          success: result.success,
          message: result.success
            ? `✅ Client "${payload.clientName}" created successfully!`
            : `❌ Failed: ${result.error}`,
        },
      ]
    } else {
      const results = await createMultipleClients(clientCount.value)
      apiResults.value = results.map((result, index) => ({
        success: result.success,
        message: result.success
          ? `✅ Client #${index + 1} created successfully!`
          : `❌ Client #${index + 1} failed: ${result.error}`,
      }))
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    apiResults.value = [{ success: false, message: `❌ Error: ${errorMessage}` }]
  } finally {
    isCreatingClient.value = false
  }
}

async function copyPayloadToClipboard(): Promise<void> {
  if (!previewPayload.value) return

  try {
    await navigator.clipboard.writeText(JSON.stringify(previewPayload.value, null, 2))
    alert('Payload copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

// Initialize preview
previewClientPayload()
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
        <div class="tab-switcher">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'generator' }"
            @click="activeTab = 'generator'"
          >
            Generator
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'api' }"
            @click="activeTab = 'api'"
          >
            API Client
          </button>
        </div>
      </div>
    </header>

    <!-- Generator Tab -->
    <div v-if="activeTab === 'generator'" class="tab-content">
      <!-- Quick Fill Button -->
      <div class="quick-actions">
        <button class="fill-form-btn" @click="fillCurrentForm" title="Auto-fill current form">
          <span class="btn-icon">⚡</span>
          <span>Fill Form</span>
        </button>
      </div>

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
    </div>

    <!-- API Client Tab -->
    <div v-if="activeTab === 'api'" class="tab-content api-tab">
      <!-- API Info -->
      <div class="api-info">
        <div class="api-endpoint">
          <span class="endpoint-label">Endpoint:</span>
          <code class="endpoint-url">/Client/CreateClient</code>
        </div>
      </div>

      <!-- Create Client Section -->
      <div class="create-client-section">
        <h3 class="section-title">🚀 Create Client</h3>

        <div class="client-count-input">
          <label for="clientCount">Number of clients:</label>
          <input
            id="clientCount"
            v-model.number="clientCount"
            type="number"
            min="1"
            max="100"
            class="count-input"
          />
        </div>

        <div class="action-buttons">
          <button class="create-btn" @click="handleCreateClient" :disabled="isCreatingClient">
            <span v-if="isCreatingClient" class="spinning">⏳</span>
            <span v-else>🎯</span>
            {{
              isCreatingClient
                ? 'Creating...'
                : `Create ${clientCount} Client${clientCount > 1 ? 's' : ''}`
            }}
          </button>

          <button class="preview-btn" @click="previewClientPayload">🔍 Preview Payload</button>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="apiResults.length > 0" class="results-section">
        <h3 class="section-title">📊 Results</h3>
        <div class="results-list">
          <div
            v-for="(result, index) in apiResults"
            :key="index"
            class="result-item"
            :class="{ success: result.success, error: !result.success }"
          >
            {{ result.message }}
          </div>
        </div>
      </div>

      <!-- Payload Preview -->
      <div v-if="previewPayload" class="preview-section">
        <div class="preview-header">
          <h3 class="section-title">📋 Payload Preview</h3>
          <button class="copy-payload-btn" @click="copyPayloadToClipboard">📋 Copy</button>
        </div>
        <pre class="payload-preview mono">{{ JSON.stringify(previewPayload, null, 2) }}</pre>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <span class="footer-text">
        {{
          activeTab === 'generator'
            ? 'Right-click on any input field for quick access'
            : 'Ahasoft Salon API Client'
        }}
      </span>
    </footer>
  </div>
</template>

<style scoped>
.popup-container {
  display: flex;
  flex-direction: column;
  min-height: 500px;
  max-height: 600px;
  background: var(--color-bg-primary);
  background-image:
    radial-gradient(ellipse at top right, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
}

/* Header */
.header {
  padding: var(--spacing-md);
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
  font-size: 1.25rem;
  animation: pulse 2s infinite;
}

.logo-text {
  font-size: 1rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Tab Switcher */
.tab-switcher {
  display: flex;
  gap: 4px;
  background: var(--color-bg-tertiary);
  padding: 4px;
  border-radius: var(--radius-md);
}

.tab-btn {
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.tab-btn:hover {
  color: var(--color-text-primary);
}

.tab-btn.active {
  background: var(--gradient-primary);
  color: var(--color-bg-primary);
}

/* Tab Content */
.tab-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Quick Actions */
.quick-actions {
  padding: var(--spacing-md);
  display: flex;
  justify-content: center;
}

.fill-form-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
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

.btn-icon {
  font-size: 1rem;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-md);
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
  font-size: 0.8rem;
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
}

.category-tab.active {
  color: var(--color-accent-primary);
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--color-accent-primary);
}

.tab-icon {
  font-size: 0.9rem;
}

.tab-label {
  font-size: 0.75rem;
}

/* Data Types Grid */
.data-types-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
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
}

.data-type-icon {
  font-size: 1.25rem;
}

.data-type-label {
  font-size: 0.7rem;
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
}

.generated-section.active {
  border-color: var(--color-accent-primary);
}

.generated-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.generated-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.generated-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: all var(--transition-fast);
}

.action-btn:hover:not(:disabled) {
  background: var(--color-bg-hover);
}

.action-btn:disabled {
  opacity: 0.4;
}

.action-btn .spinning {
  animation: spin 0.5s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.generated-value {
  padding: var(--spacing-sm);
  background: var(--color-bg-primary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--color-text-primary);
  word-break: break-all;
  min-height: 40px;
}

/* API Tab Styles */
.api-tab {
  padding: var(--spacing-md);
  gap: var(--spacing-md);
}

.api-info {
  background: var(--color-bg-card);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.api-endpoint {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.endpoint-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.endpoint-url {
  font-size: 0.75rem;
  color: var(--color-accent-primary);
  background: var(--color-bg-primary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.create-client-section {
  background: var(--color-bg-card);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.client-count-input {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.client-count-input label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.count-input {
  width: 80px;
  padding: var(--spacing-sm);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-size: 0.85rem;
  text-align: center;
}

.count-input:focus {
  border-color: var(--color-accent-primary);
  outline: none;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.create-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--gradient-primary);
  color: var(--color-bg-primary);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.8rem;
  transition: all var(--transition-fast);
}

.create-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.create-btn:disabled {
  opacity: 0.7;
}

.preview-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  transition: all var(--transition-fast);
}

.preview-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-accent-secondary);
}

.results-section {
  background: var(--color-bg-card);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.results-list {
  max-height: 100px;
  overflow-y: auto;
}

.result-item {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.75rem;
  border-radius: var(--radius-sm);
  margin-bottom: 4px;
}

.result-item.success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-accent-success);
}

.result-item.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.preview-section {
  background: var(--color-bg-card);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copy-payload-btn {
  padding: 4px 8px;
  font-size: 0.7rem;
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.copy-payload-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.payload-preview {
  flex: 1;
  overflow-y: auto;
  background: var(--color-bg-primary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.65rem;
  line-height: 1.4;
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  max-height: 150px;
}

/* Footer */
.footer {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: center;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.footer-text {
  font-size: 0.65rem;
  color: var(--color-text-muted);
}
</style>
