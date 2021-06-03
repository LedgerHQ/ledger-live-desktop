// @flow

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { JSONRPCRequest } from "json-rpc-2.0";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { getEnv } from "@ledgerhq/live-common/lib/env";
import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

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

import useTheme from "~/renderer/hooks/useTheme";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import { openModal } from "~/renderer/actions/modals";
import { accountsSelector } from "~/renderer/reducers/accounts";

import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";

import type { Manifest } from "./type";
import * as tracking from "./tracking";
import TopBar from "./TopBar";

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
  const theme = useTheme("colors.palette");

  const targetRef: { current: null | HTMLIFrameElement } = useRef(null);
  const dispatch = useDispatch();
  const accounts = useSelector(accountsSelector);
  const currencies = useMemo(() => listSupportedCurrencies(), []);
  const { pushToast } = useToasts();
  const { t } = useTranslation();

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
      tracking.platformReceiveRequested(manifest);

      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
            account,
            parentAccount: null,
            onResult: account => {
              tracking.platformReceiveSuccess(manifest);
              resolve(account.freshAddress);
            },
            onCancel: error => {
              tracking.platformReceiveFail(manifest);
              reject(error);
            },
            verifyAddress: true,
          }),
        ),
      );
    },
    [manifest, accounts, dispatch],
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

      let optimisticOperation = signedOperation.operation;

      if (!getEnv("DISABLE_TRANSACTION_BROADCAST")) {
        try {
          optimisticOperation = await bridge.broadcast({
            account,
            signedOperation,
          });
          tracking.platformBroadcastSuccess(manifest);
        } catch (error) {
          tracking.platformBroadcastFail(manifest);
          throw error;
        }
      }

      dispatch(
        updateAccountWithUpdater(account.id, account =>
          addPendingOperation(account, optimisticOperation),
        ),
      );

      pushToast({
        id: optimisticOperation.id,
        type: "operation",
        title: t("platform.flows.broadcast.toast.title"),
        text: t("platform.flows.broadcast.toast.text"),
        icon: "info",
        callback: () => {
          tracking.platformBroadcastOperationDetailsClick(manifest);
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
    [manifest, accounts, pushToast, dispatch, t],
  );

  const requestAccount = useCallback(
    ({ currencies, allowAddAccount }: { currencies?: string[], allowAddAccount?: boolean }) => {
      tracking.platformRequestAccountRequested(manifest);
      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_REQUEST_ACCOUNT", {
            currencies,
            allowAddAccount,
            onResult: account => {
              tracking.platformRequestAccountSuccess(manifest);
              resolve(serializePlatformAccount(accountToPlatformAccount(account)));
            },
            onCancel: error => {
              tracking.platformRequestAccountFail(manifest);
              reject(error);
            },
          }),
        ),
      );
    },
    [manifest, dispatch],
  );

  const signTransaction = useCallback(
    ({
      accountId,
      transaction,
      params = {},
    }: {
      accountId: string,
      transaction: RawPlatformTransaction,
      params: any,
    }) => {
      const platformTransaction = deserializePlatformTransaction(transaction);

      const account = accounts.find(account => account.id === accountId);

      if (!account) return null;

      if (account.currency.family !== platformTransaction.family) {
        throw new Error("Transaction family not matching account currency family");
      }

      tracking.platformSignTransactionRequested(manifest);

      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_SIGN_TRANSACTION", {
            transactionData: platformTransaction,
            useApp: params.useApp,
            account,
            parentAccount: null,
            onResult: signedOperation => {
              tracking.platformSignTransactionRequested(manifest);
              resolve(serializePlatformSignedTransaction(signedOperation));
            },
            onCancel: error => {
              tracking.platformSignTransactionFail(manifest);
              reject(error);
            },
          }),
        ),
      );
    },
    [manifest, dispatch, accounts],
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
    tracking.platformLoad(manifest);
    window.addEventListener("message", handleMessage, false);
    return () => window.removeEventListener("message", handleMessage, false);
  }, [manifest, handleMessage]);

  const handleLoad = useCallback(() => {
    tracking.platformLoadSuccess(manifest);
    setWidgetLoaded(true);
  }, [manifest]);

  const handleReload = useCallback(() => {
    tracking.platformReload(manifest);
    setLoadDate(Date.now());
    setWidgetLoaded(false);
  }, [manifest]);

  const uri = useMemo(() => {
    const url = new URL(manifest.url.toString());

    url.searchParams.set("backgroundColor", theme.background.paper);
    url.searchParams.set("textColor", theme.text.shade100);
    url.searchParams.set("loadDate", loadDate.valueOf().toString());

    return url;
  }, [manifest.url, loadDate, theme]);

  return (
    <Container>
      <TopBar manifest={manifest} onReload={handleReload} onClose={onClose} />
      <Wrapper>
        <CustomIframe
          src={uri.toString()}
          ref={targetRef}
          style={{ opacity: widgetLoaded ? 1 : 0 }}
          sandbox="allow-scripts allow-same-origin allow-forms"
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
