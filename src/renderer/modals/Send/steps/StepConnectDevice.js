// @flow
import React from "react";
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
  isNFTSend,
  onConfirmationHandler,
  onFailHandler,
  currencyName,
}: StepProps) {
  return (
    <>
      <TrackPage
        category="Send Flow"
        name="Step ConnectDevice"
        currencyName={currencyName}
        isNFTSend={isNFTSend}
      />
      <GenericStepConnectDevice
        account={account}
        parentAccount={parentAccount}
        transaction={transaction}
        status={status}
        transitionTo={transitionTo}
        onOperationBroadcasted={onOperationBroadcasted}
        onTransactionError={onTransactionError}
        setSigned={setSigned}
        onConfirmationHandler={onConfirmationHandler}
        onFailHandler={onFailHandler}
      />
    </>
  );
}
