"use strict";
// Decorative, rect-anchored geometry: no input, semantic pixels, or game state.
(() => {
  const profiles = Object.freeze({
    title:"#startScreen", tactics:"#tacticsPanel", "join-lobby":"#joinPanel", select:"#selectPanel", status:"#statusPanel", "operator-cards":"#operatorList", "operator-detail":"#operatorDetail", tablet:"#tabletPanel", side:"#sidePanel", "active-effects":"#activeEffectsPanel", inventory:"#itemControl", vending:"#vendingPanel", hacker:"#hackerAbilityDock", meeting:"#meetingPanel", "field-feed":"#fieldFeedPanel", "vote-list":"#voteList", "expanded-map":"#expandedMapOverlay", keybind:"#keybindOverlay", "kill-camera":"#killCameraOverlay", toast:"#toast", "chat-notification":"#chatNotification", result:"#endOverlay", "canvas-hud":"#gameCanvas"
  });
  const exclusiveProfiles = Object.freeze(["kill-camera", "result", "expanded-map", "keybind", "tactics"]);
  let root; let frame = 0; let observer; let resizeObserver;
  const observedTargets = new Set();
  const isExposed = (node, rect) => {
    const left = Math.max(0, rect.left); const right = Math.min(innerWidth, rect.right);
    const top = Math.max(0, rect.top); const bottom = Math.min(innerHeight, rect.bottom);
    if (right <= left || bottom <= top) return false;
    const samples = [[.5,.5],[.16,.16],[.84,.16],[.16,.84],[.84,.84]];
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
  const anchor = (slot, node) => {
    const rect = node.getBoundingClientRect();
    slot.style.setProperty("--dva-motion-x", `${Math.round(rect.left)}px`);
    slot.style.setProperty("--dva-motion-y", `${Math.round(rect.top)}px`);
    slot.style.setProperty("--dva-motion-w", `${Math.max(1, Math.round(rect.width))}px`);
    slot.style.setProperty("--dva-motion-h", `${Math.max(1, Math.round(rect.height))}px`);
    slot.dataset.target = node.id;
  };
  const profileEligible = (name) => name !== "canvas-hud" || !document.querySelector("#statusPanel")?.hidden;
  const reconcile = () => {
    frame = 0; if (!root) return; let any = false;
    const nextTargets = new Set();
    const candidates = Object.entries(profiles).map(([name, selector]) => {
      const target = document.querySelector(selector);
      if (target) nextTargets.add(target);
      return { name, target, active: Boolean(target && profileEligible(name) && isVisible(target)) };
    });
    const exclusive = exclusiveProfiles.find((name) => candidates.some((entry) => entry.name === name && entry.active));
    for (const { name, target, active: visible } of candidates) {
      const slot = root.querySelector(`[data-profile="${name}"]`);
      const active = visible && (!exclusive || name === exclusive); slot.hidden = !active;
      if (active) { anchor(slot, target); any = true; }
    }
    for (const target of observedTargets) {
      if (!nextTargets.has(target)) { resizeObserver?.unobserve(target); observedTargets.delete(target); }
    }
    for (const target of nextTargets) {
      if (!observedTargets.has(target)) { resizeObserver?.observe(target); observedTargets.add(target); }
    }
    root.hidden = !any;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(reconcile); };
  const start = () => {
    if (root) return;
    root = document.createElement("div"); root.id = "dvaUiMotionGraphicsV608"; root.setAttribute("aria-hidden", "true"); root.setAttribute("data-motion-owner", "v608");
    for (const name of Object.keys(profiles)) { const slot = document.createElement("div"); slot.className = "dva-ui-motion-slot"; slot.dataset.profile = name; slot.hidden = true; root.append(slot); }
    document.body.append(root);
    observer = new MutationObserver((records) => {
      if (records.some((record) => !root?.contains(record.target))) schedule();
    });
    observer.observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:["hidden", "class", "aria-hidden", "style"] });
    resizeObserver = new ResizeObserver(schedule); resizeObserver.observe(document.documentElement);
    addEventListener("resize", schedule, { passive:true }); addEventListener("scroll", schedule, { passive:true, capture:true }); schedule();
  };
  const stop = () => {
    if (frame) cancelAnimationFrame(frame); frame = 0; observer?.disconnect(); resizeObserver?.disconnect(); observer = undefined; resizeObserver = undefined; observedTargets.clear();
    removeEventListener("resize", schedule); removeEventListener("scroll", schedule, true); root?.remove(); root = undefined;
  };
  addEventListener("pagehide", stop, { passive:true }); addEventListener("pageshow", start, { passive:true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once:true }); else start();
})();
