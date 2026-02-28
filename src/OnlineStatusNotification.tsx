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

export interface OnlineStatusNotificationRef {
  openStatus: () => void
  dismiss: () => void
}

export interface OnlineStatusNotificationProps {
  className?: string
  darkMode?: boolean
  destroyOnClose?: boolean
  /** @deprecated Use `destroyOnClose` instead */
  destoryOnClose?: boolean
  duration?: number
  eventsCallback?: EventsCallback
  isOnline: boolean
  position?: Position
  statusText?: StatusText
  style?: React.CSSProperties
}

type Phase = 'hidden' | 'entering' | 'visible' | 'exiting'

const DefaultOnlineText = 'Your internet connection was restored.'
const DefaultOfflineText = 'You are currently offline.'
const TRANSITION_FALLBACK_MS = 400
const SWIPE_THRESHOLD = 80

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
 * @param className additional CSS class name(s) to apply to the notification container
 * @param darkMode toggle dark mode on
 * @param destroyOnClose remove notification from dom when it hides
 * @param destoryOnClose @deprecated use `destroyOnClose` instead
 * @param duration duration of the notification in ms
 * @param eventsCallback object that contains callbacks for refresh and close button clicks
 * @param isOnline status of the app when online
 * @param position customize notification component position
 * @param statusText customize online/offline status objects
 * @param style inline styles to apply to the notification container
 * @returns JSX Element
 *
 */
const OnlineStatusNotificationComponent = forwardRef<
  OnlineStatusNotificationRef,
  OnlineStatusNotificationProps
>((props, ref) => {
  const {
    className: userClassName,
    darkMode = false,
    destroyOnClose,
    destoryOnClose,
    duration = 4500,
    eventsCallback,
    isOnline,
    position = 'bottomLeft',
    statusText,
    style,
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

  // Swipe-to-dismiss tracking (ref-based to avoid re-renders during touchmove)
  const nodeRef = useRef<HTMLDivElement>(null)
  const touchActiveRef = useRef(false)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const swipeOffsetRef = useRef(0)
  const baseTransformRef = useRef('')

  const isVisible = phase === 'visible'

  const enterNotification = useCallback((online: boolean) => {
    setDisplayedOnline(online)
    pendingOnlineRef.current = null
    setPhase('entering')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('visible'))
    })
  }, [])

  React.useImperativeHandle(ref, () => ({
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
    } else if (typeof window !== 'undefined') {
      window.location.reload()
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchActiveRef.current = true
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
    swipeOffsetRef.current = 0
    const el = nodeRef.current
    if (el) {
      baseTransformRef.current = window.getComputedStyle(el).transform
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartXRef.current
    const dy = e.touches[0].clientY - touchStartYRef.current
    // Only track horizontal swipes (ignore vertical scrolling)
    if (Math.abs(dx) > Math.abs(dy)) {
      swipeOffsetRef.current = dx
      const el = nodeRef.current
      if (el) {
        const base =
          baseTransformRef.current !== 'none'
            ? `${baseTransformRef.current} `
            : ''
        el.style.transform = `${base}translateX(${dx}px)`
        el.style.opacity = `${Math.max(0, 1 - Math.abs(dx) / (SWIPE_THRESHOLD * 2))}`
        el.style.transition = 'none'
      }
    }
  }

  const handleTouchEnd = () => {
    touchActiveRef.current = false
    const offset = swipeOffsetRef.current
    const el = nodeRef.current
    swipeOffsetRef.current = 0

    if (Math.abs(offset) >= SWIPE_THRESHOLD) {
      // Animate off-screen in swipe direction, then dismiss
      if (el) {
        const base =
          baseTransformRef.current !== 'none'
            ? `${baseTransformRef.current} `
            : ''
        const direction = offset > 0 ? '100vw' : '-100vw'
        el.style.transition = 'transform 200ms ease-out, opacity 200ms ease-out'
        el.style.transform = `${base}translateX(${direction})`
        el.style.opacity = '0'
      }
      setTimeout(() => {
        if (el) {
          el.style.transform = ''
          el.style.opacity = ''
          el.style.transition = ''
        }
        if (pendingOnlineRef.current !== null) {
          enterNotification(pendingOnlineRef.current)
        } else {
          setPhase('hidden')
        }
      }, 200)
    } else if (el) {
      // Snap back smoothly
      el.style.transition = 'transform 150ms ease, opacity 150ms ease'
      requestAnimationFrame(() => {
        if (el) {
          el.style.transform = ''
          el.style.opacity = ''
        }
        setTimeout(() => {
          if (el) el.style.transition = ''
        }, 150)
      })
    }
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
      ref={nodeRef}
      role="status"
      aria-live="polite"
      className={classNames(
        'statusNotification',
        darkMode ? 'darkColor' : 'defaultColor',
        position,
        phaseClass,
        userClassName ?? '',
      )}
      style={style}
      onTransitionEnd={handleTransitionEnd}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => {
        if (!touchActiveRef.current) setHovering(false)
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
