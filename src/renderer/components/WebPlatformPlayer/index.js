// @flow

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { JSONRPCRequest } from "json-rpc-2.0";
import { useSelector, useDispatch } from "react-redux";
import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";

import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { openModal } from "~/renderer/actions/modals";
import { accountsSelector } from "~/renderer/reducers/accounts";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useJSONRPCServer } from "@ledgerhq/live-common/lib/platform/JSONRPCServer";
import {
  accountToPlatformAccount,
  currencyToPlatformCurrency,
} from "@ledgerhq/live-common/lib/platform/converters";

import type {
  RawPlatformTransaction,
  RawPlatformSignedTransaction,
} from "@ledgerhq/live-common/lib/platform/rawTypes";

import {
  serializePlatformAccount,
  deserializePlatformTransaction,
  serializePlatformSignedTransaction,
  deserializePlatformSignedTransaction,
} from "@ledgerhq/live-common/lib/platform/serializers";

import TopBar from "./TopBar";
import type { Manifest } from "./type";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";

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
  const currencies = useMemo(() => listSupportedCurrencies(), []);
  const { pushToast } = useToasts();

  const [loadDate, setLoadDate] = useState(Date.now());
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  const listAccounts = useCallback(() => {
    return accounts.map(account => serializePlatformAccount(accountToPlatformAccount(account)));
  }, [accounts]);

  const listCurrencies = useCallback(() => {
    return currencies.map(currencyToPlatformCurrency);
  }, [currencies]);

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
      signedTransaction: RawPlatformSignedTransaction,
    }) => {
      const account = accounts.find(account => account.id === accountId);
      if (!account) return null;

      const signedOperation = deserializePlatformSignedTransaction(signedTransaction, accountId);
      const bridge = getAccountBridge(account);

      const optimisticOperation = !getEnv("DISABLE_TRANSACTION_BROADCAST")
        ? await bridge.broadcast({
            account,
            signedOperation,
          })
        : signedOperation.operation;

      dispatch(
        updateAccountWithUpdater(account.id, account =>
          addPendingOperation(account, optimisticOperation),
        ),
      );

      pushToast({
        id: optimisticOperation.id,
        type: "operation",
        title: "Transaction sent !",
        text: "Click here for more information",
        icon: "info",
        callback: () => {
          dispatch(
            openModal("MODAL_OPERATION_DETAILS", {
              operationId: optimisticOperation.id,
              accountId: account.id,
              parentId: null,
            }),
          );
        },
      });

      return optimisticOperation.hash;
    },
    [accounts, pushToast, dispatch],
  );

  const requestAccount = useCallback(
    ({ currencies, allowAddAccount }: { currencies?: string[], allowAddAccount?: boolean }) => {
      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_REQUEST_ACCOUNT", {
            currencies,
            allowAddAccount,
            onResult: account => resolve(serializePlatformAccount(accountToPlatformAccount(account))),
            onCancel: reject,
          }),
        ),
      );
    },
    [dispatch],
  );

  const signTransaction = useCallback(
    ({ accountId, transaction }: { accountId: string, transaction: RawPlatformTransaction }) => {
      const platformTransaction = deserializePlatformTransaction(transaction);
      const account = accounts.find(account => account.id === accountId);

      if (!account) return null;

      if (account.currency.family !== platformTransaction.family) {
        throw new Error("Transaction family not matching account currency family");
      }

      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_SIGN_TRANSACTION", {
            transactionData: platformTransaction,
            account,
            parentAccount: null,
            onResult: signedOperation =>
              resolve(serializePlatformSignedTransaction(signedOperation)),
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
      "currency.list": listCurrencies,
      "account.request": requestAccount,
      "account.receive": receiveOnAccount,
      "transaction.sign": signTransaction,
      "transaction.broadcast": broadcastTransaction,
    }),
    [
      listAccounts,
      receiveOnAccount,
      signTransaction,
      broadcastTransaction,
      requestAccount,
      listCurrencies,
    ],
  );

  const handleSend = useCallback(
    (request: JSONRPCRequest) => {
      targetRef?.current?.contentWindow.postMessage(JSON.stringify(request), manifest.url.origin);
    },
    [manifest],
  );

  const [receive] = useJSONRPCServer(handlers, handleSend);

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
