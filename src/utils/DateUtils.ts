/**
 * Date utility functions for formatting and displaying dates
 */

/**
 * Format a date string or Date object to a readable format
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return dateObj.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format a date to show time ago (e.g., "2 hours ago", "3 days ago")
 */
export const timeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now'
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }
  
  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  }
  
  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months === 1 ? '' : 's'} ago`
  }
  
  // More than a year
  const years = Math.floor(diffInSeconds / 31536000)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

/**
 * Format a date to a short format (e.g., "Jan 15, 2024")
 */
export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format a date to include time (e.g., "January 15, 2024 at 3:30 PM")
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Check if a date is today
 */
export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  
  return dateObj.toDateString() === today.toDateString()
}

/**
 * Check if a date is yesterday
 */
export const isYesterday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  return dateObj.toDateString() === yesterday.toDateString()
}

/**
 * Get a relative date string (Today, Yesterday, or formatted date)
 */
export const getRelativeDate = (date: string | Date): string => {
  if (isToday(date)) {
    return 'Today'
  }
  
  if (isYesterday(date)) {
    return 'Yesterday'
  }
  
  return formatDateShort(date)
}

/**
 * Format duration in seconds to human readable format
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }
  
  const hours = Math.floor(seconds / 3600)
  const remainingMinutes = Math.floor((seconds % 3600) / 60)
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

/**
 * Parse ISO date string to local date
 */
export const parseISODate = (isoString: string): Date => {
  return new Date(isoString)
}

/**
 * Convert date to ISO string for API calls
 */
export const toISOString = (date: Date): string => {
  return date.toISOString()
}

/**
 * Calculate the number of days between a date and now
 * Returns negative number for past dates, positive for future dates
 */
export const pastNumOfDays = (date: string | Date): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  
  if (isNaN(dateObj.getTime())) {
    return 0
  }
  
  const diffInTime = dateObj.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24))
  
  return diffInDays
}

/**
 * Format a review date to show relative time or formatted date
 * Used for displaying when a review was created
 */
export const reviewDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }
  
  // Less than a day - show time ago
  if (diffInSeconds < 86400) {
    return timeAgo(date)
  }
  
  // Less than a week - show days ago
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }
  
  // More than a week - show formatted date
  return formatDateShort(date)
}