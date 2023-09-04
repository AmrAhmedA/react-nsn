import { DEFAULT_POLLING_URL, timeSince } from './utils'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState
} from 'react'

const isWindowDocumentAvailable = typeof window !== 'undefined'

const isNavigatorObjectAvailable = typeof navigator !== 'undefined'

function getConnectionInfo() {
  return (
    navigator['connection'] ||
    navigator['mozConnection'] ||
    navigator['webkitConnection'] ||
    null
  )
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' || typeof navigator !== 'undefined'
    ? useLayoutEffect
    : useEffect

type OnlineStatusProps = {
  pollingUrl?: string
  pollingDuration?: number
}

const InitialOnlineStatus =
  isNavigatorObjectAvailable &&
  isWindowDocumentAvailable &&
  typeof navigator?.onLine === 'boolean'
    ? navigator?.onLine
    : true

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

function statusReducer(prevState: State, action: ReducerActions) {
  let newState: State
  switch (action.type) {
    case 'offline': {
      if (!prevState.online)
        newState = {
          ...prevState,
          online: false,
          time: {
            since: prevState.time.since,
            diff: timeSince(prevState.time.since)
          }
        }
      // previous state is online, recalculate time
      else if (prevState.online)
        newState = {
          ...prevState,
          online: false,
          time: {
            since: new Date(),
            diff: timeSince(new Date())
          }
        }
    }
    break
    case 'online': {
      if (prevState.online)
        newState = {
          ...prevState,
          online: true,
          time: {
            since: prevState.time.since,
            diff: timeSince(prevState.time.since)
          }
        }
      // previous state is offline, recalculate time
      else if (!prevState.online) {
        newState = {
          ...prevState,
          online: true,
          time: {
            since: new Date(),
            diff: timeSince(new Date())
          }
        }
      }
    }
    break
    default:
      newState = { ...prevState }
  }
  return newState
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
 * @returns Current network status, connection info,
 * and time since online/offline,
 * attributes to be passed to notification component if used
 */

function useOnlineStatus({
  pollingUrl = DEFAULT_POLLING_URL,
  pollingDuration = 12000
}: OnlineStatusProps = {}): {
  attributes: { isOnline: boolean }
  connectionInfo: NetworkInformation
  error: Error
  isOffline: boolean
  isOnline: boolean
  time: { since: Date; difference: string }
} {
  const [statusState, dispatch] = useReducer(statusReducer, {
    online: InitialOnlineStatus,
    time: {
      since: new Date(),
      diff: timeSince(new Date())
    }
  })

  const connectionInfo = getConnectionInfo()

  const _onlineStatusFn = useCallback(async () => {
    await fetch(pollingUrl, { mode: 'no-cors' })
      .then(
        (response) =>
          response &&
          dispatch({
            type: 'online'
          })
      )
      .catch(() => {
        return dispatch({
          type: 'offline'
        })
      })
  }, [pollingUrl])

  useInterval(_onlineStatusFn, pollingDuration)

  const handleOnlineStatus = useCallback(
    async ({ type }: Event) => {
      type === 'online'
        ? _onlineStatusFn()
        : dispatch({
            type: 'offline'
          })
    },
    [_onlineStatusFn]
  )

  // Reactive logic for detecting browser side online/offline
  useEffect(() => {
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [handleOnlineStatus])

  return {
    attributes: { isOnline: statusState.online },
    connectionInfo,
    error: null,
    isOffline: !statusState.online,
    isOnline: statusState.online,
    time: { since: statusState.time.since, difference: statusState.time.diff }
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
  delay: number | null
) {
  const savedCallback = useRef<() => void | null>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

/**
 *
 * @returns flag that indicates if its the first render for the component
 *
 * @internal
 *
 */
function useFirstRender(): { isFirstRender: boolean } {
  const [firstRender, setFirstRender] = useState(true)

  const { isOffline } = useOnlineStatus()
  useIsomorphicLayoutEffect(() => {
    if (firstRender && isOffline) setFirstRender(false)
  }, [isOffline])

  return { isFirstRender: firstRender }
}

export { useFirstRender, useOnlineStatus }

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
interface NetworkInformation extends EventTarget {
  readonly type?: ConnectionType
  readonly effectiveType?: EffectiveConnectionType
  readonly downlinkMax?: Megabit
  readonly downlink?: Megabit
  readonly rtt?: Millisecond
  readonly saveData?: boolean
  onchange?: EventListener
}
