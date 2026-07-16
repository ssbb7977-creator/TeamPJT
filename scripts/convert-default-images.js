// convert-default-images.js
// Usage: install sharp (`npm install sharp`) then run `npm run convert-images`

const fs = require('fs')
const path = require('path')

async function main() {
  let sharp
  try {
    sharp = require('sharp')
  } catch (e) {
    console.error('sharp is not installed. Run `npm install sharp` first.')
    process.exit(1)
  }

  const dir = path.join(__dirname, '..', 'public', 'images', 'default')
  if (!fs.existsSync(dir)) {
    console.error('Directory not found:', dir)
    process.exit(1)
  }

  const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f))
  if (files.length === 0) {
    console.log('No images found in', dir)
    return
  }

  for (const file of files) {
    const full = path.join(dir, file)
    const name = path.parse(file).name

    const outWebp = path.join(dir, `${name}.webp`)
    const outJpg = path.join(dir, `${name}.jpg`)

    try {
      // create webp
      await sharp(full)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(outWebp)

      // create optimized jpg fallback
      await sharp(full)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 78 })
        .toFile(outJpg)

      console.log('Converted', file, '->', `${name}.webp`, `${name}.jpg`)
    } catch (e) {
      console.error('Failed to convert', file, e)
    }
  }
}

main()
