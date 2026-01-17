/**
 * Offline Detection Provider
 * 
 * Monitors network status and shows toast notifications.
 */

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { WifiOff, Wifi } from 'lucide-react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success(
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4" />
          <span>Back online</span>
        </div>,
        { duration: 3000 }
      );
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error(
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>You're offline - some features may not work</span>
        </div>,
        { duration: 5000 }
      );
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
