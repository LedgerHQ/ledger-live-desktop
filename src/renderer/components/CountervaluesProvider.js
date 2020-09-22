// @flow
import React from "react";
import { useSelector } from "react-redux";
import { Countervalues } from "@ledgerhq/live-common/lib/countervalues/react";
import { trackingPairsSelector } from "~/renderer/countervalues";

export default function CountervaluesProvider({ children }: { children: React$Node }) {
  // TODO retrieve initialCountervalues from storage
  const trackingPairs = useSelector(trackingPairsSelector);
  return (
    <Countervalues
      initialCountervalues={undefined}
      userSettings={{ trackingPairs, autofillGaps: true }}
    >
      {children}
    </Countervalues>
  );
}
