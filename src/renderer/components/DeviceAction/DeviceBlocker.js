// @flow
import { useState, useEffect } from "react";
import { Subject } from "rxjs";

/**
 * <DeviceBlocker> is rendered when a device is blocking on the device
 * and waiting the user to do something.
 * This is to block our UI too so we avoid "race condition" situations where
 * the device waits on something and you are somewhere else in the app
 *
 * useDeviceBlocked will tells if it's currently blocked or not.
 */

let mounted = 0;
const changes: Subject<boolean> = new Subject();

/**
 * tells is the device is  blocked or not
 */
export const useDeviceBlocked = (): boolean => {
  const [blocked, setBlocked] = useState(mounted > 0);

  useEffect(() => {
    const sub = changes.subscribe(setBlocked);
    return () => sub.unsubscribe();
  }, []);

  return blocked;
};

export const DeviceBlocker = () => {
  useEffect(() => {
    if (mounted++ === 0) {
      // becoming blocked
      changes.next(true);
    }

    return () => {
      if (--mounted === 0) {
        // becoming unblocked
        changes.next(false);
      }
    };
  }, []);

  return null;
};
