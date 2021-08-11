// @flow
import { useEffect, useRef, useCallback } from "react";
import { JSONRPCServer, JSONRPCRequest, JSONRPCServerAndClient, JSONRPCClient } from "json-rpc-2.0";

type LedgerLiveAPIHandlers = {};

type SendFunc = (request: JSONRPCRequest) => void;

export const useLedgerLiveApi = (handlers: LedgerLiveAPIHandlers, send: SendFunc) => {
  const serverRef: { current: null | JSONRPCServerAndClient } = useRef(null);

  useEffect(() => {
    const server = new JSONRPCServerAndClient(new JSONRPCServer(), new JSONRPCClient(send));
    for (const methodId in handlers) {
      server.addMethod(methodId, handlers[methodId]);
    }
    serverRef.current = server;
  }, [send, handlers]);

  const receive = useCallback(async (request: JSONRPCRequest) => {
    if (serverRef.current) {
      await serverRef.current.receiveAndSend(request);
    }
  }, []);

  return [receive];
};
