// @flow

import { remote } from "electron";

import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import TopBar from "./TopBar";

type WidgetType = "login" | "kyc";

type Message = { type: "setToken", token: string } | { type: "closeWidget" };

const getFTXURL = (type: WidgetType) => {
  // TODO: fetch domain (.com vs .us) through API
  const domain = "ftx.com";
  return `https://${domain}/${type}?hideFrame=true&ledgerLive=true`;
};

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

type Props = { provider: String, type: WidgetType, onClose: () => void };

// FIXME rename, should be generic and provider agnostic
const SwapConnectFTX = ({ provider, type, onClose }: Props) => {
  const webviewRef = useRef(null);
  const dispatch = useDispatch();

  /**
   * FIXME: this is only use in KYC status. Maybe could break this component down
   * in more specialized ones (one for login and one for kyc).
   */
  const swapKYC = useSelector(swapKYCSelector);
  const providerKYC = swapKYC?.[provider];
  const authToken = providerKYC?.id;

  const handleMessageData = useCallback(
    (data: Message) => {
      switch (data.type) {
        case "setToken":
          dispatch(setSwapKYCStatus({ provider, id: data?.token, status: null }));
          break;
        case "closeWidget":
          onClose();
          break;
        default:
          break;
      }
    },
    [onClose, dispatch, provider],
  );

  const handleMessage = useCallback(
    event => {
      if (event.channel === "webviewToParent") {
        handleMessageData(JSON.parse(event.args[0]));
      }
    },
    [handleMessageData],
  );

  const url = useMemo(() => {
    return getFTXURL(type);
  }, [type]);

  // Setup communication between webview and application
  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      webview.addEventListener("ipc-message", handleMessage);
    }

    return () => {
      if (webview) {
        webview.removeEventListener("ipc-message", handleMessage);
      }
    };
  }, [type, handleMessage]);

  // FIXME: only used in KYC flow
  const handleExecuteJavaScript = useCallback(() => {
    const webview = webviewRef.current;
    if (webview && type === "kyc" && authToken) {
      webview.executeJavaScript(`localStorage.setItem('authToken', "${authToken}")`);
    }
  }, [authToken, type]);

  // FIXME: only used in KYC flow
  useEffect(() => {
    const webview = webviewRef.current;
    if (webview && type === "kyc" && authToken) {
      webview.addEventListener("dom-ready", handleExecuteJavaScript);
    }

    return () => {
      if (webview && type === "kyc" && authToken) {
        webview.removeEventListener("dom-ready", handleExecuteJavaScript);
      }
    };
  }, [type, authToken, handleExecuteJavaScript]);

  return (
    <Container>
      <TopBar
        // FIXME: should get display name from provider key
        name={provider}
        onClose={onClose}
        webviewRef={webviewRef}
      />
      <Wrapper>
        <CustomWebview
          src={url.toString()}
          ref={webviewRef}
          preload={`file://${remote.app.dirname}/swapConnectWebviewPreloader.bundle.js`}
        />
      </Wrapper>
    </Container>
  );
};

export default SwapConnectFTX;
