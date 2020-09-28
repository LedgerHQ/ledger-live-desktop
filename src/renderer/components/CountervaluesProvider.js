// @flow
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Countervalues,
  useCountervaluesExport,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { trackingPairsSelector } from "~/renderer/countervalues";
import { setKey, getKey } from "~/renderer/storage";

export default function CountervaluesProvider({ children }: { children: React$Node }) {
  const trackingPairs = useSelector(trackingPairsSelector);
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
