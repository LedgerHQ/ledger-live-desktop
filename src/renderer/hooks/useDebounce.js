// @flow
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

import type { ThrottleOptions, DebounceOptions, Cancelable } from "lodash";

export const useDebouncedCallback = (
  fn: (...args: any[]) => any,
  delay: number,
  options?: DebounceOptions,
): Function & Cancelable => useCallback(debounce(fn, delay, options), [fn, delay, options]);

export const useThrottledCallback = (
  fn: (...args: any[]) => any,
  delay: number,
  options?: ThrottleOptions,
): Function & Cancelable => useCallback(throttle(fn, delay, options), [fn, delay, options]);

export const useDebounced = <T>(value: T, delay: number, options?: DebounceOptions): T => {
  const previousValue = useRef(value);
  const [current, setCurrent] = useState(value);

  const debouncedCallback = useDebouncedCallback((val: *) => setCurrent(val), delay, options);

  useEffect(() => {
    if (value !== previousValue.current) {
      debouncedCallback(value);
      previousValue.current = value;

      return () => {
        debouncedCallback.cancel();
      };
    }
  }, [debouncedCallback, value]);

  return current;
};
