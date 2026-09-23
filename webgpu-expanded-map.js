/* Dormant expanded-map WebGPU pass. The caller owns the device, registered
 * presentation target, committed viewport, frame submission, and disposal.
 * No canvas context or second GPU device is created here.
 * Pending cutover: load this module with the shared frame driver, register the
 * expanded target, prepare atlas pages, and verify visual/input parity live.
 * Canvas round room-stroke joins and exact Segoe UI bold glyph shapes remain
 * approximations (square joins and the shared WebGPU font atlas). */
(function (root) {
  'use strict';

  const shader = /* wgsl */ `
struct View { size: vec2f, unused: vec2f }
@group(0) @binding(0) var<uniform> view: View;
struct Vertex { @location(0) position: vec2f, @location(1) color: vec4f }
struct Fragment { @builtin(position) position: vec4f, @location(0) color: vec4f }
@vertex fn vs(input: Vertex) -> Fragment {
  var output: Fragment;
  output.position = vec4f(input.position / view.size * vec2f(2.0, -2.0) + vec2f(-1.0, 1.0), 0.0, 1.0);
  output.color = input.color;
  return output;
}
@fragment fn fs(input: Fragment) -> @location(0) vec4f {
  return vec4f(input.color.rgb * input.color.a, input.color.a);
}`;
  const hex = value => [1, 3, 5].map(index => parseInt(value.slice(index, index + 2), 16) / 255).concat(1);
  const clamp = value => Math.max(0, Math.min(1, value));

  function create({ device, format, text } = {}) {
    if (!device?.createRenderPipeline || !device?.createBuffer || !device?.queue?.writeBuffer ||
        typeof format !== 'string' || !format) throw new TypeError('Shared WebGPU device and format required');
    const module = device.createShaderModule({ label: 'DVA expanded map vectors', code: shader });
    const pipeline = device.createRenderPipeline({
      label: 'DVA expanded map vectors', layout: 'auto',
      vertex: { module, entryPoint: 'vs', buffers: [{ arrayStride: 24, attributes: [
        { shaderLocation: 0, offset: 0, format: 'float32x2' },
        { shaderLocation: 1, offset: 8, format: 'float32x4' }
      ] }] },
      fragment: { module, entryPoint: 'fs', targets: [{ format, blend: {
        color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
        alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' }
      } }] },
      primitive: { topology: 'triangle-list' }
    });
    let destroyed = false;
    const live = new Set();

    function labels(scene) {
      const values = (scene?.map?.rooms || []).map(room => room.label).filter(Boolean);
      if ((scene?.worldSoundEffects || []).length) values.push('心臓転移');
      if (scene?.hackTracking || scene?.hackEffective) {
        values.push(...(scene.players || []).filter(player =>
          player.id !== scene.selfId && player.alive && !player.ejected).map(player => player.label).filter(Boolean));
      }
      if ((scene?.players || []).some(player => player.id === scene.selfId && !player.ejected)) values.push('現在地');
      return [...new Set(values.map(String))];
    }

    async function prepare(scene) {
      if (destroyed) throw new Error('Expanded map renderer destroyed');
      if (!text?.ensure) throw new Error('Expanded map text atlas loader required');
      await Promise.all(labels(scene).map(value => text.ensure(value)));
    }

    function draw({ frame, target, viewport, scene } = {}) {
      if (destroyed) throw new Error('Expanded map renderer destroyed');
      if (!frame?.clear || !frame?.add || !frame?.sprite || !scene?.map ||
          viewport?.kind !== 'expanded' || viewport.width !== 1200 || viewport.height !== 760 ||
          !Number.isFinite(viewport.pixelWidth) || !Number.isFinite(viewport.pixelHeight) ||
          !Array.isArray(viewport.worldToPixel)) throw new TypeError('Committed expanded viewport, scene and shared frame required');
      const map = scene.map;
      const scale = viewport.worldToLogical[0];
      const pixelX = viewport.logicalToPixel[0], pixelY = viewport.logicalToPixel[3];
      if (!(map.width > 0 && map.height > 0 && scale > 0 && pixelX > 0 && pixelY > 0)) {
        throw new RangeError('Invalid expanded map geometry');
      }
      const logicalPoint = (x, y) => ({ x: viewport.worldToLogical[0] * x + viewport.worldToLogical[4],
        y: viewport.worldToLogical[3] * y + viewport.worldToLogical[5] });
      const point = (x, y) => ({ x: viewport.worldToPixel[0] * x + viewport.worldToPixel[4],
        y: viewport.worldToPixel[3] * y + viewport.worldToPixel[5] });
      const allocated = [];
      let vertices = [];
      const emit = (x, y, color) => { const p = point(x, y); vertices.push(p.x, p.y, ...color); };
      const tri = (a, b, c, color) => { emit(...a, color); emit(...b, color); emit(...c, color); };
      const quad = (a, b, c, d, color) => { tri(a, b, c, color); tri(a, c, d, color); };
      const rect = (x, y, w, h, color) => {
        if (w <= 0 || h <= 0) return;
        quad([x, y], [x + w, y], [x + w, y + h], [x, y + h], color);
      };
      const line = (ax, ay, bx, by, width, color) => {
        const length = Math.hypot(bx - ax, by - ay);
        if (!length) return;
        const nx = (by - ay) * width / (length * 2), ny = (ax - bx) * width / (length * 2);
        quad([ax + nx, ay + ny], [bx + nx, by + ny],
          [bx - nx, by - ny], [ax - nx, ay - ny], color);
      };
      const disc = (x, y, radius, color) => {
        const count = 48;
        for (let i = 0; i < count; i++) {
          const a = i * Math.PI * 2 / count, b = (i + 1) * Math.PI * 2 / count;
          tri([x, y], [x + Math.cos(a) * radius, y + Math.sin(a) * radius],
            [x + Math.cos(b) * radius, y + Math.sin(b) * radius], color);
        }
      };
      const ring = (x, y, radius, width, color) => {
        const count = 48, outer = radius + width / 2, inner = Math.max(0, radius - width / 2);
        for (let i = 0; i < count; i++) {
          const a = i * Math.PI * 2 / count, b = (i + 1) * Math.PI * 2 / count;
          quad([x + Math.cos(a) * inner, y + Math.sin(a) * inner],
            [x + Math.cos(a) * outer, y + Math.sin(a) * outer],
            [x + Math.cos(b) * outer, y + Math.sin(b) * outer],
            [x + Math.cos(b) * inner, y + Math.sin(b) * inner], color);
        }
      };
      const flush = () => {
        if (!vertices.length) return;
        const data = new Float32Array(vertices);
        vertices = [];
        const buffer = device.createBuffer({ label: 'DVA expanded map vertices', size: data.byteLength, usage: 0x20 | 0x08 });
        const uniform = device.createBuffer({ label: 'DVA expanded map viewport', size: 16, usage: 0x40 | 0x08 });
        allocated.push(buffer, uniform);
        device.queue.writeBuffer(buffer, 0, data);
        device.queue.writeBuffer(uniform, 0, new Float32Array([viewport.pixelWidth, viewport.pixelHeight, 0, 0]));
        const group = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniform } }] });
        frame.add({ target, label: 'expanded-map:vectors', encode(pass) {
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, group);
          pass.setVertexBuffer(0, buffer);
          pass.draw(data.length / 6);
        } });
      };
      const label = (value, x, y, size, color) => {
        if (!value) return;
        if (!text?.layout || !Array.isArray(text.textures)) throw new Error('Expanded map labels require a loaded WebGPU text atlas');
        flush();
        // Shared primitive sprites are expressed in 1200x760 logical units;
        // only this module's vector shader consumes physical backing pixels.
        const p = logicalPoint(x, y);
        const layout = text.layout(String(value), { x: 0, y: 0, size: size * scale });
        for (const glyph of layout.quads) {
          const texture = text.textures[glyph.page];
          if (!texture) throw new Error('Expanded map text atlas page is not loaded');
          frame.sprite(target, { x: p.x + glyph.x - layout.width / 2,
            y: p.y + glyph.y - layout.height / 2,
            w: glyph.w, h: glyph.h,
            uv: glyph.uv, texture, color });
        }
      };
      frame.clear(target, hex('#d7e3e9'));
      frame.stage('expanded-map');
      const corridors = map.corridors || [];
      for (const corridor of corridors) {
        const segments = Array.isArray(corridor?.renderSegments) && corridor.renderSegments.length
          ? corridor.renderSegments : [corridor];
        for (const segment of segments) rect(segment.x, segment.y, segment.w, segment.h, hex('#a8bbc5'));
      }
      for (const room of map.rooms || []) {
        rect(room.x, room.y, room.w, room.h, hex('#758e9d'));
        const outline = hex('#425968');
        rect(room.x - 4, room.y - 4, room.w + 8, 8, outline);
        rect(room.x - 4, room.y + room.h - 4, room.w + 8, 8, outline);
        rect(room.x - 4, room.y + 4, 8, room.h - 8, outline);
        rect(room.x + room.w - 4, room.y + 4, 8, room.h - 8, outline);
      }
      for (const room of map.rooms || []) label(room.label, room.x + room.w / 2,
        room.y + room.h / 2, 54, hex('#294454'));
      for (const task of scene.tasks || []) {
        if (task.done) continue;
        const station = map.stations?.find(item => item.id === task.stationId);
        if (station) disc(station.x, station.y, 34, hex('#12a594'));
      }
      for (const body of scene.bodies || []) rect(body.x - 22, body.y - 22, 44, 44, hex('#a31625'));
      const now = scene.now;
      for (const effect of scene.worldSoundEffects || []) {
        const progress = clamp((now - effect.startedAt) / effect.duration);
        ring(effect.x, effect.y, 60 + progress * 130, 12, [220 / 255, 38 / 255, 38 / 255, 1 - progress]);
        disc(effect.x, effect.y, 34, [220 / 255, 38 / 255, 38 / 255, .95 - progress * .55]);
        label('心臓転移', effect.x, effect.y - 62, 42, hex('#7f1d1d'));
      }
      if (scene.hackTracking || scene.hackEffective) {
        for (const player of scene.players || []) {
          if (player.id === scene.selfId || !player.alive || player.ejected) continue;
          disc(player.x, player.y, 30, hex(player.role === 'attacker' ? '#fb7185' : '#38bdf8'));
          ring(player.x, player.y, 30, 10, hex('#f8fafc'));
          label(player.label, player.x, player.y - 48, 28, hex('#102331'));
        }
      }
      for (const player of scene.players || []) {
        if (player.id !== scene.selfId || player.ejected) continue;
        const pulse = .5 + .5 * Math.sin(now / 180);
        ring(player.x, player.y, 54 + pulse * 22, 13, [1, 1, 1, .8 - pulse * .28]);
        disc(player.x, player.y, 38, hex('#fef08a'));
        ring(player.x, player.y, 38, 14, hex('#0e7490'));
        const dx = Number(scene.aimX) || 0, dy = Number(scene.aimY) || 1;
        const length = Math.hypot(dx, dy) || 1, nx = dx / length, ny = dy / length;
        tri([player.x + nx * 67, player.y + ny * 67],
          [player.x + ny * 22 - nx * 18, player.y - nx * 22 - ny * 18],
          [player.x - ny * 22 - nx * 18, player.y + nx * 22 - ny * 18], hex('#0e7490'));
        label('現在地', player.x, player.y - 82, 36, hex('#102331'));
      }
      if (scene.targeting && scene.mapPointer) {
        const p = scene.mapPointer, color = hex(p.valid ? '#10b981' : '#ef4444');
        disc(p.x, p.y, 58, [color[0], color[1], color[2], .18]);
        ring(p.x, p.y, 58, 11, color);
        line(p.x - 82, p.y, p.x + 82, p.y, 11, color);
        line(p.x, p.y - 82, p.x, p.y + 82, 11, color);
      }
      flush();
      let released = false;
      const release = () => {
        if (released) return;
        released = true;
        for (const buffer of allocated) { buffer.destroy(); live.delete(buffer); }
      };
      allocated.forEach(buffer => live.add(buffer));
      return Object.freeze({ release, vertexBuffers: allocated.length / 2 });
    }
    return Object.freeze({ prepare, draw, destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const buffer of live) buffer.destroy();
      live.clear();
    } });
  }
  const api = Object.freeze({ create, shader });
  root.DvaWebGPUExpandedMap = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
