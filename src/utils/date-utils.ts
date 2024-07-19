import {
  addDays,
  endOfHour,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  isValid,
  parseISO,
} from 'date-fns'

// File used to handle date and time related operations, isolating the dependecy of date-fns from the rest of the codebase

interface CreateUTCDateOptions {
  year?: number
  month?: number
  day?: number
  hour?: number
  minute?: number
  second?: number
  millisecond?: number
}

export function createUTCDate(options: CreateUTCDateOptions = {}) {
  return new Date(
    Date.UTC(
      options.year ?? new Date().getUTCFullYear(),
      options.month ?? new Date().getUTCMonth(),
      options.day ?? new Date().getUTCDate(),
      options.hour ?? 0,
      options.minute ?? 0,
      options.second ?? 0,
      options.millisecond ?? 0,
    ),
  )
}

export function isIsoDateFormat(date: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  return regex.test(date)
}

export function isIsoDateStringValid(dateStr: string) {
  const date = parseISO(dateStr)
  return isValid(date)
}

export function isIsoDateStringBeforeCurrentDate(dateStr: string) {
  const date = parseISO(dateStr)
  return isBefore(date, new Date())
}

export function newUTCDateFromIsoDateString(dateStr: string) {
  const date = parseISO(dateStr)
  return createUTCDate({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  })
}

export function isTimestampValid(timestamp: number) {
  const date = fromUnixTime(timestamp / 1000)
  return isValid(date)
}

export function isTimeStampAfterCurrentEndOfHour(timestamp: number) {
  const date = fromUnixTime(timestamp / 1000)
  return isAfter(date, endOfHour(new Date()))
}

export function newUTCDateFromTimestamp(timestamp: number) {
  const date = new Date(timestamp)
  return createUTCDate({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
  })
}

export function formatDateToIsoDateString(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function addDaysToDate(date: Date, days: number) {
  return addDays(date, days)
}
