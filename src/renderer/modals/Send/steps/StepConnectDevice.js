// @flow
import React, { useEffect, useState } from "react";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";
import TrackPage from "~/renderer/analytics/TrackPage";
import GenericStepConnectDevice from "./GenericStepConnectDevice";
import type { StepProps } from "../types";

export default function StepConnectDevice({
  account,
  parentAccount,
  transaction,
  status,
  transitionTo,
  onOperationBroadcasted,
  onTransactionError,
  setSigned,
}: StepProps) {
  const [currencyName, setCurrencyName] = useState("");

  useEffect(() => {
    if (account) {
      const currency = getAccountCurrency(account);

      const currencyName = currency
        ? currency.type === "TokenCurrency"
          ? currency.parentCurrency.name
          : currency.name
        : undefined;

      setCurrencyName(currencyName);
    }
  }, [account]);
  return (
    <>
      <TrackPage category="Send Flow" name="Step ConnectDevice" currencyName={currencyName} />
      <GenericStepConnectDevice
        account={account}
        parentAccount={parentAccount}
        transaction={transaction}
        status={status}
        transitionTo={transitionTo}
        onOperationBroadcasted={onOperationBroadcasted}
        onTransactionError={onTransactionError}
        setSigned={setSigned}
      />
    </>
  );
}
