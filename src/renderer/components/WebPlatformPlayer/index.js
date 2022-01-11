// @flow
import { remote, WebviewTag, shell } from "electron";
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { JSONRPCRequest } from "json-rpc-2.0";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { getEnv } from "@ledgerhq/live-common/lib/env";
import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useJSONRPCServer } from "@ledgerhq/live-common/lib/platform/JSONRPCServer";

import {
  accountToPlatformAccount,
  currencyToPlatformCurrency,
  getPlatformTransactionSignFlowInfos,
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

import * as tracking from "./tracking";
import TopBar from "./TopBar";

import type { TopBarConfig } from "./type";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

// $FlowFixMe
const CustomWebview: ThemedComponent<{}> = styled("webview")`
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

type WebPlatformPlayerConfig = {
  topBarConfig?: TopBarConfig,
};

type Props = {
  manifest: AppManifest,
  onClose?: Function,
  inputs?: Object,
  config?: WebPlatformPlayerConfig,
};

const WebPlatformPlayer = ({ manifest, onClose, inputs, config }: Props) => {
  const theme = useTheme("colors.palette");

  const targetRef: { current: null | WebviewTag } = useRef(null);
  const dispatch = useDispatch();
  const accounts = useSelector(accountsSelector);
  const currencies = useMemo(() => listSupportedCurrencies(), []);
  const { pushToast } = useToasts();
  const { t } = useTranslation();

  const [widgetLoaded, setWidgetLoaded] = useState(false);

  const url = useMemo(() => {
    const urlObj = new URL(manifest.url.toString());

    if (inputs) {
      for (const key in inputs) {
        if (Object.prototype.hasOwnProperty.call(inputs, key)) {
          urlObj.searchParams.set(key, inputs[key]);
        }
      }
    }

    urlObj.searchParams.set("backgroundColor", theme.background.paper);
    urlObj.searchParams.set("textColor", theme.text.shade100);
    if (manifest.params) {
      urlObj.searchParams.set("params", JSON.stringify(manifest.params));
    }

    return urlObj;
  }, [manifest.url, theme, inputs, manifest.params]);

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

      const { canEditFees, liveTx, hasFeesProvided } = getPlatformTransactionSignFlowInfos(
        platformTransaction,
      );

      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_SIGN_TRANSACTION", {
            canEditFees,
            stepId: canEditFees && !hasFeesProvided ? "amount" : "summary",
            transactionData: liveTx,
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
      const webview = targetRef.current;
      if (webview) {
        webview.contentWindow.postMessage(JSON.stringify(request), url.origin);
      }
    },
    [url],
  );

  const [receive] = useJSONRPCServer(handlers, handleSend);

  const handleMessage = useCallback(
    event => {
      if (event.channel === "webviewToParent") {
        receive(JSON.parse(event.args[0]));
      }
    },
    [receive],
  );

  useEffect(() => {
    tracking.platformLoad(manifest);
    const webview = targetRef.current;
    if (webview) {
      webview.addEventListener("ipc-message", handleMessage);
    }

    return () => {
      if (webview) {
        webview.removeEventListener("ipc-message", handleMessage);
      }
    };
  }, [manifest, handleMessage]);

  const handleLoad = useCallback(() => {
    tracking.platformLoadSuccess(manifest);
    setWidgetLoaded(true);
  }, [manifest]);

  const handleReload = useCallback(() => {
    const webview = targetRef.current;
    if (webview) {
      tracking.platformReload(manifest);
      setWidgetLoaded(false);
      webview.reloadIgnoringCache();
    }
  }, [manifest]);

  const handleNewWindow = useCallback(async e => {
    const protocol = new URL(e.url).protocol;
    if (protocol === "http:" || protocol === "https:") {
      await shell.openExternal(e.url);
    }
  }, []);

  useEffect(() => {
    const webview = targetRef.current;

    if (webview) {
      webview.addEventListener("new-window", handleNewWindow);
      webview.addEventListener("did-finish-load", handleLoad);
    }

    return () => {
      if (webview) {
        webview.removeEventListener("new-window", handleNewWindow);
        webview.removeEventListener("did-finish-load", handleLoad);
      }
    };
  }, [handleLoad, handleNewWindow]);

  const handleOpenDevTools = useCallback(() => {
    const webview = targetRef.current;

    if (webview) {
      webview.openDevTools();
    }
  }, []);

  return (
    <Container>
      <TopBar
        manifest={manifest}
        onReload={handleReload}
        onClose={onClose}
        onOpenDevTools={handleOpenDevTools}
        config={config?.topBarConfig}
      />

      <Wrapper>
        <CustomWebview
          src={url.toString()}
          ref={targetRef}
          style={{ opacity: widgetLoaded ? 1 : 0 }}
          preload={`file://${remote.app.dirname}/webviewPreloader.bundle.js`}
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
