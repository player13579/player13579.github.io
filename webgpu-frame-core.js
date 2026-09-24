/* Shared WebGPU frame owner. No Canvas 2D context or fallback is created here.
 * Callers supply ordered render-pass commands; material pipelines live in other modules. */
(function (root) {
  'use strict';

  function createFailure(reason) {
    return reason instanceof Error ? reason :
      new Error(String(reason?.message || reason || 'WebGPU unavailable'));
  }

  async function create(options = {}) {
    const gpu = options.gpu || root.navigator?.gpu;
    if (!gpu) throw new Error('WebGPU unavailable');
    const adapter = await gpu.requestAdapter({ powerPreference: options.powerPreference || 'high-performance' });
    if (!adapter) throw new Error('WebGPU adapter unavailable');
    const device = await adapter.requestDevice(options.deviceDescriptor || {});
    const format = options.format || gpu.getPreferredCanvasFormat();
    const targets = new Map();
    const resources = new Set();
    let state = 'ready';
    let activeFrame = null;
    let failure = null;

    function requireReady() {
      if (state !== 'ready') throw failure || new Error('WebGPU frame owner destroyed');
    }

    function stop(reason, report) {
      if (state !== 'ready') return;
      state = report ? 'failed' : 'destroyed';
      failure = report ? createFailure(reason) : null;
      activeFrame = null;
      for (const target of targets.values()) {
        try { target.context?.unconfigure(); } catch (_) {}
      }
      targets.clear();
      for (const resource of resources) {
        try { resource.destroy(); } catch (_) {}
      }
      resources.clear();
      try { device.removeEventListener?.('uncapturederror', onUncapturedError); } catch (_) {}
      try { device.destroy(); } catch (_) {}
      if (report) {
        try { options.onFailure?.(failure); } catch (error) { root.console?.error?.('WebGPU failure callback failed', error); }
      }
    }

    function onUncapturedError(event) {
      event.preventDefault?.();
      stop(event.error || 'WebGPU uncaptured error', true);
    }
    device.addEventListener?.('uncapturederror', onUncapturedError);
    device.lost.then(
      info => stop(info?.message || 'WebGPU device lost', true),
      error => stop(error || 'WebGPU device lost', true)
    );

    function dimensions(width, height) {
      const max = device.limits.maxTextureDimension2D;
      if (![width, height].every(Number.isInteger) || width < 1 || height < 1 || width > max || height > max) {
        throw new RangeError('Invalid WebGPU presentation size');
      }
    }

    function registerTarget(id, canvas, settings = {}) {
      requireReady();
      if (activeFrame) throw new Error('Cannot register a target during a frame');
      if (typeof id !== 'string' || !id || targets.has(id)) throw new Error('Invalid or duplicate WebGPU target');
      if (!canvas || typeof canvas.getContext !== 'function') throw new TypeError('WebGPU target requires a canvas');
      const context = canvas.getContext('webgpu');
      if (!context) throw new Error('WebGPU presentation context unavailable');
      const width = settings.width ?? canvas.width;
      const height = settings.height ?? canvas.height;
      dimensions(width, height);
      const configuration = { device, format: settings.format || format, alphaMode: settings.alphaMode || 'opaque' };
      canvas.width = width;
      canvas.height = height;
      context.configure(configuration);
      const target = { id, canvas, context, configuration, width, height, sampleable: false };
      targets.set(id, target);
      return Object.freeze({
        get width() { return target.width; },
        get height() { return target.height; },
        resize(nextWidth, nextHeight) {
          requireReady();
          if (activeFrame) throw new Error('Cannot resize a target during a frame');
          dimensions(nextWidth, nextHeight);
          if (nextWidth === target.width && nextHeight === target.height) return false;
          target.canvas.width = nextWidth;
          target.canvas.height = nextHeight;
          target.width = nextWidth;
          target.height = nextHeight;
          target.context.configure(target.configuration);
          return true;
        },
        unregister() {
          if (activeFrame) throw new Error('Cannot unregister a target during a frame');
          if (targets.get(id) !== target) return false;
          targets.delete(id);
          target.context.unconfigure();
          return true;
        }
      });
    }

    // The caller owns this RENDER_ATTACHMENT | TEXTURE_BINDING texture. Unlike a
    // presentation texture, it can be read by a later encoder-level composite.
    function registerTextureTarget(id, texture, settings = {}) {
      requireReady();
      if (activeFrame) throw new Error('Cannot register a target during a frame');
      if (typeof id !== 'string' || !id || targets.has(id)) throw new Error('Invalid or duplicate WebGPU target');
      if (!texture || typeof texture.createView !== 'function') throw new TypeError('Sampleable target requires a GPU texture');
      const { width, height } = settings;
      dimensions(width, height);
      const target = { id, texture, width, height, sampleable: true,
        configuration: { format: settings.format || format } };
      targets.set(id, target);
      return Object.freeze({
        get width() { return width; },
        get height() { return height; },
        get texture() { return texture; },
        unregister() {
          if (activeFrame) throw new Error('Cannot unregister a target during a frame');
          if (targets.get(id) !== target) return false;
          targets.delete(id);
          return true;
        }
      });
    }

    function beginFrame(label = 'DVA frame') {
      requireReady();
      if (activeFrame) throw new Error('A WebGPU frame is already open');
      const commands = [];
      const frame = {};
      activeFrame = frame;
      function requireActive() {
        requireReady();
        if (activeFrame !== frame) throw new Error('WebGPU frame is closed');
      }
      frame.add = function (command) {
        requireActive();
        if (!command || !targets.has(command.target) || typeof command.encode !== 'function') {
          throw new TypeError('Frame command requires a registered target and encode callback');
        }
        if (command.clear && !['r', 'g', 'b', 'a'].every(key => Number.isFinite(command.clear[key]))) {
          throw new TypeError('Frame clear color must have finite RGBA values');
        }
        commands.push({ kind: 'pass', target: command.target, label: String(command.label || ''), clear: command.clear, encode: command.encode });
        return frame;
      };
      frame.addEncoder = function (command) {
        requireActive();
        if (!command || typeof command.encode !== 'function' || !Array.isArray(command.reads) || !Array.isArray(command.writes)) {
          throw new TypeError('Encoder command requires reads, writes and encode callback');
        }
        const reads = command.reads.slice(), writes = command.writes.slice();
        if (!writes.length || new Set([...reads, ...writes]).size !== reads.length + writes.length ||
          [...reads, ...writes].some(id => !targets.has(id)) || reads.some(id => !targets.get(id).sampleable)) {
          throw new Error('Encoder command needs distinct registered targets and sampleable reads');
        }
        commands.push({ kind: 'encoder', label: String(command.label || ''), reads, writes, encode: command.encode });
        return frame;
      };
      frame.discard = function () {
        requireActive();
        activeFrame = null;
      };
      frame.submit = function () {
        requireActive();
        activeFrame = null;
        if (!commands.length) return 0;
        const encoder = device.createCommandEncoder({ label });
        const views = new Map();
        const painted = new Set();
        const view = id => {
          if (!views.has(id)) {
            const target = targets.get(id);
            views.set(id, (target.texture || target.context.getCurrentTexture()).createView());
          }
          return views.get(id);
        };
        try {
          for (const command of commands) {
            if (command.kind === 'encoder') {
              if (command.reads.some(id => !painted.has(id))) {
                throw new Error('Encoder cannot read a target before it is painted in this frame');
              }
              const allowed = new Set([...command.reads, ...command.writes]);
              command.encode(encoder, Object.freeze({
                device, format, view(id) {
                  if (!allowed.has(id)) throw new Error('Undeclared encoder target');
                  return view(id);
                },
                size(id) {
                  if (!allowed.has(id)) throw new Error('Undeclared encoder target');
                  const target = targets.get(id);
                  return { width: target.width, height: target.height };
                }
              }));
              for (const id of command.writes) painted.add(id);
              continue;
            }
            const target = targets.get(command.target);
            const first = !painted.has(command.target);
            if (first && !command.clear) throw new Error('First pass for each target must clear it');
            const pass = encoder.beginRenderPass({
              label: command.label,
              colorAttachments: [{
                view: view(command.target),
                loadOp: first ? 'clear' : 'load',
                clearValue: first ? command.clear : undefined,
                storeOp: 'store'
              }]
            });
            try {
              command.encode(pass, Object.freeze({
                device, target: command.target, width: target.width, height: target.height,
                format: target.configuration.format, firstPass: first
              }));
            } finally {
              pass.end();
            }
            painted.add(command.target);
          }
          device.queue.submit([encoder.finish()]);
          return commands.length;
        } catch (error) {
          throw createFailure(error);
        }
      };
      return frame;
    }

    return Object.freeze({
      get state() { return state; },
      get failure() { return failure; },
      get device() { requireReady(); return device; },
      get format() { return format; },
      registerTarget,
      registerTextureTarget,
      beginFrame,
      own(resource) {
        requireReady();
        if (!resource || typeof resource.destroy !== 'function') throw new TypeError('Owned GPU resource must be destroyable');
        resources.add(resource);
        return resource;
      },
      release(resource) { return resources.delete(resource); },
      destroy() { stop(null, false); }
    });
  }

  const api = Object.freeze({ create });
  root.DvaWebGPUFrameCore = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
