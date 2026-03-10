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
import heic2any from 'heic2any'
import { mapMutations, mapState } from 'vuex'
import { common_options } from 'Options/common-options.js'

// Components
import FileUpload from 'vue-upload-component'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

const IMG_QUALITY = 0.5
const IMG_TYPE = 'image/jpeg'
export default {
  components: {
    FileUpload,
  },
  extends: ComponentBase,

  data: () => {
    return {
      files:        [],
      invalidFiles: [],
      inputFiles:   [],
      count:        0,
      errorFile:    [],
      fileQueue:    [],
      isProcessing: false,
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
      this.$refs.file_upload.$el.addEventListener('click', () => {
        this.resetData()
      })
    })

  },

  methods: {
    ...mapMutations('client_photo', ['setClientPhotoConvertData', 'setClientMultipleConvertData']),
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
            const blobUrl = await heic2any({
              blob:     file,
              toType:   IMG_TYPE,
              quanlity: IMG_QUALITY,
            })
            const newFile = new File([blobUrl], file.name.replace(/\.heic|heif|HEIF|HEIC$/, '.jpeg'), {type: IMG_TYPE})
            if(typeof newFile === 'object') {
              let definedId = this.clientMultipleConvertPhoto?.length || 0
              newFile['id'] = definedId
            }
            this.setClientMultipleConvertData(newFile)
            return URL.createObjectURL(blobUrl)
          } catch (error) {
            this._showDialogAlert(error)
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
        return URL.createObjectURL(file)
      }
      return ''
    },

    checkValidImageWithCallback(imgSrc, callback) {
      const img = document.createElement('img')
      img.src = imgSrc
      img.onload = callback
      img.onerror = callback
    },

    inputFilter(newFile, oldFile) {
      console.log('inputFilter', newFile, oldFile)
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
      this.files = []
      this.invalidFiles = []
      this.inputFiles = []
      this.count = 0
      this.fileQueue = []
      this.isProcessing = false
      this.$refs.file_upload.clear()
    },
  },
}
</script>

