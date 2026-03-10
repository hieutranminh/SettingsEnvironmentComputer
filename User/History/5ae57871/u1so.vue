<template>
  <file-upload
    ref="file_upload"
    v-model="inputFiles"
    :multiple="true"
    :maximum="maxFile"
    accept=".png,.jpeg,.jpg,.pdf,.heic,.heif"
    @input-filter="inputFilter"
  >
    <slot />
  </file-upload>
</template>

<script>
// Utils
import { mapMutations, mapState } from 'vuex'
import { common_options } from 'Options/common-options.js'

// Components
import FileUpload from 'vue-upload-component'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

const IMG_TYPE = 'image/jpeg'
const HEIC_CONVERSION_TIMEOUT_MS = 60000
const DELAY_BETWEEN_CONVERSIONS_MS = 100

export default {
  components: {
    FileUpload,
  },
  extends: ComponentBase,

  data: () => {
    return {
      files:            [],
      invalidFiles:     [],
      inputFiles:       [],
      count:            0,
      errorFile:        [],
      heicWorker:       null,
      pendingConverts:  new Map(),
      convertIdCounter: 0,
      blobUrls:         [],
      fileQueue:        [],
      isProcessing:     false,
      clickHandler:     null,
    }
  },

  computed: {
    ...mapState('client_photo', ['clientMultipleConvertPhoto']),
    maxFile() {
      return common_options.uploadFileValidationRules.maxFile
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.clickHandler = () => {
        this.resetData()
      }
      this.$refs.file_upload.$el.addEventListener('click', this.clickHandler)
    })
    this.initHeicWorker()
  },

  beforeDestroy() {
    // Cleanup event listener
    if (this.clickHandler && this.$refs.file_upload?.$el) {
      this.$refs.file_upload.$el.removeEventListener('click', this.clickHandler)
    }
    // Terminate worker
    this.terminateHeicWorker()
    // Revoke all blob URLs to free memory
    this.revokeBlobUrls()
    // Clear Vuex store
    this.resetClientPhotoData([])
  },

  methods: {
    ...mapMutations('client_photo', ['setClientPhotoConvertData', 'setClientMultipleConvertData', 'resetClientPhotoData']),

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    revokeBlobUrls() {
      const URL = window.URL || window.webkitURL
      if (URL && URL.revokeObjectURL) {
        this.blobUrls.forEach(url => {
          try {
            URL.revokeObjectURL(url)
          } catch (e) {
            // Ignore errors
          }
        })
      }
      this.blobUrls = []
    },

    initHeicWorker() {
      if (this.heicWorker) {
        return
      }

      try {
        this.heicWorker = new Worker(
          new URL('Workers/heic-to.worker.js', import.meta.url),
          { type: 'module' },
        )
        this.heicWorker.onmessage = this.handleWorkerMessage
        this.heicWorker.onerror = this.handleWorkerError
      } catch (error) {
        // Worker failed to initialize, will fallback if needed
      }
    },

    terminateHeicWorker() {
      if (this.heicWorker) {
        this.heicWorker.terminate()
        this.heicWorker = null
      }
      this.pendingConverts.clear()
    },

    handleWorkerMessage(event) {
      const { id, success, blob, fileName, error } = event.data
      const pending = this.pendingConverts.get(id)

      if (!pending) {
        return
      }

      this.pendingConverts.delete(id)

      if (success) {
        const newFile = new File([blob], fileName, { type: IMG_TYPE })
        pending.resolve({ blob, newFile })
      } else {
        pending.reject(new Error(error || 'HEIC conversion failed'))
      }
    },

    handleWorkerError() {
      // Reject all pending conversions
      this.pendingConverts.forEach(pending => {
        pending.reject(new Error('Worker error'))
      })
      this.pendingConverts.clear()
    },

    convertHeicInWorker(file) {
      return new Promise((resolve, reject) => {
        if (!this.heicWorker) {
          this.initHeicWorker()
        }

        if (!this.heicWorker) {
          reject(new Error('Worker not available'))
          return
        }

        const id = ++this.convertIdCounter
        const timeoutId = setTimeout(() => {
          this.pendingConverts.delete(id)
          reject(new Error('HEIC conversion timeout'))
        }, HEIC_CONVERSION_TIMEOUT_MS)

        this.pendingConverts.set(id, {
          resolve: result => {
            clearTimeout(timeoutId)
            resolve(result)
          },
          reject: err => {
            clearTimeout(timeoutId)
            reject(err)
          },
        })

        // Send the file directly to worker
        this.heicWorker.postMessage({
          id,
          file,
          fileName: file.name,
        })
      })
    },

    async getFileBlobURL(file) {
      const fileExtension = file.name.split('.').pop()
      const isInvalidExt = (!['png', 'jpeg', 'jpg','PNG','JPG','JPEG','HEIC','HEIF','heic','heif'].includes(fileExtension))
      const isInvalidSize = (file.size >= common_options.uploadFileValidationRules.maxFileSize)
      const isInvalidNameLength = (file.name.length > common_options.uploadFileValidationRules.maxNameLength)
      if (isInvalidExt || isInvalidSize || isInvalidNameLength) {
        return ''
      }

      const URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        if(/\.heic$|\.heif$/i.test(file.name)) {
          try {
            this.preLoader()
            const { blob, newFile } = await this.convertHeicInWorker(file)
            if(typeof newFile === 'object') {
              let definedId = this.clientMultipleConvertPhoto?.length || 0
              newFile['id'] = definedId
            }
            this.setClientMultipleConvertData(newFile)
            const blobUrl = URL.createObjectURL(blob)
            this.blobUrls.push(blobUrl)
            return blobUrl
          } catch (error) {
            this._showDialogAlert(error.message || error)
            this.errorFile.push(file)
            return ''
          } finally {
            if(!this.errorFile.length) {
              this.preLoader(false)
            }
          }
        }
        if(typeof file === 'object') {
          file['id'] = this.count
        }
        this.setClientMultipleConvertData(file)
        const blobUrl = URL.createObjectURL(file)
        this.blobUrls.push(blobUrl)
        return blobUrl
      }
      return ''
    },

    checkValidImageWithCallback(imgSrc, callback) {
      const img = new Image()
      img.onload = () => {
        callback({ type: 'load' })
        img.onload = null
        img.onerror = null
      }
      img.onerror = () => {
        callback({ type: 'error' })
        img.onload = null
        img.onerror = null
      }
      img.src = imgSrc
    },

    inputFilter(newFile, oldFile) {
      if (newFile && !oldFile) {
        this.fileQueue.push({ newFile, oldFile })
        this.processQueue()
      }
    },

    async processQueue() {
      if (this.isProcessing || this.fileQueue.length === 0) {
        return
      }

      this.isProcessing = true

      while (this.fileQueue.length > 0) {
        const { newFile, oldFile } = this.fileQueue.shift()
        await this.processFile(newFile, oldFile)

        // Small delay between files to prevent memory pressure
        if (this.fileQueue.length > 0) {
          await this.delay(DELAY_BETWEEN_CONVERSIONS_MS)
        }
      }

      this.isProcessing = false
    },

    async processFile(newFile, oldFile) {
      const blobUrl = await this.getFileBlobURL(newFile.file)

      return new Promise(resolve => {
        this.checkValidImageWithCallback(blobUrl, event => {
          newFile.url = ''
          const fileExtension = newFile.file.name.split('.').pop()
          const isInvalidTypeFile = (event.type === 'error')
          const isInvalidExt = (!['png', 'jpeg', 'jpg','PNG','JPG','JPEG','HEIC','HEIF','heic','heif'].includes(fileExtension))
          const isInvalidSize = (newFile.size >= common_options.uploadFileValidationRules.maxFileSize)
          const isInvalidNameLength = (newFile.name.length > common_options.uploadFileValidationRules.maxNameLength)
          if (isInvalidTypeFile || isInvalidExt || isInvalidSize || isInvalidNameLength) {
            this.invalidFiles.push(newFile)
          } else {
            if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
              newFile.url = blobUrl
            }
            newFile.file.id = this.count
            this.files.push(newFile)
          }
          this.count = this.count + 1
          if (this.count === this.inputFiles?.length) {
            this.$emit('get-files', this.files, this.invalidFiles)
            if(this.errorFile.length) {
              this.preLoader(false)
            }
          }
          resolve()
        })
      })
    },

    resetData() {
      // Revoke old blob URLs before clearing
      this.revokeBlobUrls()
      // Clear Vuex store
      this.resetClientPhotoData([])
      // Reset local state
      this.files = []
      this.invalidFiles = []
      this.inputFiles = []
      this.count = 0
      this.errorFile = []
      this.fileQueue = []
      this.isProcessing = false
      this.pendingConverts.clear()
      this.$refs.file_upload.clear()
    },
  },
}
</script>
