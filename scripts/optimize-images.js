const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Config
const SRC_DIR = path.join(process.cwd(), 'public', 'images', 'src');
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'optimized');
const SIZES = [320, 480, 768, 1024, 1600];
const FORMATS = ['webp', 'avif'];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) return;
  const name = path.basename(file, ext);
  const input = path.join(SRC_DIR, file);
  for (const size of SIZES) {
    for (const fmt of FORMATS) {
      const outName = `${name}-${size}.${fmt}`;
      const outPath = path.join(OUT_DIR, fmt, outName);
      await ensureDir(path.dirname(outPath));
      await sharp(input)
        .resize({ width: size })
        [fmt]({ quality: 80 })
        .toFile(outPath);
      console.log('Written', outPath);
    }
  }
}

async function main() {
  try {
    const exists = fs.existsSync(SRC_DIR);
    if (!exists) {
      console.error('Source directory not found:', SRC_DIR);
      console.error('Create images in public/images/src and re-run.');
      process.exit(1);
    }
    await ensureDir(OUT_DIR);
    const files = await fs.promises.readdir(SRC_DIR);
    for (const f of files) {
      await processFile(f);
    }
    console.log('All done');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
