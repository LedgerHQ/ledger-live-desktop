// @flow

import { remote } from "electron";

import React, { useEffect, useMemo, useRef, useCallback } from "react";

import styled from "styled-components";

import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
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

const AUTH_TOKEN = process.env.AUTH_TOKEN || "";

// FIXME rename, should be genberaic and provider agnostic
const SwapConnectFTX = ({ type, onClose }: { type: WidgetType, onClose: () => void }) => {
  const webviewRef = useRef(null);

  const handleMessageData = useCallback(
    (data: Message) => {
      try {
        // const data: Message = JSON.parse(event.data);
        switch (data.type) {
          case "setToken":
            console.log("TOKEN --- ", { token: data.token });
            // saveToken(data.token);
            break;
          case "closeWidget":
            onClose();
            // call `onClose`
            break;
          default:
            break;
        }
      } catch (e) {
        // TODO: tracking
        console.error(e);
      }
    },
    [onClose],
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

  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      // $FlowFixMe
      webview.addEventListener("dom-ready", () => {
        // $FlowFixMe
        if (type === "kyc") {
          webview.executeJavaScript(`localStorage.setItem('authToken', "${AUTH_TOKEN}")`);
        }
      });

      webview.addEventListener("ipc-message", handleMessage);
    }

    return () => {
      // FIXME: remove all event listener
      if (webview) {
        webview.removeEventListener("ipc-message", handleMessage);
      }
    };
  }, [type, handleMessage]);

  const handleReload = () => {
    const webview = webviewRef.current;
    if (webview) {
      webview.reloadIgnoringCache();
    }
  };

  const handleOpenDevTools = () => {
    const webview = webviewRef.current;

    if (webview) {
      webview.openDevTools();
    }
  };

  return (
    <Container>
      <TopBar
        // FIXME: provider name should be a variable
        name="FTX"
        onReload={handleReload}
        onClose={onClose}
        onOpenDevTools={handleOpenDevTools}
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
