(() => {
  "use strict";

const OFFLINE_WORKER_VERSION = "item-throw-operator-ate-v391";
const OFFLINE_WORKER_READY_TIMEOUT_MS = 40_000;
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
    }

    start() {
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
        this.settleReady(false);
        this.worker = null;
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

    async request(path, body = {}) {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const ready = await this.start();
        if (ready) {
          const result = await this.requestOnce(path, body);
          if (result) return result;
        }
        this.stop();
      }
      return null;
    }

    requestOnce(path, body = {}) {
      const id = `offline-${Date.now()}-${++this.requestId}`;
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          this.pending.delete(id);
          resolve(null);
        }, OFFLINE_REQUEST_TIMEOUT_MS);
        this.pending.set(id, { resolve, timer });
        this.worker.postMessage({
          type: "request",
          id,
          path,
          body: {
            ...body,
            clientId: body.clientId || this.options.clientId?.() || "offline-device",
            _offlineDeveloper: Boolean(this.options.isDeveloper?.())
          }
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
      this.settleReady(false);
      this.failPending();
      this.worker?.terminate();
      this.worker = null;
      this.readyPromise = null;
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
