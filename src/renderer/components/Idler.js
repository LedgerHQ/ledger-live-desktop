// @flow
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { autoLockTimeoutSelector } from "~/renderer/reducers/settings";
import { lock } from "~/renderer/actions/application";
import { hasPasswordSelector } from "~/renderer/reducers/application";

import debounce from "lodash/debounce";

// FIXME drop: the impl is not correct! fn always changes so debounce is regenerated each callback
const useDebouncedCallback = (fn, delay, options) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(debounce(fn, delay, options), [fn, delay, options]);

const Idler = () => {
  const [lastAction, setLastAction] = useState(-1);
  const autoLockTimeout = useSelector(autoLockTimeoutSelector);
  const hasPassword = useSelector(hasPasswordSelector);
  const dispatch = useDispatch();

  const debounceOnChange = useDebouncedCallback(() => setLastAction(Date.now()), 1000, {
    maxWait: 1000,
    leading: true,
  });

  // onMount & willUnmount
  useEffect(() => {
    window.addEventListener("keydown", debounceOnChange);
    window.addEventListener("mouseover", debounceOnChange);

    return () => {
      window.removeEventListener("keydown", debounceOnChange);
      window.removeEventListener("mouseover", debounceOnChange);
      debounceOnChange.cancel();
    };
  }, [debounceOnChange]);

  useEffect(() => {
    let timeout = null;

    if (hasPassword && autoLockTimeout && autoLockTimeout !== -1) {
      timeout = setTimeout(() => {
        dispatch(lock());
      }, autoLockTimeout * 60000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [lastAction, autoLockTimeout, hasPassword, dispatch]);

  return null;
};

export default Idler;
