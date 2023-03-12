import { useEffect, useRef, useState } from 'react';

const isWindowDocumentAvailable = typeof window !== 'undefined';

const isNavigatorObjectAvailable = typeof navigator !== 'undefined';

// TODO:: Add polling
export function useOnlineStatus(): {
  error: unknown;
  isOffline: boolean;
  isOnline: boolean;
  isOpen: boolean;
  isFirstRender: any;
  toggleVisibility: (flag: boolean) => void;
} {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    isNavigatorObjectAvailable &&
    isWindowDocumentAvailable &&
    typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true
  );

  const [isOpen, setIsOpen] = useState(false);

  const { isFirstRender } = useFirstRender(isOnline);

  const toggleVisibility = (flag: boolean) => setIsOpen(flag);

  // Reactive logic for detecting browser side online/offline
  useEffect(() => {
    function setOnline() {
      setIsOnline(true);
      setIsOpen(true);
    }

    function setOffline() {
      setIsOnline(false);
      setIsOpen(true);
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
    isOnline,
    isOpen,
    isFirstRender,
    toggleVisibility
  };
}

const useFirstRender = (isOnline: boolean): { isFirstRender: boolean } => {
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    }
  }, [isOnline]);

  return { isFirstRender: firstUpdate.current };
};
