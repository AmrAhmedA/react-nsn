import React, { forwardRef, useEffect } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useFirstRender, useOnlineStatus } from './hooks'
import { closeIcon, offlineIcon, onlineIcon } from './icons'

type OnlineStatusNotifierType = {
  duration?: number
}
export const OnlineStatusNotifier = forwardRef<
  HTMLDivElement,
  OnlineStatusNotifierType
>((props, ref): any => {
  const [isOpen, setIsOpen] = React.useState(false)

  const { duration = 4.5 } = props

  const [hovering, setHovering] = React.useState(false)

  const onlineRef = React.useRef<HTMLDivElement>(null)

  const offlineRef = React.useRef<HTMLDivElement>(null)

  const timeoutRef: any = React.useRef(null)

  const toggleVisibility = (flag: boolean) => setIsOpen(flag)

  const { isOnline } = useOnlineStatus({ toggleVisibility })

  const { isFirstRender } = useFirstRender()

  const nodeRef = isOnline ? onlineRef : offlineRef

  const handleCloseButtonClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault()
    e.stopPropagation()
    toggleVisibility(false)
  }

  React.useImperativeHandle(ref, (): any => ({
    openStatus: () => toggleVisibility(true)
  }))

  useEffect(() => {
    const cleanupFn = () =>
      timeoutRef.current && clearTimeout(timeoutRef.current)
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
            addEndListener={(done: () => void) => {
              nodeRef.current?.addEventListener('transitionend', done, false)
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
