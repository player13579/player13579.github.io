/* CPU geometry preparation for ordered WebGPU path fills, clip stencils and strokes.
 * Returns triangle-list Float32Array XY vertices; it never creates a canvas. */
(function (root) {
  'use strict';
  const EPS = 1e-9;
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const point = (x, y) => {
    if (!finite(x) || !finite(y)) throw new RangeError('Path coordinates must be finite');
    return [x, y];
  };
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const same = (a, b) => Math.abs(a[0] - b[0]) <= EPS && Math.abs(a[1] - b[1]) <= EPS;
  const signedArea = polygon => polygon.reduce((sum, current, index) => {
    const next = polygon[(index + 1) % polygon.length];
    return sum + current[0] * next[1] - next[0] * current[1];
  }, 0) / 2;

  function clean(points, closed) {
    if (!Array.isArray(points)) throw new TypeError('Path points must be an array');
    const result = [];
    for (const value of points) {
      if (!Array.isArray(value) || value.length < 2) throw new TypeError('Path point must be [x,y]');
      const next = point(value[0], value[1]);
      if (!result.length || !same(result[result.length - 1], next)) result.push(next);
    }
    if (closed && result.length > 1 && same(result[0], result[result.length - 1])) result.pop();
    return result;
  }

  function transformPoints(points, matrix) {
    if (!matrix) return points.map(value => value.slice());
    if (!Array.isArray(matrix) || matrix.length !== 6 || !matrix.every(finite)) {
      throw new TypeError('Transform must be [a,b,c,d,e,f]');
    }
    const [a, b, c, d, e, f] = matrix;
    if (Math.abs(a * d - b * c) <= EPS) throw new RangeError('Transform must be invertible');
    return points.map(([x, y]) => point(a * x + c * y + e, b * x + d * y + f));
  }

  function segmentsIntersect(a, b, c, d) {
    const abC = cross(a, b, c), abD = cross(a, b, d);
    const cdA = cross(c, d, a), cdB = cross(c, d, b);
    return ((abC > EPS && abD < -EPS) || (abC < -EPS && abD > EPS)) &&
      ((cdA > EPS && cdB < -EPS) || (cdA < -EPS && cdB > EPS));
  }
  function validateSimple(polygon) {
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      for (let k = i + 1; k < polygon.length; k++) {
        const l = (k + 1) % polygon.length;
        if (i === k || i === l || j === k || j === l) continue;
        if (segmentsIntersect(polygon[i], polygon[j], polygon[k], polygon[l])) {
          throw new Error('Self-intersecting paths need a separate tessellator');
        }
      }
    }
  }
  function insideTriangle(p, a, b, c, winding) {
    return cross(a, b, p) * winding >= -EPS && cross(b, c, p) * winding >= -EPS &&
      cross(c, a, p) * winding >= -EPS;
  }
  function triangulate(points) {
    let polygon = clean(points, true);
    if (polygon.length < 3) throw new RangeError('Fill contour needs at least three points');
    // A collinear point carries no area and can otherwise block ear finding.
    let changed = true;
    while (changed && polygon.length > 3) {
      changed = false;
      for (let i = 0; i < polygon.length; i++) {
        if (Math.abs(cross(polygon[(i + polygon.length - 1) % polygon.length], polygon[i],
          polygon[(i + 1) % polygon.length])) <= EPS) {
          polygon.splice(i, 1); changed = true; break;
        }
      }
    }
    const area = signedArea(polygon);
    if (Math.abs(area) <= EPS) throw new RangeError('Fill contour has zero area');
    validateSimple(polygon);
    const winding = Math.sign(area);
    const active = polygon.map((_, index) => index);
    const vertices = [];
    while (active.length > 3) {
      let ear = false;
      for (let i = 0; i < active.length; i++) {
        const previous = active[(i + active.length - 1) % active.length];
        const current = active[i];
        const next = active[(i + 1) % active.length];
        const a = polygon[previous], b = polygon[current], c = polygon[next];
        if (cross(a, b, c) * winding <= EPS) continue;
        if (active.some(index => index !== previous && index !== current && index !== next &&
          insideTriangle(polygon[index], a, b, c, winding))) continue;
        vertices.push(...a, ...b, ...c);
        active.splice(i, 1);
        ear = true;
        break;
      }
      if (!ear) throw new Error('Fill contour could not be triangulated');
    }
    vertices.push(...polygon[active[0]], ...polygon[active[1]], ...polygon[active[2]]);
    return { vertices: new Float32Array(vertices), winding, area, points: polygon };
  }

  function bounds(vertices) {
    if (!vertices.length) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < vertices.length; i += 2) {
      minX = Math.min(minX, vertices[i]); minY = Math.min(minY, vertices[i + 1]);
      maxX = Math.max(maxX, vertices[i]); maxY = Math.max(maxY, vertices[i + 1]);
    }
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }
  function scissor(clipRect) {
    if (!clipRect) return null;
    const { x, y, width, height } = clipRect;
    if (![x, y, width, height].every(finite) || width < 0 || height < 0) throw new RangeError('Invalid clip rectangle');
    const left = Math.max(0, Math.floor(x)), top = Math.max(0, Math.floor(y));
    const right = Math.max(left, Math.ceil(x + width)), bottom = Math.max(top, Math.ceil(y + height));
    return { x: left, y: top, width: right - left, height: bottom - top };
  }
  function contoursOf(input) {
    if (input && typeof input.contours === 'function') return input.contours();
    if (!Array.isArray(input)) throw new TypeError('Path contours required');
    return input;
  }
  function fill(input, options = {}) {
    const values = [];
    const ranges = [];
    for (const contour of contoursOf(input)) {
      if (!contour.closed) throw new Error('Fill contour must be closed');
      const points = transformPoints(clean(contour.points, true), options.transform);
      const triangles = triangulate(points);
      ranges.push({ firstVertex: values.length / 2, vertexCount: triangles.vertices.length / 2,
        winding: triangles.winding, area: triangles.area });
      values.push(...triangles.vertices);
    }
    const vertices = new Float32Array(values);
    return { vertices, ranges, bounds: bounds(vertices), scissor: scissor(options.clipRect), fillRule: 'nonzero' };
  }

  function stroke(input, options = {}) {
    const width = options.width;
    if (!finite(width) || width <= 0) throw new RangeError('Stroke width must be positive and finite');
    const half = width / 2;
    const values = [], ranges = [];
    function triangle(a, b, c) { values.push(...a, ...b, ...c); }
    for (const contour of contoursOf(input)) {
      const points = transformPoints(clean(contour.points, Boolean(contour.closed)), options.transform);
      if (points.length < 2) continue;
      const first = values.length / 2;
      const count = contour.closed ? points.length : points.length - 1;
      const normals = [];
      for (let i = 0; i < count; i++) {
        const p = points[i], q = points[(i + 1) % points.length];
        const dx = q[0] - p[0], dy = q[1] - p[1];
        const length = Math.hypot(dx, dy);
        if (length <= EPS) throw new RangeError('Stroke segment has zero length');
        const n = [-dy / length * half, dx / length * half];
        normals.push(n);
        const a = [p[0] + n[0], p[1] + n[1]], b = [p[0] - n[0], p[1] - n[1]];
        const c = [q[0] + n[0], q[1] + n[1]], d = [q[0] - n[0], q[1] - n[1]];
        triangle(a, b, c); triangle(c, b, d);
      }
      // Bevel wedges close the outside of joins. Draw with coverage/stencil once
      // when translucency matters; adjacent quads otherwise overlap at joins.
      const joins = contour.closed ? points.length : Math.max(0, points.length - 2);
      for (let j = 0; j < joins; j++) {
        const index = contour.closed ? j : j + 1;
        const prev = normals[(index + count - 1) % count], next = normals[index % count];
        const p = points[index];
        const turn = cross(points[(index + points.length - 1) % points.length], p,
          points[(index + 1) % points.length]);
        if (Math.abs(turn) <= EPS) continue;
        const side = turn > 0 ? -1 : 1;
        triangle([p[0] + prev[0] * side, p[1] + prev[1] * side], p,
          [p[0] + next[0] * side, p[1] + next[1] * side]);
      }
      ranges.push({ firstVertex: first, vertexCount: values.length / 2 - first, closed: Boolean(contour.closed) });
    }
    const vertices = new Float32Array(values);
    return { vertices, ranges, bounds: bounds(vertices), scissor: scissor(options.clipRect), width, join: 'bevel', cap: 'butt' };
  }

  function path() {
    const contours = [];
    let current = null;
    const api = {
      moveTo(x, y) { current = { points: [point(x, y)], closed: false }; contours.push(current); return api; },
      lineTo(x, y) {
        if (!current || current.closed) throw new Error('lineTo requires an open contour');
        current.points.push(point(x, y)); return api;
      },
      closePath() { if (!current) throw new Error('No contour to close'); current.closed = true; current = null; return api; },
      rect(x, y, width, height) {
        if (![x, y, width, height].every(finite) || width <= 0 || height <= 0) throw new RangeError('Invalid rectangle');
        contours.push({ points: [[x, y], [x + width, y], [x + width, y + height], [x, y + height]], closed: true });
        current = null; return api;
      },
      contours() { return contours.map(c => ({ points: c.points.map(p => p.slice()), closed: c.closed })); },
      fill(options) { return fill(api, options); },
      stroke(options) { return stroke(api, options); }
    };
    return Object.freeze(api);
  }
  function areaPath(areas) {
    if (!Array.isArray(areas)) throw new TypeError('Areas must be an array');
    const result = path();
    for (const area of areas) {
      if (Array.isArray(area?.polygon) && area.polygon.length >= 3) {
        area.polygon.forEach(([x, y], index) => index ? result.lineTo(x, y) : result.moveTo(x, y));
        result.closePath();
      } else {
        result.rect(area.x, area.y, area.w, area.h);
      }
    }
    return result;
  }
  function mapAreaPath(map) {
    if (!map || !Array.isArray(map.rooms) || !Array.isArray(map.corridors) || !Array.isArray(map.doors)) {
      throw new TypeError('Map needs rooms, corridors and doors');
    }
    const segments = map.corridors.flatMap(corridor =>
      Array.isArray(corridor.renderSegments) && corridor.renderSegments.length ? corridor.renderSegments : [corridor]);
    return areaPath([...map.rooms, ...segments, ...map.doors]);
  }
  const api = Object.freeze({ path, areaPath, mapAreaPath, fill, stroke, triangulate, signedArea, bounds });
  root.DvaWebGPUGeometry = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
