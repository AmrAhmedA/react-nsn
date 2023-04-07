import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

const isWindowDocumentAvailable = typeof window !== 'undefined'

const isNavigatorObjectAvailable = typeof navigator !== 'undefined'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

function useOnlineStatus(
  pollingUrl = 'https://www.gstatic.com/generate_204',
  pollingDuration = 2000
): {
  error: unknown
  isOffline: boolean
  isOnline: boolean
} {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    isNavigatorObjectAvailable &&
    isWindowDocumentAvailable &&
    typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true
  )
  const prevOnlineState = useRef<boolean>()

  useEffect(() => {
    prevOnlineState.current = isOnline
  }, [isOnline])

  const _onlineStatusFn = useCallback(
    async () =>
      await fetch(pollingUrl, { mode: 'no-cors' })
        .then(
          (response) =>
            response && !prevOnlineState.current && setIsOnline(true)
        )
        .catch(() => setIsOnline(false)),
    [pollingUrl]
  )

  useInterval(_onlineStatusFn, pollingDuration)

  const handleOnlineStatus = useCallback(
    async ({ type }: Event) => {
      type === 'online' ? _onlineStatusFn() : setIsOnline(false)
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
    isOffline: !isOnline,
    isOnline
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
