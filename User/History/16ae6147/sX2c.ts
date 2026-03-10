import { ref, onMounted } from 'vue'

export const useDarkMode = (): unknown => {
  const isDark = ref(false)
  const darkModeClass = 'app-dark'

  // Initialize dark mode from localStorage or system preference
  const initializeDarkMode = (): void => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      isDark.value = JSON.parse(stored)
    } else {
      // Use system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateDarkModeClass()
  }

  // Update DOM class
  const updateDarkModeClass = (): void => {
    if (isDark.value) {
      document.documentElement.classList.add(darkModeClass)
    } else {
      document.documentElement.classList.remove(darkModeClass)
    }
  }

  // Toggle dark mode
  const toggle = (): void => {
    isDark.value = !isDark.value
    localStorage.setItem('darkMode', JSON.stringify(isDark.value))
    updateDarkModeClass()
  }

  // Set dark mode
  const setDarkMode = (value: boolean): void => {
    isDark.value = value
    localStorage.setItem('darkMode', JSON.stringify(isDark.value))
    updateDarkModeClass()
  }

  // Listen for system changes
  const watchSystemChanges = (): void => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (localStorage.getItem('darkMode') === null) {
        isDark.value = e.matches
        updateDarkModeClass()
      }
    })
  }

  onMounted(() => {
    initializeDarkMode()
    watchSystemChanges()
  })

  return {
    isDark,
    toggle,
    setDarkMode,
  }
}
