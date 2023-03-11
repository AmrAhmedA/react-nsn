import React, { forwardRef, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { closeIcon, offlineIcon, onlineIcon } from './icons';

type OnlineStatusNotifierType = {
  isOnline: boolean;
  duration?: number;
};
export const OnlineStatusNotifier = forwardRef<
  HTMLDivElement,
  OnlineStatusNotifierType
>((props, ref): any => {
  const nodeRef = useRef(null);

  const { duration = 4.5, isOnline } = props;

  const [isOpen, setIsOpen] = React.useState(true);

  const [hovering, setHovering] = React.useState(false);

  const handleCloseButtonClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  React.useImperativeHandle(ref, (): any => ({
    onClose: () => null
  }));

  const handleRefreshButtonClick = () =>
    // eslint-disable-next-line no-restricted-globals
    location.reload();

  useEffect(() => {
    if (!hovering && duration > 0) {
      const timeout = setTimeout(() => {
        setIsOpen(false);
      }, duration * 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [duration, hovering]);

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
        <div
          className={`statusNotifierAnchorOriginBottomLeft`}
          ref={nodeRef}
          onMouseEnter={() => {
            setHovering(true);
          }}
          onMouseLeave={() => {
            setHovering(false);
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
    </>
  );
});

const getStatusText = (isOnline: boolean): string => {
  return isOnline
    ? 'Your internet connection was restored.'
    : 'You are currently offline.';
};
