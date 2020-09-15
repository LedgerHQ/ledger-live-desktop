// @flow

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import WebSocket from "ws";
import IP from "ip";
import { encode } from "@ledgerhq/live-common/lib/cross";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";
import { exportSettingsSelector } from "~/renderer/reducers/settings";
import Button from "~/renderer/components/Button";
import QRCode from "~/renderer/components/QRCode";

const SocketExport = () => {
  const accounts = useSelector(activeAccountsSelector);
  const settings = useSelector(exportSettingsSelector);

  const [active, setActive] = useState(false);
  const server = useRef(null);
  const secret = useRef("");

  const resetServer = useCallback(() => {
    server.current = new WebSocket.Server({ port: 1234 });

    const data = encode({
      accounts,
      settings,
      exporterName: "desktop",
      exporterVersion: __APP_VERSION__,
    });

    secret.current = Math.random()
      .toString(36)
      .slice(2);

    if (server.current) {
      server.current.on("connection", ws => {
        ws.on("message", message => {
          if (message === secret.current) {
            ws.send(data);
            ws.close();
            setActive(false);
            server.current = undefined;
          }
        });
      });
    }
  }, [accounts, settings]);

  const onClick = useCallback((e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActive(true);
  }, []);

  // componentDidMount / WillUnmount
  useEffect(() => {
    resetServer();
    return () => {
      if (server.current) server.current.stop();
    };
  }, [resetServer]);

  // componentDidUpdate
  useEffect(() => {
    if (!active) return;
    if (!server.current) {
      resetServer();
    }
  }, [active, accounts, settings, resetServer]);

  return active ? (
    <QRCode size={50} data={`${secret.current}~${IP.address()}`} />
  ) : (
    <Button primary small onClick={onClick}>
      {"Generate Code"}
    </Button>
  );
};

export default SocketExport;
