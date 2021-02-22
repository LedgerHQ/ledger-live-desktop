// @flow
import { useMemo, useContext, useCallback, useEffect, useRef } from "react";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import isEqual from "lodash/isEqual";
import type { OverlayConfig } from "~/renderer/components/ProductTour/Overlay";
type SetHelpElement = {
  selector: string,
  i18nKey?: string,
  callback?: any => any,
  config: OverlayConfig,
};

export function useSetOverlays(condition: boolean, ...overlays: Array<SetHelpElement>) {
  const { send } = useContext(ProductTourContext);
  const cachedOverlays = useRef();
  const cachedCondition = useRef();

  useEffect(() => {
    if (
      (!isEqual(cachedOverlays.current, overlays) && condition) ||
      (condition && cachedCondition.current !== condition)
    ) {
      cachedOverlays.current = overlays;
      send("SET_OVERLAYS", { overlays });
    }
    if (cachedCondition.current !== condition) {
      cachedCondition.current = condition;
    }
  }, [send, overlays, condition]);

  return null;
}

export function useOnSetOverlays(...overlays: Array<SetHelpElement>) {
  const { state, send } = useContext(ProductTourContext);

  const cb = useCallback(() => {
    if (!isEqual(state.context.overlays, overlays)) {
      send("SET_OVERLAYS", { overlays });
    }
  }, [overlays, send, state.context.overlays]);

  return cb;
}

export function useOnClearOverlays() {
  const { send } = useContext(ProductTourContext);
  const cb = useCallback(() => send("CLEAR_OVERLAYS"), [send]);

  return cb;
}

export function useOnExitProductTour() {
  const { send } = useContext(ProductTourContext);
  const callback = useCallback(() => {
    send("EXIT");
  }, [send]);

  return callback;
}

export function useOnNextOverlay() {
  const { send } = useContext(ProductTourContext);
  const callback = useCallback(() => {
    send("NEXT_OVERLAY");
  }, [send]);

  return callback;
}

export function useActiveFlow() {
  const { state } = useContext(ProductTourContext);
  if (state.matches("dashboard")) return "dashboard"; // Nb perhaps not treat the dashboard as a step
  if (state.matches("flow.landing")) return "landing"; // Nb same;

  return state.matches("flow.ongoing") || state.matches("flow.completed")
    ? state.context.activeFlow
    : null;
}

export function useHasOverlay() {
  const { state } = useContext(ProductTourContext);
  const hasContextOverlay = useMemo(() => {
    if (state && state.context && state.context.overlays && state.context.overlays?.length) {
      return true;
    }
    return false;
  }, [state]);

  return hasContextOverlay;
}
