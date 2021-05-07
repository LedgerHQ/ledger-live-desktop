// @flow

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { JSONRPCRequest } from "json-rpc-2.0";
import { useSelector, useDispatch } from "react-redux";
import type { SignedOperation } from "@ledgerhq/live-common/lib/types";
import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";

import { openModal } from "~/renderer/actions/modals";
import { accountsSelector } from "~/renderer/reducers/accounts";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useJSONRPCServer } from "@ledgerhq/live-common/lib/platform/JSONRPCServer";
import {
  accountToPlatformAccount,
  currencyToPlatformCurrency,
} from "@ledgerhq/live-common/lib/platform/converters";

import type { RawPlatformTransaction } from "@ledgerhq/live-common/lib/platform/rawTypes";

import {
  serializePlatformAccount,
  deserializePlatformTransaction,
} from "@ledgerhq/live-common/lib/platform/serializers";

import TopBar from "./TopBar";
import type { Manifest } from "./type";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/currencies/index";

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
  const currencies = useMemo(() => listCryptoCurrencies(), []);
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

  const requestAccount = useCallback(
    ({ currencies, allowAddAccount }: { currencies?: string[], allowAddAccount?: boolean }) => {
      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_REQUEST_ACCOUNT", {
            currencies,
            allowAddAccount,
            onResult: resolve,
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

      return new Promise((resolve, reject) =>
        dispatch(
          openModal("MODAL_SIGN_TRANSACTION", {
            transactionData: {
              amount: platformTransaction.amount,
              data: platformTransaction.data,
              userGasLimit: platformTransaction.gasLimit,
              gasLimit: platformTransaction.gasLimit,
              gasPrice: platformTransaction.gasPrice,
              family: platformTransaction.family,
              recipient: platformTransaction.recipient,
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
      "currency.list": listCurrencies,
      "account.request": requestAccount,
      "account.receive": receiveOnAccount,
      "transaction.sign": signTransaction,
      "transaction.broadcast": broadcastTransaction,
    }),
    [listAccounts, receiveOnAccount, signTransaction, broadcastTransaction, requestAccount],
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
