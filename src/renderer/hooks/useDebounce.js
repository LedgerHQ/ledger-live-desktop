// @flow
import { useCallback, useEffect, useState } from "react";
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

// https://usehooks.com/useDebounce
export function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
