// Build script for Chrome Extension
// This script copies necessary files after Vite build

import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// Ensure directory exists
function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

// Copy file with directory creation
function copyFile(src: string, dest: string): void {
  ensureDir(dirname(dest))
  copyFileSync(src, dest)
  console.log(`Copied: ${src} -> ${dest}`)
}

// Main build steps
function build(): void {
  console.log('🚀 Building Chrome Extension...\n')

  const distDir = resolve(rootDir, 'dist')
  const srcDir = resolve(rootDir, 'src')
  const publicDir = resolve(rootDir, 'public')

  // 1. Copy manifest.json
  copyFile(resolve(srcDir, 'manifest.json'), resolve(distDir, 'manifest.json'))

  // 2. Copy icons
  const iconsDir = resolve(distDir, 'icons')
  ensureDir(iconsDir)

  const iconSizes = [16, 32, 48, 128]
  iconSizes.forEach((size): void => {
    const iconSrc = resolve(publicDir, 'icons', `icon-${size}.png`)
    const iconDest = resolve(iconsDir, `icon-${size}.png`)

    if (existsSync(iconSrc)) {
      copyFile(iconSrc, iconDest)
    } else {
      console.warn(`⚠️  Icon not found: icon-${size}.png`)
    }
  })

  // 3. Copy content script CSS
  const contentCssSrc = resolve(srcDir, 'content', 'styles.css')
  const contentCssDest = resolve(distDir, 'content', 'styles.css')
  if (existsSync(contentCssSrc)) {
    copyFile(contentCssSrc, contentCssDest)
  }

  // 4. Fix popup HTML path
  const popupHtmlPath = resolve(distDir, 'src', 'popup', 'index.html')
  if (existsSync(popupHtmlPath)) {
    let html = readFileSync(popupHtmlPath, 'utf-8')
    // Fix script paths if needed
    html = html.replace(/src="\.\/main\.ts"/g, 'src="./main.js"')
    writeFileSync(popupHtmlPath, html)

    // Move to correct location
    ensureDir(resolve(distDir, 'popup'))
    copyFile(popupHtmlPath, resolve(distDir, 'popup', 'index.html'))
  }

  console.log('\n✅ Chrome Extension build complete!')
  console.log('📁 Output directory: dist/')
  console.log('\n📝 To load the extension:')
  console.log('   1. Open Chrome and go to chrome://extensions/')
  console.log('   2. Enable "Developer mode"')
  console.log('   3. Click "Load unpacked"')
  console.log('   4. Select the "dist" folder')
}

build()

