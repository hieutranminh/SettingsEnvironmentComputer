// Chrome Extension Storage Utilities
// Handles persistent storage operations

import type { ExtensionSettings, GeneratedHistoryItem, StorageData } from '../types'

const DEFAULT_SETTINGS: ExtensionSettings = {
  locale: 'en',
  showFloatingButton: false,
  autoDetectFields: true,
  recentDataTypes: [],
  favorites: ['fullName', 'email', 'phone', 'address'],
}

const MAX_HISTORY_ITEMS = 100

// Get settings from storage
export async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.sync.get('settings')
  return { ...DEFAULT_SETTINGS, ...result.settings }
}

// Save settings to storage
export async function saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
  const currentSettings = await getSettings()
  const newSettings = { ...currentSettings, ...settings }
  await chrome.storage.sync.set({ settings: newSettings })
}

// Get history from storage
export async function getHistory(): Promise<GeneratedHistoryItem[]> {
  const result = await chrome.storage.local.get('history')
  return result.history || []
}

// Add item to history
export async function addToHistory(item: Omit<GeneratedHistoryItem, 'id' | 'timestamp'>): Promise<void> {
  const history = await getHistory()

  const newItem: GeneratedHistoryItem = {
    ...item,
    id: generateId(),
    timestamp: Date.now(),
  }

  // Add to beginning and limit size
  const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS)
  await chrome.storage.local.set({ history: updatedHistory })
}

// Clear history
export async function clearHistory(): Promise<void> {
  await chrome.storage.local.set({ history: [] })
}

// Delete specific history item
export async function deleteHistoryItem(id: string): Promise<void> {
  const history = await getHistory()
  const updatedHistory = history.filter((item): boolean => item.id !== id)
  await chrome.storage.local.set({ history: updatedHistory })
}

// Update recent data types
export async function updateRecentDataTypes(dataType: string): Promise<void> {
  const settings = await getSettings()
  const recent = settings.recentDataTypes.filter((t): boolean => t !== dataType)
  recent.unshift(dataType as ExtensionSettings['recentDataTypes'][number])

  // Keep only last 5
  const updatedRecent = recent.slice(0, 5)
  await saveSettings({ recentDataTypes: updatedRecent })
}

// Toggle favorite
export async function toggleFavorite(dataType: string): Promise<boolean> {
  const settings = await getSettings()
  const favorites = [...settings.favorites]
  const index = favorites.indexOf(dataType as ExtensionSettings['favorites'][number])

  if (index === -1) {
    favorites.push(dataType as ExtensionSettings['favorites'][number])
  } else {
    favorites.splice(index, 1)
  }

  await saveSettings({ favorites })
  return index === -1 // Returns true if added, false if removed
}

// Check if data type is favorite
export async function isFavorite(dataType: string): Promise<boolean> {
  const settings = await getSettings()
  return settings.favorites.includes(dataType as ExtensionSettings['favorites'][number])
}

// Get all storage data
export async function getAllStorageData(): Promise<StorageData> {
  const [settings, history] = await Promise.all([getSettings(), getHistory()])
  return { settings, history }
}

// Clear all storage data
export async function clearAllData(): Promise<void> {
  await Promise.all([
    chrome.storage.sync.clear(),
    chrome.storage.local.clear(),
  ])
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

