// @flow
import React, { useEffect, useState } from "react";
import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/completeExchange";
import { createAction as txCreateAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import type { Exchange } from "@ledgerhq/live-common/lib/exchange/swap/types";
import type { Transaction, Operation } from "@ledgerhq/live-common/lib/types";
import { command } from "~/renderer/commands";
import { toExchangeRaw } from "@ledgerhq/live-common/lib/exchange/swap/serialization";
import { toTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
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
  const { onResult } = data;
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

  return (
    <ModalBody
      onClose={onClose}
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
                  console.log({ completeExchangeResult });
                  if (completeExchangeError) {
                    setError(completeExchangeError);
                  } else {
                    setTransaction(completeExchangeResult);
                  }
                }}
              />
            ) : (
              <DeviceAction
                key={"sign"}
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
