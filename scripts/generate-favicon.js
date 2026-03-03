const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const logoPath = path.join(process.cwd(), 'public', 'logo.svg');
const faviconPath = path.join(process.cwd(), 'app', 'favicon.ico');

async function generateFavicon() {
  try {
    if (!fs.existsSync(logoPath)) {
      console.error('Logo SVG not found at:', logoPath);
      process.exit(1);
    }

    // Generate favicon.ico from SVG (resize to 32x32, convert to ICO)
    await sharp(logoPath)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(faviconPath.replace('.ico', '.png'));

    // Convert PNG to ICO
    const pngPath = faviconPath.replace('.ico', '.png');
    const buffer = await sharp(pngPath)
      .resize(32, 32)
      .toBuffer();

    // Simple ICO header + pixel data for 32x32
    const icoBuffer = createICOBuffer(buffer);
    fs.writeFileSync(faviconPath, icoBuffer);
    
    // Clean up temp PNG
    fs.unlinkSync(pngPath);
    
    console.log('✓ Favicon generated at:', faviconPath);
  } catch (err) {
    console.error('Error generating favicon:', err);
    process.exit(1);
  }
}

function createICOBuffer(pngBuffer) {
  // Simplified ICO format: use the PNG directly as BMP
  // This is a minimal ICO with a single 32x32 image entry
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: ICO
  header.writeUInt16LE(1, 4); // Number of images

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(32, 0); // Width
  dirEntry.writeUInt8(32, 1); // Height
  dirEntry.writeUInt8(0, 2);  // Palette colors
  dirEntry.writeUInt8(0, 3);  // Reserved
  dirEntry.writeUInt16LE(1, 4); // Color planes
  dirEntry.writeUInt16LE(32, 6); // Bits per pixel
  dirEntry.writeUInt32LE(pngBuffer.length, 8); // Image data size
  dirEntry.writeUInt32LE(22, 12); // Offset to image data

  return Buffer.concat([header, dirEntry, pngBuffer]);
}

generateFavicon();
