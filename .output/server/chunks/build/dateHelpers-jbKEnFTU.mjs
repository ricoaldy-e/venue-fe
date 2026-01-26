function pad(n) {
  return String(n).padStart(2, "0");
}
function toDateKey(value) {
  if (!value) return null;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toWibMidnightIso(value) {
  const dateKey = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : toDateKey(value);
  if (!dateKey) return null;
  return `${dateKey}T00:00:00.000+07:00`;
}
function toUtcMidnightIso(value) {
  const dateKey = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : toDateKey(value);
  if (!dateKey) return null;
  return `${dateKey}T00:00:00.000+07:00`;
}
function getTodayInWib() {
  const now = /* @__PURE__ */ new Date();
  const wibFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const wibDateString = wibFormatter.format(now);
  const parts = wibDateString.split("-").map(Number);
  const year = parts[0] ?? 2026;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const wibToday = new Date(year, month - 1, day, 0, 0, 0, 0);
  return wibToday;
}
function getNextNDays(start, n = 7, startFromTomorrow = true) {
  const days = [];
  const now = /* @__PURE__ */ new Date();
  const startOffset = startFromTomorrow ? 1 : 0;
  for (let i = startOffset; i < n + startOffset; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const label = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Jakarta" });
    const dateKey = toDateKey(d);
    const value = toWibMidnightIso(dateKey);
    days.push({ label, value });
  }
  return days;
}

export { toDateKey as a, getTodayInWib as b, getNextNDays as g, toUtcMidnightIso as t };
//# sourceMappingURL=dateHelpers-jbKEnFTU.mjs.map
