// Background Service Worker for Chrome Extension
// Handles context menus, messaging, and background tasks

import { generateFakeData } from '../utils/fakeDataGenerator'
import type { FakeDataType, GeneratedData, MessageRequest, MessageResponse } from '../types'

// Create context menu items when extension is installed
chrome.runtime.onInstalled.addListener((): void => {
  console.log('Fake Data Generator extension installed')

  // Create parent context menu
  chrome.contextMenus.create({
    id: 'fake-data-generator',
    title: 'Generate Fake Data',
    contexts: ['editable'],
  })

  // Create sub-menu items for different data types
  const dataTypes: Array<{ id: FakeDataType; title: string }> = [
    { id: 'fullName', title: 'Full Name' },
    { id: 'firstName', title: 'First Name' },
    { id: 'lastName', title: 'Last Name' },
    { id: 'email', title: 'Email' },
    { id: 'phone', title: 'Phone Number' },
    { id: 'address', title: 'Address' },
    { id: 'city', title: 'City' },
    { id: 'country', title: 'Country' },
    { id: 'zipCode', title: 'Zip Code' },
    { id: 'company', title: 'Company' },
    { id: 'jobTitle', title: 'Job Title' },
    { id: 'username', title: 'Username' },
    { id: 'password', title: 'Password' },
    { id: 'creditCard', title: 'Credit Card' },
    { id: 'date', title: 'Date' },
    { id: 'uuid', title: 'UUID' },
    { id: 'lorem', title: 'Lorem Ipsum' },
  ]

  dataTypes.forEach((item): void => {
    chrome.contextMenus.create({
      id: `generate-${item.id}`,
      parentId: 'fake-data-generator',
      title: item.title,
      contexts: ['editable'],
    })
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab): void => {
  if (!tab?.id) return

  const menuItemId = info.menuItemId as string
  if (menuItemId.startsWith('generate-')) {
    const dataType = menuItemId.replace('generate-', '') as FakeDataType
    const fakeData = generateFakeData(dataType)

    // Send message to content script to fill the input
    chrome.tabs.sendMessage(tab.id, {
      action: 'fillInput',
      data: fakeData,
    })
  }
})

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener(
  (
    request: MessageRequest,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ): boolean => {
    if (request.action === 'generateData') {
      const dataType = request.dataType as FakeDataType
      const data = generateFakeData(dataType) as GeneratedData
      sendResponse({ success: true, data })
    }

    if (request.action === 'generateMultiple') {
      const dataTypes = request.dataTypes as FakeDataType[]
      const results: Record<string, GeneratedData> = {}
      dataTypes.forEach((type): void => {
        results[type] = generateFakeData(type) as GeneratedData
      })
      sendResponse({ success: true, data: results })
    }

    // Return true to indicate async response
    return true
  }
)

export {}

