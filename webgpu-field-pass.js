/* Authored field pass for the shared WebGPU frame. This module owns no canvas,
 * adapter, device, RAF or Canvas 2D fallback. Its caller supplies the ordered
 * frame and a WebGPU presentation target registered with the frame core. */
(function (root) {
  'use strict';

  const field = root.DvaWebGPUFieldStatic || (typeof require === 'function' ? require('./webgpu-field-static.js') : null);
  const textureUsage = root.GPUTextureUsage || { COPY_DST: 0x02, TEXTURE_BINDING: 0x04, RENDER_ATTACHMENT: 0x10 };
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const align = value => Math.ceil(value / 256) * 256;

  async function create(options = {}) {
    const { owner, map, image } = options;
    if (!field?.createGeometryMask || !field?.shader) throw new Error('WebGPU authored field module unavailable');
    if (!owner || owner.state !== 'ready') throw new Error('Shared WebGPU frame owner unavailable');
    if (!map || !Number.isInteger(map.width) || !Number.isInteger(map.height) ||
        map.width < 1 || map.height < 1 || !image || image.complete === false ||
        Number(image.naturalWidth ?? image.width) !== map.width ||
        Number(image.naturalHeight ?? image.height) !== map.height) {
      throw new Error('Authored map image and geometry must match');
    }
    const device = owner.device;
    if (Math.max(map.width, map.height) > device.limits.maxTextureDimension2D) {
      throw new RangeError('Authored map exceeds WebGPU texture limit');
    }
    const resources = [];
    const own = resource => { resources.push(resource); return resource; };
    let destroyed = false;
    try {
      const module = device.createShaderModule({ label: 'DVA shared authored field shader', code: field.shader });
      if (typeof module.getCompilationInfo === 'function') {
        const info = await module.getCompilationInfo();
        const errors = info.messages.filter(message => message.type === 'error');
        if (errors.length) throw new Error(errors.map(message => message.message).join('; '));
      }
      const pipelineDescriptor = { layout: 'auto', vertex: { module, entryPoint: 'vs' },
        fragment: { module, entryPoint: 'fs', targets: [{ format: owner.format }] },
        primitive: { topology: 'triangle-list' } };
      const pipeline = typeof device.createRenderPipelineAsync === 'function'
        ? await device.createRenderPipelineAsync(pipelineDescriptor)
        : device.createRenderPipeline(pipelineDescriptor);
      if (owner.state !== 'ready') throw new Error('Shared WebGPU device lost during field setup');
      const uniform = own(device.createBuffer({ size: 48, usage: 0x40 | 0x08 }));
      const material = own(device.createTexture({ label: 'DVA authored field image',
        size: [map.width, map.height], format: 'rgba8unorm',
        usage: textureUsage.COPY_DST | textureUsage.TEXTURE_BINDING | textureUsage.RENDER_ATTACHMENT }));
      const geometry = own(device.createTexture({ label: 'DVA authored field coverage',
        size: [map.width, map.height], format: 'r8unorm', usage: 0x04 | 0x02 }));
      device.queue.copyExternalImageToTexture({ source: image },
        { texture: material, premultipliedAlpha: true, colorSpace: 'srgb' }, [map.width, map.height]);
      const alpha = options.mask || field.createGeometryMask(map);
      if (!(alpha instanceof Uint8Array) || alpha.byteLength !== map.width * map.height) {
        throw new Error('Authored field coverage has invalid dimensions');
      }
      const bytesPerRow = align(map.width);
      const upload = bytesPerRow === map.width ? alpha : new Uint8Array(bytesPerRow * map.height);
      if (upload !== alpha) {
        for (let y = 0; y < map.height; y += 1) {
          upload.set(alpha.subarray(y * map.width, (y + 1) * map.width), y * bytesPerRow);
        }
      }
      device.queue.writeTexture({ texture: geometry }, upload, { bytesPerRow }, [map.width, map.height]);
      const sampler = device.createSampler({ minFilter: 'linear', magFilter: 'linear',
        addressModeU: 'clamp-to-edge', addressModeV: 'clamp-to-edge' });
      const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
        { binding: 0, resource: { buffer: uniform } },
        { binding: 1, resource: material.createView() },
        { binding: 2, resource: geometry.createView() },
        { binding: 3, resource: sampler }
      ] });
      return Object.freeze({
        enqueue(frame, { target, width, height, pixelWidth = width, pixelHeight = height,
          cameraX, cameraY, zoom } = {}) {
          if (destroyed || owner.state !== 'ready') throw new Error('Shared WebGPU field pass unavailable');
          if (!frame || typeof frame.add !== 'function' || typeof target !== 'string' || !target ||
              !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 ||
              !Number.isInteger(pixelWidth) || !Number.isInteger(pixelHeight) ||
              pixelWidth < 1 || pixelHeight < 1 ||
              ![cameraX, cameraY, zoom].every(finite) || zoom <= 0) {
            throw new TypeError('Invalid WebGPU field frame or camera');
          }
          device.queue.writeBuffer(uniform, 0, new Float32Array([
            width, height, pixelWidth, pixelHeight, cameraX, cameraY, zoom, 0,
            map.width, map.height, 0, 0
          ]));
          frame.add({ target, label: 'map:authored-field',
            clear: { r: 205 / 255, g: 238 / 255, b: 250 / 255, a: 1 },
            encode(pass, info) {
              if (info.width !== pixelWidth || info.height !== pixelHeight) {
                throw new Error('Field backing dimensions differ from committed presentation target');
              }
              pass.setPipeline(pipeline);
              pass.setBindGroup(0, bind);
              pass.draw(3);
            }
          });
          return frame;
        },
        destroy() {
          if (destroyed) return;
          destroyed = true;
          for (const resource of resources) {
            try { resource.destroy(); } catch (_) {}
          }
          resources.length = 0;
        }
      });
    } catch (error) {
      for (const resource of resources) {
        try { resource.destroy(); } catch (_) {}
      }
      throw error;
    }
  }

  const api = Object.freeze({ create });
  root.DvaWebGPUFieldPass = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
