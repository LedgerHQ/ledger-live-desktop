// @flow
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Countervalues,
  useCountervaluesExport,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { inferTrackingPairForAccounts } from "@ledgerhq/live-common/lib/countervalues/logic";
import { setKey, getKey } from "~/renderer/storage";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";

export default function CountervaluesProvider({ children }: { children: React$Node }) {
  const trackingPairs = useTrackingPairs();
  const [initialCountervalues, setInitialCuntervalues] = useState();

  useEffect(() => {
    async function getInitialCountervalues() {
      const values = await getKey("app", "countervalues");
      setInitialCuntervalues(values);
    }
    getInitialCountervalues();
  }, []);

  return (
    <Countervalues
      initialCountervalues={initialCountervalues}
      userSettings={{ trackingPairs, autofillGaps: true }}
    >
      <CountervaluesPersist>{children}</CountervaluesPersist>
    </Countervalues>
  );
}

function CountervaluesPersist({ children }: { children: React$Node }) {
  const rawState = useCountervaluesExport();

  useEffect(() => {
    setKey("app", "countervalues", rawState);
  }, [rawState]);

  return children;
}

export function useTrackingPairs() {
  const accounts = useSelector(accountsSelector);
  const countervalue = useSelector(counterValueCurrencySelector);
  return useMemo(() => inferTrackingPairForAccounts(accounts, countervalue), [
    accounts,
    countervalue,
  ]);
}

// TODO countervalue
// const addExtraPollingHooks = (schedulePoll, cancelPoll) => {
//   // TODO hook to net info of Electron ? retrieving network should trigger a poll

//   // provide a basic mecanism to stop polling when you leave the tab
//   // & immediately poll when you come back.
//   function onWindowBlur() {
//     cancelPoll();
//   }
//   function onWindowFocus() {
//     schedulePoll(1000);
//   }
//   window.addEventListener("blur", onWindowBlur);
//   window.addEventListener("focus", onWindowFocus);

//   return () => {
//     window.removeEventListener("blur", onWindowBlur);
//     window.removeEventListener("focus", onWindowFocus);
//   };
// };
