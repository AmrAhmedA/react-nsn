import React, { forwardRef, useEffect } from 'react';
import { closeIcon, offlineIcon, onlineIcon } from './icons';

type OnlineStatusNotifierType = {
  isOnline: boolean;
  duration?: number;
};
export const OnlineStatusNotifier = forwardRef<
  HTMLDivElement,
  OnlineStatusNotifierType
>((props, ref): any => {
  const { duration = 4.5, isOnline } = props;

  const [isOpen, setIsOpen] = React.useState(true);

  const [hovering, setHovering] = React.useState(false);

  const handleCloseButtonClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
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

  const shouldRender = useDelayUnmount(isOpen, 280);

  const fadeClass = isOpen ? 'fadeIn' : 'fadeOut';

  if (!shouldRender) return null;

  return (
    <div
      className={`statusNotifierAnchorOriginBottomLeft ${fadeClass}`}
      ref={ref}
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
  );
});

const getStatusText = (isOnline: boolean): string => {
  return isOnline
    ? 'Your internet connection was restored.'
    : 'You are currently offline.';
};

function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    let timeoutId: any;
    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime);
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);

  return shouldRender;
}
