<template>
  <img
    :src="imageSrc"
    :alt="imgAlt"
    loading="lazy"
    decoding="async"
    @error="handleImageError"
  >
</template>

<script>
import { convertImageToJPEG } from 'CommonHelpers'

export default {
  props: {
    imgFullPath: {
      type:     String,
      required: true,
    },
    imgAlt: {
      type:    String,
      default: '',
    },
    imgType: {
      type:    String,
      default: 'jpeg',
    },
    // Skip conversion for thumbnails/lists - use direct URL for better performance
    skipConversion: {
      type:    Boolean,
      default: false,
    },
  },

  data () {
    return {
      imageSrc:    '',
      hasError:    false,
      isConverted: false,
    }
  },

  watch: {
    imgFullPath (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.hasError = false
        this.isConverted = false
        this.loadImage()
      }
    },
  },

  created () {
    this.loadImage()
  },

  methods: {
    loadImage() {
      if (this.skipConversion) {
        // Use direct URL for better performance (thumbnails, lists)
        this.imageSrc = this.imgFullPath
      } else {
        // Convert for cases that need it (e.g., download, print)
        this.handleConvertImage()
      }
    },

    async handleConvertImage () {
      if (this.isConverted) return

      try {
        // When you fetch images from the localhost domain,
        // you will be blocked by CORS policy: No 'Access-Control-Allow-Origin'.
        // Therefore, deployment is needed to be able to test
        this.imageSrc = await convertImageToJPEG(this.imgFullPath, this.imgType)
        this.isConverted = true
      } catch (error) {
        // Fallback to direct URL if conversion fails
        this.imageSrc = this.imgFullPath
      }
    },

    handleImageError() {
      // If direct URL fails, try conversion as fallback
      if (!this.hasError && this.skipConversion) {
        this.hasError = true
        this.isConverted = false // Allow conversion attempt
        this.handleConvertImage()
      }
    },
  },
}
</script>
