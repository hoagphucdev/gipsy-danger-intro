import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BufferAttribute, BufferGeometry, MathUtils } from 'three'
import { WELD_RIGS, WELDING } from '../../config/world'
import { createRandom } from '../../lib/random'
import { createArcMaterial, createSparkMaterial, createTipOffsets, MAX_WELDERS, welderOn } from '../../lib/welding'
import { measureArm } from '../../lib/weldArm'
import { planWeldRigs, torchOffset } from '../../lib/weldRigs'
import { secondsSinceReady } from '../../store/useExperienceStore'
import { useRobotStore } from '../../store/useRobotStore'
import { usePointScale } from '../common/usePointScale'
import { WeldArm } from './WeldArm'
import { WeldRigFrames } from './WeldRigFrames'

const LIFT = { on: 0.15, off: 1.2 } // torch distance from the surface (m)

/**
 * Automatic welding rigs around the robot. They are planned against the robot's real surface,
 * so they appear once the robot is loaded (and re-plan when the arm loadout changes).
 * The point lights are always mounted so the light count never changes (no shader recompiles).
 */
export function WeldingStation() {
  const { scene: armTemplate } = useGLTF(WELD_RIGS.arm.url)
  const spec = useMemo(() => measureArm(armTemplate, WELD_RIGS.arm.scale), [armTemplate])
  const picker = useRobotStore((s) => s.picker)
  const loadout = useRobotStore((s) => s.loadout)
  // loadout is a dependency on purpose: swapping arm variants changes what the rays hit
  const rigs = useMemo(
    () => (picker ? planWeldRigs(picker, WELD_RIGS, spec).slice(0, MAX_WELDERS) : []),
    [picker, loadout, spec],
  )
  const lights = useRef([])

  return (
    <group>
      {rigs.length > 0 && <Rigs rigs={rigs} lights={lights} armTemplate={armTemplate} spec={spec} />}
      {Array.from({ length: WELDING.lights }, (_, i) => (
        <pointLight key={i} ref={(l) => (lights.current[i] = l)} color={WELDING.arcColor} decay={2} intensity={0} />
      ))}
    </group>
  )
}

function Rigs({ rigs, lights, armTemplate, spec }) {
  const tips = useMemo(createTipOffsets, [])
  const sparks = useMemo(() => createSparkMaterial(WELDING, tips), [tips])
  const arcs = useMemo(() => createArcMaterial(WELDING, tips), [tips])
  const sparkGeometry = useMemo(() => createSparkGeometry(rigs), [rigs])
  const arcGeometry = useMemo(() => createArcGeometry(rigs), [rigs])
  const arms = useRef([])
  const lift = useRef(rigs.map(() => LIFT.off))

  usePointScale([sparks, arcs])

  useFrame((_, dt) => {
    const t = sparks.uniforms.uTime.value
    const ready = secondsSinceReady() >= WELDING.startDelay
    sparks.uniforms.uActive.value = arcs.uniforms.uActive.value = ready ? 1 : 0

    rigs.forEach((rig, i) => {
      const on = ready && welderOn(t, i, WELDING)
      lift.current[i] = MathUtils.damp(lift.current[i], on ? LIFT.on : LIFT.off, 6, dt)
      torchOffset(rig, i, t, lift.current[i], WELD_RIGS, tips[i])
      arms.current[i]?.update(tips[i])

      const light = lights.current[i]
      if (!light) return
      light.position.copy(rig.point).add(tips[i]).addScaledVector(rig.normal, 0.6)
      light.intensity = on ? WELDING.lightIntensity * (0.6 + 0.4 * Math.random()) : 0
    })
  })

  return (
    <group>
      <WeldRigFrames rigs={rigs} />
      {rigs.map((rig, i) => (
        <WeldArm key={i} rig={rig} template={armTemplate} spec={spec} ref={(a) => (arms.current[i] = a)} />
      ))}
      <points geometry={sparkGeometry} material={sparks} frustumCulled={false} />
      <points geometry={arcGeometry} material={arcs} frustumCulled={false} />
    </group>
  )
}

/** Spark spray: away from the surface (along its normal), fanned out, then falling. */
function createSparkGeometry(rigs) {
  const rnd = createRandom(21)
  const n = rigs.length * WELDING.sparksPerWelder
  const origin = new Float32Array(n * 3)
  const velocity = new Float32Array(n * 3)
  const seed = new Float32Array(n)
  const welder = new Float32Array(n)
  let i = 0
  rigs.forEach(({ point, normal }, w) => {
    for (let k = 0; k < WELDING.sparksPerWelder; k++, i++) {
      const speed = WELDING.speed * rnd.range(0.3, 1)
      origin.set([point.x, point.y, point.z], i * 3)
      velocity.set(
        [
          (normal.x * 0.7 + rnd.range(-0.6, 0.6)) * speed,
          (normal.y * 0.7 + rnd.range(-0.3, 0.7)) * speed,
          (normal.z * 0.7 + rnd.range(-0.6, 0.6)) * speed,
        ],
        i * 3,
      )
      seed[i] = rnd.next()
      welder[i] = w
    }
  })
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(origin, 3))
  g.setAttribute('aVelocity', new BufferAttribute(velocity, 3))
  g.setAttribute('aSeed', new BufferAttribute(seed, 1))
  g.setAttribute('aWelder', new BufferAttribute(welder, 1))
  return g
}

function createArcGeometry(rigs) {
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(rigs.flatMap(({ point }) => [point.x, point.y, point.z])), 3))
  g.setAttribute('aWelder', new BufferAttribute(new Float32Array(rigs.map((_, w) => w)), 1))
  return g
}

useGLTF.preload(WELD_RIGS.arm.url)
