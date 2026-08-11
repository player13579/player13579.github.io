(() => {
  const hostname = String(globalThis.location?.hostname || "").toLowerCase();
  const local = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  globalThis.DVA_API_BASE_URL = globalThis.DVA_API_BASE_URL || (
    local ? "" : "https://defenders-vs-attackers-api.onrender.com"
  );
})();
