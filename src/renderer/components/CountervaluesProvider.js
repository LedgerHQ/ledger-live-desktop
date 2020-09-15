// @flow
import React from "react";
import { Countervalues } from "@ledgerhq/live-common/lib/countervalues/react";

export default function CountervaluesProvider({ children }: { children: React$Node }) {
  // TODO retrieve initialCountervalues from storage
  return <Countervalues initialCountervalues={undefined}>{children}</Countervalues>;
}
