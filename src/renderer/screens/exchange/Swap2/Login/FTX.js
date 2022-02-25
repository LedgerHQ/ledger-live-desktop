// @flow

import React, { useRef, useMemo, useCallback, useEffect } from "react";
import SwapConnectWidget from "../SwapConnectWidget";

import type { FTXProviders } from "../utils";
import { getFTXURL } from "../utils";

type Props = { onClose: Function, provider: FTXProviders };

const FTXLogin = ({ onClose, provider }: Props) => {
  const url = useMemo(() => getFTXURL({ type: "login", provider }), [provider]);

  const webviewRef = useRef(null);

  /**
   * Force removal of authToken item from webview local storage when user is
   * asked to login. Done to allow for FTX login reset (when cleaning app.json)
   */
  const handleExecuteJavaScript = useCallback(() => {
    const webview = webviewRef.current;
    if (webview) {
      /**
       * FIXME:
       * should remove auth token and ask the user to log in again (by provider
       * his login / password infos)
       */

      webview.executeJavaScript(`window.localStorage.removeItem("authToken");`);
      webview.executeJavaScript(`window.localStorage.clear();`);
    }
  }, []);

  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {
      webview.addEventListener("dom-ready", handleExecuteJavaScript);
    }

    return () => {
      if (webview) {
        webview.removeEventListener("dom-ready", handleExecuteJavaScript);
      }
    };
  }, [handleExecuteJavaScript]);

  return <SwapConnectWidget provider={provider} onClose={onClose} url={url} ref={webviewRef} />;
};

export default FTXLogin;
