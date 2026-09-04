"use strict";
// Decorative, rect-anchored geometry. It never owns input, semantic pixels, or game state.
(() => {
  const profiles = Object.freeze({
    title: "#startScreen", tactics: "#tacticsPanel", "join-lobby": "#joinPanel", select: "#selectPanel", status: "#statusPanel", "operator-cards": "#operatorList", "operator-detail": "#operatorDetail", tablet: "#tabletPanel", side: "#sidePanel", "active-effects": "#activeEffectsPanel", inventory: "#itemControl", vending: "#vendingPanel", hacker: "#hackerAbilityDock", meeting: "#meetingPanel", "field-feed": "#fieldFeedPanel", "vote-list": "#voteList", "expanded-map": "#expandedMapOverlay", keybind: "#keybindOverlay", "kill-camera": "#killCameraOverlay", toast: "#toast", "chat-notification": "#chatNotification", result: "#endOverlay", "canvas-hud": "#gameCanvas"
  });
  const exclusiveProfiles = Object.freeze(["kill-camera", "result", "expanded-map", "keybind", "tactics"]);
  const fingerprintAttributes = Object.freeze(["data-ui-motion-revision", "data-ui-motion-state", "data-ui-motion-event", "aria-expanded", "aria-current", "data-phase"]);
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  let root; let frame = 0; let observer; let resizeObserver; let suspended = Boolean(document.hidden);
  const observedTargets = new Set();
  const slotState = new WeakMap();
  const reducedMotion = () => Boolean(motionPreference.matches);
  const isExposed = (node, rect) => {
    const left = Math.max(0, rect.left); const right = Math.min(innerWidth, rect.right);
    const top = Math.max(0, rect.top); const bottom = Math.min(innerHeight, rect.bottom);
    if (right <= left || bottom <= top) return false;
    const samples = [[.5, .5], [.16, .16], [.84, .16], [.16, .84], [.84, .84]];
    return samples.some(([rx, ry]) => {
      const x = left + (right - left) * rx; const y = top + (bottom - top) * ry;
      const foreground = document.elementsFromPoint(x, y).find((entry) => !root?.contains(entry));
      return Boolean(foreground && (foreground === node || node.contains(foreground)));
    });
  };
  const isVisible = (node) => {
    for (let current = node; current && current !== document.documentElement; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (current.hidden || current.inert || current.getAttribute("aria-hidden") === "true" || style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    }
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && isExposed(node, rect);
  };
  const semanticFingerprint = (node) => fingerprintAttributes.map((attribute) => `${attribute}=${node.getAttribute(attribute) || ""}`).join("|");
  const anchor = (slot, node) => {
    const rect = node.getBoundingClientRect();
    slot.style.setProperty("--dva-motion-x", `${Math.round(rect.left)}px`);
    slot.style.setProperty("--dva-motion-y", `${Math.round(rect.top)}px`);
    slot.style.setProperty("--dva-motion-w", `${Math.max(1, Math.round(rect.width))}px`);
    slot.style.setProperty("--dva-motion-h", `${Math.max(1, Math.round(rect.height))}px`);
    slot.dataset.target = node.id;
    slot.dataset.semanticState = node.dataset.uiMotionState || "default";
    slot.dataset.semanticEvent = node.dataset.uiMotionEvent || "";
  };
  const profileEligible = (name) => name !== "canvas-hud" || !document.querySelector("#statusPanel")?.hidden;
  const playPhase = (slot, phase) => {
    const state = slotState.get(slot) || {};
    slot.hidden = false;
    if (["enter", "update", "leaving"].includes(phase)) {
      slot.dataset.motionPhase = "reset";
      void slot.offsetWidth;
    }
    state.phase = phase; slotState.set(slot, state); slot.dataset.motionPhase = phase;
    if (phase === "settled") slot.dataset.motionSettled = "true";
    else delete slot.dataset.motionSettled;
  };
  const settle = (slot) => {
    const state = slotState.get(slot);
    if (!state || state.phase === "leaving") { slot.hidden = true; return; }
    playPhase(slot, "settled");
  };
  const hideAfterLeaving = (slot) => {
    const state = slotState.get(slot);
    if (state?.phase === "leaving") { slot.hidden = true; state.active = false; }
  };
  const reconcile = () => {
    frame = 0;
    if (!root || suspended || document.hidden) return;
    let any = false;
    const nextTargets = new Set();
    const candidates = Object.entries(profiles).map(([name, selector]) => {
      const target = document.querySelector(selector);
      if (target) nextTargets.add(target);
      return { name, target, active: Boolean(target && profileEligible(name) && isVisible(target)) };
    });
    const exclusive = exclusiveProfiles.find((name) => candidates.some((entry) => entry.name === name && entry.active));
    for (const { name, target, active: exposed } of candidates) {
      const slot = root.querySelector(`[data-profile="${name}"]`);
      const active = exposed && (!exclusive || name === exclusive);
      const state = slotState.get(slot) || { active: false, fingerprint: "", phase: "inactive" };
      if (!active) {
        if (state.active && !slot.hidden) playPhase(slot, "leaving");
        state.active = false; slotState.set(slot, state);
        continue;
      }
      anchor(slot, target); any = true;
      const fingerprint = semanticFingerprint(target);
      const changed = state.active && state.fingerprint !== fingerprint;
      state.active = true; state.fingerprint = fingerprint; slotState.set(slot, state);
      if (reducedMotion()) playPhase(slot, "settled");
      else if (slot.hidden || state.phase === "inactive" || state.phase === "leaving") playPhase(slot, "enter");
      else if (changed) playPhase(slot, "update");
    }
    for (const target of observedTargets) {
      if (!nextTargets.has(target)) { resizeObserver?.unobserve(target); observedTargets.delete(target); }
    }
    for (const target of nextTargets) {
      if (!observedTargets.has(target)) { resizeObserver?.observe(target); observedTargets.add(target); }
    }
    root.hidden = !any && ![...root.children].some((slot) => !slot.hidden && slot.dataset.motionPhase === "leaving");
  };
  const schedule = () => {
    if (suspended || document.hidden || frame) return;
    frame = requestAnimationFrame(reconcile);
  };
  const onAnimationEnd = (event) => {
    const slot = event.target.closest?.(".dva-ui-motion-slot");
    if (!slot || !root?.contains(slot) || !event.target.classList.contains("dva-ui-motion-secondary")) return;
    if (slot.dataset.motionPhase === "leaving") hideAfterLeaving(slot); else settle(slot);
    root.hidden = ![...root.children].some((entry) => !entry.hidden);
  };
  const suspend = () => {
    suspended = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (root) {
      root.setAttribute("data-motion-suspended", "true");
      for (const slot of root.children) {
        const state = slotState.get(slot);
        if (slot.dataset.motionPhase === "leaving") {
          slot.hidden = true;
          if (state) state.active = false;
        } else if (!slot.hidden && state?.active) {
          playPhase(slot, "settled");
        }
      }
      root.hidden = ![...root.children].some((slot) => !slot.hidden);
    }
  };
  const resume = () => {
    suspended = Boolean(document.hidden);
    if (suspended) return;
    root?.removeAttribute("data-motion-suspended"); schedule();
  };
  const onMotionPreference = () => {
    if (motionPreference.matches && root) {
      for (const slot of root.children) {
        const state = slotState.get(slot);
        if (!slot.hidden && state?.active) playPhase(slot, "settled");
      }
    }
    schedule();
  };
  const onVisibilityChange = () => document.hidden ? suspend() : resume();
  const start = () => {
    if (root) { resume(); return; }
    root = document.createElement("div"); root.id = "dvaUiMotionGraphicsV608"; root.setAttribute("aria-hidden", "true"); root.setAttribute("data-motion-owner", "v613");
    for (const name of Object.keys(profiles)) {
      const slot = document.createElement("div"); slot.className = "dva-ui-motion-slot"; slot.dataset.profile = name; slot.dataset.motionPhase = "inactive"; slot.hidden = true;
      const primary = document.createElement("span"); primary.className = "dva-ui-motion-primary";
      const secondary = document.createElement("span"); secondary.className = "dva-ui-motion-secondary";
      slot.append(primary, secondary); root.append(slot);
    }
    document.body.append(root); root.addEventListener("animationend", onAnimationEnd);
    observer = new MutationObserver((records) => { if (records.some((record) => !root?.contains(record.target))) schedule(); });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden", "class", "aria-hidden", "style", "data-ui-motion-revision", "data-ui-motion-state", "data-ui-motion-event", "aria-expanded", "aria-current", "data-phase"] });
    resizeObserver = new ResizeObserver(schedule); resizeObserver.observe(document.documentElement);
    addEventListener("resize", schedule, { passive: true }); addEventListener("scroll", schedule, { passive: true, capture: true });
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });
    motionPreference.addEventListener?.("change", onMotionPreference);
    addEventListener("pagehide", suspend, { passive: true }); addEventListener("pageshow", resume, { passive: true }); resume();
  };
  const stop = () => {
    suspend(); observer?.disconnect(); resizeObserver?.disconnect(); observer = undefined; resizeObserver = undefined; observedTargets.clear();
    removeEventListener("resize", schedule); removeEventListener("scroll", schedule, true); document.removeEventListener("visibilitychange", onVisibilityChange); motionPreference.removeEventListener?.("change", onMotionPreference); root?.removeEventListener("animationend", onAnimationEnd); root?.remove(); root = undefined;
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true }); else start();
  addEventListener("unload", stop, { once: true, passive: true });
})();
