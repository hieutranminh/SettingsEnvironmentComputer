/**
 * Speech Recognition Utility
 * Provides speech-to-text functionality using Web Speech API
 */

/**
 * Check if browser supports Web Speech API
 * @returns {boolean} True if browser supports speech recognition
 */
export function isSpeechRecognitionSupported() {
  return (
    typeof window !== 'undefined' &&
    (
      'webkitSpeechRecognition' in window ||
      'SpeechRecognition' in window
    )
  )
}

/**
 * Check if running on Safari mobile browser
 * Safari mobile handles microphone permission differently - it's handled automatically by Speech Recognition API
 * @returns {boolean} True if running on Safari mobile
 */
export function isSafariMobile() {
  if (typeof window === 'undefined' || !window.navigator) {
    return false
  }

  const userAgent = window.navigator.userAgent.toLowerCase()
  const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)
  const isMobile = /iphone|ipad|ipod/i.test(userAgent) ||
                   (window.navigator.maxTouchPoints > 0 && window.innerWidth <= 768)

  return isSafari && isMobile
}

/**
 * Check if microphone is available and accessible
 * @returns {Promise<boolean>} True if microphone is available
 */
export async function checkMicrophonePermission() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return false
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    // Stop the stream immediately after checking
    stream.getTracks().forEach(track => track.stop())
    return true
  } catch (error) {
    return false
  }
}

/**
 * Request microphone permission
 * @returns {Promise<void>} Resolves if permission granted
 */
export async function requestMicrophonePermission() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Microphone API not supported')
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  // Clean up stream immediately - we only need to check permission
  stream.getTracks().forEach(track => track.stop())
}

/**
 * Get SpeechRecognition instance
 * @returns {SpeechRecognition|webkitSpeechRecognition|null} SpeechRecognition instance or null
 */
function getSpeechRecognitionInstance() {
  if (typeof window === 'undefined') {
    return null
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    return null
  }

  return new SpeechRecognition()
}

/**
 * Map locale to speech recognition language code
 * @param {string} locale - i18n locale (e.g., 'en', 'ko', 'vi')
 * @returns {string} Speech recognition language code
 */
function getLanguageCode(locale) {
  const languageMap = {
    en: 'en-US',
    ko: 'ko-KR',
    vi: 'vi-VN',
  }

  return languageMap[locale] || 'en-US'
}

/**
 * Create and configure speech recognition instance
 * @param {Object} options - Configuration options
 * @param {string} options.locale - i18n locale for language setting
 * @param {Function} options.onResult - Callback for recognition results
 * @param {Function} options.onError - Callback for recognition errors
 * @param {Function} options.onStart - Callback when recognition starts
 * @param {Function} options.onEnd - Callback when recognition ends
 * @returns {SpeechRecognition|webkitSpeechRecognition|null} Configured recognition instance
 */
