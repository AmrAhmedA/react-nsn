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

function useOnlineStatus(
  pollingUrl = 'https://www.gstatic.com/generate_204',
  pollingDuration = 20000
): {
  error: unknown
  isOffline: boolean
  isOnline: boolean
  since: { time: Date; difference: string }
  connectionInfo: NetworkInformation
} {
  const [isOnline, setIsOnline] = useState<{ online: boolean; since: Date }>({
    online:
      isNavigatorObjectAvailable &&
      isWindowDocumentAvailable &&
      typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true,
    since: new Date()
  })

  const connectionInfo = getConnectionInfo()

  const prevOnlineState = useRef<boolean>()

  useEffect(() => {
    prevOnlineState.current = isOnline.online
  }, [isOnline])

  const _onlineStatusFn = useCallback(
    async () =>
      await fetch(pollingUrl, { mode: 'no-cors' })
        .then(
          (response) =>
            response &&
            !prevOnlineState.current &&
            setIsOnline({ online: true, since: new Date() })
        )
        .catch(() => setIsOnline({ online: false, since: new Date() })),
    [pollingUrl]
  )

  useInterval(_onlineStatusFn, pollingDuration)

  const handleOnlineStatus = useCallback(
    async ({ type }: Event) => {
      type === 'online'
        ? _onlineStatusFn()
        : setIsOnline({ online: false, since: new Date() })
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
    error: null,
    isOffline: !isOnline.online,
    isOnline: isOnline.online,
    since: { time: isOnline.since, difference: timeSince(isOnline.since) },
    connectionInfo
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
  const firstUpdate = useRef(true)

  useIsomorphicLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
    }
  }, [])

  return { isFirstRender: firstUpdate.current }
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
  if (interval > 1) {
    return Math.floor(interval) + ' minutes'
  }
  return Math.floor(seconds) + ' seconds'
}
