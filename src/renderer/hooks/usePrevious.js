import { useRef, useEffect } from "react";
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useLastNonNull(value) {
  const ref = useRef(value);
  useEffect(() => {
    if (value !== null && value !== undefined) ref.current = value;
  }, [value]);
  return ref.current;
}
