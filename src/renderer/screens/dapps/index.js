// @flow
import React, { useCallback, useState } from "react";
import WalletConnectCore from "@walletconnect/core";
import * as cryptoLib from "@walletconnect/iso-crypto";
import type { RouterHistory, Match, Location } from "react-router-dom";
import { useSelector } from "react-redux";
import { remote } from "electron";
import path from "path";
import IPCTransportHost from "./ipctransporthost";
import Box from "~/renderer/components/Box";
import SelectAccount from "~/renderer/components/SelectAccount";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match,
};

const filter = account => account.currency.id === "ethereum";

// Props are passed from the <Route /> component in <Default />
const Dapps = ({ history, location, match }: Props) => {
  const accounts = useSelector(shallowAccountsSelector);
  const [account, setAccount] = useState(accounts.filter(filter)[0]);
  const [connector, setConnector] = useState();

  const onChangeAccount = useCallback(
    account => {
      // $FlowFixMe
      setAccount(account);
      if (connector && connector.connected) {
        connector.updateSession({
          // $FlowFixMe
          accounts: [account.freshAddress],
          chainId: 1,
        });
      }
    },
    [connector],
  );

  const setUp = useCallback(
    (uri, webview) => {
      let session;
      const sessionStorage = {
        getSession: () => {
          return session;
        },
        setSession: s => {
          session = s;
          return session;
        },
        removeSession: () => {
          session = null;
        },
      };

      const connector = new WalletConnectCore({
        cryptoLib,
        connectorOpts: {
          uri,
          clientMeta: {
            description: "LedgerLive",
            url: "https://ledger.fr",
            icons: ["https://cdn.live.ledger.com/live/icon-512.png"],
            name: "LedgerLive",
          },
        },
        transport: new IPCTransportHost({ webview }),
        sessionStorage,
      });
      connector.on("session_request", (error, payload) => {
        if (error) {
          return;
        }
        console.log("session_request");
        connector.approveSession({
          accounts: [account.freshAddress],
          chainId: 1,
        });
      });
      connector.on("call_request", (error, payload) => {
        if (error) {
          return;
        }

        remote.dialog.showMessageBoxSync({
          message: JSON.stringify(payload),
        });
        connector.rejectRequest({
          id: payload.id,
          error: {
            message: "SALUT SALUT, not implemented",
          },
        });
      });
      setConnector(connector);
    },
    [account.freshAddress],
  );

  const ref = useCallback(
    webview => {
      if (webview !== null) {
        const setupHandler = evt => {
          const {
            args: [uri],
            channel,
          } = evt;
          console.log(evt);
          if (channel !== "dappuri") {
            return;
          }
          setUp(uri, webview);
        };
        // $FlowFixMe
        webview.addEventListener("ipc-message", setupHandler);
      }
    },
    [setUp],
  );

  const preload = __DEV__
    ? path.join(process.env.PWD || "", ".webpack", "provider.bundle.js")
    : path.join(__dirname, "provider.bundle.js");

  return (
    <Box grow>
      <SelectAccount onChange={onChangeAccount} value={account} filter={filter} />
      <webview
        ref={ref}
        // Your source
        id="webview"
        src="https://app.aave.com"
        preload={`file://${preload}`}
        style={{
          flex: 1,
          marginTop: 10,
        }}
        nodeintegration="true"
      />
    </Box>
  );
};
export default Dapps;
