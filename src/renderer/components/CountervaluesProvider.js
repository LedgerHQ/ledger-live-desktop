// @flow
import React from "react";
import { useSelector } from "react-redux";
import { Countervalues } from "@ledgerhq/live-common/lib/countervalues/react";
import { trackingPairsSelector } from "~/renderer/countervalues";

export default function CountervaluesProvider({ children }: { children: React$Node }) {
  // TODO retrieve initialCountervalues from storage
  const pairs = useSelector(trackingPairsSelector);
  const reversePairs = pairs.map(p => ({ from: p.to, to: p.from }));
  return (
    <Countervalues
      initialCountervalues={undefined}
      userSettings={{ trackingPairs: [...pairs, ...reversePairs], autofillGaps: true }}
    >
      {children}
    </Countervalues>
  );
}
