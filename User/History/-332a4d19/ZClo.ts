import Compressor from 'compressorjs'
import { IMAGE_COMPRESS_CONFIG } from '@/constants'

const MAX_COMPRESS_ITERATIONS = 10
const MIN_IMAGE_WIDTH = 1

interface IImageCompressorOptions {
  quality?: number
  convertSize?: number
  width?: number
  drew?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
}

const readFileAsDataURL = async (file: File): Promise<string> => {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = (): void => reject(new Error('read_failed'))
    reader.onloadend = (): void => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}

const loadImageElement = async (src: string): Promise<HTMLImageElement> => {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onerror = (): void => reject(new Error('image_load_failed'))
    image.onload = (): void => resolve(image)
    image.src = src
  })
}

const ensureFile = (blob: Blob | File, base: File): File => {
  return blob instanceof File
    ? blob
    : new File([blob], base.name, { type: base.type, lastModified: base.lastModified })
}

const compressOnce = async (
  file: File,
  image: HTMLImageElement,
  width: number | undefined,
  options: Partial<IImageCompressorOptions>,
): Promise<File> => {
  return await new Promise<File>((resolve, reject) => {
    const compressorOptions = {
      ...options,
      quality: IMAGE_COMPRESS_CONFIG.QUALITY,
      convertSize: IMAGE_COMPRESS_CONFIG.CONVERT_SIZE,
      width,
      drew: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        // keep previous drawing behavior and also allow user custom drew
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        try {
          options.drew?.(context, canvas)
        } catch {
          // no-op
        }
      },
      success: (result: Blob | File) => resolve(ensureFile(result, file)),
      error: () => reject(new Error('compress_failed')),
    } as unknown as Compressor.Options

    new Compressor(file, compressorOptions)
  })
}

const compressIteratively = async <T extends { file: File }>(
  fileUpload: T,
  limitFileSize: number,
  image: HTMLImageElement,
  options: Partial<IImageCompressorOptions>,
): Promise<T> => {
  let currentFile = fileUpload.file
  let width: number | undefined

  // Iteratively compress until under limit or width becomes 1
  // Guard to avoid infinite loops (cap at 10 iterations)
  for (let i = 0; i < MAX_COMPRESS_ITERATIONS; i += 1) {
    const compressed = await compressOnce(currentFile, image, width, options)
    if (compressed.size <= limitFileSize) {
      return { ...fileUpload, file: compressed } as T
    }

    // Reduce width and try again
    const nextWidth = Math.max(
      MIN_IMAGE_WIDTH,
      Math.floor((width ?? image.width) * IMAGE_COMPRESS_CONFIG.SCALE),
    )
    width = nextWidth
    currentFile = compressed
    if (width <= MIN_IMAGE_WIDTH) break
  }

  return { ...fileUpload, file: currentFile } as T
}

export const compressFileAsync = async <T extends { file: File }>(
  fileUpload: T,
  limitFileSize: number,
  options: Partial<IImageCompressorOptions> = {},
): Promise<T> => {
  try {
    const base64 = await readFileAsDataURL(fileUpload.file)
    const image = await loadImageElement(base64)
    return await compressIteratively(fileUpload, limitFileSize, image, options)
  } catch {
    return fileUpload
  }
}
