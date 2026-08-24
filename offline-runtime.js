(() => {
  "use strict";

const OFFLINE_WORKER_VERSION = "electric-long-range-settlement-v558";
// Generated-worker startup must never turn an instant matchmaking decision
// into a 40-second stall. Fall back to the generated main-thread bundle after
// one bounded perceptual beat; initialization is already prewarmed on title.
const OFFLINE_WORKER_READY_TIMEOUT_MS = 800;
const OFFLINE_MAIN_READY_TIMEOUT_MS = 30_000;
const OFFLINE_REQUEST_TIMEOUT_MS = 20_000;

  class OfflineApiClient {
    constructor(options = {}) {
      this.options = options;
      this.worker = null;
      this.pending = new Map();
      this.requestId = 0;
      this.workerGeneration = 0;
      this.readyPromise = null;
      this.readyResolve = null;
      this.readyTimer = null;
      this.mainThreadApi = globalThis.DVAOfflineMainThread || null;
      this.mainThreadPromise = null;
    }

    start() {
      if (!this.mainThreadApi && globalThis.DVAOfflineMainThread) {
        this.mainThreadApi = globalThis.DVAOfflineMainThread;
        this.failPending();
        this.worker?.terminate();
        this.worker = null;
        this.settleReady(true);
      }
      if (this.mainThreadApi) return Promise.resolve(true);
      if (this.worker) return this.readyPromise || Promise.resolve(true);
      const generation = ++this.workerGeneration;
      const workerUrl = new URL("offline-server-worker.js", document.baseURI);
      workerUrl.searchParams.set("v", OFFLINE_WORKER_VERSION);
      workerUrl.searchParams.set("boot", String(generation));
      this.readyPromise = new Promise((resolve) => {
        this.readyResolve = resolve;
        this.readyTimer = setTimeout(() => this.handleWorkerFailure(generation), OFFLINE_WORKER_READY_TIMEOUT_MS);
      });
      try {
        this.worker = new Worker(workerUrl, { name: `${OFFLINE_WORKER_VERSION}-${generation}` });
      } catch {
        this.worker = null;
        this.activateMainThreadFallback(generation);
        return this.readyPromise;
      }
      this.worker.addEventListener("message", (event) => {
        const message = event.data || {};
        if (message.type === "ready") {
          this.settleReady(true);
          return;
        }
        if (message.type !== "response") return;
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        clearTimeout(pending.timer);
        pending.resolve(message.result || null);
      });
      this.worker.addEventListener("error", () => this.handleWorkerFailure(generation));
      this.worker.addEventListener("messageerror", () => this.handleWorkerFailure(generation));
      return this.readyPromise;
    }

    startMainThreadFallback() {
      if (this.mainThreadApi) return Promise.resolve(true);
      if (globalThis.DVAOfflineMainThread) {
        this.mainThreadApi = globalThis.DVAOfflineMainThread;
        return Promise.resolve(true);
      }
      if (this.mainThreadPromise) return this.mainThreadPromise;
      this.mainThreadPromise = new Promise((resolve) => {
        const existing = document.querySelector("script[data-dva-offline-main]");
        const script = existing || document.createElement("script");
        let settled = false;
        const finish = (value) => {
          // A hidden Pages tab can finish parsing the generated main bundle
          // after an earlier readiness boundary. Adopt that late owner even
          // when this particular waiter has already settled, so the next
          // request cannot start another discarded Worker generation.
          const loadedApi = globalThis.DVAOfflineMainThread || null;
          if (loadedApi) {
            this.mainThreadApi = loadedApi;
            this.failPending();
            this.worker?.terminate();
            this.worker = null;
            this.settleReady(true);
          }
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(Boolean(value && this.mainThreadApi));
        };
        const timer = setTimeout(() => finish(false), OFFLINE_MAIN_READY_TIMEOUT_MS);
        script.addEventListener("load", () => finish(true), { once: true });
        script.addEventListener("error", () => finish(false), { once: true });
        if (!existing) {
          const mainUrl = new URL("offline-server-main.js", document.baseURI);
          mainUrl.searchParams.set("v", OFFLINE_WORKER_VERSION);
          script.src = mainUrl.href;
          script.async = true;
          script.dataset.dvaOfflineMain = OFFLINE_WORKER_VERSION;
          document.head.append(script);
        }
      }).finally(() => {
        if (!this.mainThreadApi) this.mainThreadPromise = null;
      });
      return this.mainThreadPromise;
    }

    async activateMainThreadFallback(generation) {
      if (generation !== this.workerGeneration) return;
      this.failPending();
      this.worker?.terminate();
      this.worker = null;
      const ready = await this.startMainThreadFallback();
      if (generation !== this.workerGeneration) return;
      this.settleReady(ready);
    }

    async request(path, body = {}, options = {}) {
      const attempts = Number.isFinite(options.attempts) ? Math.max(1, Number(options.attempts)) : 2;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const ready = await this.start();
        if (ready) {
          const result = await this.requestOnce(path, body, options);
          if (result) return result;
        }
        // A hidden/background browser can discard a ready Worker between its
        // handshake and the first request. Promote the generated main-thread
        // server inside this same request instead of starting another Worker
        // generation and losing the fallback to the generation race.
        const fallbackReady = await this.startMainThreadFallback();
        if (fallbackReady) {
          this.worker?.terminate();
          this.worker = null;
          const fallbackResult = await this.requestOnce(path, body, options);
          if (fallbackResult) return fallbackResult;
        }
        this.stop();
      }
      return null;
    }

    requestOnce(path, body = {}, options = {}) {
      const timeoutMs = Number.isFinite(options.timeoutMs)
        ? Math.max(50, Number(options.timeoutMs))
        : OFFLINE_REQUEST_TIMEOUT_MS;
      const requestBody = {
        ...body,
        clientId: body.clientId || this.options.clientId?.() || "offline-device",
        _offlineDeveloper: Boolean(this.options.isDeveloper?.())
      };
      if (this.mainThreadApi) {
        return new Promise((resolve) => {
          let settled = false;
          const finish = (value) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(value || null);
          };
          const timer = setTimeout(() => finish(null), timeoutMs);
          Promise.resolve(this.mainThreadApi.request(path, requestBody)).then(finish, () => finish(null));
        });
      }
      if (!this.worker) return Promise.resolve(null);
      const id = `offline-${Date.now()}-${++this.requestId}`;
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          this.pending.delete(id);
          resolve(null);
        }, timeoutMs);
        this.pending.set(id, { resolve, timer });
        this.worker.postMessage({
          type: "request",
          id,
          path,
          body: requestBody
        });
      });
    }

    settleReady(value) {
      clearTimeout(this.readyTimer);
      this.readyTimer = null;
      const resolve = this.readyResolve;
      this.readyResolve = null;
      resolve?.(Boolean(value));
    }

    handleWorkerFailure(generation) {
      if (generation !== this.workerGeneration) return;
      this.activateMainThreadFallback(generation);
    }

    failPending() {
      for (const { resolve, timer } of this.pending.values()) {
        clearTimeout(timer);
        resolve(null);
      }
      this.pending.clear();
    }

    stop() {
      this.settleReady(false);
      this.failPending();
      this.worker?.terminate();
      this.worker = null;
      this.readyPromise = null;
    }
  }

  globalThis.DVAOffline = Object.freeze({ OfflineApiClient });
})();
