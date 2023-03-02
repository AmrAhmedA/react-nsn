import { useEffect, useState } from 'react';

const isWindowDocumentAvailable = typeof window !== 'undefined';

const isNavigatorObjectAvailable = typeof navigator !== 'undefined';

// TODO:: Add polling
export function useOnlineStatus() {
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

  return {
    error: null,
    isOffline: !isOnline,
    isOnline
  };
}
