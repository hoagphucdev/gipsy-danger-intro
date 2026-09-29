import { Canvas } from '@react-three/fiber'
import { INTRO, LENS } from './config/camera'
import { Experience } from './scene/Experience'
import { Credits } from './ui/Credits'
import { IntroHero } from './ui/intro/IntroHero'
import { LoadoutPanel } from './ui/LoadoutPanel'
import { TourUI } from './ui/TourUI'

export default function App() {
  return (
    <>
      <Canvas
        shadows="percentage"
        dpr={[1, 2]}
        gl={{ antialias: false }}
        camera={{ ...LENS, position: INTRO.keys[0].position }}
        onCreated={(state) => import.meta.env.DEV && (window.__r3f = state)} // devtools / automated checks
      >
        <Experience />
      </Canvas>
      {/* <LoadoutPanel /> */}
      <IntroHero />
      <TourUI />
      <Credits />
    </>
  )
}
