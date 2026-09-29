import { Suspense } from 'react'
import { FOG } from '../config/scene'
import { AmbientDust } from './fx/AmbientDust'
import { Beacons } from './world/Beacons'
import { Floodlights } from './world/Floodlights'
import { Hangar } from './world/Hangar'
import { Scaffolding } from './world/Scaffolding'
import { WeldingStation } from './world/WeldingStation'
import { Workers } from './world/Workers'

/** The repair bay around the robot. Add new set pieces here. */
export function Stage() {
  return (
    <>
      <color attach="background" args={[FOG.color]} />
      <fogExp2 attach="fog" args={[FOG.color, FOG.density]} />
      <Hangar />
      <Scaffolding />
      <Workers />
      <Floodlights />
      <Beacons />
      <Suspense fallback={null}>
        <WeldingStation />
      </Suspense>
      <AmbientDust />
    </>
  )
}
