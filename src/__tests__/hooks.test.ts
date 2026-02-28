import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useInterval, useOnlineStatus } from '../hooks'

describe('useOnlineStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Default to online
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })
    // Mock fetch for polling
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('returns online status when browser is online', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current.isOnline).toBe(true)
    expect(result.current.isOffline).toBe(false)
  })

  it('provides attributes object for the notification component', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current.attributes).toEqual({ isOnline: true })
  })

  it('provides time information', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current.time.since).toBeInstanceOf(Date)
    expect(typeof result.current.time.difference).toBe('string')
  })

  it('responds to offline browser events', async () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current.isOnline).toBe(true)

    await act(async () => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true,
      })
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current.isOnline).toBe(false)
    expect(result.current.isOffline).toBe(true)
  })

  it('responds to online browser events', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    })
    const { result } = renderHook(() => useOnlineStatus())

    await act(async () => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        configurable: true,
      })
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current.isOnline).toBe(true)
  })

  it('polls at the specified duration', async () => {
    renderHook(() => useOnlineStatus({ pollingDuration: 5000 }))

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    // fetch called for polling
    expect(globalThis.fetch).toHaveBeenCalled()
  })

  it('error property is null by default', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current.error).toBeNull()
  })
})

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls callback at the specified interval', async () => {
    const callback = vi.fn().mockResolvedValue(undefined)

    renderHook(() => useInterval(callback, 1000))

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('does not call callback when delay is null', async () => {
    const callback = vi.fn().mockResolvedValue(undefined)

    renderHook(() => useInterval(callback, null))

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('cleans up interval on unmount', async () => {
    const callback = vi.fn().mockResolvedValue(undefined)

    const { unmount } = renderHook(() => useInterval(callback, 1000))

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    expect(callback).toHaveBeenCalledTimes(1)

    unmount()

    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    // Should still be 1 after unmount
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
