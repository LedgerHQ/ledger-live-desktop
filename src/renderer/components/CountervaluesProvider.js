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
