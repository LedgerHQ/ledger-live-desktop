// @flow
import { useEffect, useRef, useCallback } from "react";
import { useStore, useDispatch } from "react-redux";
import { JSONRPCServer } from "json-rpc-2.0";

import { PlatformsConfig } from "./config";

import handlers from "./handlers";

const useLedgerLiveApi = (platform: string) => {
  const targetRef: { current: null | HTMLIFrameElement } = useRef(null);
  const dispatch = useDispatch();
  const store = useStore();
  const server = useRef(null);

  const platformConfig = PlatformsConfig[platform];

  const handleMessage = useCallback(
    e => {
      console.log("COUCOU", e);
      if (!e.isTrusted || e.origin !== platformConfig.host || !e.data) return;

      if (server.current) {
        server.current.receiveJSON(e.data).then(jsonRPCResponse => {
          if (jsonRPCResponse && platformConfig) {
            targetRef.current?.contentWindow.postMessage(
              JSON.stringify(jsonRPCResponse),
              platformConfig?.host,
            );
          }
        });
      }
    },
    [platformConfig],
  );

  const connectHandler = useCallback(
    handlerFunction => params => handlerFunction(store.getState(), dispatch, params),
    [store, dispatch],
  );

  useEffect(() => {
    console.log("USE EFFECT");
    window.addEventListener("message", handleMessage, false);
    return () => window.removeEventListener("message", handleMessage, false);
  }, [handleMessage]);

  useEffect(() => {
    server.current = new JSONRPCServer();

    for (const method in handlers) {
      console.log(method);
      server.current.addMethod(method, connectHandler(handlers[method]));
    }

    return () => (server.current = null);
  }, [connectHandler]);

  return { targetRef };
};

export default useLedgerLiveApi;
