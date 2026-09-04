(() => {
  "use strict";

  const TARGET_FRAME_MS = 1000 / 60;
  const MAX_FRAME_MS = 1000 / 30;
  const MAX_SIMULATION_FRAME_MS = 100;

  function start(onFrame, isFrameEligible = () => true) {
    let active = true;
    let frameId = 0;
    let lastTimestamp = 0;
    let lastRenderedAt = 0;
    let smoothedDelta = TARGET_FRAME_MS;
    let sampleStartedAt = 0;
    let sampleFrames = 0;

    const resetClock = () => {
      lastTimestamp = 0;
      smoothedDelta = TARGET_FRAME_MS;
    };

    const runnable = () => active && !document.hidden && Boolean(isFrameEligible());
    const publishFrameLifecycle = () => {
      const root = document.documentElement;
      if (!root?.dataset) return;
      root.dataset.fieldFrameOwner = frameId ? "scheduled" : "none";
      root.dataset.fieldFrameState = !active
        ? "stopped"
        : document.hidden
          ? "hidden-paused"
          : !isFrameEligible()
            ? "screen-paused"
            : "running";
    };
    const cancelScheduledFrame = () => {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
      publishFrameLifecycle();
    };
    const scheduleFrame = () => {
      if (runnable() && !frameId) frameId = requestAnimationFrame(frame);
      publishFrameLifecycle();
    };
    const sync = () => {
      resetClock();
      if (!runnable()) cancelScheduledFrame();
      else scheduleFrame();
      publishFrameLifecycle();
    };

    const frame = (timestamp) => {
      frameId = 0;
      if (!active) return;
      if (!runnable()) return;
      const verificationFrameInterval = Math.max(0, Number(document.documentElement.dataset.verificationFrameInterval) || 0);
      if (verificationFrameInterval > 0 && lastRenderedAt && timestamp - lastRenderedAt < verificationFrameInterval) {
        frameId = requestAnimationFrame(frame);
        publishFrameLifecycle();
        return;
      }
      lastRenderedAt = timestamp;
      let rawDelta = lastTimestamp ? timestamp - lastTimestamp : TARGET_FRAME_MS;
      lastTimestamp = timestamp;
      if (!Number.isFinite(rawDelta) || rawDelta > 250) {
        rawDelta = TARGET_FRAME_MS;
        smoothedDelta = TARGET_FRAME_MS;
      }
      const clampedDelta = Math.min(MAX_FRAME_MS, Math.max(1, rawDelta));
      smoothedDelta += (clampedDelta - smoothedDelta) * 0.2;
      const simulationDelta = Math.min(MAX_SIMULATION_FRAME_MS, Math.max(1, rawDelta));
      onFrame(timestamp, simulationDelta, smoothedDelta);

      sampleFrames += 1;
      if (!sampleStartedAt) sampleStartedAt = timestamp;
      if (timestamp - sampleStartedAt >= 1000) {
        const fps = Math.round(sampleFrames * 1000 / Math.max(1, timestamp - sampleStartedAt));
        document.documentElement.dataset.fieldFps = String(fps);
        sampleStartedAt = timestamp;
        sampleFrames = 0;
      }
      scheduleFrame();
    };

    document.documentElement.dataset.fieldEngine = "raf-smooth";
    document.documentElement.dataset.fieldRenderer = "canvas2d";
    document.addEventListener("visibilitychange", sync);
    sync();

    return {
      kind: "raf-smooth",
      sync,
      stop() {
        active = false;
        cancelScheduledFrame();
        publishFrameLifecycle();
        document.removeEventListener("visibilitychange", sync);
      }
    };
  }

  globalThis.DVAFrameLoop = Object.freeze({ start });
})();
