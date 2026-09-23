/* Shared-device composition for the currently connected main-field passes.
 * This is deliberately a partial registry: a caller must pass the full-frame
 * readiness gate before replacing the visible Canvas 2D frame. */
(function (root) {
  'use strict';

  const defaults = Object.freeze({
    scene: root.DvaWebGPUMainScene || (typeof require === 'function' ? require('./webgpu-main-scene.js') : null),
    field: root.DvaWebGPUFieldPass || (typeof require === 'function' ? require('./webgpu-field-pass.js') : null),
    environmentE: root.DvaWebGPUMedicalEnvironmentE || (typeof require === 'function' ? require('./webgpu-medical-environment-e.js') : null),
    medicalObjectE: root.DvaWebGPUMedicalObjectE || (typeof require === 'function' ? require('./webgpu-medical-object-e.js') : null),
    medicalCabinetE: root.DvaWebGPUMedicalCabinetE || (typeof require === 'function' ? require('./webgpu-medical-cabinet-e.js') : null),
    medicalFootbathUseE: root.DvaWebGPUMedicalFootbathUseE || (typeof require === 'function' ? require('./webgpu-medical-footbath-use-e.js') : null),
    medicalUploadConsoleE: root.DvaWebGPUMedicalUploadConsoleE || (typeof require === 'function' ? require('./webgpu-medical-upload-console-e.js') : null),
    medicalFixtureE: root.DvaWebGPUMedicalFixtureE || (typeof require === 'function' ? require('./webgpu-medical-fixture-e.js') : null),
    shapes: root.DvaWebGPUEffectShapes || (typeof require === 'function' ? require('./webgpu-effect-shapes.js') : null),
    stations: root.DvaWebGPUStations || (typeof require === 'function' ? require('./webgpu-stations.js') : null),
    mapObjects: root.DvaWebGPUMapObjectLabels || (typeof require === 'function' ? require('./webgpu-map-object-labels.js') : null),
    mysteryBoxes: root.DvaWebGPUMysteryBoxes || (typeof require === 'function' ? require('./webgpu-mystery-boxes.js') : null),
    alchemyObjects: root.DvaWebGPUAlchemyObjects || (typeof require === 'function' ? require('./webgpu-alchemy-objects.js') : null),
    groundItems: root.DvaWebGPUGroundItems || (typeof require === 'function' ? require('./webgpu-ground-items.js') : null),
    facilityEffects: root.DvaWebGPUFacilityEffects || (typeof require === 'function' ? require('./webgpu-facility-effects.js') : null),
    bodies: root.DvaWebGPUBodies || (typeof require === 'function' ? require('./webgpu-bodies.js') : null),
    worldSound: root.DvaWebGPUWorldSoundEffects || (typeof require === 'function' ? require('./webgpu-world-sound-effects.js') : null),
    throwPreview: root.DvaWebGPUThrowPreview || (typeof require === 'function' ? require('./webgpu-throw-preview.js') : null),
    preparationSummons: root.DvaWebGPUPreparationSummons || (typeof require === 'function' ? require('./webgpu-preparation-summons.js') : null),
    players: root.DvaWebGPUPlayerSprite || (typeof require === 'function' ? require('./webgpu-player-sprite.js') : null),
    headMarkers: root.DvaWebGPUHeadMarkers || (typeof require === 'function' ? require('./webgpu-head-markers.js') : null),
    gunnerAim: root.DvaWebGPUGunnerAim || (typeof require === 'function' ? require('./webgpu-gunner-aim.js') : null),
    killCamera: root.DvaWebGPUKillCameraMarkers || (typeof require === 'function' ? require('./webgpu-kill-camera-markers.js') : null),
    hitEffects: root.DvaWebGPUHitEffects || (typeof require === 'function' ? require('./webgpu-hit-effects.js') : null),
    gravityImpacts: root.DvaWebGPUGravityImpacts || (typeof require === 'function' ? require('./webgpu-gravity-impacts.js') : null),
    grenadeImpacts: root.DvaWebGPUGrenadeImpact || (typeof require === 'function' ? require('./webgpu-grenade-impact.js') : null),
    bodyBenefits: root.DvaWebGPUBodyBenefitPass || (typeof require === 'function' ? require('./webgpu-body-benefit-pass.js') : null),
    fireActivation: root.DvaWebGPUFireActivation || (typeof require === 'function' ? require('./webgpu-fire-activation.js') : null),
    empEffect: root.DvaWebGPUEmpEffect || (typeof require === 'function' ? require('./webgpu-emp-effect.js') : null),
    specialAmmoEffect: root.DvaWebGPUSpecialAmmoEffect || (typeof require === 'function' ? require('./webgpu-special-ammo-effect.js') : null),
    attackTargets: root.DvaWebGPUAttackTargets || (typeof require === 'function' ? require('./webgpu-attack-targets.js') : null),
    taskIndicators: root.DvaWebGPUTaskIndicators || (typeof require === 'function' ? require('./webgpu-task-indicators.js') : null),
    hud: root.DvaWebGPUHud || (typeof require === 'function' ? require('./webgpu-hud.js') : null),
    minimap: root.DvaWebGPUMinimap || (typeof require === 'function' ? require('./webgpu-minimap.js') : null),
    modeBanner: root.DvaWebGPUModeBanner || (typeof require === 'function' ? require('./webgpu-mode-banner.js') : null),
    killBloom: root.DvaWebGPUKillResidualBloom || (typeof require === 'function' ? require('./webgpu-kill-residual-bloom.js') : null),
    killAnimation: root.DvaWebGPUKillAnimation || (typeof require === 'function' ? require('./webgpu-kill-animation.js') : null),
    sensory: root.DvaWebGPUSensoryBlackout || (typeof require === 'function' ? require('./webgpu-sensory-blackout.js') : null),
    markerExplanation: root.DvaWebGPUMarkerExplanation || (typeof require === 'function' ? require('./webgpu-marker-explanation.js') : null),
    expandedMap: root.DvaWebGPUExpandedMap || (typeof require === 'function' ? require('./webgpu-expanded-map.js') : null),
    acquisition: root.DvaWebGPUAcquisition || (typeof require === 'function' ? require('./webgpu-acquisition.js') : null)
  });
  const BUILT = Object.freeze(['map', 'environmentE', 'stations', 'mapObjects', 'mysteryBoxes',
    'alchemyObjects', 'gravityHazards', 'groundItems', 'facilityEffects',
    'bodies', 'worldSound', 'throwPreview', 'preparationSummons', 'players',
    'gunnerAim', 'killCamera', 'hitEffects', 'magicEffects',
    'attackTargets', 'taskIndicators',
    'hud', 'minimap', 'modeBanner', 'lighting', 'killAnimation', 'sensory',
    'markerExplanation', 'acquisition']);
  const MAGIC_EVENT_TYPES = Object.freeze(['shapes', 'gravityImpact', 'grenadeImpact',
    'bodyBenefit', 'fireActivation', 'empEffect', 'specialAmmoEffect', 'medicalObjectE',
    'medicalCabinetE', 'medicalFootbathUseE', 'medicalUploadConsoleE', 'taskCompletion', 'headMarker']);
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  function coverage(scene, passes) {
    if (!Array.isArray(scene?.ORDER) || !Array.isArray(scene?.REQUIRED))
      throw new TypeError('Main scene stage contract required');
    const supported = scene.ORDER.filter(name => own(passes, name));
    const unsupported = scene.ORDER.filter(name => !own(passes, name));
    const missingRequired = scene.REQUIRED.filter(name => !own(passes, name));
    return Object.freeze({ supported: Object.freeze(supported),
      unsupported: Object.freeze(unsupported),
      missingRequired: Object.freeze(missingRequired),
      fullFrameReady: unsupported.length === 0 });
  }

  async function create({ renderer, map, image, textAtlas, atlasMetrics,
    expandedCanvas = null, expandedTarget = 'main-expanded-map',
    acquisitionCanvas = null, acquisitionTarget = 'main-acquisition-overlay',
    modules = defaults } = {}) {
    if (!renderer || renderer.state !== 'ready' || !renderer.device ||
        typeof renderer.format !== 'string' || !renderer.format ||
        typeof renderer.createGravityHazardPasses !== 'function')
      throw new TypeError('The active shared WebGPU renderer is required');
    if (typeof textAtlas?.layout !== 'function' ||
        typeof textAtlas?.ensure !== 'function' || !Array.isArray(textAtlas.textures))
      throw new TypeError('The uploaded shared WebGPU text atlas is required');
    if (![atlasMetrics?.ascent, atlasMetrics?.pixelSize].every(Number.isFinite) ||
        atlasMetrics.pixelSize <= 0)
      throw new TypeError('Source GPU text atlas metrics are required for the HUD');
    if (acquisitionCanvas &&
        (typeof renderer.registerTarget !== 'function' ||
          typeof acquisitionTarget !== 'string' || !acquisitionTarget ||
          acquisitionTarget === expandedTarget || acquisitionTarget === 'main'))
      throw new TypeError('Acquisition overlay needs a distinct shared renderer target name');
    const methods = { field: 'create', environmentE: 'create', medicalObjectE: 'create',
      medicalCabinetE: 'create', medicalFootbathUseE: 'create', medicalUploadConsoleE: 'create',
      medicalFixtureE: 'create', shapes: 'create', stations: 'create',
      mapObjects: 'create', mysteryBoxes: 'create', alchemyObjects: 'create',
      groundItems: 'createTextureCache', facilityEffects: 'create',
      bodies: 'record', worldSound: 'record', throwPreview: 'create',
      preparationSummons: 'create', players: 'createTextureCache', headMarkers: 'create',
      gunnerAim: 'create', killCamera: 'create', hitEffects: 'record',
      gravityImpacts: 'create', grenadeImpacts: 'record', bodyBenefits: 'create', fireActivation: 'create', empEffect: 'create', specialAmmoEffect: 'create',
      attackTargets: 'record', taskIndicators: 'create', hud: 'create',
      minimap: 'create', modeBanner: 'create', killBloom: 'create',
      killAnimation: 'create', sensory: 'enqueue', markerExplanation: 'create',
      acquisition: 'create', ...(expandedCanvas ? { expandedMap: 'create' } : {}) };
    const absent = Object.entries(methods).filter(([name, method]) =>
      typeof modules?.[name]?.[method] !== 'function').map(([name]) => name);
    if (!Array.isArray(modules?.scene?.ORDER) ||
        !Array.isArray(modules.scene.REQUIRED)) absent.unshift('scene');
    if (absent.length) throw new Error(`Missing main pass modules: ${absent.join(', ')}`);
    const owned = [], passes = Object.create(null);
    const add = (name, value, method) => {
      if (!value || typeof value[method] !== 'function' ||
          typeof value.destroy !== 'function' ||
          (value.device && value.device !== renderer.device)) {
        try { value?.destroy?.(); } catch (_) { /* Keep validation error. */ }
        throw new TypeError(`Invalid shared-device WebGPU ${name} pass`);
      }
      owned.push(value);
      passes[name] = value;
    };
    const borrow = (name, value, method = 'record') => {
      if (!value || typeof value[method] !== 'function' ||
          (value.device && value.device !== renderer.device))
        throw new TypeError(`Invalid shared-device WebGPU ${name} module`);
      passes[name] = value;
    };
    try {
      // Every constructor is given the same renderer/device; none opens a new
      // context or obtains a second adapter. The authored field is async.
      add('shapes', modules.shapes.create({ device: renderer.device,
        format: renderer.format }), 'enqueue');
      add('map', await modules.field.create({ owner: renderer, map, image }), 'enqueue');
      add('environmentE', modules.environmentE.create({ device: renderer.device,
        format: renderer.format }), 'record');
      add('medicalFixtureE', modules.medicalFixtureE.create({ device: renderer.device,
        format: renderer.format }), 'record');
      add('medicalUploadConsoleE', modules.medicalUploadConsoleE.create({ device: renderer.device,
        format: renderer.format }), 'record');
      add('stations', modules.stations.create({ device: renderer.device, textAtlas }), 'record');
      add('mapObjects', modules.mapObjects.create({ textAtlas }), 'draw');
      add('mysteryBoxes', modules.mysteryBoxes.create({ device: renderer.device }), 'record');
      add('alchemyObjects', modules.alchemyObjects.create({ device: renderer.device, textAtlas }), 'record');
      add('gravityHazards', renderer.createGravityHazardPasses({ textAtlas }), 'record');
      add('groundItems', modules.groundItems.createTextureCache(renderer.device), 'record');
      add('facilityEffects', modules.facilityEffects.create({ device: renderer.device,
        format: renderer.format }), 'record');
      borrow('bodies', modules.bodies);
      borrow('worldSound', modules.worldSound);
      add('throwPreview', modules.throwPreview.create({ device: renderer.device,
        format: renderer.format, textAtlas }), 'record');
      add('preparationSummons', modules.preparationSummons.create({
        device: renderer.device }), 'record');
      add('players', modules.players.createTextureCache(renderer.device), 'record');
      add('headMarkers', modules.headMarkers.create({ frameOwner: renderer }), 'record');
      add('gunnerAim', modules.gunnerAim.create({ device: renderer.device,
        format: renderer.format }), 'record');
      borrow('killCamera', modules.killCamera.create({ textAtlas,
        shapes: passes.shapes }));
      borrow('hitEffects', modules.hitEffects);
      add('gravityImpacts', modules.gravityImpacts.create({
        device: renderer.device }), 'record');
      borrow('grenadeImpacts', modules.grenadeImpacts);
      add('bodyBenefits', modules.bodyBenefits.create({ renderer }), 'record');
      add('fireActivation', modules.fireActivation.create({ renderer }), 'record');
      add('empEffect', modules.empEffect.create({ frameOwner: renderer }), 'record');
      add('specialAmmoEffect', modules.specialAmmoEffect.create({ frameOwner: renderer }), 'record');
      add('medicalObjectE', modules.medicalObjectE.create({ device: renderer.device,
        format: renderer.format }), 'record');
      add('medicalCabinetE', modules.medicalCabinetE.create({ device: renderer.device,
        format: renderer.format }), 'record');
      add('medicalFootbathUseE', modules.medicalFootbathUseE.create({ device: renderer.device,
        format: renderer.format }), 'record');
      // MainScene records each source event in order. Shapes already owns the
      // `magicEffects` stage method; the other five event routes are real pass
      // dependencies, with taskCompletion reusing facilityEffects + shapes.
      passes.magicEffects = passes.shapes;
      borrow('attackTargets', modules.attackTargets);
      add('taskIndicators', modules.taskIndicators.create({ textAtlas }), 'draw');
      borrow('hud', modules.hud.create({ textAtlas, atlasMetrics }), 'draw');
      add('minimap', modules.minimap.create({ device: renderer.device,
        format: renderer.format }), 'draw');
      borrow('modeBanner', modules.modeBanner.create({ textAtlas }), 'draw');
      const bloom = modules.killBloom.create({ device: renderer.device });
      if (!bloom || typeof bloom.prepare !== 'function' ||
          typeof bloom.release !== 'function') {
        try { bloom?.release?.(); } catch (_) { /* Keep validation error. */ }
        throw new TypeError('Invalid shared-device kill bloom pass');
      }
      owned.push({ destroy: () => bloom.release() });
      borrow('killAnimation', modules.killAnimation.create({ textAtlas, bloom }));
      borrow('sensory', modules.sensory, 'enqueue');
      borrow('markerExplanation', modules.markerExplanation.create({ textAtlas }), 'draw');
      if (expandedCanvas) {
        if (typeof renderer.registerTarget !== 'function' ||
            typeof expandedTarget !== 'string' || !expandedTarget)
          throw new TypeError('Expanded map needs a shared renderer target name');
        const expanded = modules.expandedMap.create({ device: renderer.device,
          format: renderer.format, text: textAtlas });
        if (!expanded || typeof expanded.prepare !== 'function' ||
            typeof expanded.draw !== 'function' || typeof expanded.destroy !== 'function') {
          try { expanded?.destroy?.(); } catch (_) { /* Keep validation error. */ }
          throw new TypeError('Invalid shared-device expanded-map pass');
        }
        let targetHandle;
        try {
          targetHandle = renderer.registerTarget(expandedTarget, expandedCanvas, {
            width: Math.max(1, expandedCanvas.width || 1),
            height: Math.max(1, expandedCanvas.height || 1),
            logicalWidth: 1200, logicalHeight: 760 });
        } catch (error) { expanded.destroy(); throw error; }
        const prepared = new WeakSet();
        // The app must prove that its visible expanded-map surface is the one
        // registered on this shared device before admitting a candidate frame.
        const wrapper = Object.freeze({ device: renderer.device,
          canvas: expandedCanvas, target: expandedTarget,
          async prepare({ scene, viewport } = {}) {
            if (!scene?.map || viewport?.kind !== 'expanded' ||
                viewport.width !== 1200 || viewport.height !== 760 ||
                !Number.isInteger(viewport.pixelWidth) ||
                !Number.isInteger(viewport.pixelHeight))
              throw new TypeError('Expanded map needs its scene and committed viewport');
            await expanded.prepare(scene);
            targetHandle.resize(viewport.pixelWidth, viewport.pixelHeight,
              { width: viewport.width, height: viewport.height });
            const value = Object.freeze({ scene, viewport });
            prepared.add(value);
            return value;
          },
          record({ frame, preparedPlan } = {}) {
            if (!prepared.has(preparedPlan))
              throw new TypeError('Prepare expanded map before main-frame recording');
            prepared.delete(preparedPlan);
            return expanded.draw({ frame, target: expandedTarget,
              scene: preparedPlan.scene, viewport: preparedPlan.viewport });
          },
          destroy() {
            let error;
            try { expanded.destroy(); } catch (caught) { error = caught; }
            try { targetHandle.unregister(); } catch (caught) { error ||= caught; }
            if (error) throw error;
          }
        });
        add('expandedMap', wrapper, 'record');
      }
      // app.js drawLighting is currently a literal return (no Canvas output).
      // Keep this explicit, so a later nontrivial lighting implementation must
      // replace this stage rather than being silently dropped.
      borrow('lighting', Object.freeze({ device: renderer.device,
        record() { return Object.freeze({ drawn: false, reason: 'Canvas lighting is no-op' }); } }));
      const acquisition = await modules.acquisition.create(null,
        { frameOwner: renderer });
      if (!acquisition || acquisition.state !== 'ready' ||
          typeof acquisition.enqueue !== 'function' ||
          typeof acquisition.destroy !== 'function') {
        try { acquisition?.destroy?.(); } catch (_) { /* Keep validation error. */ }
        throw new TypeError('Invalid shared-frame acquisition pass');
      }
      let acquisitionHandle = null;
      if (acquisitionCanvas) {
        try {
          acquisitionHandle = renderer.registerTarget(acquisitionTarget, acquisitionCanvas, {
            width: Math.max(1, acquisitionCanvas.width || 1),
            height: Math.max(1, acquisitionCanvas.height || 1),
            logicalWidth: 1, logicalHeight: 1, alphaMode: 'premultiplied'
          });
        } catch (error) { acquisition.destroy(); throw error; }
      }
      const preparedAcquisition = new WeakSet();
      let acquisitionDestroyed = false;
      add('acquisition', Object.freeze({ device: renderer.device,
        target: acquisitionHandle ? acquisitionTarget : null,
        prepare({ viewport, drawFrame } = {}) {
          if (acquisitionDestroyed || renderer.state !== 'ready')
            throw new Error('Shared acquisition pass unavailable');
          if (!acquisitionHandle) throw new Error('Acquisition overlay canvas is required');
          if (viewport?.kind !== 'acquisition' ||
              ![viewport.width, viewport.height].every(value => Number.isFinite(value) && value > 0) ||
              ![viewport.pixelWidth, viewport.pixelHeight].every(value => Number.isInteger(value) && value > 0) ||
              !Array.isArray(drawFrame?.effects) ||
              drawFrame.width !== viewport.width || drawFrame.height !== viewport.height ||
              drawFrame.pixelWidth !== viewport.pixelWidth ||
              drawFrame.pixelHeight !== viewport.pixelHeight)
            throw new TypeError('Acquisition needs effects and exact overlay viewport dimensions');
          acquisitionHandle.resize(viewport.pixelWidth, viewport.pixelHeight,
            { width: viewport.pixelWidth, height: viewport.pixelHeight });
          const plan = Object.freeze({ viewport, drawFrame });
          preparedAcquisition.add(plan);
          return plan;
        },
        record({ frame, target, viewport, drawFrame, preparedPlan } = {}) {
          if (acquisitionDestroyed || acquisition.state !== 'ready' || renderer.state !== 'ready')
            throw new Error('Shared acquisition pass unavailable');
          if (acquisitionHandle) {
            if (!preparedAcquisition.has(preparedPlan) || target !== acquisitionTarget ||
                viewport !== preparedPlan.viewport)
              throw new TypeError('Prepare the acquisition overlay before main-frame recording');
            preparedAcquisition.delete(preparedPlan);
            if (acquisition.enqueue(frame, target, preparedPlan.drawFrame,
              { clear: { r: 0, g: 0, b: 0, a: 0 } }) !== true)
              throw new Error('Shared acquisition overlay pass did not enqueue');
            return true;
          }
          if (drawFrame?.effects?.length)
            throw new Error('Active acquisition effects require an overlay canvas');
          if (viewport?.kind !== 'main' || !drawFrame ||
              !Array.isArray(drawFrame.effects) ||
              drawFrame.width !== viewport?.width ||
              drawFrame.height !== viewport?.height ||
              drawFrame.pixelWidth !== viewport?.pixelWidth ||
              drawFrame.pixelHeight !== viewport?.pixelHeight)
            throw new TypeError('Acquisition needs effects and exact main viewport dimensions');
          if (acquisition.enqueue(frame, target, drawFrame) !== true)
            throw new Error('Shared acquisition pass did not enqueue');
          return true;
        },
        destroy() {
          if (acquisitionDestroyed) return;
          acquisitionDestroyed = true;
          let error;
          try { acquisition.destroy(); } catch (caught) { error = caught; }
          try { acquisitionHandle?.unregister(); } catch (caught) { error ||= caught; }
          if (error) throw error;
        }
      }), 'record');
      let destroyed = false;
      const status = coverage(modules.scene, passes);
      return Object.freeze({
        device: renderer.device, passes: Object.freeze(passes), status,
        magicEventTypes: MAGIC_EVENT_TYPES,
        assertFullFrameReady() {
          if (destroyed) throw new Error('Main pass registry destroyed');
          if (status.unsupported.length)
            throw new Error(`Main WebGPU frame incomplete: ${status.unsupported.join(', ')}`);
          return true;
        },
        destroy() {
          if (destroyed) return;
          destroyed = true;
          let firstError;
          for (let i = owned.length - 1; i >= 0; i--) {
            try { owned[i].destroy(); } catch (error) { firstError ||= error; }
          }
          owned.length = 0;
          if (firstError) throw firstError;
        }
      });
    } catch (error) {
      for (let i = owned.length - 1; i >= 0; i--) {
        try { owned[i].destroy(); } catch (_) { /* Keep construction error. */ }
      }
      throw error;
    }
  }

  const api = Object.freeze({ create, BUILT });
  root.DvaWebGPUMainPassRegistry = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
