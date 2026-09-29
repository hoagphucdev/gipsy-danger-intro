// Extracts one KUKA arm (skinned) from the Sketchfab demo scene (3 arms + rails + walls)
// into public/models/weld-arm.glb. Source: assets-src/weld-arm (CC-BY-4.0, Hrofti).
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune, textureCompress } from '@gltf-transform/functions'
import sharp from 'sharp'
import { statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SRC = fileURLToPath(new URL('../assets-src/weld-arm/scene.gltf', import.meta.url))
const OUT = fileURLToPath(new URL('../public/models/weld-arm.glb', import.meta.url))
const KEEP = 'Armature' // the first arm; its siblings are the other arms, rails and walls

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const doc = await io.read(SRC)
const root = doc.getRoot()

// Sketchfab_model > Root > [Armature, Armature.001, Cube, ...]: keep only KEEP under Root
const sceneRoot = root.listNodes().find((n) => n.getName() === 'Root')
for (const child of sceneRoot.listChildren()) {
  if (child.getName() !== KEEP) disposeTree(child)
}
for (const animation of root.listAnimations()) animation.dispose() // we drive the joints ourselves

await doc.transform(
  prune(),
  dedup(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 85 }),
)
await io.write(OUT, doc)
console.log(`weld-arm.glb: ${(statSync(OUT).size / 1024).toFixed(0)} KB`)

function disposeTree(node) {
  for (const child of node.listChildren()) disposeTree(child)
  node.dispose()
}
