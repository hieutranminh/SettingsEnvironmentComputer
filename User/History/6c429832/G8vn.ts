// Content Script - Runs in the context of web pages
// Handles form field detection and data injection

import type { ContentMessage } from '../types'

// Track the currently focused element
let focusedElement: HTMLInputElement | HTMLTextAreaElement | null = null

// Listen for focus events on input elements
document.addEventListener(
  'focusin',
  (event: FocusEvent): void => {
    const target = event.target as HTMLElement
    if (isEditableElement(target)) {
      focusedElement = target as HTMLInputElement | HTMLTextAreaElement
    }
  },
  true
)

document.addEventListener(
  'focusout',
  (): void => {
    // Delay clearing to allow context menu to work
    setTimeout((): void => {
      focusedElement = null
    }, 100)
  },
  true
)

// Check if element is editable
function isEditableElement(element: HTMLElement): boolean {
  if (!element) return false

  const tagName = element.tagName.toLowerCase()
  if (tagName === 'input') {
    const inputType = (element as HTMLInputElement).type.toLowerCase()
    const editableTypes = ['text', 'email', 'password', 'search', 'tel', 'url', 'number']
    return editableTypes.includes(inputType)
  }

  if (tagName === 'textarea') return true
  if (element.isContentEditable) return true

  return false
}

// Fill input with generated data
function fillInput(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  // Set the value
  element.value = value

  // Dispatch events to trigger any listeners
  element.dispatchEvent(new Event('input', { bubbles: true }))
  element.dispatchEvent(new Event('change', { bubbles: true }))

  // For React apps
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(element, value)
    element.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(
  (message: ContentMessage, _sender: chrome.runtime.MessageSender, sendResponse: (response: { success: boolean }) => void): boolean => {
    if (message.action === 'fillInput' && focusedElement) {
      fillInput(focusedElement, message.data)
      sendResponse({ success: true })
    }

    if (message.action === 'fillForm' && message.formData) {
      fillFormFields(message.formData)
      sendResponse({ success: true })
    }

    return true
  }
)

// Auto-detect and fill form fields based on their attributes
function fillFormFields(formData: Record<string, string>): void {
  const inputs = document.querySelectorAll('input, textarea')

  inputs.forEach((input): void => {
    const element = input as HTMLInputElement | HTMLTextAreaElement
    const name = element.name?.toLowerCase() || ''
    const id = element.id?.toLowerCase() || ''
    const placeholder = element.placeholder?.toLowerCase() || ''
    const type = (element as HTMLInputElement).type?.toLowerCase() || ''

    // Match fields based on common patterns
    const fieldIdentifier = `${name} ${id} ${placeholder} ${type}`

    if (matchesPattern(fieldIdentifier, ['email', 'e-mail', 'mail'])) {
      if (formData.email) fillInput(element, formData.email)
    } else if (matchesPattern(fieldIdentifier, ['firstname', 'first_name', 'first-name', 'fname'])) {
      if (formData.firstName) fillInput(element, formData.firstName)
    } else if (matchesPattern(fieldIdentifier, ['lastname', 'last_name', 'last-name', 'lname'])) {
      if (formData.lastName) fillInput(element, formData.lastName)
    } else if (matchesPattern(fieldIdentifier, ['fullname', 'full_name', 'full-name', 'name'])) {
      if (formData.fullName) fillInput(element, formData.fullName)
    } else if (matchesPattern(fieldIdentifier, ['phone', 'tel', 'mobile', 'cell'])) {
      if (formData.phone) fillInput(element, formData.phone)
    } else if (matchesPattern(fieldIdentifier, ['address', 'street'])) {
      if (formData.address) fillInput(element, formData.address)
    } else if (matchesPattern(fieldIdentifier, ['city', 'town'])) {
      if (formData.city) fillInput(element, formData.city)
    } else if (matchesPattern(fieldIdentifier, ['zip', 'postal', 'postcode'])) {
      if (formData.zipCode) fillInput(element, formData.zipCode)
    } else if (matchesPattern(fieldIdentifier, ['country'])) {
      if (formData.country) fillInput(element, formData.country)
    } else if (matchesPattern(fieldIdentifier, ['company', 'organization', 'org'])) {
      if (formData.company) fillInput(element, formData.company)
    } else if (matchesPattern(fieldIdentifier, ['username', 'user_name', 'user-name', 'login'])) {
      if (formData.username) fillInput(element, formData.username)
    } else if (matchesPattern(fieldIdentifier, ['password', 'pass', 'pwd'])) {
      if (formData.password) fillInput(element, formData.password)
    }
  })
}

// Helper function to match patterns
function matchesPattern(text: string, patterns: string[]): boolean {
  return patterns.some((pattern): boolean => text.includes(pattern))
}

// Inject floating button for quick access (optional feature)
function injectQuickAccessButton(): void {
  const button = document.createElement('div')
  button.id = 'fake-data-generator-btn'
  button.innerHTML = '🎲'
  button.title = 'Generate Fake Data'
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    z-index: 999999;
    transition: transform 0.2s, box-shadow 0.2s;
    user-select: none;
  `

  button.addEventListener('mouseenter', (): void => {
    button.style.transform = 'scale(1.1)'
    button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
  })

  button.addEventListener('mouseleave', (): void => {
    button.style.transform = 'scale(1)'
    button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
  })

  button.addEventListener('click', (): void => {
    // Open popup or trigger form fill
    chrome.runtime.sendMessage({ action: 'openPopup' })
  })

  document.body.appendChild(button)
}

// Initialize content script
function init(): void {
  console.log('Fake Data Generator content script loaded')
  // Uncomment to enable floating button
  // injectQuickAccessButton()
}

init()

export {}

