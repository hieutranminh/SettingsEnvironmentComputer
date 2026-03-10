#!/usr/bin/env node

/**
 * Slot Syntax Migration Script
 * Converts deprecated Vue 2 slot syntax to Vue 2.6+ / Vue 3 compatible syntax
 * 
 * Changes:
 * - slot="name" slot-scope="{ row }" → #name="{ row }"
 * - slot="name" → #name
 * - slot-scope="props" → v-slot="props"
 * 
 * Usage:
 *   node tmp/migrate-slots.js [--dry-run] [--path=src/pages]
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Configuration
const DEFAULT_GLOB_PATTERN = 'src/**/*.vue'
const BACKUP_DIR = 'tmp/backups/slots'

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const customPath = args.find(arg => arg.startsWith('--path='))
const globPattern = customPath 
  ? customPath.replace('--path=', '') + '/**/*.vue'
  : DEFAULT_GLOB_PATTERN

console.log('🔧 Vue Slot Syntax Migration Tool\n')
console.log('Configuration:')
console.log(`  Pattern: ${globPattern}`)
console.log(`  Dry Run: ${isDryRun ? 'Yes' : 'No'}`)
console.log(`  Backup:  ${BACKUP_DIR}\n`)

// Statistics
const stats = {
  filesScanned: 0,
  filesChanged: 0,
  replacements: 0,
  errors: 0,
}

/**
 * Create backup directory
 */
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }
}

/**
 * Backup file before modification
 */
function backupFile(filePath, content) {
  const backupPath = path.join(BACKUP_DIR, path.basename(filePath))
  fs.writeFileSync(backupPath, content, 'utf8')
}

/**
 * Migration patterns
 */
const migrations = [
  {
    name: 'slot + slot-scope',
    pattern: /(<template)\s+slot="([^"]+)"\s+slot-scope="([^"]+)"/g,
    replacement: '$1 #$2="$3"',
    description: 'slot="name" slot-scope="props" → #name="props"'
  },
  {
    name: 'slot-scope + slot',
    pattern: /(<template)\s+slot-scope="([^"]+)"\s+slot="([^"]+)"/g,
    replacement: '$1 #$3="$2"',
    description: 'slot-scope="props" slot="name" → #name="props"'
  },
  {
    name: 'slot only',
    pattern: /(<template)\s+slot="([^"]+)"/g,
    replacement: '$1 #$2',
    description: 'slot="name" → #name'
  },
  {
    name: 'slot-scope only',
    pattern: /(<template)\s+slot-scope="([^"]+)"/g,
    replacement: '$1 v-slot="$2"',
    description: 'slot-scope="props" → v-slot="props"'
  },
]

/**
 * Migrate file content
 */
function migrateContent(content, filePath) {
  let modified = content
  let fileReplacements = 0
  const changes = []

  migrations.forEach(migration => {
    const matches = [...modified.matchAll(migration.pattern)]
    
    if (matches.length > 0) {
      modified = modified.replace(migration.pattern, migration.replacement)
      fileReplacements += matches.length
      
      changes.push({
        type: migration.name,
        count: matches.length,
        description: migration.description,
        examples: matches.slice(0, 2).map(m => m[0])
      })
    }
  })

  return {
    content: modified,
    changed: fileReplacements > 0,
    replacements: fileReplacements,
    changes,
  }
}

/**
 * Process single file
 */
function processFile(filePath) {
  try {
    stats.filesScanned++
    
    const content = fs.readFileSync(filePath, 'utf8')
    const result = migrateContent(content, filePath)
    
    if (result.changed) {
      stats.filesChanged++
      stats.replacements += result.replacements
      
      console.log(`\n📝 ${filePath}`)
      console.log(`   Replacements: ${result.replacements}`)
      
      result.changes.forEach(change => {
        console.log(`   - ${change.type}: ${change.count}x`)
        if (change.examples.length > 0) {
          console.log(`     Example: ${change.examples[0]}`)
        }
      })
      
      if (!isDryRun) {
        // Backup original file
        backupFile(filePath, content)
        
        // Write migrated content
        fs.writeFileSync(filePath, result.content, 'utf8')
        console.log('   ✅ File updated')
      } else {
        console.log('   ⚠️  Dry run - no changes made')
      }
    }
  } catch (error) {
    stats.errors++
    console.error(`❌ Error processing ${filePath}:`, error.message)
  }
}

/**
 * Main execution
 */
function main() {
  try {
    if (!isDryRun) {
      ensureBackupDir()
    }
    
    console.log('🔍 Scanning files...\n')
    
    const files = glob.sync(globPattern)
    
    if (files.length === 0) {
      console.log('⚠️  No files found matching pattern')
      return
    }
    
    console.log(`Found ${files.length} Vue files\n`)
    console.log('━'.repeat(60))
    
    files.forEach(processFile)
    
    console.log('\n' + '━'.repeat(60))
    console.log('\n📊 Migration Summary:')
    console.log(`   Files scanned:  ${stats.filesScanned}`)
    console.log(`   Files changed:  ${stats.filesChanged}`)
    console.log(`   Replacements:   ${stats.replacements}`)
    console.log(`   Errors:         ${stats.errors}`)
    
    if (!isDryRun && stats.filesChanged > 0) {
      console.log(`\n💾 Backups saved to: ${BACKUP_DIR}`)
    }
    
    if (isDryRun && stats.filesChanged > 0) {
      console.log('\n⚠️  This was a DRY RUN. No files were modified.')
      console.log('   Run without --dry-run to apply changes.')
    }
    
    if (stats.filesChanged === 0) {
      console.log('\n✅ No deprecated slot syntax found!')
    } else if (!isDryRun) {
      console.log('\n✅ Migration completed successfully!')
      console.log('\n📋 Next steps:')
      console.log('   1. Review the changes')
      console.log('   2. Test your application')
      console.log('   3. Run: npm run lint -- --fix')
      console.log('   4. Commit the changes')
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

// Run
main()

