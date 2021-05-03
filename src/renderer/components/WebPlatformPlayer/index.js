// @flow

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { JSONRPCRequest } from "json-rpc-2.0";
import { useSelector, useDispatch } from "react-redux";
import type { SignedOperation, Transaction } from "@ledgerhq/live-common/lib/types";
import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";

import { openModal } from "~/renderer/actions/modals";
import { accountsSelector } from "~/renderer/reducers/accounts";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useLedgerLiveApi } from "./ledgerLiveAPI";
import TopBar from "./TopBar";
import { Manifest } from "./type";
import { BigNumber } from "bignumber.js";
import { getEnv } from "@ledgerhq/live-common/lib/env";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const CustomIframe: ThemedComponent<{}> = styled.iframe`
  border: none;
  width: 100%;
  flex: 1;
  transition: opacity 200ms ease-out;
`;

const Wrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  flex: 1,
}))`
  position: relative;
`;

const Loader: ThemedComponent<{}> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

type Props = {
  manifest: Manifest,
  onClose?: Function,
};

const WebPlatformPlayer = ({ manifest, onClose }: Props) => {
  const targetRef: { current: null | HTMLIFrameElement } = useRef(null);
  const dispatch = useDispatch();
  const accounts = useSelector(accountsSelector);
  const { pushToast } = useToasts();

  const [loadDate, setLoadDate] = useState(Date.now());
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  const listAccounts = useCallback(() => {
    return accounts;
  }, []);

  const receiveOnAccount = useCallback(
    ({ accountId }: { accountId: string }) => {
      const account = accounts.find(account => account.id === accountId);

      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
            account,
            parentAccount: null,
            onResult: resolve,
            onCancel: reject,
            verifyAddress: true,
          }),
        ),
      );
    },
    [accounts, dispatch],
  );

  const broadcastTransaction = useCallback(
    async ({
      accountId,
      signedTransaction,
    }: {
      accountId: string,
      signedTransaction: SignedOperation,
    }) => {
      const account = accounts.find(account => account.id === accountId);

      const bridge = getAccountBridge(account);

      if (!getEnv("DISABLE_TRANSACTION_BROADCAST")) {
        await bridge.broadcast({
          account,
          signedTransaction,
        });
      }
      pushToast({
        id: signedTransaction.operation.id,
        type: "operation",
        title: "Transaction sent !",
        text: "Click here for more information",
        icon: "info",
        callback: () => {},
      });
      return signedTransaction.operation;
    },
    [accounts],
  );

  const signTransaction = useCallback(
    ({ accountId, transaction }: { accountId: string, transaction: Transaction }) => {
      const account = accounts.find(account => account.id === accountId);

      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_SIGN_TRANSACTION", {
            transactionData: {
              amount: new BigNumber(transaction.amount),
              data: transaction.data ? Buffer.from(transaction.data) : undefined,
              userGasLimit: transaction.gasLimit ? new BigNumber(transaction.gasLimit) : undefined,
              gasLimit: transaction.gasLimit ? new BigNumber(transaction.gasLimit) : undefined,
              gasPrice: transaction.gasPrice ? new BigNumber(transaction.gasPrice) : undefined,
              family: transaction.family,
              recipient: transaction.recipient,
            },
            account,
            parentAccount: null,
            onResult: resolve,
            onCancel: reject,
          }),
        ),
      );
    },
    [dispatch, accounts],
  );

  const handlers = useMemo(
    () => ({
      "account.list": listAccounts,
      "account.receive": receiveOnAccount,
      "transaction.sign": signTransaction,
      "transaction.broadcast": broadcastTransaction,
    }),
    [listAccounts, receiveOnAccount, signTransaction],
  );

  const handleSend = useCallback(
    (request: JSONRPCRequest) => {
      targetRef?.current?.contentWindow.postMessage(JSON.stringify(request), manifest.url.origin);
    },
    [manifest],
  );

  const [receive] = useLedgerLiveApi(handlers, handleSend);

  const handleMessage = useCallback(
    e => {
      if (e.isTrusted && e.origin === manifest.url.origin && e.data) {
        receive(JSON.parse(e.data));
      }
    },
    [manifest, receive],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage, false);
    return () => window.removeEventListener("message", handleMessage, false);
  }, [handleMessage]);

  const handleLoad = useCallback(() => {
    setWidgetLoaded(true);
  }, []);

  const handleReload = useCallback(() => {
    setLoadDate(Date.now());
    setWidgetLoaded(false);
  }, []);

  return (
    <Container>
      <TopBar manifest={manifest} onReload={handleReload} onClose={onClose} />
      <Wrapper>
        <CustomIframe
          src={`${manifest.url.toString()}&${loadDate}`}
          ref={targetRef}
          style={{ opacity: widgetLoaded ? 1 : 0 }}
          onLoad={handleLoad}
        />
        {!widgetLoaded ? (
          <Loader>
            <BigSpinner size={50} />
          </Loader>
        ) : null}
      </Wrapper>
    </Container>
  );
};

export default WebPlatformPlayer;
