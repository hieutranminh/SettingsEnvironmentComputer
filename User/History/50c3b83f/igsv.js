// Utils
import {
  isSpeechRecognitionSupported,
  isSafariMobile,
  checkMicrophonePermission,
  requestMicrophonePermission,
  createSpeechRecognition,
  startRecognition,
  abortRecognition,
} from 'SpeechRecognitionHelpers'
// Components
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Auto-stop voice recognition after user finishes speaking
// Note: Browser handles initial silence automatically (~5-7s if no speech detected)
const SILENCE_TIMEOUT_MS = 2000 // Timeout after user has spoken and paused

export default {
  extends: ComponentBase,

  data() {
    return {
      speechRecognition:         null,
      isInitializingRecognition: false,
      basePrompt:                '',
      fullFinalTranscript:       '',
      callbacks:                 null,
      silenceTimeoutId:          null,
      hasSpeechDetected:         false,
    }
  },

  methods: {
    /**
     * Check if recognition instance is valid and component is active
     * @param {Object} recognition - Recognition instance to validate
     * @returns {boolean}
     */
    _isValidRecognition(recognition) {
      return this._isComponentActive() && this.speechRecognition === recognition
    },

    /**
     * Reset initialization state
     */
    _resetInitState() {
      this.isInitializingRecognition = false
      this.callbacks = null
    },

    /**
     * Start or reset the silence timer after user has spoken
     * Ends recognition if user stops speaking for SILENCE_TIMEOUT_MS
     */
    _startSilenceTimer() {
      this._clearSilenceTimer()
      this.silenceTimeoutId = setTimeout(() => {
        if (this.speechRecognition) {
          // Save callback reference before cleanup (cleanup sets callbacks to null)
          const onEndCallback = this.callbacks?.onEnd
          this.$mixinSpeechRecognition_cleanup()
          onEndCallback?.()
        }
      }, SILENCE_TIMEOUT_MS)
    },

    /**
     * Clear the silence timer
     */
    _clearSilenceTimer() {
      if (this.silenceTimeoutId) {
        clearTimeout(this.silenceTimeoutId)
        this.silenceTimeoutId = null
      }
    },

    /**
     * Build updated text from transcripts
     * @param {string} fullFinalTranscript - Full final transcript (rebuilt from all results)
     * @param {string} interimTranscript - Current interim transcript
     * @returns {string}
     */
    _buildUpdatedText(fullFinalTranscript, interimTranscript) {
      const parts = [this.basePrompt, fullFinalTranscript, interimTranscript]
        .filter(part => part && part.trim().length > 0)
      return parts.join(' ').trim()
    },

    /**
     * Get enhanced error message for recognition errors
     * @param {Object} errorData - Error data from recognition
     * @returns {string}
     */
    _getErrorMessage(errorData) {
      const errorMap = {
        'not-allowed':   'aha-ai.error.microphone-permission-denied',
        'audio-capture': 'aha-ai.error.microphone-permission-denied',
        'network':       'aha-ai.error.network-error',
      }

      const errorKey = errorMap[errorData.error]
      if (errorKey) {
        return this.$t(errorKey) || errorData.message
      }

      return errorData.message
    },

    /**
     * Handle error with consistent formatting
     * @param {Function} onError - Error callback
     * @param {string} errorKey - Translation key for error message
     * @param {string} fallbackMessage - Fallback error message
     */
    _handleRecognitionError(onError, errorKey, fallbackMessage) {
      if (onError) {
        const errorMessage = this.$t(errorKey) || fallbackMessage
        onError(new Error(errorMessage))
      }
    },

    /**
     * Check and request microphone permission
     * On Safari mobile, permission is handled automatically by Speech Recognition API
     * @param {Function} onError - Error callback
     * @returns {Promise<boolean>} True if permission granted
     */
    async _checkAndRequestPermission(onError) {
      // Safari mobile handles permission automatically via Speech Recognition API
      // Skip manual permission check to avoid false negative errors
      if (isSafariMobile()) {
        return true
      }

      const hasPermission = await checkMicrophonePermission()
      if (hasPermission) {
        return true
      }

      try {
        await requestMicrophonePermission()
        return true
      } catch (permissionError) {
        this._handleRecognitionError(
          onError,
          'aha-ai.error.microphone-permission-denied',
          'Microphone permission denied',
        )
        return false
      }
    },

    /**
     * Handle onStart callback
     * @param {Object} recognition - Recognition instance
     */
    _handleOnStart(recognition) {
      if (!this._isValidRecognition(recognition)) {
        return
      }

      this.isInitializingRecognition = false
      // Note: Don't start silence timer here - browser handles initial silence automatically
      this.callbacks?.onStart?.()
    },

    /**
     * Handle onResult callback
     * @param {Object} recognition - Recognition instance
     * @param {Object} result - Recognition result
     */
    _handleOnResult(recognition, result) {
      if (!this._isValidRecognition(recognition)) {
        return
      }

      // Mark that speech has been detected
      this.hasSpeechDetected = true

      // Store full final transcript (rebuilt from all results to avoid duplicates on Android/Samsung)
      if (result.fullFinalTranscript) {
        this.fullFinalTranscript = result.fullFinalTranscript
      }

      const updatedText = this._buildUpdatedText(this.fullFinalTranscript, result.interimTranscript)
      this.callbacks?.onResult?.(updatedText)

      // Only start silence timer when no interim text is being processed
      // If there's interim text, user is still speaking or speech is being processed
      const hasInterimText = result.interimTranscript && result.interimTranscript.trim().length > 0
      if (hasInterimText) {
        this._clearSilenceTimer()
      } else {
        this._startSilenceTimer()
      }
    },

    /**
     * Handle onError callback
     * @param {Object} errorData - Error data
     */
    _handleOnError(errorData) {
      if (!this._isComponentActive()) {
        return
      }

      this._clearSilenceTimer()
      this.isInitializingRecognition = false

      // Don't show error for 'no-speech' or 'aborted' as they are expected
      if (errorData.error === 'no-speech' || errorData.error === 'aborted') {
        return
      }

      const errorMessage = this._getErrorMessage(errorData)
      this.callbacks?.onError?.(new Error(errorMessage))
      this.$mixinSpeechRecognition_cleanup()
    },

    /**
     * Handle onEnd callback
     * @param {Object} recognition - Recognition instance
     */
    _handleOnEnd(recognition) {
      if (!this._isValidRecognition(recognition)) {
        return
      }

      this._clearSilenceTimer()
      this.isInitializingRecognition = false
      this.speechRecognition = null
      this.callbacks?.onEnd?.()
      this.callbacks = null
    },

    /**
     * Start voice recognition
     * @param {Object} options - Configuration options
     * @param {string} options.currentText - Current text to append transcript to
     * @param {Function} options.onStart - Callback when recognition starts
     * @param {Function} options.onResult - Callback when result received (receives updatedText)
     * @param {Function} options.onError - Callback when error occurs
     * @param {Function} options.onEnd - Callback when recognition ends
     * @returns {Promise<void>}
     */
    async $mixinSpeechRecognition_startVoiceRecognition(options) {
      const { currentText = '', onStart, onResult, onError, onEnd } = options

      // Check browser support
      if (!isSpeechRecognitionSupported()) {
        this._handleRecognitionError(
          onError,
          'aha-ai.error.browser-not-supported',
          'Browser does not support speech recognition',
        )
        return
      }

      // Check if already initializing or active
      if (this.isInitializingRecognition || this.speechRecognition) {
        return
      }

      // Store callbacks for cleanup guard
      this.callbacks = { onStart, onResult, onError, onEnd }
      this.isInitializingRecognition = true

      try {
        // Check and request microphone permission
        const hasPermission = await this._checkAndRequestPermission(onError)
        if (!hasPermission) {
          this._resetInitState()
          return
        }

        // Initialize recognition state
        this.basePrompt = (currentText || '').trim()
        this.fullFinalTranscript = ''
        this.hasSpeechDetected = false

        // Create speech recognition instance with handlers
        let recognition = null
        recognition = createSpeechRecognition({
          locale:   this.x_user.language,
          onStart:  () => this._handleOnStart(recognition),
          onResult: (result) => this._handleOnResult(recognition, result),
          onError:  (errorData) => this._handleOnError(errorData),
          onEnd:    () => this._handleOnEnd(recognition),
        })

        if (!recognition) {
          this._resetInitState()
          this._handleRecognitionError(
            onError,
            'aha-ai.error.browser-not-supported',
            'Browser does not support speech recognition',
          )
          return
        }

        this.speechRecognition = recognition
        await startRecognition(recognition)
      } catch (error) {
        this._handleRecognitionError(
          onError,
          'aha-ai.error.recognition-failed',
          error.message || 'Failed to start speech recognition',
        )
        this.$mixinSpeechRecognition_cleanup()
      }
    },

    /**
     * Check if component is still active (not destroyed)
     * @returns {boolean}
     */
    _isComponentActive() {
      return this.$el && this.callbacks !== null
    },

    /**
     * Clean up speech recognition instance
     */
    $mixinSpeechRecognition_cleanup() {
      this._clearSilenceTimer()
      if (this.speechRecognition) {
        abortRecognition(this.speechRecognition)
        this.speechRecognition = null
      }
      this.isInitializingRecognition = false
      this.callbacks = null
    },

    /**
     * Reset speech recognition state
     */
    $mixinSpeechRecognition_reset() {
      this.$mixinSpeechRecognition_cleanup()
      this.basePrompt = ''
      this.fullFinalTranscript = ''
      this.hasSpeechDetected = false
    },
  },

  beforeDestroy() {
    this.$mixinSpeechRecognition_cleanup()
  },
}

