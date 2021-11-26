// @flow

import React, { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

import { swapKYCSelector } from "~/renderer/reducers/settings";
import SwapConnectWidget from "../SwapConnectWidget";
import { getFTXURL } from "../utils";

// FIXME: should use constant instead of string
const provider = "ftx";

const url = getFTXURL("kyc");

type Props = { onClose: Function };

const FTXKYC = ({ onClose }: Props) => {
  const webviewRef = useRef(null);

  const swapKYC = useSelector(swapKYCSelector);
  const providerKYC = swapKYC?.[provider];
  const authToken = providerKYC?.id;

  const handleExecuteJavaScript = useCallback(() => {
    const webview = webviewRef.current;
    if (webview && authToken) {
      webview.executeJavaScript(`localStorage.setItem('authToken', "${authToken}")`);
    }
  }, [authToken]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (webview && authToken) {
      webview.addEventListener("dom-ready", handleExecuteJavaScript);
    }

    return () => {
      if (webview && authToken) {
        webview.removeEventListener("dom-ready", handleExecuteJavaScript);
      }
    };
  }, [authToken, handleExecuteJavaScript]);

  return <SwapConnectWidget provider={provider} onClose={onClose} url={url} ref={webviewRef} />;
};

export default FTXKYC;
