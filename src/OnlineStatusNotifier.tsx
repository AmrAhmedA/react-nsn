import React, { forwardRef, useEffect } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { closeIcon, offlineIcon, onlineIcon } from './icons'
import { useOnlineStatus } from './useOnlineStatus'

type OnlineStatusNotifierType = {
  duration?: number
}
export const OnlineStatusNotifier = forwardRef<
  HTMLDivElement,
  OnlineStatusNotifierType
>((props, ref): any => {
  const { isOnline, isOpen, toggleVisibility, isFirstRender } =
    useOnlineStatus()

  const { duration = 4.5 } = props

  const [hovering, setHovering] = React.useState(false)

  const onlineRef = React.useRef(null)

  const offlineRef = React.useRef(null)

  const timeoutRef: any = React.useRef(null)

  const nodeRef: any = isOnline ? onlineRef : offlineRef

  const handleCloseButtonClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault()
    e.stopPropagation()
    toggleVisibility(false)
  }

  React.useImperativeHandle(ref, (): any => ({
    onlineChange: () => clearTimeout(timeoutRef.current)
  }))

  useEffect(() => {
    const cleanupFn = () => clearTimeout(timeoutRef.current)
    // clear timeout between transitions
    if (timeoutRef.current) cleanupFn

    if (!hovering && duration > 0 && isOpen) {
      timeoutRef.current = setTimeout(() => {
        toggleVisibility(false)
      }, duration * 1000)

      return cleanupFn
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, hovering, isOpen, isOnline])

  const handleRefreshButtonClick = () =>
    // eslint-disable-next-line no-restricted-globals
    location.reload()

  if (isFirstRender && isOnline) return null

  return (
    <>
      <CSSTransition
        in={isOpen}
        timeout={260}
        nodeRef={nodeRef}
        appear={true}
        classNames={'fade'}
        unmountOnExit
      >
        <SwitchTransition mode={'out-in'}>
          <CSSTransition
            key={isOnline as any}
            nodeRef={nodeRef}
            addEndListener={(done: any) => {
              nodeRef.current.addEventListener('transitionend', done, false)
            }}
            classNames='fade'
          >
            <div
              className={`statusNotifierAnchorOriginBottomLeft`}
              ref={nodeRef}
              onMouseEnter={() => {
                setHovering(true)
              }}
              onMouseLeave={() => {
                setHovering(false)
              }}
            >
              <div>{isOnline ? onlineIcon : offlineIcon}</div>
              <div>{getStatusText(isOnline)}</div>
              {!isOnline && (
                <div>
                  <span onClick={handleRefreshButtonClick}>Refresh</span>
                </div>
              )}
              {/* close icon */}
              <div onClick={handleCloseButtonClick}>{closeIcon}</div>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </CSSTransition>
    </>
  )
})

const getStatusText = (isOnline: boolean): string => {
  return isOnline
    ? 'Your internet connection was restored.'
    : 'You are currently offline.'
}
