/* Kill-camera world evidence on the shared WebGPU frame. The caller resolves
 * the active record and owns the frame, shape renderer, and text atlas. */
(function (root) {
  'use strict';
  const finite = Number.isFinite;
  const victimInk = [248 / 255, 113 / 255, 113 / 255, 1];
  const killerInk = [250 / 255, 204 / 255, 21 / 255, 1];
  const fillInk = [2 / 255, 6 / 255, 23 / 255, .82];
  const dashInk = [248 / 255, 113 / 255, 113 / 255, .9];
  const white = [1, 1, 1, 1];

  function create({ textAtlas, shapes } = {}) {
    if (typeof textAtlas?.layout !== 'function' || !Array.isArray(textAtlas.textures) ||
        typeof shapes?.enqueue !== 'function') {
      throw new TypeError('Kill-camera markers require shared GPU text and shapes');
    }
    function plan({ viewport, scene, camera, zoom } = {}) {
      if (!viewport || ![viewport.width, viewport.height].every(v => finite(v) && v > 0) ||
          !camera || ![camera.x, camera.y, zoom].every(finite) || zoom <= 0) {
        throw new TypeError('Committed logical viewport, camera and zoom required');
      }
      if (!scene?.record) return { drawn: false, markers: [], dashes: [] };
      const record = scene.record;
      const victim = { x: Number(record.victimX) || 0, y: Number(record.victimY) || 0 };
      const killer = { x: Number(record.killerX) || victim.x,
        y: Number(record.killerY) || victim.y };
      const separated = Math.hypot(killer.x - victim.x, killer.y - victim.y) > 10;
      const world = point => ({ x: (point.x - camera.x) * zoom,
        y: (point.y - 22 - camera.y) * zoom });
      const markers = [{ ...world(victim), label: '死亡地点', ink: victimInk }];
      if (separated) markers.push({ ...world(killer), label: 'キラー', ink: killerInk });
      const dashes = [];
      if (separated) {
        const start = world(killer), end = world(victim);
        const dx = end.x - start.x, dy = end.y - start.y;
        const length = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
        for (let distance = 0; distance < length; distance += 19 * zoom) {
          const span = Math.min(11 * zoom, length - distance);
          const center = distance + span / 2;
          dashes.push({ x: start.x + dx * center / length - span / 2,
            y: start.y + dy * center / length - 2 * zoom,
            w: span, h: 4 * zoom, rotation: angle,
            color: dashInk, mode: 'source-over' });
        }
      }
      return { drawn: true, markers, dashes, separated };
    }
    async function prepare(input) {
      const prepared = plan(input);
      if (prepared.drawn) {
        if (typeof textAtlas.ensure !== 'function') throw new TypeError('Text atlas ensure required');
        await textAtlas.ensure(prepared.markers.map(marker => marker.label).join('\n'));
      }
      return prepared;
    }
    function record({ frame, target, viewport, scene, camera, zoom, preparedPlan } = {}) {
      const prepared = preparedPlan || plan({ viewport, scene, camera, zoom });
      if (!prepared.drawn) return { drawn: false, batches: [] };
      if (typeof frame?.stage !== 'function' || typeof frame.rect !== 'function' ||
          typeof frame.sprite !== 'function' || typeof frame.add !== 'function' ||
          typeof target !== 'string' || !target || !viewport ||
          ![viewport.pixelWidth, viewport.pixelHeight].every(Number.isInteger) ||
          viewport.pixelWidth <= 0 || viewport.pixelHeight <= 0) {
        throw new TypeError('Shared frame and committed target required');
      }
      const layouts = prepared.markers.map(marker => textAtlas.layout(marker.label,
        { size: 14 * zoom, missing: 'replace' }));
      for (const layout of layouts) for (const glyph of layout.quads) {
        if (!textAtlas.textures[glyph.page]) throw new Error('Kill-camera glyph page not uploaded; call prepare first');
      }
      const batches = [];
      try {
        if (prepared.dashes.length) {
          frame.stage('world:kill-camera:dashes');
          for (const dash of prepared.dashes) frame.rect(target, dash);
        }
        prepared.markers.forEach((marker, index) => {
          batches.push(shapes.enqueue(frame, { target,
            width: viewport.width, height: viewport.height,
            pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight,
            label: `world:kill-camera:marker:${index}`,
            commands: [
              { kind: 'circle', x: marker.x, y: marker.y,
                radius: 48 * zoom, color: fillInk },
              { kind: 'arc', x: marker.x, y: marker.y,
                radius: 48 * zoom, start: 0, sweep: Math.PI * 2,
                lineWidth: 5 * zoom, color: marker.ink }
            ] }));
          frame.stage(`world:kill-camera:label:${index}`);
          const layout = layouts[index];
          const glyphs = layout.quads;
          const top = glyphs.length ? Math.min(...glyphs.map(g => g.y)) : 0;
          const bottom = glyphs.length ? Math.max(...glyphs.map(g => g.y + g.h)) : layout.height;
          for (const glyph of glyphs) frame.sprite(target, {
            x: marker.x - layout.width / 2 + glyph.x,
            y: marker.y - (top + bottom) / 2 + glyph.y,
            w: glyph.w, h: glyph.h, uv: glyph.uv,
            texture: textAtlas.textures[glyph.page], color: white,
            mode: 'source-over' });
        });
      } catch (error) {
        batches.forEach(batch => batch.destroy());
        throw error;
      }
      return { drawn: true, batches, preparedPlan: prepared };
    }
    return Object.freeze({ plan, prepare, record });
  }
  const api = Object.freeze({ create });
  root.DvaWebGPUKillCameraMarkers = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
