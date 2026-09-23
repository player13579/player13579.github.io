/* GPU-only preparation of the 128px world-kill residual light. The caller
 * owns the source texture and submits the encoder before sampling the result.
 * Call releaseRetired/release only after submitted work using those textures
 * has finished. */
(function (root) {
  'use strict';
  const size = 128;
  const weights = Array.from({ length: 13 }, (_, i) => Math.exp(-((i - 6) ** 2) / (2 * 2.2 ** 2)));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const kernel = weights.map(weight => weight / total);
  const wgsl = `
@group(0) @binding(0) var inputTexture: texture_2d<f32>;
@group(0) @binding(1) var inputSampler: sampler;
struct VertexOutput { @builtin(position) position: vec4f, @location(0) uv: vec2f };
@vertex fn vertex(@builtin(vertex_index) index: u32) -> VertexOutput {
  var positions = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  var output: VertexOutput;
  output.position = vec4f(positions[index], 0.0, 1.0);
  output.uv = output.position.xy * vec2f(0.5, -0.5) + vec2f(0.5, 0.5);
  return output;
}
const kernel = array<f32, 13>(${kernel.map(n => n.toFixed(10)).join(', ')});
@fragment fn horizontal(input: VertexOutput) -> @location(0) vec4f {
  var alpha = 0.0;
  for (var k = -6; k <= 6; k = k + 1) {
    let x = i32(input.uv.x * 128.0) + k;
    if (x >= 0 && x < 128) {
      let uv = vec2f((f32(x) + 0.5) / 128.0, input.uv.y);
      alpha = alpha + textureSampleLevel(inputTexture, inputSampler, uv, 0.0).a * kernel[u32(k + 6)];
    }
  }
  return vec4f(alpha, 0.0, 0.0, 1.0);
}
@fragment fn vertical(input: VertexOutput) -> @location(0) vec4f {
  var alpha = 0.0;
  let x = clamp(i32(input.uv.x * 128.0), 0, 127);
  let y = i32(input.uv.y * 128.0);
  for (var k = -6; k <= 6; k = k + 1) {
    let sampleY = y + k;
    if (sampleY >= 0 && sampleY < 128) {
      alpha = alpha + textureLoad(inputTexture, vec2i(x, sampleY), 0).r * kernel[u32(k + 6)];
    }
  }
  let opacity = min(1.0, alpha * 2.2);
  return vec4f(vec3f(221.0 / 255.0, 236.0 / 255.0, 1.0) * opacity, opacity);
}`;
  function create({ device } = {}) {
    if (!device || typeof device.createShaderModule !== 'function' ||
        typeof device.createRenderPipeline !== 'function' || typeof device.createTexture !== 'function') {
      throw new TypeError('A WebGPU device is required');
    }
    const usage = globalThis.GPUTextureUsage || { TEXTURE_BINDING: 4, RENDER_ATTACHMENT: 16 };
    const shader = device.createShaderModule({ label: 'world-kill-residual-bloom', code: wgsl });
    const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear', addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge' });
    const pipeline = (entryPoint, format) => device.createRenderPipeline({
      label: `world-kill-residual-${entryPoint}`, layout: 'auto',
      vertex: { module: shader, entryPoint: 'vertex' },
      fragment: { module: shader, entryPoint, targets: [{ format }] },
      primitive: { topology: 'triangle-list' }
    });
    const horizontalPipeline = pipeline('horizontal', 'rgba16float');
    const verticalPipeline = pipeline('vertical', 'rgba8unorm');
    let cache = null;
    const retired = [];
    function destroy(entry) {
      entry.intermediate.destroy();
      entry.texture.destroy();
    }
    function releaseRetired() {
      while (retired.length) destroy(retired.pop());
    }
    function release() {
      releaseRetired();
      if (cache) destroy(cache);
      cache = null;
    }
    function prepare({ sourceTexture, revision = 0, encoder } = {}) {
      if (!sourceTexture || typeof sourceTexture.createView !== 'function' ||
          !encoder || typeof encoder.beginRenderPass !== 'function') {
        throw new TypeError('Source GPU texture and command encoder are required');
      }
      if (cache && cache.sourceTexture === sourceTexture && cache.revision === revision) return cache.asset;
      const intermediate = device.createTexture({ label: 'world-kill-residual-horizontal',
        size: [size, size], format: 'rgba16float', usage: usage.TEXTURE_BINDING | usage.RENDER_ATTACHMENT });
      const texture = device.createTexture({ label: 'world-kill-residual-bloom',
        size: [size, size], format: 'rgba8unorm', usage: usage.TEXTURE_BINDING | usage.RENDER_ATTACHMENT });
      const run = (target, source, renderPipeline, sample) => {
        const pass = encoder.beginRenderPass({ colorAttachments: [{ view: target.createView(),
          loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 0] }] });
        pass.setPipeline(renderPipeline);
        const entries = [{ binding: 0, resource: source.createView() }];
        if (sample) entries.push({ binding: 1, resource: sampler });
        pass.setBindGroup(0, device.createBindGroup({ layout: renderPipeline.getBindGroupLayout(0), entries }));
        pass.draw(3);
        pass.end();
      };
      try {
        run(intermediate, sourceTexture, horizontalPipeline, true);
        run(texture, intermediate, verticalPipeline, false);
      } catch (error) {
        intermediate.destroy();
        texture.destroy();
        throw error;
      }
      const asset = Object.freeze({ texture, width: size, height: size });
      if (cache) retired.push(cache);
      cache = { sourceTexture, revision, intermediate, texture, asset };
      return asset;
    }
    return Object.freeze({ prepare, releaseRetired, release, shader });
  }
  const api = Object.freeze({ create, wgsl, kernel, size });
  root.DvaWebGPUKillResidualBloom = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
