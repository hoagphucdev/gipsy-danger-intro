/**
 * Add a shader patch to a built-in material without replacing earlier ones.
 * patch(shader) edits shader.vertexShader / fragmentShader / uniforms; `key` names the patch
 * so materials with the same set of patches share one compiled program.
 */
export function patchShader(material, key, patch) {
  const previous = material.onBeforeCompile
  material.onBeforeCompile = (shader, renderer) => {
    previous.call(material, shader, renderer)
    patch(shader)
  }
  const keys = [...(material.userData.shaderPatches ?? []), key]
  material.userData.shaderPatches = keys
  material.customProgramCacheKey = () => keys.join('|')
}
