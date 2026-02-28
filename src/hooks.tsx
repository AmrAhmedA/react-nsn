import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { DEFAULT_POLLING_URL, timeSince } from './utils'

const isWindowDocumentAvailable = typeof window !== 'undefined'

const isNavigatorObjectAvailable = typeof navigator !== 'undefined'

function getConnectionInfo(): NetworkInformation | null {
  if (isNavigatorObjectAvailable) {
    const nav: Navigator & {
      connection?: NetworkInformation
      mozConnection?: NetworkInformation
      webkitConnection?: NetworkInformation
    } = navigator
    return nav.connection || nav.mozConnection || nav.webkitConnection || null
  }
  return null
}

type OnlineStatusProps = {
  pollingUrl?: string
  pollingDuration?: number
  pollingFn?: () => Promise<boolean>
  onStatusChange?: (isOnline: boolean) => void
}

const InitialOnlineStatus = isNavigatorObjectAvailable ? navigator.onLine : true

type ReducerActionTypes = 'offline' | 'online'
type ReducerActions = {
  type: ReducerActionTypes
}

type State = {
  online: boolean
  time: {
    since: Date
    diff: string
  }
}

function statusReducer(prevState: State, action: ReducerActions): State {
  switch (action.type) {
    case 'offline': {
      const since = prevState.online ? new Date() : prevState.time.since
      return {
        ...prevState,
        online: false,
        time: { since, diff: timeSince(since) },
      }
    }
    case 'online': {
      const since = prevState.online ? prevState.time.since : new Date()
      return {
        ...prevState,
        online: true,
        time: { since, diff: timeSince(since) },
      }
    }
    default:
      return prevState
  }
}

/**
 * Return current network status, status time info, network information
 * @example
 * Here's simple example:
 * ```
 * // Prints "true":
 * const { isOnline } = useOnlineStatus()
 * console.log(isOnline) // Prints true in your app if network is online
 * ```
 * @param pollingUrl your custom polling url
 * @param pollingDuration your custom polling duration in ms
 * @param pollingFn custom async function for connectivity checks — should return `true` if online, `false` if offline. Overrides `pollingUrl` when provided
 * @param onStatusChange callback fired when the online status changes (skips initial render)
 * @returns Current network status, connection info,
 * time since online/offline,
 * attributes to be passed to notification component if used,
 * and checkNow to manually trigger a connectivity check
 */

type OnlineStatusResult = {
  attributes: { isOnline: boolean }
  checkNow: () => Promise<void>
  connectionInfo: NetworkInformation | null
  isOffline: boolean
  isOnline: boolean
  time: { since: Date; difference: string }
}

function useOnlineStatus({
  pollingUrl = DEFAULT_POLLING_URL,
  pollingDuration = 12000,
  pollingFn,
  onStatusChange,
}: OnlineStatusProps = {}): OnlineStatusResult {
  const [statusState, dispatch] = useReducer(statusReducer, {
    online: InitialOnlineStatus,
    time: {
      since: new Date(),
      diff: timeSince(new Date()),
    },
  })

  const connectionInfo = useMemo(() => getConnectionInfo(), [])

  const pollingFnRef = useRef(pollingFn)
  pollingFnRef.current = pollingFn

  const [effectiveDelay, setEffectiveDelay] = useState(pollingDuration)

  const _onlineStatusFn = useCallback(async () => {
    try {
      if (pollingFnRef.current) {
        const online = await pollingFnRef.current()
        dispatch({ type: online ? 'online' : 'offline' })
        if (online) {
          setEffectiveDelay(pollingDuration)
        } else {
          setEffectiveDelay((prev) => Math.min(prev * 2, 60000))
        }
      } else {
        await fetch(pollingUrl, { mode: 'no-cors' })
        dispatch({ type: 'online' })
        setEffectiveDelay(pollingDuration)
      }
    } catch {
      dispatch({ type: 'offline' })
      setEffectiveDelay((prev) => Math.min(prev * 2, 60000))
    }
  }, [pollingUrl, pollingDuration])

  const [tabVisible, setTabVisible] = useState(
    isWindowDocumentAvailable ? !document.hidden : true,
  )

  useEffect(() => {
    if (isWindowDocumentAvailable) {
      const onVisibilityChange = () => {
        const visible = !document.hidden
        setTabVisible(visible)
        if (visible) _onlineStatusFn()
      }
      document.addEventListener('visibilitychange', onVisibilityChange)
      return () =>
        document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [_onlineStatusFn])

  useInterval(_onlineStatusFn, tabVisible ? effectiveDelay : null)

  const handleOnlineStatus = useCallback(
    ({ type }: Event) => {
      if (type === 'online') {
        _onlineStatusFn()
      } else {
        dispatch({ type: 'offline' })
      }
    },
    [_onlineStatusFn],
  )

  // Reactive logic for detecting browser side online/offline
  useEffect(() => {
    if (isWindowDocumentAvailable) {
      window.addEventListener('online', handleOnlineStatus)
      window.addEventListener('offline', handleOnlineStatus)

      return () => {
        window.removeEventListener('online', handleOnlineStatus)
        window.removeEventListener('offline', handleOnlineStatus)
      }
    }
  }, [handleOnlineStatus])

  // Fire onStatusChange callback when status changes (skip initial render)
  const onStatusChangeRef = useRef(onStatusChange)
  onStatusChangeRef.current = onStatusChange
  const isInitialRenderRef = useRef(true)

  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false
      return
    }
    onStatusChangeRef.current?.(statusState.online)
  }, [statusState.online])

  return {
    attributes: { isOnline: statusState.online },
    checkNow: _onlineStatusFn,
    connectionInfo,
    isOffline: !statusState.online,
    isOnline: statusState.online,
    time: { since: statusState.time.since, difference: statusState.time.diff },
  }
}

/**
 *
 * @param callback function that is called in an interval of time
 * @param delay delay between intervals, specified in ms
 *
 * @internal
 *
 */
export function useInterval(
  callback: () => Promise<void>,
  delay: number | null,
) {
  const savedCallback = useRef<(() => Promise<void>) | null>(null)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current?.()
    }

    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export { useOnlineStatus }
export type { OnlineStatusResult }

type Megabit = number
type Millisecond = number
type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g'
type ConnectionType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'mixed'
  | 'none'
  | 'other'
  | 'unknown'
  | 'wifi'
  | 'wimax'
export interface NetworkInformation extends EventTarget {
  readonly type?: ConnectionType
  readonly effectiveType?: EffectiveConnectionType
  readonly downlinkMax?: Megabit
  readonly downlink?: Megabit
  readonly rtt?: Millisecond
  readonly saveData?: boolean
  onchange?: EventListener
}
