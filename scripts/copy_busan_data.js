const fs = require('fs')
const path = require('path')

const srcDir = path.join(__dirname, '..', 'Busan_data')
const destDir = path.join(__dirname, '..', 'public', 'Busan_data')

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error('Source directory not found:', src)
    process.exit(1)
  }
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath)
      console.log('copied', srcPath, '->', destPath)
    }
  }
}

copyRecursive(srcDir, destDir)
console.log('Busan_data copied to public/Busan_data')
