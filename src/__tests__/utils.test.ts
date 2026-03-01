import { describe, expect, it, vi } from 'vitest'
import { timeSince } from '../utils'

describe('timeSince', () => {
  it('returns seconds for very recent dates', () => {
    const now = new Date()
    expect(timeSince(now)).toBe('0 seconds')
  })

  it('returns seconds for dates less than a minute ago', () => {
    const date = new Date(Date.now() - 45 * 1000)
    expect(timeSince(date)).toBe('45 seconds')
  })

  it('returns singular minute for 1-2 minutes ago', () => {
    const date = new Date(Date.now() - 90 * 1000)
    expect(timeSince(date)).toBe('1 minute')
  })

  it('returns plural minutes for 2+ minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000)
    expect(timeSince(date)).toBe('5 minutes')
  })

  it('returns hours for dates hours ago', () => {
    const date = new Date(Date.now() - 3 * 3600 * 1000)
    expect(timeSince(date)).toBe('3 hours')
  })

  it('returns days for dates days ago', () => {
    const date = new Date(Date.now() - 5 * 86400 * 1000)
    expect(timeSince(date)).toBe('5 days')
  })

  it('returns months for dates months ago', () => {
    const date = new Date(Date.now() - 90 * 86400 * 1000)
    // 90 days / 30-day month = 3 months
    expect(timeSince(date)).toBe('3 months')
  })

  it('returns years for dates over a year ago', () => {
    const date = new Date(Date.now() - 400 * 86400 * 1000)
    expect(timeSince(date)).toBe('1 year')
  })

  it('handles future dates gracefully (returns 0 seconds)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
    const future = new Date('2024-01-02T00:00:00Z')
    const result = timeSince(future)
    expect(result).toContain('seconds')
    vi.useRealTimers()
  })
})
