import { DateTime } from 'luxon'

const formatAs = (value: number, timeValue: string) => {
  const roundedValue = Math.round(value)

  return roundedValue > 1 ? `${roundedValue} ${timeValue}s ago` : `${roundedValue} ${timeValue} ago`
}

const getTimeValue = (diff: any, timeValue: string) => {
  if (timeValue in diff) {
    return diff[timeValue]
  }
  return 0
}

const reviewDate = (dateString: string) => {
  const now = DateTime.now()
  const postDate = DateTime.fromISO(dateString)
  const diff = now.diff(postDate, ['months', 'days', 'years', 'hours']).toObject()
  const years = getTimeValue(diff, 'years')
  const months = getTimeValue(diff, 'months')
  const days = getTimeValue(diff, 'days')
  const hours = getTimeValue(diff, 'hours')

  let dateFormat = ''
  if (years > 0) {
    dateFormat += `${formatAs(years, 'year')}, `
  }
  if (months > 0) {
    dateFormat += `, ${formatAs(months, 'month')}, `
  }
  if (days > 0) {
    dateFormat += `${formatAs(days, 'day')}, `
  }
  if (hours > 0) {
    dateFormat += formatAs(hours, 'hour')
  }

  return dateFormat
}

const formatDate = (dateStr: string, format = 'short') => {
  if (dateStr && format === 'short') {
    return DateTime.fromISO(dateStr).toLocaleString(DateTime.DATETIME_SHORT)
  } else if (dateStr && format === 'short_no_time') {
    return DateTime.fromISO(dateStr).toLocaleString(DateTime.DATE_SHORT)
  }
  return dateStr
}

const pastNumOfDays = (dateStr: string) => {
  if (dateStr) {
    const daysObj = { days: 0, ...DateTime.fromISO(dateStr).diffNow('days').toObject() }
    return Math.round(daysObj.days)
  }
  return 0
}

export { reviewDate, formatDate, pastNumOfDays }
