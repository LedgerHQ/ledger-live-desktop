// @flow

import { remote } from "electron";

import React, { useEffect, useCallback, forwardRef } from "react";
import { useDispatch } from "react-redux";

import styled from "styled-components";

import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import TopBar from "./TopBar";

type Message = { type: "setToken", token: string } | { type: "closeWidget" };

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

type Props = {
  provider: string,
  url: string,
  onClose: () => void,
};

const SwapConnectWidget = (
  { provider, url, onClose }: Props,
  webviewRef: React.MutableRefObject<any>,
) => {
  const dispatch = useDispatch();

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
  }, [handleMessage, webviewRef]);

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
          src={process.env.MOCK_FTX_WIDGETS ? { html: "<h1>YOOOOOOO</h1>" } : url.toString()}
          ref={webviewRef}
          preload={`file://${remote.app.dirname}/swapConnectWebviewPreloader.bundle.js`}
        />
      </Wrapper>
    </Container>
  );
};

const html = {
  html: `<!doctype html>

  <html lang="en">
  <head>
    <meta charset="utf-8">
  
    <title>Test login widget</title>
  </head>
  
  <body>
    // <script src="js/scripts.js"></script>
    <h1>YOOOOOO TESTINGGGG</h1>
  </body>
  </html>
  `,
};

export default forwardRef(SwapConnectWidget);
