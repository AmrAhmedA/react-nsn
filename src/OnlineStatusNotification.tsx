import React, { forwardRef, useEffect } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import './App.css'
import { useFirstRender } from './hooks'
import { closeIcon, offlineIcon, onlineIcon } from './icons'

type StatusText = {
  online?: string
  offline?: string
}

type Position =
  | 'topLeft'
  | 'topRight'
  | 'topCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'bottomCenter'

type EventsCallback = {
  onRefreshClick: () => void
  onCloseClick: () => void
}

interface OnlineStatusNotification {
  darkMode?: boolean
  destoryOnClose?: boolean
  duration?: number
  eventsCallback?: EventsCallback
  isOnline: boolean
  position?: Position
  statusText?: StatusText
}

const DefaultOnlineText = 'Your internet connection was restored.'
const DefaultOfflineText = 'You are currently offline.'

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
 * @param destoryOnClose remove notification from dom when it hides
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
  OnlineStatusNotification
>((props, ref): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false)

  const {
    darkMode = false,
    destoryOnClose = true,
    duration = 4500,
    eventsCallback,
    isOnline,
    position = 'bottomLeft',
    statusText
  } = props

  const [hovering, setHovering] = React.useState(false)

  const onlineRef = React.useRef<HTMLDivElement>(null)

  const offlineRef = React.useRef<HTMLDivElement>(null)

  const timeoutRef = React.useRef(null)

  const { isFirstRender } = useFirstRender()

  const nodeRef = isOnline ? onlineRef : offlineRef

  const toggleVisibility = (flag: boolean) => setIsOpen(flag)

  React.useImperativeHandle(ref, (): any => ({
    openStatus: () => toggleVisibility(true)
  }))

  useEffect(() => {
    if (!isFirstRender) return toggleVisibility(true)
  }, [isOnline, isFirstRender])

  useEffect(() => {
    const cleanupFn = () =>
      timeoutRef.current && clearTimeout(timeoutRef.current)

    if (!hovering && duration > 0 && isOpen) {
      timeoutRef.current = setTimeout(() => {
        toggleVisibility(false)
      }, duration)

      return cleanupFn
    }
    // eslint-disable-next-line no-restricted-globals
  }, [duration, hovering, isOpen, isOnline])

  const handleRefreshButtonClick = () => {
    // eslint-disable-next-line no-restricted-globals
    eventsCallback.onRefreshClick
      ? eventsCallback.onRefreshClick()
      : location.reload()
  }

  const handleCloseButtonClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault()
    e.stopPropagation()
    eventsCallback?.onCloseClick && eventsCallback.onCloseClick()
    toggleVisibility(false)
  }

  if (isFirstRender && isOnline) return null

  return (
    <CSSTransition
      in={isOpen}
      timeout={260}
      nodeRef={nodeRef}
      appear={true}
      classNames={'fade'}
      unmountOnExit={destoryOnClose}
    >
      <SwitchTransition mode={'out-in'}>
        <CSSTransition
          key={isOnline ? 'Online' : 'Offline'}
          nodeRef={nodeRef}
          addEndListener={(done: () => void) => {
            nodeRef.current?.addEventListener('transitionend', done, false)
          }}
          classNames='fade'
        >
          <div
            className={classNames(
              'statusNotification',
              darkMode ? 'darkColor' : 'defaultColor',
              position
            )}
            ref={nodeRef}
            onMouseEnter={() => {
              setHovering(true)
            }}
            onMouseLeave={() => {
              setHovering(false)
            }}
          >
            <div className='statusNotificationIcon'>
              {isOnline ? onlineIcon : offlineIcon}
            </div>
            <div>{getStatusText(isOnline, statusText)}</div>
            {/* refresh link */}
            {!isOnline && (
              <div className='statusNotificationRefresh'>
                <span onClick={handleRefreshButtonClick}>Refresh</span>
              </div>
            )}
            {/* close icon */}
            <div
              className={classNames(
                'statusNotificationCloseIcon',
                darkMode ? 'darkColor' : 'defaultColor'
              )}
              onClick={handleCloseButtonClick}
            >
              {closeIcon}
            </div>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </CSSTransition>
  )
})

export const OnlineStatusNotification = React.memo(
  OnlineStatusNotificationComponent
)

const getStatusText = (isOnline: boolean, statusText: StatusText): string =>
  isOnline
    ? statusText?.online ?? DefaultOnlineText
    : statusText?.offline ?? DefaultOfflineText

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')
