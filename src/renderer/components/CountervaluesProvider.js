// @flow
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Countervalues,
  useCountervaluesPolling,
  useCountervaluesExport,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { inferTrackingPairForAccounts } from "@ledgerhq/live-common/lib/countervalues/logic";
import { setKey, getKey } from "~/renderer/storage";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";

export default function CountervaluesProvider({ children }: { children: React$Node }) {
  const userSettings = useUserSettings();
  const [savedState, setSavedState] = useState();

  useEffect(() => {
    async function getSavedState() {
      const values = await getKey("app", "countervalues");
      setSavedState(values);
    }
    getSavedState();
  }, []);

  return (
    <Countervalues userSettings={userSettings} savedState={savedState}>
      <CountervaluesManager>{children}</CountervaluesManager>
    </Countervalues>
  );
}

function CountervaluesManager({ children }: { children: React$Node }) {
  useCacheManager();
  usePollingManager();

  return children;
}

function useCacheManager() {
  const rawState = useCountervaluesExport();
  useEffect(() => {
    if (!Object.keys(rawState.status).length) return;
    setKey("app", "countervalues", rawState);
  }, [rawState]);
}

function usePollingManager() {
  const { start, stop } = useCountervaluesPolling();
  useEffect(() => {
    window.addEventListener("blur", stop);
    window.addEventListener("focus", start);
    return () => {
      window.removeEventListener("blur", stop);
      window.removeEventListener("focus", start);
    };
  }, [start, stop]);
}

export function useUserSettings() {
  const accounts = useSelector(accountsSelector);
  const countervalue = useSelector(counterValueCurrencySelector);
  return useMemo(
    () => ({
      trackingPairs: inferTrackingPairForAccounts(accounts, countervalue),
      autofillGaps: true,
    }),
    [accounts, countervalue],
  );
}
