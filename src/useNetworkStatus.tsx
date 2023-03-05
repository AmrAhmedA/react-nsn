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
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    isNavigatorObjectAvailable &&
    isWindowDocumentAvailable &&
    typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true
  );

  const { isFirstRender } = useFirstRender(isOnline);

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

  const StatusNotifierComponent = () => {
    if (isFirstRender && isOnline) return null;
    return <OnlineStatusNotifier isOnline={isOnline} />;
  };

  return {
    error: null,
    isOffline: !isOnline,
    isOnline,
    StatusNotifierComponent
  };
}

const useFirstRender = (isOnline: boolean): { isFirstRender: boolean } => {
  let firstUpdate = useRef(true);

  useEffect(() => {
    if (!isOnline) {
      firstUpdate.current = false;
    }
  }, [isOnline]);

  return { isFirstRender: firstUpdate.current };
};
