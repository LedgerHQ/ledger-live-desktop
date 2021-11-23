// @flow

import { remote } from "electron";

import React, { useEffect, useMemo, useRef } from "react";

import styled from "styled-components";

import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type WidgetType = "login" | "kyc";

type Message = { type: "setToken", token: string } | { type: "closeWidget" };

const getFTXURL = (type: WidgetType) => {
  // TODO: fetch domain (.com vs .us) through API
  const domain = "ftx.com";
  return `https://${domain}/${type}?hideFrame=true&ledgerLive=true`;
};

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

const handleMessageData = (data: Message) => {
  try {
    // const data: Message = JSON.parse(event.data);
    switch (data.type) {
      case "setToken":
        console.log("TOKEN --- ", { token: data.token });
        // saveToken(data.token);
        break;
      case "closeWidget":
        // FIXME: redirect to /swap (?)
        break;
      default:
        break;
    }
  } catch (e) {
    // TODO: tracking
    console.error(e);
  }
};

const handleMessage = event => {
  if (event.channel === "webviewToParent") {
    handleMessageData(JSON.parse(event.args[0]));
  }
};

const SwapConnectFTX = ({ type }: { type: WidgetType }) => {
  const webviewRef = useRef(null);

  const url = useMemo(() => {
    return getFTXURL(type);
  }, [type]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      // $FlowFixMe
      webview.addEventListener("dom-ready", () => {
        webview.openDevTools();
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
  }, [type]);

  return (
    //   FIXME: Add a TopBar component to display provider name and close button
    <Wrapper>
      <CustomWebview
        src={url.toString()}
        ref={webviewRef}
        preload={`file://${remote.app.dirname}/swapConnectWebviewPreloader.bundle.js`}
      />
    </Wrapper>
  );
};

export default SwapConnectFTX;
