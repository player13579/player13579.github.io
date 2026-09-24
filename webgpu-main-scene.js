/* Ordered main-field WebGPU scene recorder. The caller creates every pass with
 * the main runtime's renderer/device, prepares text/images before draw(), and
 * passes scene.record as the runtime's synchronous record callback. The authored
 * field pass owns the first clear: use mainRuntime.draw({ recordClears: true }).
 * This module never creates a canvas, adapter, device, or fallback renderer. */
(function (root) {
  'use strict';

  // Matches the active draw() slots in app.js. A null stage is an intentional
  // gap and is returned in the report; an omitted required stage is an error.
  const ORDER = Object.freeze([
    'map', 'environmentE', 'stations', 'mapObjects', 'mysteryBoxes', 'alchemyObjects',
    'gravityHazards', 'groundItems', 'facilityEffects',
    'bodies', 'worldSound', 'throwPreview', 'preparationSummons', 'players',
    'gunnerAim', 'killCamera', 'hitEffects', 'magicEffects', 'attackTargets',
    'taskIndicators', 'hud', 'minimap', 'modeBanner', 'expandedMap',
    'lighting', 'killAnimation', 'sensory', 'markerExplanation', 'acquisition'
  ]);
  const REQUIRED = Object.freeze([
    'map', 'environmentE', 'stations', 'mapObjects', 'mysteryBoxes', 'alchemyObjects',
    'gravityHazards', 'groundItems', 'facilityEffects', 'bodies', 'worldSound',
    'throwPreview', 'players', 'gunnerAim', 'killCamera', 'hitEffects',
    'magicEffects', 'attackTargets', 'taskIndicators', 'hud', 'minimap',
    'modeBanner', 'killAnimation', 'sensory', 'markerExplanation'
  ]);
  const REQUIRED_SET = new Set(REQUIRED);
  const EMP_TYPES = new Set(['emp', 'emp-charge', 'emp-resonance',
    'emp-cancel', 'emp-storage-lock']);
  const SPECIAL_AMMO_TYPES = new Set(['action-special-ammo-load',
    'action-special-ammo-shot', 'action-special-ammo-impact']);
  const METHOD = Object.freeze({
    map: 'enqueue', environmentE: 'record', stations: 'record', mapObjects: 'draw', mysteryBoxes: 'record',
    alchemyObjects: 'record', gravityHazards: 'record',
    groundItems: 'record', facilityEffects: 'record', bodies: 'record',
    worldSound: 'record', throwPreview: 'record', preparationSummons: 'record',
    players: 'record', gunnerAim: 'record', killCamera: 'record',
    hitEffects: 'record', magicEffects: 'enqueue', attackTargets: 'record',
    taskIndicators: 'draw', hud: 'draw', minimap: 'draw', modeBanner: 'draw',
    expandedMap: 'record', lighting: 'record', killAnimation: 'record',
    sensory: 'enqueue', markerExplanation: 'draw', acquisition: 'record'
  });
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  function leaseFor(result) {
    if (!result) return null;
    if (typeof result.release === 'function') return () => result.release();
    if (typeof result.destroy === 'function') return () => result.destroy();
    if (Array.isArray(result.batches)) return () => result.batches.forEach(batch => batch.destroy());
    if (typeof result === 'object' && result !== null && typeof result.encode === 'function') return () => result.destroy?.();
    return null;
  }
  function create({ renderer, passes = {} } = {}) {
    if (!renderer?.device || typeof renderer.beginFrame !== 'function')
      throw new TypeError('Main scene requires the active shared WebGPU renderer');
    const device = renderer.device;
    let destroyed = false;
    function prepare({ stages, device: preparedDevice = device } = {}) {
      if (destroyed) throw new Error('Main WebGPU scene destroyed');
      if (preparedDevice !== device) throw new Error('Main scene prepared on a different WebGPU device');
      if (!stages || typeof stages !== 'object' || Array.isArray(stages))
        throw new TypeError('Main scene needs explicit stage inputs');
      const unknown = Object.keys(stages).filter(name => !ORDER.includes(name));
      if (unknown.length) throw new Error(`Unknown main scene stages: ${unknown.join(', ')}`);
      const missing = REQUIRED.filter(name => !own(stages, name) || stages[name] === null || stages[name] === undefined);
      if (missing.length) throw new Error(`Missing mandatory WebGPU main scene stages: ${missing.join(', ')}`);
      const unavailable = ORDER.filter(name => stages[name] != null &&
        (typeof passes[name === 'magicEffects' ? 'shapes' : name]?.[METHOD[name]] !== 'function' ||
          (['stations', 'alchemyObjects', 'facilityEffects', 'bodies', 'worldSound',
            'hitEffects', 'attackTargets'].includes(name) && typeof passes.shapes?.enqueue !== 'function')));
      if (unavailable.length) throw new Error(`Unavailable WebGPU main scene passes: ${unavailable.join(', ')}`);
      const summon = stages.preparationSummons;
      const playerStage = stages.players;
      if (summon != null) {
        if (!(summon.scene?.entries instanceof Map) || !Array.isArray(summon.scene.players))
          throw new TypeError('Preparation summons need roster players and shared entries Map');
        if (playerStage.entries !== summon.scene.entries ||
            typeof playerStage.createCommands !== 'function' || playerStage.commands !== undefined)
          throw new Error('Preparation players need a post-summon command builder and the same entries Map');
      } else if (!Array.isArray(playerStage.commands) || playerStage.createCommands !== undefined) {
        throw new TypeError('Players without preparation summons need prepared commands');
      }
      if (!Number.isInteger(playerStage.markerGeneration) ||
          typeof playerStage.headMarkersForCommand !== 'function' ||
          typeof passes.headMarkers?.record !== 'function')
        throw new TypeError('Players need a shared head-marker pass, generation and per-command tail planner');
      const magic = stages.magicEffects;
      if (!Array.isArray(magic.sourceEffectIds) || !Array.isArray(magic.events) ||
          !Array.isArray(magic.omitted))
        throw new TypeError('Main scene magicEffects needs source IDs, ordered events, and explicit omissions');
      const markerCoverage = magic.markerCoverage;
      if (!markerCoverage || !Array.isArray(markerCoverage.visibleRetained))
        throw new TypeError('Main scene magicEffects needs explicit visible retained-marker coverage');
      const empCoverage = magic.empCoverage;
      if (!empCoverage || !Array.isArray(empCoverage.visibleEmp))
        throw new TypeError('Main scene magicEffects needs explicit visible EMP coverage');
      const specialAmmoCoverage = magic.specialAmmoCoverage;
      if (!specialAmmoCoverage || !Array.isArray(specialAmmoCoverage.visibleSpecialAmmo))
        throw new TypeError('Main scene magicEffects needs explicit visible special-ammo coverage');
      const ids = magic.sourceEffectIds.map(id => {
        if ((typeof id !== 'string' && typeof id !== 'number') || String(id) === '')
          throw new TypeError('Magic source effect ID required');
        return String(id);
      });
      if (new Set(ids).size !== ids.length) throw new Error('Duplicate magic source effect ID');
      const positions = new Map(ids.map((id, index) => [id, index]));
      const retained = new Map();
      for (const item of markerCoverage.visibleRetained) {
        const id = String(item?.effectId ?? '');
        if (!positions.has(id) || retained.has(id) ||
            !['enhance-activation','fighter-energy-charge'].includes(item?.effectType) ||
            typeof item.instanceKey !== 'string' || !item.instanceKey ||
            typeof item.playerId !== 'string' || !item.playerId)
          throw new TypeError(`Invalid visible retained-marker source: ${id}`);
        retained.set(id,item);
      }
      if (retained.size && !Number.isInteger(magic.markerGeneration))
        throw new TypeError('Visible retained markers need the current marker generation');
      const visibleEmp = new Map();
      for (const item of empCoverage.visibleEmp) {
        const id = String(item?.effectId ?? '');
        if (!positions.has(id) || visibleEmp.has(id) || !EMP_TYPES.has(item?.effectType))
          throw new TypeError(`Invalid visible EMP source: ${id}`);
        visibleEmp.set(id, item.effectType);
      }
      const visibleSpecialAmmo = new Map();
      for (const item of specialAmmoCoverage.visibleSpecialAmmo) {
        const id = String(item?.effectId ?? '');
        if (!positions.has(id) || visibleSpecialAmmo.has(id) ||
            !SPECIAL_AMMO_TYPES.has(item?.effectType) ||
            !['weak', 'shock'].includes(item?.variant))
          throw new TypeError(`Invalid visible special-ammo source: ${id}`);
        visibleSpecialAmmo.set(id, item);
      }
      const owned = new Set();
      let previousPosition = -1;
      for (const omission of magic.omitted) {
        const id = String(omission?.effectId ?? '');
        if (!positions.has(id) || owned.has(id)) throw new Error(`Duplicate or unknown magic omission: ${id}`);
        if (typeof omission.reason !== 'string' || !omission.reason.trim() ||
            omission.reason.toLowerCase().includes('unsupported'))
          throw new Error(`Magic omission ${id} needs an intentional nonvisual reason`);
        owned.add(id);
      }
      for (const [index, event] of magic.events.entries()) {
        const id = String(event?.effectId ?? '');
        const position = positions.get(id);
        if (position === undefined || owned.has(id)) throw new Error(`Duplicate or unknown magic event: ${id}`);
        if (position <= previousPosition) throw new Error(`Magic event order differs from source effects: ${id}`);
        previousPosition = position;
        owned.add(id);
        if (event?.type === 'shapes') {
          if (!Array.isArray(event.commands) || !event.commands.length)
            throw new TypeError(`Magic event ${index} needs shape commands`);
        } else if (event?.type === 'headMarker') {
          const source=retained.get(id), input=event.input, planned=input?.planned;
          const prefix=source?.effectType==='enhance-activation'?'enhance:':'fighter-ec:';
          const expectedKey=`${prefix}${source?.instanceKey}:${source?.playerId}`;
          if (!source || !input || input.sourceEffectId!==id ||
              input.effectType!==source.effectType ||
              input.instanceKey!==source.instanceKey || input.playerId!==source.playerId ||
              !planned || planned.generation!==magic.markerGeneration ||
              !Array.isArray(planned.unsupported) || planned.unsupported.length ||
              !Array.isArray(planned.commands) || !planned.commands.length ||
              !Array.isArray(planned.hitTargets) || planned.hitTargets.length!==1 ||
              planned.hitTargets[0]?.key!==expectedKey ||
              !planned.commands.some(command=>command.kind===source.effectType) ||
              planned.commands.some(command=>!([source.effectType,
                source.effectType==='enhance-activation'?'enhance-propagation':''].includes(command.kind))))
            throw new TypeError(`Magic retained marker ${id} needs one exact source-owned plan`);
        } else if (event?.type === 'empEffect') {
          const input = event.input, effect = input?.effect, planned = input?.planned;
          const effectType = visibleEmp.get(id);
          if (!effectType || typeof passes.empEffect?.record !== 'function' || !input ||
              input.sourceEffectId !== id || String(effect?.id ?? '') !== id ||
              effect.type !== effectType || planned?.effectId !== id ||
              planned.type !== effectType || !Number.isFinite(planned.progress) ||
              planned.progress <= 0 || planned.progress >= 1 ||
              !(planned.values instanceof Float32Array) || planned.values.length !== 16 ||
              !planned.values.every(Number.isFinite))
            throw new TypeError(`Magic EMP ${id} needs one exact source-owned plan`);
        } else if (event?.type === 'specialAmmoEffect') {
          const input = event.input, effect = input?.effect, planned = input?.planned;
          const source = visibleSpecialAmmo.get(id);
          if (!source || typeof passes.specialAmmoEffect?.record !== 'function' ||
              input.sourceEffectId !== id || String(effect?.id ?? '') !== id ||
              effect.type !== source.effectType ||
              String(effect.variant || '').split(':')[0] !== source.variant ||
              planned?.effectId !== id || planned.type !== source.effectType ||
              planned.variant !== source.variant ||
              !Number.isFinite(planned.progress) || planned.progress <= 0 ||
              planned.progress >= 1 || !(planned.values instanceof Float32Array) ||
              planned.values.length !== 16 || !planned.values.every(Number.isFinite))
            throw new TypeError(`Magic special ammo ${id} needs one exact source-owned plan`);
        } else if (event?.type === 'gravityImpact') {
          if (typeof passes.gravityImpacts?.record !== 'function')
            throw new Error('Magic gravity impact needs WebGPU gravityImpacts.record');
          if (!Array.isArray(event.scene?.effects) || event.scene.effects.length !== 1 ||
              !String(event.scene.effects[0]?.type || '').startsWith('gravity-storm-') ||
              String(event.scene.effects[0]?.id ?? '') !== id)
            throw new TypeError(`Magic event ${index} needs one gravity-storm effect`);
        } else if (event?.type === 'grenadeImpact') {
          if (typeof passes.grenadeImpacts?.record !== 'function')
            throw new Error('Magic grenade impact needs WebGPU grenadeImpacts.record');
          const impact = event.scene?.effects?.[0];
          if (!Array.isArray(event.scene?.effects) || event.scene.effects.length !== 1 ||
              !['grenade-frag-impact', 'grenade-stun-impact'].includes(impact?.type) ||
              String(impact.id ?? '') !== id ||
              (impact.sourceId != null &&
                ((typeof impact.sourceId !== 'string' && typeof impact.sourceId !== 'number') ||
                  String(impact.sourceId) === '')))
            throw new TypeError(`Magic event ${index} needs one identified grenade impact`);
        } else if (event?.type === 'bodyBenefit') {
          if (typeof passes.bodyBenefits?.record !== 'function')
            throw new Error('Magic body benefit needs WebGPU bodyBenefits.record');
          if (!event.input || typeof event.input !== 'object' ||
              !['gain-stamina', 'gain-heal', 'gain-mana', 'gain-overheal'].includes(event.input.effect?.type) ||
              String(event.input.effect?.id ?? '') !== id)
            throw new TypeError(`Magic event ${index} needs one supported body benefit effect`);
        } else if (event?.type === 'fireActivation') {
          if (typeof passes.fireActivation?.record !== 'function')
            throw new Error('Magic fire activation needs WebGPU fireActivation.record');
          if (!event.input || typeof event.input !== 'object' ||
              event.input.effect?.type !== 'fire' ||
              String(event.input.effect?.id ?? '') !== id)
            throw new TypeError(`Magic event ${index} needs one standalone fire effect`);
        } else if (event?.type === 'medicalObjectE') {
          const effect = event.input?.effect, planned = event.input?.planned;
          if (typeof passes.medicalObjectE?.record !== 'function' ||
              effect?.type !== 'object-relaxationBed' ||
              effect.objectId !== 'v302-medical-diagnosticBed-1' ||
              String(effect.id ?? '') !== id || planned?.effectId !== id ||
              !Number.isFinite(planned.elapsed) || planned.elapsed < 0 ||
              planned.elapsed >= 900)
            throw new TypeError(`Magic event ${index} needs one owned medical object E`);
        } else if (event?.type === 'medicalCabinetE' ||
            event?.type === 'medicalFootbathUseE') {
          const cabinet = event.type === 'medicalCabinetE';
          const pass = cabinet ? passes.medicalCabinetE : passes.medicalFootbathUseE;
          const effect = event.input?.effect, planned = event.input?.planned;
          if (typeof pass?.record !== 'function' ||
              effect?.type !== (cabinet ? 'object-herbalCabinet' : 'object-footBath') ||
              effect.objectId !== (cabinet ? 'v302-medical-medicalCabinet-2' :
                'v302-medical-sterilizer-3') ||
              String(effect.id ?? '') !== id || planned?.effectId !== id ||
              !Number.isFinite(planned.elapsed) || planned.elapsed < 0 ||
              planned.elapsed >= (cabinet ? 1180 : 1050))
            throw new TypeError(`Magic event ${index} needs one owned medical use E`);
        } else if (event?.type === 'medicalUploadConsoleE') {
          const effect = event.input?.effect, planned = event.input?.planned;
          if (typeof passes.medicalUploadConsoleE?.record !== 'function' ||
              effect?.type !== 'action-task' || effect.mode !== 'upload' ||
              effect.targetId !== 'upload-d' || String(effect.id ?? '') !== id ||
              planned?.completionId !== id || planned.phase !== 'complete')
            throw new TypeError(`Magic event ${index} needs one owned medical upload E`);
        } else if (event?.type === 'taskCompletion') {
          if (typeof passes.facilityEffects?.record !== 'function')
            throw new Error('Magic task completion needs WebGPU facilityEffects.record');
          if (!event.input || event.input.effect?.type !== 'action-task' ||
              !['download', 'upload'].includes(event.input.effect.mode) ||
              String(event.input.effect.id ?? '') !== id ||
              !Array.isArray(event.input.scene?.stations) ||
              event.input.scene.stations.length !== 1 ||
              !Array.isArray(event.input.scene?.magicEffects) ||
              event.input.scene.magicEffects.length !== 1 ||
              event.input.scene.magicEffects[0] !== event.input.effect ||
              event.input.scene.stations[0].completionEffect !== event.input.effect)
            throw new TypeError(`Magic event ${index} needs one owned task completion`);
        } else throw new TypeError(`Unsupported magic event ${index}: ${event?.type}`);
      }
      const dropped = ids.filter(id => !owned.has(id));
      if (dropped.length) throw new Error(`Unowned magic effects: ${dropped.join(', ')}`);
      const routedMarkers=new Set(magic.events.filter(event=>event.type==='headMarker')
        .map(event=>String(event.effectId)));
      const unported=[...retained.keys()].filter(id=>!routedMarkers.has(id));
      if (unported.length) throw new Error(`Visible retained markers lack source-order WebGPU routes: ${unported.join(', ')}`);
      const routedEmp = new Set(magic.events.filter(event => event.type === 'empEffect')
        .map(event => String(event.effectId)));
      const unportedEmp = [...visibleEmp.keys()].filter(id => !routedEmp.has(id));
      if (unportedEmp.length) throw new Error(`Visible EMP effects lack source-order WebGPU routes: ${unportedEmp.join(', ')}`);
      const routedSpecialAmmo = new Set(magic.events.filter(event =>
        event.type === 'specialAmmoEffect').map(event => String(event.effectId)));
      const unportedSpecialAmmo = [...visibleSpecialAmmo.keys()].filter(id =>
        !routedSpecialAmmo.has(id));
      if (unportedSpecialAmmo.length)
        throw new Error(`Visible special ammo lacks source-order WebGPU routes: ${unportedSpecialAmmo.join(', ')}`);
      const gaps = ORDER.filter(name => !REQUIRED_SET.has(name) && (!own(stages, name) || stages[name] == null));
      const leases = [];
      let released = false, recorded = false;
      return Object.freeze({ stages: Object.freeze({ ...stages }), gaps: Object.freeze(gaps), device,
        addLease(result) {
          if (released) throw new Error('Main scene frame resources already released');
          const lease = leaseFor(result);
          if (lease) leases.push(lease);
        },
        markRecorded() {
          if (released || recorded) throw new Error('Main scene frame already recorded or released');
          recorded = true;
        },
        release() {
          if (released) return;
          released = true;
          let firstError;
          for (let i = leases.length - 1; i >= 0; i--) {
            try { leases[i](); } catch (error) { firstError ||= error; }
          }
          leases.length = 0;
          if (firstError) throw firstError;
        }
      });
    }

    function record({ frame, target, viewport, renderer: frameRenderer, prepared } = {}) {
      if (destroyed) throw new Error('Main WebGPU scene destroyed');
      if (frameRenderer !== renderer || prepared?.device !== device)
        throw new Error('Main scene frame must use its prepared renderer/device');
      if (!frame || typeof frame.stage !== 'function' || typeof frame.add !== 'function' ||
          typeof frame.sprite !== 'function' || typeof target !== 'string' || !target)
        throw new TypeError('Main scene needs a shared frame and target');
      if (![viewport?.width, viewport?.height, viewport?.pixelWidth, viewport?.pixelHeight]
          .every(value => Number.isInteger(value) && value > 0))
        throw new TypeError('Main scene needs logical viewport and physical backing dimensions');
      if (!prepared?.stages || typeof prepared.markRecorded !== 'function')
        throw new TypeError('Use mainScene.prepare for frame inputs');
      prepared.markRecorded();
      const stages = prepared.stages, results = {}, recorded = [];
      const markerHitTargets = [];
      const run = (name, callback) => {
        const input = stages[name];
        if (input == null) return;
        if (typeof input !== 'object' || Array.isArray(input))
          throw new TypeError(`Main scene stage ${name} needs an input object`);
        try {
          const result = callback(input);
          if (result && typeof result.then === 'function')
            throw new TypeError(`Main scene stage ${name} must record synchronously`);
          prepared.addLease(result);
          results[name] = result;
          recorded.push(name);
        } catch (error) {
          error.message = `Main scene ${name}: ${error.message}`;
          throw error;
        }
      };
      const need = (name, method) => {
        const pass = passes[name];
        if (!pass || typeof pass[method] !== 'function')
          throw new Error(`Missing WebGPU pass ${name}.${method}`);
        if (pass.device && pass.device !== device)
          throw new Error(`WebGPU pass ${name} belongs to another device`);
        return pass;
      };
      const common = input => ({ ...input, frame, target, viewport });
      // No frame.clear here: map.enqueue is the first, clearing pass.
      run('map', input => need('map', 'enqueue').enqueue(frame, {
        target, width: viewport.width, height: viewport.height,
        pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight,
        cameraX: input.camera.x, cameraY: input.camera.y, zoom: input.zoom
      }));
      // A required empty plan is an explicit no-op for maps without this room.
      run('environmentE', input => {
        const result = need('environmentE', 'record').record({
          frame, target, viewport, planned: input.planned
        });
        if (input.fixtures?.length) {
          if (!Array.isArray(input.fixtures))
            throw new TypeError('Medical fixture E plans must be an array');
          for (const planned of input.fixtures) {
            const outcome = need('medicalFixtureE', 'record').record({
              frame, target, viewport, planned });
            if (!outcome?.drawn || outcome.fixtureId !== planned.fixtureId)
              throw new Error(`Medical fixture ${planned.fixtureId} was not drawn`);
          }
        }
        if (input.uploadConsole) {
          const outcome = need('medicalUploadConsoleE', 'record').record({
            frame, target, viewport, planned: input.uploadConsole });
          if (!outcome?.drawn || outcome.phase !== input.uploadConsole.phase)
            throw new Error('Medical upload console idle E was not drawn');
        }
        return result;
      });
      run('stations', input => need('stations', 'record').record({ ...common(input), shapes: need('shapes', 'enqueue') }));
      run('mapObjects', input => need('mapObjects', 'draw').draw(common(input)));
      run('mysteryBoxes', input => need('mysteryBoxes', 'record').record(common(input)));
      run('alchemyObjects', input => need('alchemyObjects', 'record').record({ ...common(input), shapes: need('shapes', 'enqueue') }));
      run('gravityHazards', input => need('gravityHazards', 'record').record(common(input)));
      run('groundItems', input => {
        const pass = need('groundItems', 'record');
        if (!Array.isArray(input.commands)) throw new TypeError('Prepared ground-item commands required');
        frame.stage('world:ground-items');
        const batch = { sprite: item => frame.sprite(target, item), rect: item => frame.rect(target, item) };
        for (const command of input.commands) {
          if (pass.record(batch, command, input.textAtlas) === false)
            throw new Error('Ground-item text atlas is not ready for a prepared command');
        }
        return { drawn: input.commands.length };
      });
      run('facilityEffects', input => need('facilityEffects', 'record').record({ ...common(input), shapes: need('shapes', 'enqueue') }));
      run('bodies', input => need('bodies', 'record').record({ ...common(input), shapes: need('shapes', 'enqueue') }));
      run('worldSound', input => need('worldSound', 'record').record({ ...common(input), shapes: need('shapes', 'enqueue') }));
      run('throwPreview', input => need('throwPreview', 'record').record(common(input)));
      run('preparationSummons', input => need('preparationSummons', 'record').record(common(input)));
      run('players', input => {
        const cache = need('players', 'record');
        const markers = need('headMarkers', 'record');
        const summonInput = stages.preparationSummons;
        const entries = summonInput?.scene.entries;
        const arrivalFor = player => player && !player.isBot && !player.ejected
          ? entries.get(String(player.id || ''))?.arrival || null : null;
        const commands = summonInput ? input.createCommands({ entries, arrivalFor,
          summonResult: results.preparationSummons, viewport }) : input.commands;
        if (!Array.isArray(commands)) throw new TypeError('Synchronous player commands required');
        frame.stage('world:players:sprite');
        const markerViewport = Object.freeze({ ...viewport, generation: input.markerGeneration });
        commands.forEach((command, index) => {
          cache.record(frame, target, command);
          const tail = input.headMarkersForCommand({ command, index, viewport: markerViewport });
          if (!tail || typeof tail.then === 'function' ||
              String(tail.playerId || '') !== String(command.playerId || '') ||
              !Array.isArray(tail.unsupported) || tail.unsupported.length ||
              !tail.planned || tail.planned.generation !== input.markerGeneration ||
              !Array.isArray(tail.planned.unsupported) || tail.planned.unsupported.length ||
              !Array.isArray(tail.planned.commands) || !Array.isArray(tail.planned.hitTargets))
            throw new Error(`Player ${String(command.playerId)} head-marker tail incomplete or unsupported`);
          const hits = markers.record({ frame, target, viewport: markerViewport, planned: tail.planned });
          if (!Array.isArray(hits) || hits.length !== tail.planned.hitTargets.length ||
              hits.some((hit, hitIndex) => hit !== tail.planned.hitTargets[hitIndex]))
            throw new Error(`Player ${String(command.playerId)} head-marker targets differ from recorded plan`);
          markerHitTargets.push(...hits);
        });
        return { drawn: commands.length, markerHitTargets: Object.freeze(markerHitTargets.slice()) };
      });
      run('gunnerAim', input => need('gunnerAim', 'record').record(common(input)));
      run('killCamera', input => need('killCamera', 'record').record(common(input)));
      run('hitEffects', input => need('hitEffects', 'record').record({ ...common(input), shapes: need('shapes', 'enqueue') }));
      run('magicEffects', input => {
        const shapes = need('shapes', 'enqueue');
        // drawMagicEffects iterates state.magicEffects in order; a gravity-storm
        // impact can occur between other TE draws. Record each event at its own
        // position instead of moving all impacts into an early world pass.
        input.events.forEach((event, index) => {
          if (event.type === 'shapes') {
            prepared.addLease(shapes.enqueue(frame, {
              target, width: viewport.width, height: viewport.height,
              pixelWidth: viewport.pixelWidth, pixelHeight: viewport.pixelHeight,
              label: `world:magic-effects:${index}`, commands: event.commands
            }));
          } else if (event.type === 'headMarker') {
            const planned=event.input.planned;
            const markerViewport=Object.freeze({ ...viewport,
              generation: input.markerGeneration });
            const hits=need('headMarkers','record').record({frame,target,
              viewport:markerViewport,planned});
            if (!Array.isArray(hits) || hits.length!==planned.hitTargets.length ||
                hits.some((hit,hitIndex)=>hit!==planned.hitTargets[hitIndex]))
              throw new Error(`Magic retained marker ${event.effectId} targets differ from recorded plan`);
            markerHitTargets.push(...hits);
          } else if (event.type === 'empEffect') {
            const outcome = need('empEffect', 'record').record({ frame, target,
              viewport, planned: event.input.planned });
            if (outcome?.effectId !== event.effectId ||
                outcome.type !== event.input.effect.type || outcome.drawn !== true)
              throw new Error(`Magic EMP ${event.effectId} was not fully claimed and drawn`);
          } else if (event.type === 'specialAmmoEffect') {
            const outcome = need('specialAmmoEffect', 'record').record({ frame, target,
              viewport, planned: event.input.planned });
            if (outcome?.effectId !== event.effectId ||
                outcome.type !== event.input.effect.type ||
                outcome.variant !== event.input.planned.variant || outcome.drawn !== true)
              throw new Error(`Magic special ammo ${event.effectId} was not fully claimed and drawn`);
          } else if (event.type === 'medicalObjectE') {
            const outcome = need('medicalObjectE', 'record').record({ frame, target,
              viewport, planned: event.input.planned });
            if (outcome?.effectId !== event.effectId || outcome.drawn !== true)
              throw new Error(`Medical object E ${event.effectId} was not drawn`);
          } else if (event.type === 'medicalCabinetE' ||
              event.type === 'medicalFootbathUseE') {
            const passName = event.type === 'medicalCabinetE'
              ? 'medicalCabinetE' : 'medicalFootbathUseE';
            const outcome = need(passName, 'record').record({ frame, target,
              viewport, planned: event.input.planned });
            if (outcome?.effectId !== event.effectId || outcome.drawn !== true)
              throw new Error(`Medical use E ${event.effectId} was not drawn`);
          } else if (event.type === 'medicalUploadConsoleE') {
            const outcome = need('medicalUploadConsoleE', 'record').record({ frame,
              target, viewport, planned: event.input.planned });
            if (outcome?.completionId !== event.effectId ||
                outcome.phase !== 'complete' || outcome.drawn !== true)
              throw new Error(`Medical upload E ${event.effectId} was not drawn`);
          } else if (event.type === 'gravityImpact') {
            const outcome = need('gravityImpacts', 'record').record({
              frame, target, viewport, scene: event.scene,
              camera: event.camera || input.camera, zoom: event.zoom || input.zoom
            });
            if (!Array.isArray(outcome?.commands) || !outcome.commands.length)
              throw new Error(`Magic gravity impact ${event.effectId} recorded no draw commands`);
            prepared.addLease(outcome);
          } else if (event.type === 'grenadeImpact') {
            const impact = event.scene.effects[0];
            const outcome = need('grenadeImpacts', 'record').record({
              shapes, frame, target, viewport, scene: event.scene,
              camera: event.camera || input.camera, zoom: event.zoom || input.zoom
            });
            // The grenade pass returns its shape batch inside the outcome.
            // Lease it before checking claims, including on a validation error.
            prepared.addLease(outcome?.batch);
            if (!Array.isArray(outcome?.commands) || !outcome.commands.length ||
                !Array.isArray(outcome.claims) || outcome.claims.length !== 1 ||
                outcome.claims[0].effect !== impact ||
                outcome.claims[0].type !== impact.type ||
                outcome.claims[0].sourceId !== (impact.sourceId ?? null) ||
                !Array.isArray(outcome.unhandled) || outcome.unhandled.length)
              throw new Error(`Magic grenade impact ${event.effectId} was not fully claimed and drawn`);
          } else if (event.type === 'bodyBenefit') {
            const outcome = need('bodyBenefits', 'record').record({
              ...event.input, frame, target, viewport
            });
            if (outcome !== true)
              throw new Error(`Magic body benefit ${event.effectId} was not drawn`);
          } else if (event.type === 'fireActivation') {
            const outcome = need('fireActivation', 'record').record({
              ...event.input, frame, target, viewport
            });
            if (outcome !== true)
              throw new Error(`Magic fire activation ${event.effectId} was not drawn`);
          } else if (event.type === 'taskCompletion') {
            const outcome = need('facilityEffects', 'record').record({
              ...event.input, frame, target, viewport,
              shapes: need('shapes', 'enqueue')
            });
            if (!(outcome?.drawn > 0))
              throw new Error(`Magic task completion ${event.effectId} was not drawn`);
            prepared.addLease(outcome);
          }
        });
        return { drawn: input.events.length };
      });
      run('attackTargets', input => need('attackTargets', 'record').record({ ...common(input), shapes: need('shapes', 'enqueue') }));
      run('taskIndicators', input => need('taskIndicators', 'draw').draw(common(input)));
      run('hud', input => need('hud', 'draw').draw(common(input)));
      run('minimap', input => need('minimap', 'draw').draw(common(input)));
      run('modeBanner', input => need('modeBanner', 'draw').draw(common(input)));
      run('expandedMap', input => need('expandedMap', 'record').record(common(input)));
      run('lighting', input => need('lighting', 'record').record(common(input)));
      run('killAnimation', input => need('killAnimation', 'record').record(common(input)));
      run('sensory', input => need('sensory', 'enqueue').enqueue(common(input)));
      run('markerExplanation', input => need('markerExplanation', 'draw').draw(common(input)));
      run('acquisition', input => {
        const pass = need('acquisition', 'record');
        return pass.record({ ...common(input),
          target: pass.target || target,
          viewport: input.preparedPlan?.viewport || input.viewport || viewport });
      });
      return Object.freeze({ recorded: Object.freeze(recorded), gaps: prepared.gaps,
        markerHitTargets: Object.freeze(markerHitTargets.slice()), results: Object.freeze(results) });
    }
    return Object.freeze({ prepare, record, get device() { return device; }, destroy() { destroyed = true; } });
  }
  const api = Object.freeze({ create, ORDER, REQUIRED });
  root.DvaWebGPUMainScene = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
