// @flow

import { remote, WebviewTag } from "electron";
import React, { forwardRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import Box from "~/renderer/components/Box";
import {
  handleMessageEvent,
  handleNewWindowEvent,
} from "~/renderer/components/WebPlatformPlayer/utils";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
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
  // $FlowFixMe
  webviewRef: React.MutableRefObject<WebviewTag>,
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
    event => handleMessageEvent({ event, handler: handleMessageData }),
    [handleMessageData],
  );

  const handleNewWindow = useCallback(handleNewWindowEvent, []);

  // Setup communication between webview and application
  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      webview.addEventListener("ipc-message", handleMessage);
      webview.addEventListener("new-window", handleNewWindow);
    }

    return () => {
      if (webview) {
        webview.removeEventListener("ipc-message", handleMessage);
        webview.removeEventListener("new-window", handleNewWindow);
      }
    };
  }, [handleMessage, handleNewWindow, webviewRef]);

  return (
    <Container>
      <TopBar provider={provider} onClose={onClose} webviewRef={webviewRef} />
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

// $FlowFixMe
export default forwardRef(SwapConnectWidget);
