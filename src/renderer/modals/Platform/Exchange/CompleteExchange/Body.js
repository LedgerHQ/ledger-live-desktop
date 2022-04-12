// @flow
import React, { useEffect, useState } from "react";

import { toExchangeRaw } from "@ledgerhq/live-common/lib/exchange/platform/serialization";
import type { Exchange } from "@ledgerhq/live-common/lib/exchange/platform/types";

import { toTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
import type { Transaction, Operation } from "@ledgerhq/live-common/lib/types";

import { createAction } from "@ledgerhq/live-common/lib/hw/actions/completeExchange";
import { createAction as txCreateAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";

import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import DeviceAction from "~/renderer/components/DeviceAction";
import { command } from "~/renderer/commands";
import BigSpinner from "~/renderer/components/BigSpinner";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import { useBroadcast } from "~/renderer/hooks/useBroadcast";

const completeExchangeExec = command("completeExchange");
const connectAppExec = command("connectApp");

const exchangeAction = createAction(completeExchangeExec);
const sendAction = txCreateAction(connectAppExec);

const Body = ({
  data,
  onClose,
}: {
  data: {
    provider: string,
    exchange: Exchange,
    transaction: Transaction,
    binaryPayload: string,
    signature: string,
    onResult: Operation => void,
    onCancel: Error => void,
    exchangeType: number,
  },
  onClose: () => void,
}) => {
  const { onResult, onCancel } = data;
  const { fromAccount: account, fromParentAccount: parentAccount } = data.exchange;
  let tokenCurrency;
  if (account.type === "TokenAccount") tokenCurrency = account.token;
  const request = {
    ...data,
    exchange: toExchangeRaw(data.exchange),
    transaction: toTransactionRaw(data.transaction),
  };

  const broadcast = useBroadcast({ account, parentAccount });
  const [transaction, setTransaction] = useState();
  const [signedOperation, setSignedOperation] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (signedOperation) {
      broadcast(signedOperation).then(operation => {
        onResult(operation);
        onClose();
      }, setError);
    }
  }, [broadcast, onClose, onResult, signedOperation]);

  useEffect(() => {
    if (error) {
      onCancel(error);
    }
  }, [onCancel, error]);

  return (
    <ModalBody
      onClose={() => {
        onCancel(new Error("Interrupted by user"));
        onClose();
      }}
      render={() => {
        return (
          <Box alignItems={"center"} justifyContent={"center"} px={32}>
            {error ? (
              <ErrorDisplay error={error} />
            ) : signedOperation ? (
              <BigSpinner size={40} />
            ) : !transaction ? (
              <DeviceAction
                key="completeExchange"
                action={exchangeAction}
                request={request}
                onResult={({ completeExchangeResult, completeExchangeError }) => {
                  if (completeExchangeError) {
                    setError(completeExchangeError);
                  } else {
                    setTransaction(completeExchangeResult);
                  }
                }}
              />
            ) : (
              <DeviceAction
                key="sign"
                action={sendAction}
                request={{
                  tokenCurrency,
                  parentAccount,
                  account,
                  transaction,
                  appName: "Exchange",
                }}
                onResult={({ signedOperation, transactionSignError }) => {
                  if (transactionSignError) {
                    setError(transactionSignError);
                  } else {
                    setSignedOperation(signedOperation);
                  }
                }}
              />
            )}
          </Box>
        );
      }}
    />
  );
};

export default Body;
