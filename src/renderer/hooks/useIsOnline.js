import { useCallback, useEffect, useState } from "react";

export default function useIsOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  const handleOnlineStatusChanged = useCallback(() => {
    navigator.onLine ? !online && setOnline(true) : online && setOnline(false);
  }, [online, setOnline]);

  useEffect(() => {
    window.addEventListener("online", handleOnlineStatusChanged);
    window.addEventListener("offline", handleOnlineStatusChanged);
    return () => {
      window.removeEventListener("online", handleOnlineStatusChanged);
      window.removeEventListener("offline", handleOnlineStatusChanged);
    };
  }, [handleOnlineStatusChanged]);
  return online;
}
