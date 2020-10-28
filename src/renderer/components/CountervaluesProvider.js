// @flow
import React, { useState, useEffect } from "react";
import {
  Countervalues,
  useCountervaluesPolling,
  useCountervaluesExport,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { isEnvDefault, getEnvDefault } from "@ledgerhq/live-common/lib/env";
import { setKey, getKey } from "~/renderer/storage";
import { setEnvOnAllThreads } from "~/helpers/env";
import { useUserSettings, useTrackingPairIds } from "../actions/general";

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
  useLegacyFlagHandler();

  return children;
}

function useLegacyFlagHandler() {
  useEffect(() => {
    const key = "LEDGER_COUNTERVALUES_API";
    if (isEnvDefault(key)) return;
    const val = getEnvDefault(key);
    setEnvOnAllThreads(key, val);
  }, []);
}

function useCacheManager() {
  const { status, ...state } = useCountervaluesExport();
  const trackingPairs = useTrackingPairIds();
  useEffect(() => {
    if (!Object.keys(status).length) return;
    const newState = Object.entries(state).reduce(
      (prev, [key, val]) => (trackingPairs.includes(key) ? { ...prev, [key]: val } : prev),
      {},
    );
    setKey("app", "countervalues", { ...newState, state });
  }, [state, trackingPairs, status]);
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
