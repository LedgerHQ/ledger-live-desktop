// @flow
import { useContext, useCallback, useEffect, useRef } from "react";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import isEqual from "lodash/isEqual";
import type { OverlayConfig } from "~/renderer/components/ProductTour/ContextualOverlay";
type SetHelpElement = {
  selector: string,
  i18nKey: string,
  callback?: any => any,
  conf: OverlayConfig,
};

export function useSetContextualOverlayQueue(
  condition: boolean,
  ...overlayQueue: Array<SetHelpElement>
) {
  const { send } = useContext(ProductTourContext);
  const cachedOverlayQueue = useRef();
  const cachedCondition = useRef();

  useEffect(() => {
    if (
      (!isEqual(cachedOverlayQueue.current, overlayQueue) && condition) ||
      (condition && cachedCondition.current !== condition)
    ) {
      cachedOverlayQueue.current = overlayQueue;
      // if length gt 1 We are waiting for a specific action from the user, _this_ queue is over
      // if length is 1 We are dealing with auto-steps, any user click will get next step
      send("SET_CONTEXTUAL_OVERLAY_QUEUE", { overlayQueue });
    }
    if (cachedCondition.current !== condition) {
      cachedCondition.current = condition;
    }
  }, [send, overlayQueue, condition]);

  return null;
}

export function useOnSetContextualOverlayQueue(overlayData: SetHelpElement) {
  const { send } = useContext(ProductTourContext);
  const cb = useCallback(
    () => send("SET_CONTEXTUAL_OVERLAY_QUEUE", { overlayQueue: [overlayData] }),
    [send, overlayData],
  );

  return cb;
}

export function useOnClearContextualOverlayQueue() {
  const { send } = useContext(ProductTourContext);
  const cb = useCallback(() => send("SET_CONTEXTUAL_OVERLAY_QUEUE", { overlayQueue: [] }), [send]);

  return cb;
}

export function useOnExitProductTour() {
  const { send } = useContext(ProductTourContext);
  const callback = useCallback(() => {
    send("EXIT");
  }, [send]);

  return callback;
}

export function useActiveFlow() {
  const { state } = useContext(ProductTourContext);
  return state.matches("flow.ongoing") ? state.context.activeFlow || null : null;
}
