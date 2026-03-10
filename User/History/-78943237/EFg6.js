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

  // Detect Samsung device
  const isSamsungDevice = typeof window !== 'undefined' &&
    /samsung|sm-|galaxy/i.test(window.navigator.userAgent)

  // Track state for Android/Samsung duplicate prevention
  let accumulatedFinalText = ''
  let lastResultsLength = 0
  let processedExactTranscripts = new Set()
  let recentFinalTexts = [] // Samsung fix: track recent finals with timestamps

  /**
   * Normalize text for comparison
   * @param {string} text - Text to normalize
   * @returns {string} - Normalized text
   */
  function normalize(text) {
    return (text || '').toLowerCase().replace(/\s+/g, ' ').trim()
  }

  /**
   * Samsung-specific: Check if text is similar to any recent final
   * Samsung often sends slightly modified duplicates
   * @param {string} text - Text to check
   * @returns {boolean} - True if similar to recent
   */
  function isSimilarToRecent(text) {
    if (!isSamsungDevice) return false
    if (!text) return false

    const normText = normalize(text)
    if (!normText) return false

    const now = Date.now()

    // Clean old entries (older than 2 seconds - shorter window)
    recentFinalTexts = recentFinalTexts.filter(item => now - item.time < 2000)

    // No recent texts - not similar
    if (recentFinalTexts.length === 0) return false

    for (const recent of recentFinalTexts) {
      const recentNorm = recent.text

      // Exact match
      if (recentNorm === normText) return true

      // One contains the other - only check if lengths are similar
      const lengthRatio = Math.min(recentNorm.length, normText.length) / Math.max(recentNorm.length, normText.length)
      if (lengthRatio > 0.5 && (recentNorm.includes(normText) || normText.includes(recentNorm))) {
        // Only skip if they're very similar (>70% of words match)
        const recentWords = recentNorm.split(' ')
        const newWords = normText.split(' ')
        let matchCount = 0
        for (const word of newWords) {
          if (recentWords.includes(word)) matchCount++
        }
        const similarity = matchCount / Math.max(newWords.length, 1)
        if (similarity > 0.7) return true
      }
    }

    return false
  }

  /**
   * Add text to recent finals list (Samsung fix)
   * @param {string} text - Text to add
   */
  function addToRecent(text) {
    if (!isSamsungDevice) return

    recentFinalTexts.push({
      text: normalize(text),
      time: Date.now(),
    })

    // Keep list manageable
    if (recentFinalTexts.length > 20) {
      recentFinalTexts = recentFinalTexts.slice(-10)
    }
  }

  /**
   * Check if transcript is exact duplicate of accumulated or already processed
   * @param {string} transcript - Transcript to check
   * @returns {boolean} - True if exact duplicate
   */
  function isExactDuplicate(transcript) {
    const norm = normalize(transcript)
    const normAccum = normalize(accumulatedFinalText)

    // Empty transcript is always duplicate
    if (!norm) return true

    // No accumulated text yet - not a duplicate
    if (!normAccum) return false

    // Exact match with accumulated
    if (norm === normAccum) return true

    // Already processed this exact transcript
    if (processedExactTranscripts.has(norm)) return true

    // Accumulated already contains this transcript (only if accumulated is longer)
    if (normAccum.length > norm.length && normAccum.includes(norm)) return true

    // Samsung: Check similarity to recent finals
    if (isSimilarToRecent(transcript)) return true

    return false
  }

  /**
   * Extract new content from transcript
   * @param {string} transcript - New transcript
   * @returns {string|null} - New content to add, or null
   */
  function extractNewContent(transcript) {
    if (!transcript) return null

    const normTranscript = normalize(transcript)
    const normAccum = normalize(accumulatedFinalText)

    // No accumulated text yet - return full transcript
    if (!normAccum) return transcript

    // Exact duplicate
    if (isExactDuplicate(transcript)) return null

    // Case: Cumulative result - transcript starts with accumulated text
    // e.g., accumulated="Hello", transcript="Hello world" -> return "world"
    if (normTranscript.startsWith(normAccum + ' ')) {
      const newPart = transcript.trim().slice(accumulatedFinalText.trim().length).trim()
      return newPart || null
    }

    // Samsung fix: Check if accumulated starts with transcript (reverse cumulative)
    // This happens when Samsung resends earlier parts
    if (normAccum.startsWith(normTranscript)) {
      return null
    }

    // Case: Partial overlap - find overlap between end of accumulated and start of transcript
    const accumWords = normAccum.split(' ')
    const transcriptWords = normTranscript.split(' ')
    const originalWords = transcript.trim().split(/\s+/)

    for (let overlap = Math.min(accumWords.length, transcriptWords.length); overlap > 0; overlap--) {
      const accumEnd = accumWords.slice(-overlap).join(' ')
      const transcriptStart = transcriptWords.slice(0, overlap).join(' ')

      if (accumEnd === transcriptStart) {
        // Found overlap - return only new words
        if (transcriptWords.length > overlap) {
          return originalWords.slice(overlap).join(' ')
        }
        return null
      }
    }

    // Samsung fix: Check if any segment of transcript is already in accumulated
    // Samsung sometimes sends "word1 word2" when accumulated already has "word1"
    if (isSamsungDevice && transcriptWords.length > 1) {
      let skipWords = 0
      for (let i = 0; i < transcriptWords.length; i++) {
        const partialTranscript = transcriptWords.slice(0, i + 1).join(' ')
        if (normAccum.endsWith(partialTranscript)) {
          skipWords = i + 1
        }
      }
      if (skipWords > 0 && skipWords < transcriptWords.length) {
        return originalWords.slice(skipWords).join(' ')
      }
    }

    // No overlap - return full transcript
    return transcript
  }

  // Set up event handlers
  if (onStart) {
    recognition.onstart = onStart
  }

  if (onResult) {
    recognition.onresult = (event) => {
      let interimTranscript = ''

      // Detect if results array was reset (Android behavior)
      const resultsReset = event.results.length < lastResultsLength
      if (resultsReset) {
        // Results were reset - clear processed set but keep accumulated text
        processedExactTranscripts.clear()
      }
      lastResultsLength = event.results.length

      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i]
        const transcript = result[0].transcript.trim()

        if (result.isFinal) {
          const normTranscript = normalize(transcript)

          // Skip if already processed this exact transcript
          if (processedExactTranscripts.has(normTranscript)) {
            continue
          }

          // Extract new content
          const newContent = extractNewContent(transcript)

          if (newContent) {
            accumulatedFinalText = accumulatedFinalText
              ? accumulatedFinalText + ' ' + newContent
              : newContent

            // Samsung: Add to recent for similarity checking
            addToRecent(transcript)
          }

          // Mark as processed
          processedExactTranscripts.add(normTranscript)

          // Keep set manageable
          if (processedExactTranscripts.size > 100) {
            const arr = Array.from(processedExactTranscripts)
            processedExactTranscripts = new Set(arr.slice(-50))
          }
        } else {
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

