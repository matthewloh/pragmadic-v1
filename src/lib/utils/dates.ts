import {
    format,
    parseISO,
    formatDistance,
    formatRelative,
    isValid,
    isFuture,
    isPast,
    isToday,
    differenceInDays,
    addDays,
    subDays,
} from "date-fns"

// Basic formatting
export const formatDate = (date: Date | string, formatStr = "PPP") => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, formatStr) : "Invalid Date"
}

// Format for display in UI
export const formatDisplayDate = (date: Date | string) => {
    return formatDate(date, "MMMM d, yyyy")
}

// Format for input fields
export const formatInputDate = (date: Date | string) => {
    return formatDate(date, "yyyy-MM-dd")
}

// Format with time
export const formatDateTime = (date: Date | string) => {
    return formatDate(date, "PPP p")
}

// Relative time (e.g., "2 hours ago", "in 3 days")
export const getRelativeTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return formatDistance(dateObj, new Date(), { addSuffix: true })
}

// Relative time with weekday (e.g., "last Friday at 09:00")
export const getRelativeTimeWithWeekday = (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return formatRelative(dateObj, new Date())
}

// Date validation
export const isValidDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return isValid(dateObj)
}

// Check if date is in future
export const isFutureDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return isFuture(dateObj)
}

// Check if date is in past
export const isPastDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return isPast(dateObj)
}

// Check if date is today
export const isDateToday = (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return isToday(dateObj)
}

// Get days difference between two dates
export const getDaysDifference = (
    dateLeft: Date | string,
    dateRight: Date | string,
) => {
    const dateLeftObj =
        typeof dateLeft === "string" ? parseISO(dateLeft) : dateLeft
    const dateRightObj =
        typeof dateRight === "string" ? parseISO(dateRight) : dateRight
    return differenceInDays(dateLeftObj, dateRightObj)
}

// Add days to a date
export const addDaysToDate = (date: Date | string, days: number) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return addDays(dateObj, days)
}

// Subtract days from a date
export const subtractDaysFromDate = (date: Date | string, days: number) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return subDays(dateObj, days)
}

// Format for database (ISO string)
export const formatForDatabase = (date: Date | string) => {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return dateObj.toISOString()
}
