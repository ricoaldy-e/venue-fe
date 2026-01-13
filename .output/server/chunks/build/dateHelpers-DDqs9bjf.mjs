function pad(n) {
  return String(n).padStart(2, "0");
}
function toDateKey(value) {
  if (!value) return null;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toUtcMidnightIso(value) {
  const dateKey = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : toDateKey(value);
  if (!dateKey) return null;
  return `${dateKey}T00:00:00.000Z`;
}
function getNextNDays(n = 7, startFromTomorrow = true) {
  const days = [];
  const now = /* @__PURE__ */ new Date();
  const startOffset = startFromTomorrow ? 1 : 0;
  for (let i = startOffset; i < n + startOffset; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const label = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
    const dateKey = toDateKey(d);
    const value = toUtcMidnightIso(dateKey);
    days.push({ label, value });
  }
  return days;
}

export { toDateKey as a, getNextNDays as g, toUtcMidnightIso as t };
//# sourceMappingURL=dateHelpers-DDqs9bjf.mjs.map
