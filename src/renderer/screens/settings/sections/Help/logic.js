// @flow
import { useReducer, useCallback } from "react";

export function useActionModal() {
  const [state, dispatch] = useReducer<ActionModalState, Action>(
    actionModalReducer,
    actionModalInitState,
  );

  const open = useCallback(() => {
    dispatch({ type: "open" });
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch({ type: "close" });
  }, [dispatch]);

  const closeFallback = useCallback(() => {
    dispatch({ type: "closeFallback" });
  }, [dispatch]);

  const handleConfirm = useCallback(() => {
    dispatch({ type: "confirm" });
  }, [dispatch]);

  const handleError = useCallback(() => {
    dispatch({ type: "error" });
  }, [dispatch]);

  return [state, { dispatch, open, close, closeFallback, handleConfirm, handleError }];
}

type ActionModalState = {
  opened: boolean,
  fallbackOpened: boolean,
  pending: boolean,
};

type Action =
  | { type: "open" }
  | { type: "close" }
  | { type: "closeFallback" }
  | { type: "confirm" }
  | { type: "error" };

const actionModalInitState: ActionModalState = {
  opened: false,
  fallbackOpened: false,
  pending: false,
};

function actionModalReducer(state: ActionModalState, action: Action): ActionModalState {
  switch (action.type) {
    case "open":
      return { ...state, opened: true };
    case "close":
      return { ...state, opened: false };
    case "closeFallback":
      return { ...state, fallbackOpened: false };
    case "confirm":
      return { ...state, pending: true };
    case "error":
      return { ...state, pending: false, fallbackOpened: true };
    default:
      return state;
  }
}
