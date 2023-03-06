import React, { useEffect, useState } from 'react';
import { cancelIcon, offlineIcon, onlineIcon } from './icons';

type OnlineStatusNotifierType = {
  isOnline: boolean;
  duration?: number;
};
export function OnlineStatusNotifier({
  isOnline,
  duration = 4.5
}: OnlineStatusNotifierType) {
  const [hovering, setHovering] = React.useState(false);

  const [isOpen, setIsOpen] = useState(true);

  const handleCloseButtonClick = () => {};

  const handleRefreshButtonClick = () =>
    // eslint-disable-next-line no-restricted-globals
    location.reload();

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!hovering && duration > 0) {
      const timeout = setTimeout(() => {
        onClose();
      }, duration * 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [duration, hovering]);

  if (!isOpen) return null;

  return (
    <div
      className="statusNotifierAnchorOriginBottomLeft"
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
      <div onClick={handleCloseButtonClick}>{cancelIcon}</div>
    </div>
  );
}

const getStatusText = (isOnline: boolean): string => {
  return isOnline
    ? 'Your internet connection was restored.'
    : 'You are currently offline.';
};
