// Build script for Chrome Extension
// This script copies necessary files after Vite build

import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync, cpSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
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
  console.log(`✓ Copied: ${src} -> ${dest}`)
}

// Main build steps
function build(): void {
  console.log('🚀 Building Chrome Extension...\n')

  const distDir = resolve(rootDir, 'dist')
  const srcDir = resolve(rootDir, 'src')
  const publicDir = resolve(rootDir, 'public')

  // 1. Copy manifest.json
  console.log('📋 Copying manifest.json...')
  copyFile(resolve(srcDir, 'manifest.json'), resolve(distDir, 'manifest.json'))

  // 2. Copy icons
  console.log('\n🎨 Copying icons...')
  const iconsDir = resolve(distDir, 'icons')
  ensureDir(iconsDir)

  const publicIconsDir = resolve(publicDir, 'icons')
  if (existsSync(publicIconsDir)) {
    const iconFiles = readdirSync(publicIconsDir)
    iconFiles.forEach((file): void => {
      if (file.endsWith('.png') || file.endsWith('.svg')) {
        copyFile(resolve(publicIconsDir, file), resolve(iconsDir, file))
      }
    })
  }

  // Check for required icons
  const iconSizes = [16, 32, 48, 128]
  const missingIcons: number[] = []
  iconSizes.forEach((size): void => {
    const iconPath = resolve(iconsDir, `icon-${size}.png`)
    if (!existsSync(iconPath)) {
      missingIcons.push(size)
    }
  })

  if (missingIcons.length > 0) {
    console.warn(`\n⚠️  Missing icon sizes: ${missingIcons.join(', ')}px`)
    console.warn('   Please create PNG icons in public/icons/ folder')
    console.warn('   You can use the icon.svg as a template')
  }

  // 3. Copy content script CSS
  console.log('\n📄 Copying content styles...')
  const contentCssSrc = resolve(srcDir, 'content', 'styles.css')
  const contentCssDest = resolve(distDir, 'content', 'styles.css')
  if (existsSync(contentCssSrc)) {
    copyFile(contentCssSrc, contentCssDest)
  }

  // 4. Move popup files to correct location
  console.log('\n📦 Organizing popup files...')
  const popupSrcDir = resolve(distDir, 'src', 'popup')
  const popupDestDir = resolve(distDir, 'popup')
  
  if (existsSync(popupSrcDir)) {
    ensureDir(popupDestDir)
    
    // Copy all files from src/popup to popup
    const popupFiles = readdirSync(popupSrcDir)
    popupFiles.forEach((file): void => {
      const srcPath = resolve(popupSrcDir, file)
      const destPath = resolve(popupDestDir, file)
      copyFile(srcPath, destPath)
    })

    // Fix HTML file - update script src
    const htmlPath = resolve(popupDestDir, 'index.html')
    if (existsSync(htmlPath)) {
      let html = readFileSync(htmlPath, 'utf-8')
      
      // Find and update the script tag
      html = html.replace(
        /src="\.\/main\.ts"/g,
        'src="./popup.js"'
      )
      
      // Also check for built JS files in popup directory
      const jsFiles = readdirSync(resolve(distDir, 'popup')).filter((f): boolean => f.endsWith('.js'))
      if (jsFiles.length > 0) {
        const mainJs = jsFiles.find((f): boolean => f.startsWith('popup')) || jsFiles[0]
        html = html.replace(
          /<script type="module" src="[^"]*"><\/script>/,
          `<script type="module" src="./${mainJs}"></script>`
        )
      }
      
      writeFileSync(htmlPath, html)
      console.log('✓ Updated popup HTML paths')
    }
  }

  // 5. Clean up src folder in dist
  const distSrcDir = resolve(distDir, 'src')
  if (existsSync(distSrcDir)) {
    console.log('\n🧹 Cleaning up...')
    // Note: We keep it for now, can remove later if needed
  }

  console.log('\n' + '═'.repeat(50))
  console.log('✅ Chrome Extension build complete!')
  console.log('═'.repeat(50))
  console.log('\n📁 Output directory: dist/')
  console.log('\n📝 To load the extension:')
  console.log('   1. Open Chrome and go to chrome://extensions/')
  console.log('   2. Enable "Developer mode" (top right toggle)')
  console.log('   3. Click "Load unpacked"')
  console.log('   4. Select the "dist" folder')
  console.log('\n💡 Tip: After making changes, run "pnpm build:extension"')
  console.log('   and click the refresh button on the extension card')
}

build()
