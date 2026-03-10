// Test file for console.log and debugger rules

export function developmentDebugging() {
  // ⚠️ WARN in development, ❌ ERROR in production
  console.log('This is for debugging')
  console.warn('Warning message')
  console.error('Error message')
  console.info('Info message')

  // ⚠️ WARN in development, ❌ ERROR in production
  debugger // This will be flagged in production

  // ⚠️ WARN in development, ❌ ERROR in production
  alert('This should not be in production')

  return 'Debug function executed'
}

// ✅ GOOD: Using proper logging in production
export function productionLogging() {
  // Use proper logging library instead of console.log
  // Example: using a logging service
  const logMessage = (level: string, message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${level}] ${message}`)
    } else {
      // Send to logging service in production
      // sendToLoggingService(level, message)
    }
  }

  logMessage('INFO', 'This is proper logging')

  return 'Production logging executed'
}

// ✅ GOOD: Conditional debugging
export function conditionalDebugging() {
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment) {
    console.log('This only shows in development')
  }

  // Better: Use environment check
  if (import.meta.env.DEV) {
    console.log('Vite development mode')
  }

  return 'Conditional debugging executed'
}

// Examples of what NOT to leave in production code:
export function badProductionCode() {
  // ❌ These will cause ESLint errors in production:
  console.log('User data:', { userId: 123, password: 'secret' })
  debugger // Performance killer in production
  alert('Debug info') // Bad UX in production

  // ❌ Performance issues:
  console.time('operation')
  // ... some operation
  console.timeEnd('operation')

  return 'Bad production code'
}
