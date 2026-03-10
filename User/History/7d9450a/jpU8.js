// Web Worker for HEIC to JPEG conversion using heic-to library
// This runs in a separate thread to avoid blocking the main UI thread

import { heicTo } from 'heic-to'

const IMG_TYPE = 'image/jpeg'
const IMG_QUALITY = 0.5

onmessage = async function(event) {
  const { id, file, fileName } = event.data

  try {
    const convertedBlob = await heicTo({
      blob:    file,
      type:    IMG_TYPE,
      quality: IMG_QUALITY,
    })

    postMessage({
      id,
      success:  true,
      blob:     convertedBlob,
      fileName: fileName.replace(/\.heic|\.heif$/i, '.jpeg'),
    })
  } catch (error) {
    postMessage({
      id,
      success: false,
      error:   error.message || 'HEIC conversion failed',
    })
  }
}
