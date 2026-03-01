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

  it('checkNow triggers a fetch call', async () => {
    const { result } = renderHook(() => useOnlineStatus())

    await act(async () => {
      await result.current.checkNow()
    })

    expect(globalThis.fetch).toHaveBeenCalled()
  })

  it('polls at the specified duration', async () => {
    renderHook(() => useOnlineStatus({ pollingDuration: 5000 }))

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    // fetch called for polling
    expect(globalThis.fetch).toHaveBeenCalled()
  })

  it('fires onStatusChange when going offline', async () => {
    const onStatusChange = vi.fn()
    renderHook(() => useOnlineStatus({ onStatusChange }))

    await act(async () => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(onStatusChange).toHaveBeenCalledWith(false)
  })

  it('fires onStatusChange when coming back online', async () => {
    const onStatusChange = vi.fn()
    renderHook(() => useOnlineStatus({ onStatusChange }))

    // Go offline first
    await act(async () => {
      window.dispatchEvent(new Event('offline'))
    })

    onStatusChange.mockClear()

    // Come back online
    await act(async () => {
      window.dispatchEvent(new Event('online'))
    })

    expect(onStatusChange).toHaveBeenCalledWith(true)
  })

  it('uses custom pollingFn when provided', async () => {
    const pollingFn = vi.fn().mockResolvedValue(true)
    renderHook(() => useOnlineStatus({ pollingFn, pollingDuration: 5000 }))

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(pollingFn).toHaveBeenCalled()
    // Should NOT use fetch when pollingFn is provided
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('detects offline status via custom pollingFn returning false', async () => {
    const pollingFn = vi.fn().mockResolvedValue(false)
    const { result } = renderHook(() =>
      useOnlineStatus({ pollingFn, pollingDuration: 5000 }),
    )

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.isOnline).toBe(false)
  })

  it('backs off polling interval when offline', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
    renderHook(() => useOnlineStatus({ pollingDuration: 1000 }))

    vi.mocked(globalThis.fetch).mockClear()

    // First poll at 1s — should fire
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)

    // After first failure, delay doubles to 2s
    // At 2s mark (1s after last poll), should NOT have fired again
    vi.mocked(globalThis.fetch).mockClear()
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(globalThis.fetch).toHaveBeenCalledTimes(0)

    // At 2s after last poll, should fire
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it('pauses polling when the tab is hidden', async () => {
    renderHook(() => useOnlineStatus({ pollingDuration: 5000 }))

    // Clear any initial fetch calls
    vi.mocked(globalThis.fetch).mockClear()

    // Hide the tab
    Object.defineProperty(document, 'hidden', {
      value: true,
      writable: true,
      configurable: true,
    })
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    await act(async () => {
      vi.advanceTimersByTime(10000)
    })

    // No polling should have occurred while hidden
    expect(globalThis.fetch).not.toHaveBeenCalled()

    // Show the tab again
    Object.defineProperty(document, 'hidden', {
      value: false,
      configurable: true,
    })
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    // Should check immediately on tab return
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    // And polling should resume after the interval
    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
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

  it('fires immediately when delay transitions from null to a number', async () => {
    const callback = vi.fn().mockResolvedValue(undefined)

    const { rerender } = renderHook(
      ({ delay }) => useInterval(callback, delay),
      { initialProps: { delay: null as number | null } },
    )

    // Should not have been called while paused
    expect(callback).not.toHaveBeenCalled()

    // Resume with a delay
    rerender({ delay: 1000 })

    // Should fire immediately on resume
    expect(callback).toHaveBeenCalledTimes(1)

    // And continue at the interval
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    expect(callback).toHaveBeenCalledTimes(2)
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
