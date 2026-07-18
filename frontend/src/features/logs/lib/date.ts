const TZ = "Asia/Tokyo"

export function toDateString(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: TZ })
}

export function getMonthRange(year: number, month: number) {
  const from = `${year}-${String(month).padStart(2, "0")}-01`
  const nextYear = month === 12 ? year + 1 : year
  const nextMonth = month === 12 ? 1 : month + 1
  const to = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`
  return { from, to }
}

/** 今日(JST)の残り時間を HH:MM:SS で返す */
export function formatTimeLeftTodayJST(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(now)

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0)
  const second = Number(parts.find((p) => p.type === "second")?.value ?? 0)

  const remaining = Math.max(
    0,
    24 * 3600 - (hour * 3600 + minute * 60 + second),
  )
  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":")
}
