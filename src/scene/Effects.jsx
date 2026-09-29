import { Bloom, EffectComposer, SMAA, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { BLOOM } from '../config/scene'

// multisampling must stay 0: MSAA on the half-float composer buffer renders a black
// frame on NVIDIA/D3D11 (ANGLE). SMAA handles anti-aliasing instead.
export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={BLOOM.intensity}
        luminanceThreshold={BLOOM.threshold}
        luminanceSmoothing={BLOOM.smoothing}
        radius={BLOOM.radius}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <SMAA />
    </EffectComposer>
  )
}
