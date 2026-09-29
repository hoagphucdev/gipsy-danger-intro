import { Suspense } from 'react'
import { CameraDirector } from './camera/CameraDirector'
import { Effects } from './Effects'
import { Lights } from './Lights'
import { Robot } from './Robot'
import { Stage } from './Stage'

/** Everything that lives inside the <Canvas>. */
export function Experience() {
  return (
    <>
      <Stage />
      <Lights />
      <Suspense fallback={null}>
        <Robot />
      </Suspense>
      <CameraDirector />
      <Effects />
    </>
  )
}
