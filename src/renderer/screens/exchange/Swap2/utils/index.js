import { useCallback } from "react";
import { useHistory } from "react-router-dom";

export const useRedirectToSwapForm = () => {
  const history = useHistory();

  return useCallback(
    _ => {
      history.push("/swap");
    },
    [history],
  );
};
