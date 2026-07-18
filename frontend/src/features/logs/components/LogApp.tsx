import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import {
  addMonths,
  eachDayOfInterval,
  format,
  getDate,
  getDay,
  isAfter,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns"
import { ja } from "date-fns/locale"
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { graphql } from "@/generated"
import { cn } from "@/lib/utils"
import {
  formatTimeLeftTodayJST,
  getMonthRange,
  toDateString,
} from "../lib/date"

export const CatchUpDailyLogsDocument = graphql(`
  mutation CatchUpDailyLogs {
    catchUpDailyLogs
  }
`)

export const DailyLogsDocument = graphql(`
  query DailyLogs($from: String!, $to: String!) {
    dailyLogs(from: $from, to: $to) {
      date
      isCompleted
    }
  }
`)

type DayMark =
  | "complete"
  | "incomplete"
  | "today"
  | "future"
  | "other-month"
  | "pending"

function useTimeLeftToday() {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeLeftTodayJST())

  useEffect(() => {
    const tick = () => setTimeLeft(formatTimeLeftTodayJST())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return timeLeft
}

/** JSTの「今日」をローカル Date（年月日のみ）として取得 */
function getTodayDateJST(): Date {
  const [y, m, d] = toDateString(new Date()).split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function LogApp() {
  const [cursorMonth, setCursorMonth] = useState(() => {
    const n = getTodayDateJST()
    return new Date(n.getFullYear(), n.getMonth(), 1)
  })
  const { from, to } = getMonthRange(
    cursorMonth.getFullYear(),
    cursorMonth.getMonth() + 1,
  )
  const timeLeft = useTimeLeftToday()
  const today = useMemo(() => getTodayDateJST(), [])

  const [catchUpDone, setCatchUpDone] = useState(false)
  const [catchUp, { error: catchUpError }] = useMutation(
    CatchUpDailyLogsDocument,
  )

  const { data, loading, error } = useQuery(DailyLogsDocument, {
    variables: { from, to },
    skip: !catchUpDone,
  })

  useEffect(() => {
    let cancelled = false
    catchUp()
      .catch(() => {
        // catchup は保険。失敗しても過去ログの read は許可する
      })
      .finally(() => {
        if (!cancelled) setCatchUpDone(true)
      })
    return () => {
      cancelled = true
    }
  }, [catchUp])

  const logByDate = useMemo(() => {
    const map = new Map<string, boolean>()
    for (const log of data?.dailyLogs ?? []) {
      map.set(log.date, log.isCompleted)
    }
    return map
  }, [data])

  const logsReady = catchUpDone && !loading

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(cursorMonth)
    const startPad = getDay(monthStart)
    const gridStart = new Date(monthStart)
    gridStart.setDate(gridStart.getDate() - startPad)

    const gridEnd = new Date(gridStart)
    gridEnd.setDate(gridEnd.getDate() + 41)

    return eachDayOfInterval({ start: gridStart, end: gridEnd })
  }, [cursorMonth])

  const getMark = (day: Date): DayMark => {
    if (!isSameMonth(day, cursorMonth)) return "other-month"
    if (isSameDay(day, today)) return "today"
    if (isAfter(day, today)) return "future"
    if (!logsReady) return "pending"
    const dateStr = format(day, "yyyy-MM-dd")
    return logByDate.get(dateStr) === true ? "complete" : "incomplete"
  }

  return (
    <div className="w-full max-w-md">
      {catchUpError ? (
        <p className="mb-2 text-muted-foreground text-sm">
          Catch-up skipped: {catchUpError.message}
        </p>
      ) : null}
      {error ? (
        <p className="mb-2 text-destructive text-sm">{error.message}</p>
      ) : null}

      <div className="w-full rounded-3xl bg-[#2a2d35] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCursorMonth((m) => subMonths(m, 1))}
            className="rounded-full p-2 text-gray-300 transition-colors hover:bg-white/10"
            aria-label="Previous month"
          >
            <ChevronLeft size={22} />
          </button>
          <h2 className="text-lg font-semibold tracking-wide">
            {format(cursorMonth, "MMMM yyyy", { locale: ja })}
          </h2>
          <button
            type="button"
            onClick={() => setCursorMonth((m) => addMonths(m, 1))}
            className="rounded-full p-2 text-gray-300 transition-colors hover:bg-white/10"
            aria-label="Next month"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="mb-6 flex items-baseline justify-between px-1">
          <div className="text-3xl font-bold tracking-tight">
            Day {getDate(today)}
          </div>
          <div className="font-mono text-sm text-gray-400 tabular-nums">
            {timeLeft} left
          </div>
        </div>

        <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={`${d}-${i}`}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day) => {
            const mark = getMark(day)
            const dateStr = format(day, "yyyy-MM-dd")
            const inMonth = isSameMonth(day, cursorMonth)

            return (
              <button
                key={dateStr}
                type="button"
                disabled={!inMonth}
                title={dateStr}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-full transition-transform",
                  inMonth && "hover:scale-105",
                  mark === "other-month" && "pointer-events-none invisible",
                  mark === "today" &&
                    "border-[3px] border-blue-500 bg-blue-500/25 text-white",
                  mark === "future" && "bg-[#3a3d47] text-gray-400",
                  mark === "pending" && "bg-[#3a3d47] text-gray-400",
                  mark === "incomplete" &&
                    "border-2 border-dashed border-red-500/80 text-gray-200",
                  mark === "complete" &&
                    "border-2 border-dashed border-emerald-500/80 text-gray-200",
                )}
              >
                <span
                  className={cn(
                    "text-sm leading-none font-semibold",
                    mark === "today" && "text-white",
                    (mark === "future" || mark === "pending") && "text-gray-400",
                  )}
                >
                  {getDate(day)}
                </span>
                {mark === "incomplete" ? (
                  <X size={14} className="mt-0.5 text-red-500" strokeWidth={3} />
                ) : null}
                {mark === "complete" ? (
                  <Check
                    size={14}
                    className="mt-0.5 text-emerald-400"
                    strokeWidth={3}
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
