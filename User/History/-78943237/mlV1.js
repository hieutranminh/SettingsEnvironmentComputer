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
  let processedTranscriptHashes = new Set() // Track processed transcripts by hash

  /**
   * Normalize text for comparison (lowercase, collapse whitespace, remove punctuation)
   * @param {string} text - Text to normalize
   * @returns {string} - Normalized text
   */
  function normalizeForComparison(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[.,!?;:'"]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  /**
   * Create a simple hash for a transcript to track if we've seen it
   * @param {string} text - Text to hash
   * @returns {string} - Hash string
   */
  function hashTranscript(text) {
    return normalizeForComparison(text)
  }

  /**
   * Check if this transcript was already processed
   * @param {string} transcript - Transcript to check
   * @returns {boolean} - True if already processed
   */
  function wasAlreadyProcessed(transcript) {
    const hash = hashTranscript(transcript)
    if (processedTranscriptHashes.has(hash)) {
      return true
    }
    // Also check if any existing hash contains this or vice versa
    for (const existingHash of processedTranscriptHashes) {
      if (existingHash.includes(hash) || hash.includes(existingHash)) {
        return true
      }
    }
    return false
  }

  /**
   * Mark transcript as processed
   * @param {string} transcript - Transcript to mark
   */
  function markAsProcessed(transcript) {
    const hash = hashTranscript(transcript)
    processedTranscriptHashes.add(hash)
    // Keep set size manageable
    if (processedTranscriptHashes.size > 50) {
      const arr = Array.from(processedTranscriptHashes)
      processedTranscriptHashes = new Set(arr.slice(-25))
    }
  }

  /**
   * Check if text is a duplicate of accumulated text
   * @param {string} accumulated - Accumulated text
   * @param {string} newText - New text to check
   * @returns {boolean} - True if duplicate
   */
  function isDuplicateOfAccumulated(accumulated, newText) {
    const normAccum = normalizeForComparison(accumulated)
    const normNew = normalizeForComparison(newText)

    if (!normNew) return true
    if (!normAccum) return false

    // Exact match
    if (normAccum === normNew) return true

    // Accumulated contains new text
    if (normAccum.includes(normNew)) return true

    // Accumulated ends with new text
    if (normAccum.endsWith(normNew)) return true

    // New text starts with accumulated (cumulative but no new content)
    if (normNew === normAccum) return true

    return false
  }

  /**
   * Extract the non-overlapping part from newText
   * @param {string} existingText - Text we already have
   * @param {string} newText - New text to check
   * @returns {string|null} - New part to add, or null if duplicate
   */
  function extractNonOverlappingPart(existingText, newText) {
    if (!newText) return null
    if (!existingText) return newText

    const normExisting = normalizeForComparison(existingText)
    const normNew = normalizeForComparison(newText)

    // Check if it's a duplicate first
    if (isDuplicateOfAccumulated(existingText, newText)) {
      return null
    }

    // Case: newText contains existingText at start (cumulative)
    // e.g., existing="Hello", new="Hello my name" -> return "my name"
    if (normNew.startsWith(normExisting)) {
      const newWords = normNew.split(' ')
      const existingWords = normExisting.split(' ')
      const newPart = newWords.slice(existingWords.length).join(' ')
      if (newPart) {
        // Get original case from newText
        const originalWords = newText.trim().split(/\s+/)
        return originalWords.slice(existingWords.length).join(' ')
      }
      return null
    }

    // Case: Check for word-level overlap at the end of existingText and start of newText
    // e.g., existing="Hello my", new="my name is" -> return "name is"
    const existingWords = normExisting.split(' ')
    const newWords = normNew.split(' ')

    for (let overlapLen = Math.min(existingWords.length, newWords.length, 10); overlapLen > 0; overlapLen--) {
      const endOfExisting = existingWords.slice(-overlapLen).join(' ')
      const startOfNew = newWords.slice(0, overlapLen).join(' ')

      if (endOfExisting === startOfNew) {
        const remainingNewWords = newWords.slice(overlapLen)
        if (remainingNewWords.length > 0) {
          // Get original case from newText
          const originalWords = newText.trim().split(/\s+/)
          return originalWords.slice(overlapLen).join(' ')
        }
        return null
      }
    }

    // No overlap found - return the whole new text
    return newText
  }

  // Set up event handlers
  if (onStart) {
    recognition.onstart = onStart
  }

  if (onResult) {
    recognition.onresult = (event) => {
      let interimTranscript = ''

      // Process all final results, using content-based deduplication
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i]
        const transcript = result[0].transcript.trim()

        if (result.isFinal) {
          // Skip if we've already processed this exact transcript
          if (wasAlreadyProcessed(transcript)) {
            continue
          }

          // Extract only the non-overlapping, non-duplicate part
          const newPart = extractNonOverlappingPart(accumulatedFinalText, transcript)

          if (newPart) {
            accumulatedFinalText = accumulatedFinalText
              ? accumulatedFinalText + ' ' + newPart
              : newPart
          }

          // Mark this transcript as processed (regardless of whether we added it)
          markAsProcessed(transcript)
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

