// @flow
import { useEffect, useState } from "react";

// Expand the useDebounce to take a condition, basically to allow me to let connections through but debounce
// disconnections on devices.
export function useConditionalDebounce<T>(value: T, delay: number, condition: e => boolean): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const shouldDelay = condition(value);

      // Update debounced value after delay
      const handler = setTimeout(
        () => {
          setDebouncedValue(value);
        },
        shouldDelay ? delay : 0,
      );

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay, condition], // Only re-call effect if value, condition or delay changes
  );

  return debouncedValue;
}
