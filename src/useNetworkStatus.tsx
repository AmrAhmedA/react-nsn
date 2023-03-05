import { useEffect, useState, useRef } from 'react';
import { OnlineStatusNotifier } from './OnlineStatusNotifier';

const isWindowDocumentAvailable = typeof window !== 'undefined';

const isNavigatorObjectAvailable = typeof navigator !== 'undefined';

// TODO:: Add polling
export function useOnlineStatus(): {
  error: unknown;
  isOffline: boolean;
  isOnline: boolean;
  StatusNotifierComponent: () => JSX.Element | null;
} {
  let firstUpdate = useRef(true);

  const [isOnline, setIsOnline] = useState<boolean>(() =>
    isNavigatorObjectAvailable &&
    isWindowDocumentAvailable &&
    typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true
  );

  // Reactive logic for detecting browser side online/offline
  useEffect(() => {
    function setOnline() {
      setIsOnline(true);
    }

    function setOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      firstUpdate.current = false;
    }
  }, [isOnline]);

  const StatusNotifierComponent = () => {
    if (firstUpdate.current && isOnline) return null;
    return <OnlineStatusNotifier isOnline={isOnline} />;
  };

  return {
    error: null,
    isOffline: !isOnline,
    isOnline,
    StatusNotifierComponent
  };
}
