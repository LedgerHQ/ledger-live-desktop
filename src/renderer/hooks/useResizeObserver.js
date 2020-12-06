// @flow
import { useLayoutEffect, useState, useCallback, type ElementRef } from "react";

export interface ResizeObserverEntry {
  target: HTMLElement;
  contentRect: DOMRectReadOnly;
}

const useResizeObserver = (ref: ElementRef<any>, callback?: (entry: DOMRectReadOnly) => *) => {
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (!Array.isArray(entries)) {
        return;
      }

      const entry = entries[0];
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);

      if (callback) {
        callback(entry.contentRect);
      }
    },
    [callback],
  );

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    let resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      handleResize(entries);
    });
    resizeObserver.observe(ref.current);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      resizeObserver = null;
    };
  }, [handleResize, ref]);

  return [width, height];
};

export default useResizeObserver;
