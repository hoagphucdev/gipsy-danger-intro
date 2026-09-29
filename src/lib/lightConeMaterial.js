import { AdditiveBlending, Color, ShaderMaterial } from 'three'

/**
 * Fake volumetric beam: additive, bright near the lamp, fading along the cone and
 * towards its silhouette edges. Use on an open-ended cylinder whose top (uv.y = 1) is the lamp.
 */
export function createLightConeMaterial({ color, intensity = 0.25 }) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uColor: { value: new Color(color) }, uIntensity: { value: intensity } },
    vertexShader: /* glsl */ `
      varying float vAlong;
      varying float vFacing;
      void main() {
        vAlong = uv.y;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normal);
        vFacing = abs(dot(n, normalize(-mv.xyz)));
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying float vAlong;
      varying float vFacing;
      void main() {
        float a = pow(clamp(vAlong, 0.0, 1.0), 1.6) * vFacing * vFacing * uIntensity;
        gl_FragColor = vec4(uColor * a, a);
      }`,
  })
}
