import { NetworkInformation } from './network-information-api'
import { timeSince } from './utils'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
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
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

type UseOnlineStatusProps = {
  pollingUrl?: string
  pollingDuration?: number
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
  pollingUrl = 'https://www.gstatic.com/generate_204',
  pollingDuration = 12000
}: UseOnlineStatusProps = {}): {
  attributes: { isOnline: boolean }
  connectionInfo: NetworkInformation
  error: unknown
  isOffline: boolean
  isOnline: boolean
  time: { since: Date; difference: string }
} {
  const [isOnline, setIsOnline] = useState<{
    online: boolean
    time: { since: Date; diff: string }
  }>({
    online:
      isNavigatorObjectAvailable &&
      isWindowDocumentAvailable &&
      typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true,
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
          setIsOnline((prevState) => {
            if (prevState.online) {
              return {
                online: true,
                time: {
                  since: prevState.time.since,
                  diff: timeSince(prevState.time.since)
                }
              }
            }
            return {
              online: true,
              time: {
                since: new Date(),
                diff: timeSince(new Date())
              }
            }
          })
      )
      .catch(() => {
        return setIsOnline((prevState) => {
          if (!prevState.online)
            return {
              online: false,
              time: {
                since: prevState.time.since,
                diff: timeSince(prevState.time.since)
              }
            }
          return {
            online: false,
            time: {
              since: new Date(),
              diff: timeSince(new Date())
            }
          }
        })
      })
  }, [pollingUrl])

  useInterval(_onlineStatusFn, pollingDuration)

  const handleOnlineStatus = useCallback(
    async ({ type }: Event) => {
      type === 'online'
        ? _onlineStatusFn()
        : setIsOnline({
            online: false,
            time: {
              since: new Date(),
              diff: timeSince(new Date())
            }
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
    attributes: { isOnline: isOnline.online },
    connectionInfo,
    error: null,
    isOffline: !isOnline.online,
    isOnline: isOnline.online,
    time: { since: isOnline.time.since, difference: isOnline.time.diff }
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
