import { AdditiveBlending, Color, ShaderMaterial, Vector3 } from 'three'
import { createRadialTexture } from './textures'

/**
 * Whether welder w is burning at time t. Same formula in JS (lights) and GLSL (particles),
 * using only small numbers so both agree.
 */
export function welderOn(t, w, { rate, duty }) {
  const k = Math.floor(t * rate + w * 0.37)
  const x = k * 0.618034 + w * 0.29
  return x - Math.floor(x) < duty
}

const WELDER_ON_GLSL = /* glsl */ `
  float welderOn(float t, float w) {
    float k = floor(t * uRate + w * 0.37);
    return step(fract(k * 0.618034 + w * 0.29), uDuty);
  }`

export const MAX_WELDERS = 16

/** Per-welder torch offsets, shared by the particles (uniform) and whoever moves the torches. */
export const createTipOffsets = () => Array.from({ length: MAX_WELDERS }, () => new Vector3())

const TIPS_GLSL = /* glsl */ `
  #define MAX_WELDERS ${MAX_WELDERS}
  uniform vec3 uTips[MAX_WELDERS];`

const ADDITIVE = { transparent: true, depthWrite: false, blending: AdditiveBlending }

const baseUniforms = (cfg, color, size, tips) => ({
  uTime: { value: 0 },
  uActive: { value: 0 }, // 0..1, welding only runs once the dock sequence is done
  uTips: { value: tips }, // current torch offset from each welder's anchor point
  uRate: { value: cfg.rate },
  uDuty: { value: cfg.duty },
  uSize: { value: size },
  uScale: { value: 1 },
  uColor: { value: new Color(color) },
  uMap: { value: createRadialTexture(32) },
})

/**
 * Looping spark particles. Attributes: position = welder anchor, aVelocity, aSeed (0..1), aWelder.
 * Each spark re-emits every `life` seconds from the moving torch tip (anchor + uTips[welder]);
 * it only shows if its welder was on when it was emitted.
 */
export function createSparkMaterial(cfg, tips) {
  return new ShaderMaterial({
    ...ADDITIVE,
    uniforms: { ...baseUniforms(cfg, cfg.sparkColor, cfg.sparkSize, tips), uLife: { value: cfg.life }, uGravity: { value: cfg.gravity } },
    vertexShader: /* glsl */ `
      uniform float uTime, uActive, uRate, uDuty, uSize, uScale, uLife, uGravity;
      attribute vec3 aVelocity;
      attribute float aSeed, aWelder;
      varying float vBright;
      ${TIPS_GLSL}
      ${WELDER_ON_GLSL}
      void main() {
        float life = uLife * (0.5 + 0.5 * aSeed);
        float t = mod(uTime + aSeed * 17.0, life);
        float on = welderOn(uTime - t, aWelder) * uActive;
        vec3 origin = position + uTips[int(aWelder)];
        vec3 p = origin + aVelocity * t + vec3(0.0, 0.5 * uGravity * t * t, 0.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float fade = 1.0 - t / life;
        gl_PointSize = max(1.5, uSize * uScale * fade / -mv.z);
        vBright = fade * fade * on;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform vec3 uColor;
      varying float vBright;
      void main() {
        float a = texture2D(uMap, gl_PointCoord).a * vBright;
        if (a < 0.01) discard;
        gl_FragColor = vec4(uColor * 5.0 * a, a); // HDR -> bloom
      }`,
  })
}

/** Flickering arc glow at each torch tip. Attributes: position = welder anchor, aWelder. */
export function createArcMaterial(cfg, tips) {
  return new ShaderMaterial({
    ...ADDITIVE,
    uniforms: baseUniforms(cfg, cfg.arcColor, cfg.arcSize, tips),
    vertexShader: /* glsl */ `
      uniform float uTime, uActive, uRate, uDuty, uSize, uScale;
      attribute float aWelder;
      varying float vBright;
      ${TIPS_GLSL}
      ${WELDER_ON_GLSL}
      void main() {
        vec4 mv = modelViewMatrix * vec4(position + uTips[int(aWelder)], 1.0);
        gl_Position = projectionMatrix * mv;
        float flicker = 0.6 + 0.4 * fract(sin(floor(uTime * 30.0) + aWelder * 7.0) * 43.7);
        vBright = welderOn(uTime, aWelder) * uActive * flicker;
        gl_PointSize = uSize * uScale * (0.7 + 0.5 * flicker) / -mv.z;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform vec3 uColor;
      varying float vBright;
      void main() {
        float a = texture2D(uMap, gl_PointCoord).a * vBright;
        if (a < 0.01) discard;
        gl_FragColor = vec4(uColor * 10.0 * a, a);
      }`,
  })
}
