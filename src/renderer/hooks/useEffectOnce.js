// @flow
import { useEffect, useRef } from "react";

export default function useEffectOnce(callback: (...args: any[]) => void) {
  const count = useRef(0);

  useEffect(() => {
    if (count.current !== 0) {
      return;
    }
    count.current = count.current + 1;
    callback();
  }, [callback]);
}