export function createSpeechRecognition(options) {
  const {
    locale = 'en',
    onResult = null,
    onError = null,
    onStart = null,
    onEnd = null,
  } = options

  if (!isSpeechRecognitionSupported()) {
    return null
  }

  const recognition = getSpeechRecognitionInstance()
  if (!recognition) {
    return null
  }

  const languageCode = getLanguageCode(locale)

  // Configure recognition
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = languageCode
  recognition.maxAlternatives = 1

  // Track state for Android/Samsung duplicate prevention
  let accumulatedFinalText = ''

  /**
   * Normalize text for comparison (lowercase, collapse whitespace)
   * @param {string} text - Text to normalize
   * @returns {string} - Normalized text
   */
  function normalizeText(text) {
    return (text || '').toLowerCase().replace(/\s+/g, ' ').trim()
  }

  /**
   * Find the longest common suffix of str1 that is a prefix of str2
   * e.g., str1="hello world", str2="world is great" -> "world"
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} - Length of overlap in str1
   */
  function findOverlapLength(str1, str2) {
    const norm1 = normalizeText(str1)
    const norm2 = normalizeText(str2)

    // Check from longest possible overlap to shortest
    const maxLen = Math.min(norm1.length, norm2.length)
    for (let len = maxLen; len > 0; len--) {
      const suffix = norm1.slice(-len)
      if (norm2.startsWith(suffix)) {
        return len
      }
    }
    return 0
  }

  /**
   * Check if newText is already contained in existingText
   * @param {string} existingText - Text we already have
   * @param {string} newText - New text to check
   * @returns {boolean} - True if duplicate
   */
  function isDuplicate(existingText, newText) {
    const normExisting = normalizeText(existingText)
    const normNew = normalizeText(newText)

    if (!normNew) return true
    if (!normExisting) return false

    // Exact match
    if (normExisting === normNew) return true

    // New text is contained in existing
    if (normExisting.includes(normNew)) return true

    // Existing ends with new text
    if (normExisting.endsWith(normNew)) return true

    return false
  }

  /**
   * Extract the non-overlapping part from newText
   * @param {string} existingText - Text we already have
   * @param {string} newText - New text to check
   * @returns {string|null} - New part to add, or null if nothing new
   */
  function extractNewPart(existingText, newText) {
    if (!newText || !newText.trim()) return null
    if (!existingText || !existingText.trim()) return newText.trim()

    const normExisting = normalizeText(existingText)
    const normNew = normalizeText(newText)

    // Check if duplicate
    if (isDuplicate(existingText, newText)) return null

    // Case 1: newText starts with existingText (cumulative result)
    // e.g., existing="Hello", new="Hello my name" -> return "my name"
    if (normNew.startsWith(normExisting)) {
      const newPart = newText.trim().slice(existingText.trim().length).trim()
      return newPart || null
    }

    // Case 2: Find overlap between end of existing and start of new
    // e.g., existing="Hello my", new="my name is" -> return "name is"
    const overlapLen = findOverlapLength(existingText, newText)
    if (overlapLen > 0) {
      // Find the actual position in original newText (not normalized)
      const normNewText = normalizeText(newText)
      const overlapText = normNewText.slice(0, overlapLen)

      // Find where overlap ends in original newText
      let pos = 0
      let matched = 0
      const newTextLower = newText.toLowerCase()
      while (pos < newText.length && matched < overlapText.length) {
        if (newTextLower[pos] === overlapText[matched]) {
          matched++
        } else if (newText[pos] !== ' ') {
          // Non-space character that doesn't match - this shouldn't happen
          break
        }
        pos++
      }

      const newPart = newText.slice(pos).trim()
      return newPart || null
    }

    // Case 3: Check if existing text contains the start of new text
    // e.g., existing="Hello my name", new="name is Hieu" -> return "is Hieu"
    const words = newText.trim().split(/\s+/)
    for (let skipWords = 1; skipWords < words.length; skipWords++) {
      const partialNew = words.slice(skipWords).join(' ')
      const skippedPart = words.slice(0, skipWords).join(' ')

      // Check if the skipped part is already in existing
      if (normalizeText(existingText).includes(normalizeText(skippedPart))) {
        // Verify the rest is actually new
        if (!isDuplicate(existingText, partialNew)) {
          return partialNew
        }
      }
    }

    // No overlap found - return the whole new text
    return newText.trim()
  }

  // Set up event handlers
  if (onStart) {
    recognition.onstart = onStart
  }

  if (onResult) {
    recognition.onresult = (event) => {
      let interimTranscript = ''

      // Process all final results
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i]
        const transcript = result[0].transcript.trim()

        if (result.isFinal) {
          // Extract only the new, non-duplicate part
          const newPart = extractNewPart(accumulatedFinalText, transcript)

          if (newPart) {
            accumulatedFinalText = accumulatedFinalText
              ? accumulatedFinalText + ' ' + newPart
              : newPart
          }
        } else {
          // Interim results - always use the latest
          interimTranscript = transcript
        }
      }

      onResult({
        interimTranscript:   interimTranscript,
        fullFinalTranscript: accumulatedFinalText,
      })
    }
  }

  if (onError) {
    recognition.onerror = (event) => {
      let errorMessage = 'Speech recognition error occurred'

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected'
          break
        case 'aborted':
          errorMessage = 'Speech recognition aborted'
          break
        case 'audio-capture':
          errorMessage = 'Microphone not accessible'
          break
        case 'network':
          errorMessage = 'Network error occurred'
          break
        case 'not-allowed':
          errorMessage = 'Microphone permission denied'
          break
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service not allowed'
          break
        case 'bad-grammar':
          errorMessage = 'Bad grammar in speech recognition'
          break
        case 'language-not-supported':
          errorMessage = 'Language not supported'
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }

      onError({
        error:   event.error,
        message: errorMessage,
      })
    }
  }

  if (onEnd) {
    recognition.onend = onEnd
  }

  return recognition
}

/**
 * Start speech recognition
 * @param {SpeechRecognition|webkitSpeechRecognition} recognition - Recognition instance
 * @returns {Promise<void>}
 */
export async function startRecognition(recognition) {
  if (!recognition) {
    throw new Error('Speech recognition not initialized')
  }

  try {
    recognition.start()
  } catch (error) {
    // If recognition is already running, ignore the error
    if (error.name !== 'InvalidStateError') {
      throw error
    }
  }
}

/**
 * Abort speech recognition
 * @param {SpeechRecognition|webkitSpeechRecognition} recognition - Recognition instance
 */
export function abortRecognition(recognition) {
  if (!recognition) {
    return
  }

  try {
    recognition.abort()
  } catch (error) {
    // Ignore errors when aborting
  }
}

