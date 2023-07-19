import { NetworkInformation } from './network-information-api'
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

function useFirstRender(): { isFirstRender: boolean } {
  const [firstRender, setFirstRender] = useState(true)

  const { isOffline } = useOnlineStatus()
  useIsomorphicLayoutEffect(() => {
    if (firstRender && isOffline) setFirstRender(false)
  }, [isOffline])

  return { isFirstRender: firstRender }
}

export { useFirstRender, useOnlineStatus }

function timeSince(date: any) {
  const seconds = Math.floor(((new Date() as any) - date) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours'
  }

  interval = seconds / 60

  if (interval > 2) {
    return Math.floor(interval) + ' minutes'
  }

  if (interval > 1) {
    return Math.floor(interval) + ' minute'
  }

  return Math.floor(seconds) + ' seconds'
}
