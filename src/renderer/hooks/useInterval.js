// @flow
// Thanks Dan Abramov
import { useRef, useEffect } from "react";
import noop from "lodash/noop";

const useInterval = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function>(noop);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
