import React, { forwardRef, useEffect } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useFirstRender, useOnlineStatus } from './hooks'
import { closeIcon, offlineIcon, onlineIcon } from './icons'

type StatusText = {
  online?: string
  offline?: string
}

type Position = 'bottomLeft' | 'bottomRight' | 'centered'

type EventsCallback = {
  onRefreshClick: () => void
  onCloseClick: () => void
}

interface OnlineStatusNotifierType {
  destoryOnClose?: boolean
  duration?: number
  eventsCallback?: EventsCallback
  position?: Position
  statusText?: StatusText
}

const DefaultOnlineText = 'Your internet connection was restored.'
const DefaultOfflineText = 'You are currently offline.'

export const OnlineStatusNotifier = forwardRef<
  HTMLDivElement,
  OnlineStatusNotifierType
>((props, ref): any => {
  const [isOpen, setIsOpen] = React.useState(false)

  const {
    destoryOnClose = true,
    duration = 4.5,
    eventsCallback,
    position = 'bottomLeft',
    statusText
  } = props

  const [hovering, setHovering] = React.useState(false)

  const onlineRef = React.useRef<HTMLDivElement>(null)

  const offlineRef = React.useRef<HTMLDivElement>(null)

  const timeoutRef = React.useRef(null)

  const { isOnline } = useOnlineStatus()

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
      }, duration * 1000)

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
    eventsCallback.onCloseClick && eventsCallback.onCloseClick()
    toggleVisibility(false)
  }

  if (isFirstRender && isOnline) return null

  return (
    <>
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
              className={getNotificationCls(position)}
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
                className='statusNotificationCloseIcon'
                onClick={handleCloseButtonClick}
              >
                {closeIcon}
              </div>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </CSSTransition>
    </>
  )
})

const getStatusText = (isOnline: boolean, statusText: StatusText): string =>
  isOnline
    ? statusText?.online ?? DefaultOnlineText
    : statusText?.offline ?? DefaultOfflineText

const getNotificationCls = (position: Position): string => {
  const defaultCls = `statusNotification`
  switch (position) {
    case 'bottomLeft':
      return `${defaultCls} AnchorOriginBottomLeft`
    case 'bottomRight':
      return `${defaultCls} AnchorOriginBottomRight`
    case 'centered':
      return `${defaultCls}`
    default:
      return `${defaultCls} AnchorOriginBottomLeft`
  }
}
