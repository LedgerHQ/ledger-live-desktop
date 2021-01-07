// @flow
import React, { useCallback, useMemo, useState } from "react";
import type { Account, AccountLike, SignedOperation } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import DeviceAction from "~/renderer/components/DeviceAction";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import { Trans } from "react-i18next";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import StepProgress from "~/renderer/components/StepProgress";
import { DeviceBlocker } from "~/renderer/components/DeviceAction/DeviceBlocker";
import BigSpinner from "~/renderer/components/BigSpinner";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";
import { parseCurrencyUnit } from "@ledgerhq/live-common/lib/currencies/index";
import { createAction as initSellCreateAction } from "@ledgerhq/live-common/lib/hw/actions/initSell";
import { toTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
import { toAccountLikeRaw, toAccountRaw } from "@ledgerhq/live-common/lib/account/serialization";
import { toTransactionStatusRaw } from "@ledgerhq/live-common/lib/transaction/status";
import { renderError } from "~/renderer/components/DeviceAction/rendering";
import { useBroadcast } from "~/renderer/hooks/useBroadcast";

const checkSignatureAndPrepare = command("checkSignatureAndPrepare");
const connectAppExec = command("connectApp");
const initSellExec = command("getTransactionId");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

type Props = {
  onClose: () => void,
  data: {
    account: AccountLike,
    parentAccount: ?Account,
    onResult: () => null,
    onCancel: () => null,
    verifyAddress?: boolean,
    getCoinifyContext: string => Promise<any>,
  },
};

const Result = ({
  signedOperation,
  device,
}: {
  signedOperation: ?SignedOperation,
  device: Device,
}) => {
  if (!signedOperation) return null;
  return (
    <StepProgress modelId={device.modelId}>
      <DeviceBlocker />
      <Trans i18nKey="send.steps.confirmation.pending.title" />
    </StepProgress>
  );
};

const Root = ({ data, onClose }: Props) => {
  const { account, parentAccount, getCoinifyContext, onResult, onCancel } = data;

  const tokenCurrency = account && account.type === "TokenAccount" && account.token;

  // state
  const [sellData, setSellData] = useState(null);
  const [error, setError] = useState(null);
  const [signedOperation, setSignedOperation] = useState(null);

  const broadcast = useBroadcast({ account, parentAccount });

  const handleTransactionId = useCallback(
    async (nonce: string) => {
      const mainAccount = getMainAccount(account, parentAccount);
      const mainCurrency = getAccountCurrency(mainAccount);

      const coinifyContext = await getCoinifyContext(nonce);

      const bridge = getAccountBridge(account, parentAccount);
      const t1 = bridge.createTransaction(mainAccount);

      const t2 = bridge.updateTransaction(t1, {
        amount: parseCurrencyUnit(mainCurrency.units[0], coinifyContext.inAmount.toString(10)),
        recipient: coinifyContext.transferIn.details.account,
      });
      const t3 = await bridge.prepareTransaction(mainAccount, t2);
      const s = await bridge.getTransactionStatus(mainAccount, t3);

      if (s.errors && s.errors.amount) {
        setError(s.errors.amount);
      }

      return {
        binaryPayload: coinifyContext.providerSig.payload,
        payloadSignature: coinifyContext.providerSig.signature,
        transaction: t3,
        status: s,
      };
    },
    [getCoinifyContext, account, parentAccount],
  );

  const action2 = useMemo(
    () =>
      initSellCreateAction(
        getEnv("MOCK") ? mockedEventEmitter : connectAppExec,
        getEnv("MOCK")
          ? mockedEventEmitter
          : ({ deviceId }) =>
              initSellExec({
                deviceId,
              }),
        ({
          deviceId,
          transaction,
          binaryPayload,
          payloadSignature,
          account,
          parentAccount,
          status,
        }) =>
          checkSignatureAndPrepare({
            deviceId,
            transaction: toTransactionRaw(transaction),
            binaryPayload,
            payloadSignature,
            account: toAccountLikeRaw(account),
            parentAccount: parentAccount ? toAccountRaw(parentAccount) : undefined,
            status: toTransactionStatusRaw(status),
          }),
        handleTransactionId,
      ),
    [handleTransactionId],
  );

  if (error) {
    return (
      <Box alignItems={"center"} justifyContent={"center"} p={20}>
        {renderError({
          error,
        })}
      </Box>
    );
  }

  // If the TX is signed by the device
  if (signedOperation) {
    return (
      <Box alignItems={"center"} justifyContent={"center"} p={20}>
        <BigSpinner size={40} />
      </Box>
    );
  }

  // When the device is done with the sell init
  if (!sellData) {
    return (
      <DeviceAction
        action={action2}
        request={{
          parentAccount,
          account,
        }}
        Result={Result}
        onResult={({ initSellResult, initSellError, ...rest }) => {
          if (initSellError) {
            if (initSellError.statusCode === 27268) {
              // this mean the user declined the trade on device
              onCancel();
              onClose();
              return;
            }
            setError(initSellError);
          } else {
            setSellData(initSellResult);
          }
        }}
      />
    );
  }

  // About to broadcast
  return (
    <DeviceAction
      key={"send"}
      action={action}
      request={{
        tokenCurrency,
        parentAccount,
        account,
        transaction: sellData.transaction,
        appName: "Exchange",
      }}
      Result={Result}
      onResult={({ signedOperation, transactionSignError }) => {
        if (transactionSignError) {
          setError(transactionSignError);
        } else {
          setSignedOperation(signedOperation);
          broadcast(signedOperation).then(() => {
            onResult();
            onClose();
          });
        }
      }}
    />
  );
};

const SellCrypto = () => {
  return (
    <Modal
      name="MODAL_SELL_CRYPTO_DEVICE"
      centered
      render={({ data, onClose }) => (
        <ModalBody
          onClose={() => {
            if (data.onCancel) {
              data.onCancel();
            }
            onClose();
          }}
          title="Connect your device"
          render={() => (data ? <Root data={data} onClose={onClose} /> : null)}
        />
      )}
    />
  );
};

export default SellCrypto;
