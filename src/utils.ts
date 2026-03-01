export function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]

  for (const [divisor, unit] of intervals) {
    const value = Math.floor(seconds / divisor)
    if (value >= 1) {
      return `${value} ${unit}${value === 1 ? '' : 's'}`
    }
  }

  return `${seconds} second${seconds === 1 ? '' : 's'}`
}
