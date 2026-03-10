import { ref, computed } from 'vue'

interface LoadingState {
  [key: string]: boolean
}

const loadingStates = ref<LoadingState>({})

export const useLoadingState = () => {
  const setLoading = (key: string, loading: boolean): void => {
    loadingStates.value[key] = loading
  }

  const isLoading = (key: string): boolean => {
    return loadingStates.value[key] || false
  }

  const getLoadingKeys = computed(() => Object.keys(loadingStates.value))

  const hasAnyLoading = computed(() => Object.values(loadingStates.value).some(Boolean))

  const clearLoading = (key?: string): void => {
    if (key) {
      delete loadingStates.value[key]
    } else {
      loadingStates.value = {}
    }
  }

  return {
    setLoading,
    isLoading,
    getLoadingKeys,
    hasAnyLoading,
    clearLoading,
  }
}
