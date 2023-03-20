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

// TODO:: Add polling
function useOnlineStatus({
  toggleVisibility
}: {
  toggleVisibility: (flag: boolean) => void
}): {
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

  const handleOnlineStatus = useCallback(
    ({ type }: Event) => {
      setIsOnline(type === 'online')
      toggleVisibility(true)
    },
    [toggleVisibility]
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
