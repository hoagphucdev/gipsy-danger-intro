import { useMemo } from 'react'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, ShaderMaterial } from 'three'
import { DUST } from '../../config/world'
import { createRandom } from '../../lib/random'
import { createRadialTexture } from '../../lib/textures'
import { usePointScale } from '../common/usePointScale'

/**
 * Slowly drifting dust motes in a box. Replaces drei <Sparkles>, whose shader divides by
 * the distance to the point centre and writes Inf into the HDR buffer (bloom then blanks the screen).
 */
export function AmbientDust() {
  const { count, scale, position, size, speed, color } = DUST
  const geometry = useMemo(() => {
    const rnd = createRandom(11)
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos.set([(rnd.next() - 0.5) * scale[0], (rnd.next() - 0.5) * scale[1], (rnd.next() - 0.5) * scale[2]], i * 3)
      seed[i] = rnd.next() * 100
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new BufferAttribute(seed, 1))
    return g
  }, [count, scale])

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: size },
          uScale: { value: 1 },
          uMap: { value: createRadialTexture(64) },
          uColor: { value: new Color(color) },
        },
        vertexShader: /* glsl */ `
          uniform float uTime, uSize, uScale;
          attribute float aSeed;
          varying float vAlpha;
          void main() {
            vec3 p = position + vec3(sin(uTime * 0.3 + aSeed), sin(uTime * 0.2 + aSeed * 1.7), cos(uTime * 0.25 + aSeed)) * 2.0;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * 0.05 * uScale / -mv.z;
            vAlpha = 0.5 + 0.5 * sin(uTime * 1.3 + aSeed * 5.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform sampler2D uMap;
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            gl_FragColor = vec4(uColor, texture2D(uMap, gl_PointCoord).a * vAlpha * 0.6);
          }`,
      }),
    [size, color],
  )

  usePointScale(material, speed * 4)

  return <points geometry={geometry} material={material} position={position} frustumCulled={false} />
}
