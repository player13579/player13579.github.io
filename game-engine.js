(() => {
  "use strict";

  const TARGET_FRAME_MS = 1000 / 60;
  const MAX_FRAME_MS = 1000 / 30;
  const MAX_SIMULATION_FRAME_MS = 100;

  function start(onFrame) {
    let active = true;
    let lastTimestamp = 0;
    let smoothedDelta = TARGET_FRAME_MS;
    let sampleStartedAt = 0;
    let sampleFrames = 0;

    const resetClock = () => {
      lastTimestamp = 0;
      smoothedDelta = TARGET_FRAME_MS;
    };

    const frame = (timestamp) => {
      if (!active) return;
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
      requestAnimationFrame(frame);
    };

    document.documentElement.dataset.fieldEngine = "raf-smooth";
    document.documentElement.dataset.fieldRenderer = "canvas2d";
    document.addEventListener("visibilitychange", resetClock);
    requestAnimationFrame(frame);

    return {
      kind: "raf-smooth",
      stop() {
        active = false;
        document.removeEventListener("visibilitychange", resetClock);
      }
    };
  }

  globalThis.DVAFrameLoop = Object.freeze({ start });
})();
