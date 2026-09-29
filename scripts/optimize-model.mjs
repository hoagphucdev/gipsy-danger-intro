// Converts the Sketchfab export (robot/source/scene.gltf) into web-ready GLBs.
// Keeps skeleton, node names and every bodygroup variant (used for weapon switching).
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune, textureCompress } from '@gltf-transform/functions'
import sharp from 'sharp'
import { mkdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SRC = fileURLToPath(new URL('../../robot/source/scene.gltf', import.meta.url))
const OUT = fileURLToPath(new URL('../public/models/', import.meta.url))
mkdirSync(OUT, { recursive: true })

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)

const variants = [
  { file: 'robot.glb', color: 2048, detail: 1024 },
  { file: 'robot-mobile.glb', color: 1024, detail: 1024 },
]

for (const v of variants) {
  const doc = await io.read(SRC)
  await doc.transform(
    dedup(),
    // keepLeaves keeps the empty "*.smd" bodygroup marker nodes
    prune({ keepLeaves: true, keepAttributes: true }),
    // normal / specular / emissive maps tolerate lower resolution well
    textureCompress({
      encoder: sharp,
      targetFormat: 'webp',
      resize: [v.detail, v.detail],
      slots: /^(normalTexture|specularTexture|emissiveTexture|metallicRoughnessTexture)$/,
      quality: 85,
    }),
    textureCompress({
      encoder: sharp,
      targetFormat: 'webp',
      resize: [v.color, v.color],
      quality: 88,
    }),
  )
  await io.write(OUT + v.file, doc)
  console.log(`${v.file}: ${(statSync(OUT + v.file).size / 1048576).toFixed(1)} MB`)
}
