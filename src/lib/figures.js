import { CanvasTexture, MeshBasicMaterial, MeshMatcapMaterial, OrthographicCamera, SRGBColorSpace, WebGLRenderTarget } from 'three'
import { NO_PART, partId } from './parts'

// Report plates: front + side elevation of the robot, one part tinted, drawn like a clay render.
const LAYER = 7 // only the robot is rendered for the plates
const VIEW = { width: 300, height: 460 } // px per elevation
const GUTTER = 40 // px between the views (the dimension line lives left of the front view)
const FRAME = { height: 88, centreY: 40 } // metres covered vertically, centred on the hips

/**
 * Render one plate per part id (null = no part highlighted). Returns { [id]: PNG data URL }.
 * robot: the prepared robot root (split by parts, see lib/parts.js); heightM: overall height label.
 */
export function renderPlates(renderer, scene, robot, ids, { heightM }) {
  const meshes = []
  robot.traverse((o) => {
    if (o.isMesh && o.geometry.userData.groupParts && isShown(o)) meshes.push(o)
  })
  const restoreMaterials = meshes.map((m) => m.material)
  const restore = isolate(renderer, scene, meshes)
  const target = new WebGLRenderTarget(VIEW.width, VIEW.height, { samples: 4 })
  target.texture.colorSpace = SRGBColorSpace
  const pixels = new Uint8Array(VIEW.width * VIEW.height * 4)
  const cameras = { front: elevation([0, 0, 300]), side: elevation([300, 0, 0]) }

  const plates = {}
  try {
    for (const id of ids) {
      paint(meshes, restoreMaterials, id)
      const canvas = document.createElement('canvas')
      canvas.width = GUTTER + VIEW.width * 2 + GUTTER
      canvas.height = VIEW.height
      const ctx = canvas.getContext('2d')
      Object.values(cameras).forEach((camera, i) => {
        renderer.setRenderTarget(target)
        renderer.clear()
        renderer.render(scene, camera)
        renderer.readRenderTargetPixels(target, 0, 0, VIEW.width, VIEW.height, pixels)
        ctx.putImageData(flipRows(pixels), GUTTER + i * (VIEW.width + GUTTER), 0)
      })
      annotate(ctx, heightM)
      plates[id ?? 'all'] = canvas.toDataURL('image/png')
    }
  } finally {
    restore()
    target.dispose()
  }
  return plates
}

// --- scene isolation -----------------------------------------------------------

function isolate(renderer, scene, meshes) {
  const saved = {
    target: renderer.getRenderTarget(),
    alpha: renderer.getClearAlpha(),
    background: scene.background,
    fog: scene.fog,
    shadows: renderer.shadowMap.autoUpdate,
    materials: meshes.map((m) => m.material),
  }
  scene.background = null
  scene.fog = null
  renderer.shadowMap.autoUpdate = false
  renderer.setClearAlpha(0)
  meshes.forEach((m) => m.layers.enable(LAYER))

  return () => {
    renderer.setRenderTarget(saved.target)
    renderer.setClearAlpha(saved.alpha)
    renderer.shadowMap.autoUpdate = saved.shadows
    scene.background = saved.background
    scene.fog = saved.fog
    meshes.forEach((m, i) => {
      m.material = saved.materials[i]
      m.layers.disable(LAYER)
    })
  }
}

function elevation(position) {
  const halfH = FRAME.height / 2
  const halfW = (halfH * VIEW.width) / VIEW.height
  const camera = new OrthographicCamera(-halfW, halfW, halfH, -halfH, 1, 1000)
  camera.position.set(position[0], FRAME.centreY, position[2])
  camera.lookAt(0, FRAME.centreY, 0)
  camera.layers.set(LAYER)
  camera.updateMatrixWorld()
  return camera
}

// --- materials -------------------------------------------------------------------

const clay = {
  grey: matcap('#eef1f5', '#6b7480', '#1b2027'),
  accent: matcap('#ffe0a8', '#f0a64a', '#5a300a'),
  none: new MeshBasicMaterial({ visible: false }), // glow cards, glass, light beams: not part of the hull drawing
}

/** Clay everywhere, the chosen part in the accent colour; see-through materials are left out. */
function paint(meshes, originals, id) {
  meshes.forEach((mesh, i) => {
    const source = [].concat(originals[i])
    mesh.material = mesh.geometry.userData.groupParts.map((p, g) => {
      if ((source[g] ?? source[0]).transparent) return clay.none
      return p !== NO_PART && partId(p) === id ? clay.accent : clay.grey
    })
  })
}

/** A tiny spherical light study: light top-left, falling to a dark rim. */
function matcap(light, mid, dark) {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size * 0.36, size * 0.3, size * 0.04, size / 2, size / 2, size / 2)
  g.addColorStop(0, light)
  g.addColorStop(0.55, mid)
  g.addColorStop(1, dark)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return new MeshMatcapMaterial({ matcap: texture })
}

// --- drawing ---------------------------------------------------------------------

function flipRows(pixels) {
  const { width, height } = VIEW
  const out = new ImageData(width, height)
  const row = width * 4
  for (let y = 0; y < height; y++) out.data.set(pixels.subarray((height - 1 - y) * row, (height - y) * row), y * row)
  return out
}

/** Height dimension on the front view, floor line, view labels. */
function annotate(ctx, heightM) {
  const toPx = (y) => VIEW.height / 2 - ((y - FRAME.centreY) / (FRAME.height / 2)) * (VIEW.height / 2)
  const floor = toPx(0)
  const top = toPx(heightM)
  const x = GUTTER / 2
  ctx.strokeStyle = ctx.fillStyle = 'rgba(240,166,74,0.9)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x, floor)
  ctx.lineTo(x, top)
  for (const y of [floor, top]) {
    ctx.moveTo(x - 6, y)
    ctx.lineTo(x + 6, y)
  }
  ctx.stroke()
  ctx.save()
  ctx.translate(x - 6, (floor + top) / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.font = '11px "IBM Plex Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(`${heightM} m`, 0, 0)
  ctx.restore()

  ctx.strokeStyle = 'rgba(230,235,242,0.25)'
  ctx.beginPath()
  ctx.moveTo(GUTTER, floor + 0.5)
  ctx.lineTo(ctx.canvas.width - GUTTER, floor + 0.5)
  ctx.stroke()
  ctx.fillStyle = 'rgba(139,150,166,1)'
  ctx.font = '10px "IBM Plex Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('FRONT', GUTTER + VIEW.width / 2, VIEW.height - 6)
  ctx.fillText('SIDE', GUTTER * 2 + VIEW.width * 1.5, VIEW.height - 6)
}

function isShown(object) {
  for (let o = object; o; o = o.parent) if (!o.visible) return false
  return true
}
