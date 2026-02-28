import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import './App.css'
import { closeIcon, offlineIcon, onlineIcon } from './icons'

export type StatusText = {
  online?: string
  offline?: string
}

export type Position =
  | 'topLeft'
  | 'topRight'
  | 'topCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'bottomCenter'

export type EventsCallback = {
  onRefreshClick?: () => void
  onCloseClick?: () => void
}

export interface OnlineStatusNotificationProps {
  darkMode?: boolean
  destroyOnClose?: boolean
  /** @deprecated Use `destroyOnClose` instead */
  destoryOnClose?: boolean
  duration?: number
  eventsCallback?: EventsCallback
  isOnline: boolean
  position?: Position
  statusText?: StatusText
}

type Phase = 'hidden' | 'entering' | 'visible' | 'exiting'

const DefaultOnlineText = 'Your internet connection was restored.'
const DefaultOfflineText = 'You are currently offline.'
const TRANSITION_FALLBACK_MS = 400

/**
 * The notification component will pop up when the network status becomes offline and will popup once again when it goes back online
 * @example
 * Simple example to use the notification component
 * ```
 * function App() {
 *   const { attributes } = useOnlineStatus()
 *
 *   return <OnlineStatusNotifier {...attributes} />
 * }
 *
 * ```
 * @param darkMode toggle dark mode on
 * @param destroyOnClose remove notification from dom when it hides
 * @param destoryOnClose @deprecated use `destroyOnClose` instead
 * @param duration duration of the notification in ms
 * @param eventsCallback object that contains 2 callbacks that are called when refresh button is clicked or close button clicked
 * @param isOnline status of the app when online
 * @param position customize notification component position
 * @param statusText customize online/offline status objects.
 * @returns JSX Element
 *
 */
const OnlineStatusNotificationComponent = forwardRef<
  HTMLDivElement,
  OnlineStatusNotificationProps
>((props, ref) => {
  const {
    darkMode = false,
    destroyOnClose,
    destoryOnClose,
    duration = 4500,
    eventsCallback,
    isOnline,
    position = 'bottomLeft',
    statusText,
  } = props

  const shouldDestroyOnClose = destroyOnClose ?? destoryOnClose ?? true

  const [phase, setPhase] = useState<Phase>('hidden')
  const [hovering, setHovering] = useState(false)
  const [displayedOnline, setDisplayedOnline] = useState(isOnline)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingOnlineRef = useRef<boolean | null>(null)
  const isFirstChangeRef = useRef(true)
  const phaseRef = useRef<Phase>(phase)
  phaseRef.current = phase

  const isVisible = phase === 'visible'

  const enterNotification = useCallback((online: boolean) => {
    setDisplayedOnline(online)
    pendingOnlineRef.current = null
    setPhase('entering')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('visible'))
    })
  }, [])

  React.useImperativeHandle(ref, (): any => ({
    openStatus: () => enterNotification(isOnline),
    dismiss: () => setPhase('exiting'),
  }))

  // When isOnline changes, trigger the notification
  useEffect(() => {
    if (isFirstChangeRef.current) {
      isFirstChangeRef.current = false
      if (isOnline) return
    }

    if (phaseRef.current === 'visible' || phaseRef.current === 'entering') {
      // Already showing — exit first, swap content after exit completes
      pendingOnlineRef.current = isOnline
      setPhase('exiting')
    } else {
      enterNotification(isOnline)
    }
  }, [isOnline, enterNotification])

  const completeExit = useCallback(() => {
    if (phaseRef.current !== 'exiting') return
    if (pendingOnlineRef.current !== null) {
      enterNotification(pendingOnlineRef.current)
    } else {
      setPhase('hidden')
    }
  }, [enterNotification])

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return
    completeExit()
  }

  // Fallback in case transitionend never fires
  useEffect(() => {
    if (phase === 'exiting') {
      const id = setTimeout(completeExit, TRANSITION_FALLBACK_MS)
      return () => clearTimeout(id)
    }
  }, [phase, completeExit])

  // Auto-hide after duration
  useEffect(() => {
    if (!hovering && duration > 0 && isVisible) {
      timeoutRef.current = setTimeout(() => {
        setPhase('exiting')
      }, duration)

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    }
  }, [duration, hovering, isVisible, isOnline])

  const handleRefreshButtonClick = () => {
    if (eventsCallback?.onRefreshClick) {
      eventsCallback.onRefreshClick()
    } else {
      location.reload()
    }
  }

  const handleCloseButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    if (eventsCallback?.onCloseClick) {
      eventsCallback.onCloseClick()
    }
    setPhase('exiting')
  }

  if (shouldDestroyOnClose && phase === 'hidden') return null

  const phaseClass =
    phase === 'entering'
      ? 'fade-initial'
      : phase === 'visible'
        ? 'fade-enter-active'
        : 'fade-exit-active'

  return (
    <div
      role="status"
      aria-live="polite"
      className={classNames(
        'statusNotification',
        darkMode ? 'darkColor' : 'defaultColor',
        position,
        phaseClass,
      )}
      onTransitionEnd={handleTransitionEnd}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="statusNotificationIcon">
        {displayedOnline ? onlineIcon : offlineIcon}
      </div>
      <div>{getStatusText(displayedOnline, statusText ?? {})}</div>
      {!displayedOnline && (
        <div className="statusNotificationRefresh">
          <button
            type="button"
            aria-label="Refresh the page"
            onClick={handleRefreshButtonClick}
          >
            Refresh
          </button>
        </div>
      )}
      <button
        type="button"
        aria-label="Close notification"
        className={classNames(
          'statusNotificationCloseIcon',
          darkMode ? 'darkColor' : 'defaultColor',
        )}
        onClick={handleCloseButtonClick}
      >
        {closeIcon}
      </button>
    </div>
  )
})

export const OnlineStatusNotification = React.memo(
  OnlineStatusNotificationComponent,
)

export default OnlineStatusNotification

const getStatusText = (isOnline: boolean, statusText: StatusText): string =>
  isOnline
    ? (statusText?.online ?? DefaultOnlineText)
    : (statusText?.offline ?? DefaultOfflineText)

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')
