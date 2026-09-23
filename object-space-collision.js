/* Collision against explicitly authored world-space object footprints.
 * Object spaces are map data, never derived from sprite size or pixels. */
(function (root) {
  'use strict';

  const finite = value => typeof value === 'number' && Number.isFinite(value);

  function validateSpace(value, index) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new TypeError(`objectSpaces[${index}] must be an object`);
    }
    const { id, room, x, y, w, h } = value;
    if (typeof id !== 'string' || !id.trim() || id !== id.trim()) {
      throw new TypeError(`objectSpaces[${index}].id must be a nonempty trimmed string`);
    }
    if (typeof room !== 'string' || !room.trim() || room !== room.trim()) {
      throw new TypeError(`objectSpaces[${index}].room must be a nonempty trimmed string`);
    }
    if (![x, y, w, h].every(finite) || w <= 0 || h <= 0 ||
        !Number.isFinite(x + w) || !Number.isFinite(y + h)) {
      throw new RangeError(`objectSpaces[${index}] needs finite x/y and positive finite w/h`);
    }
    return Object.freeze({ id, room, x, y, w, h });
  }

  // A point is a radius-zero circle. Tangency with any edge or corner counts
  // as occupied space, so a movement solver cannot settle on the boundary.
  function circleIntersectsRect(x, y, radius, rect) {
    if (![x, y, radius].every(finite) || radius < 0) {
      throw new RangeError('Circle needs finite x/y and a nonnegative finite radius');
    }
    if (!rect || ![rect.x, rect.y, rect.w, rect.h].every(finite) ||
        rect.w <= 0 || rect.h <= 0 ||
        !Number.isFinite(rect.x + rect.w) || !Number.isFinite(rect.y + rect.h)) {
      throw new RangeError('Rectangle needs finite x/y and positive finite w/h');
    }
    const nearestX = Math.max(rect.x, Math.min(x, rect.x + rect.w));
    const nearestY = Math.max(rect.y, Math.min(y, rect.y + rect.h));
    return Math.hypot(x - nearestX, y - nearestY) <= radius;
  }

  function compile(map) {
    if (!map || !Array.isArray(map.objectSpaces)) {
      throw new TypeError('Map needs an explicit objectSpaces array');
    }
    const ids = new Set();
    const geometry = new Set();
    const spaces = map.objectSpaces.map((source, index) => {
      const space = validateSpace(source, index);
      if (ids.has(space.id)) throw new Error(`Duplicate object-space id: ${space.id}`);
      // Equivalent occupied rectangles are duplicate records even if a second
      // author accidentally supplies a different id or room label.
      const key = JSON.stringify([space.x, space.y, space.w, space.h]);
      if (geometry.has(key)) throw new Error(`Duplicate object-space rectangle: ${space.id}`);
      ids.add(space.id);
      geometry.add(key);
      return space;
    });
    Object.freeze(spaces);
    function firstIntersection(x, y, radius) {
      if (![x, y, radius].every(finite) || radius < 0) {
        throw new RangeError('Circle needs finite x/y and a nonnegative finite radius');
      }
      // Input order is preserved so the result is stable across repeated calls.
      for (const space of spaces) {
        if (circleIntersectsRect(x, y, radius, space)) return space;
      }
      return null;
    }
    return Object.freeze({ spaces, firstIntersection,
      isBlocked(x, y, radius) { return firstIntersection(x, y, radius) !== null; } });
  }

  // The medical prototype has drawn walls at the north/east polygon edges.
  // Its corridor polygons touch those edges more widely than the visible door
  // cuts. Keep this index separate from object spaces: floor-bypassing powers
  // still pass walls while physical furniture remains solid.
  function compileMedicalWalls(map) {
    const medical = map?.rooms?.find(room => room.id === 'medical');
    // Client map snapshots omit authoredGeometry, so the actual polygon and
    // door records, rather than that server-only flag, identify this room.
    if (map?.id !== 'station' || !medical) {
      return Object.freeze({ walls: Object.freeze([]), isBlocked: () => false });
    }
    const northDoor = map.doors?.find(door => door.id === 'd-medical-north');
    const eastDoor = map.doors?.find(door => door.id === 'd-medical-east');
    if (!northDoor || !eastDoor || northDoor.orientation !== 'horizontal' || eastDoor.orientation !== 'vertical') {
      throw new Error('Medical wall openings need the north and east authored doors');
    }
    const polygon = medical.polygon;
    if (!Array.isArray(polygon) || polygon.length < 4) throw new Error('Medical room polygon is required');
    let northEdge = null;
    let eastEdge = null;
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      if (a[1] === medical.y && b[1] === medical.y) northEdge = [Math.min(a[0], b[0]), Math.max(a[0], b[0])];
      if (a[0] === medical.x + medical.w && b[0] === medical.x + medical.w) {
        eastEdge = [Math.min(a[1], b[1]), Math.max(a[1], b[1])];
      }
    }
    const northY = medical.y;
    const eastX = medical.x + medical.w;
    if (!northEdge || !eastEdge ||
        Math.abs(northDoor.y + northDoor.h / 2 - northY) > 0.5 ||
        Math.abs(eastDoor.x + eastDoor.w / 2 - eastX) > 0.5 ||
        northDoor.x <= northEdge[0] || northDoor.x + northDoor.w >= northEdge[1] ||
        eastDoor.y <= eastEdge[0] || eastDoor.y + eastDoor.h >= eastEdge[1]) {
      throw new Error('Medical doors must cut through their authored wall edges');
    }
    const walls = Object.freeze([
      Object.freeze({ x: northEdge[0], y: northY - 0.5, w: northDoor.x - northEdge[0], h: 1 }),
      Object.freeze({ x: northDoor.x + northDoor.w, y: northY - 0.5, w: northEdge[1] - northDoor.x - northDoor.w, h: 1 }),
      Object.freeze({ x: eastX - 0.5, y: eastEdge[0], w: 1, h: eastDoor.y - eastEdge[0] }),
      Object.freeze({ x: eastX - 0.5, y: eastDoor.y + eastDoor.h, w: 1, h: eastEdge[1] - eastDoor.y - eastDoor.h })
    ]);
    return Object.freeze({ walls, isBlocked(x, y, radius) {
      return walls.some(wall => circleIntersectsRect(x, y, radius, wall));
    } });
  }

  const api = Object.freeze({ compile, compileMedicalWalls, circleIntersectsRect });
  root.DvaObjectSpaceCollision = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
