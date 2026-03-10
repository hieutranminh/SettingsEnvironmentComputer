interface RetryConfig {
  maxRetries: number
  delay: number
  backoffMultiplier: number
  retryableStatuses: number[]
}

const defaultConfig: RetryConfig = {
  maxRetries: 3,
  delay: 1000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
}

export const createRetryableRequest = <T>(
  requestFn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> => {
  const finalConfig = { ...defaultConfig, ...config }

  const attempt = async (retryCount: number): Promise<T> => {
    try {
      return await requestFn()
    } catch (error) {
      const apiError = error as { status?: number }

      // Check if we should retry
      const shouldRetry = retryCount < finalConfig.maxRetries &&
        finalConfig.retryableStatuses.includes(apiError.status || 0)

      if (!shouldRetry) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = finalConfig.delay * Math.pow(finalConfig.backoffMultiplier, retryCount)

      await new Promise(resolve => setTimeout(resolve, delay))

      return attempt(retryCount + 1)
    }
  }

  return attempt(0)
}
