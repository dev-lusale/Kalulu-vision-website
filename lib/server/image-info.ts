import "server-only";

export interface ImageInfo { mime: "image/png" | "image/jpeg" | "image/webp" | "image/gif"; width: number | null; height: number | null }

/**
 * Identifies an image by its bytes (never by the file name or the browser's claimed type)
 * and reads its dimensions. Only raster formats are accepted: SVG can carry scripts.
 */
export function inspectImage(b: Buffer): ImageInfo | null {
  if (b.length < 16) return null;
  // PNG
  if (b.readUInt32BE(0) === 0x89504e47 && b.readUInt32BE(4) === 0x0d0a1a0a) {
    return { mime: "image/png", width: b.length >= 24 ? b.readUInt32BE(16) : null, height: b.length >= 24 ? b.readUInt32BE(20) : null };
  }
  // GIF
  if (b.toString("ascii", 0, 6) === "GIF87a" || b.toString("ascii", 0, 6) === "GIF89a") {
    return { mime: "image/gif", width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }
  // WebP
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    let width: number | null = null, height: number | null = null;
    if (chunk === "VP8 " && b.length >= 30) { width = b.readUInt16LE(26) & 0x3fff; height = b.readUInt16LE(28) & 0x3fff; }
    else if (chunk === "VP8L" && b.length >= 25) {
      const bits = b.readUInt32LE(21);
      width = (bits & 0x3fff) + 1; height = ((bits >> 14) & 0x3fff) + 1;
    } else if (chunk === "VP8X" && b.length >= 30) {
      width = 1 + b.readUIntLE(24, 3); height = 1 + b.readUIntLE(27, 3);
    }
    return { mime: "image/webp", width, height };
  }
  // JPEG: walk segments to the first SOFn marker
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { mime: "image/jpeg", height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
    return { mime: "image/jpeg", width: null, height: null };
  }
  return null;
}
