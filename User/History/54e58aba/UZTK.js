// Web Worker for HEIC to JPEG conversion
// This runs in a separate thread to avoid blocking the main UI thread

import heicConvert from 'heic-convert'

const IMG_QUALITY = 0.5

/**
 * Convert HEIC buffer to JPEG buffer
 * @param {ArrayBuffer} inputBuffer - The HEIC file as ArrayBuffer
 * @returns {Promise<ArrayBuffer>} - The converted JPEG as ArrayBuffer
 */
async function convertHeicToJpeg(inputBuffer) {
  const inputUint8Array = new Uint8Array(inputBuffer)

  const outputBuffer = await heicConvert({
    buffer:  inputUint8Array,
    format:  'JPEG',
    quality: IMG_QUALITY,
  })

  return outputBuffer.buffer
}

onmessage = async function(event) {
  const { id, arrayBuffer, fileName } = event.data

  try {
    const jpegBuffer = await convertHeicToJpeg(arrayBuffer)

    postMessage({
      id,
      success:    true,
      jpegBuffer: jpegBuffer,
      fileName:   fileName.replace(/\.heic|\.heif$/i, '.jpeg'),
    }, [jpegBuffer])
  } catch (error) {
    postMessage({
      id,
      success: false,
      error:   error.message || 'HEIC conversion failed',
    })
  }
}
