import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const master = path.join(root, 'public/saha-ilan-icon-master.png')

await sharp(master).resize(512, 512).png().toFile(path.join(root, 'public/logo-v2.png'))
await sharp(master).resize(180, 180).png().toFile(path.join(root, 'public/apple-touch-icon-v2.png'))

const sizes = [16, 32, 48, 64, 128, 256]
const frames = await Promise.all(sizes.map(size => sharp(master).resize(size, size).png().toBuffer()))
const header = Buffer.alloc(6 + frames.length * 16)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(frames.length, 4)
let offset = header.length
frames.forEach((frame, index) => {
  const entry = 6 + index * 16
  header[entry] = sizes[index] === 256 ? 0 : sizes[index]
  header[entry + 1] = header[entry]
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(frame.length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += frame.length
})
await fs.writeFile(path.join(root, 'app/favicon.ico'), Buffer.concat([header, ...frames]))
console.log('Prepared logo (512px), Apple icon (180px), favicon (16–256px).')
