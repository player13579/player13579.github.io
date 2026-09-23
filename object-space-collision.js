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

  const api = Object.freeze({ compile, circleIntersectsRect });
  root.DvaObjectSpaceCollision = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
