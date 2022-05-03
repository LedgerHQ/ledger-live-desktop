import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProviderCommon, {
  setCurrentCallRequestError,
  setCurrentCallRequestResult,
} from "@ledgerhq/live-common/lib/walletconnect/Provider";
import { useHistory } from "react-router-dom";
import { accountSelector } from "~/renderer/reducers/accounts";
import { openModal, closeAllModal } from "~/renderer/actions/modals";
import WalletConnectClientMock from "~/../tests/mocks/WalletConnectClient";

const useAccount = accountId => {
  return useSelector(s => accountSelector(s, { accountId }));
};

// eslint-disable-next-line flowtype/no-types-missing-file-annotation
const Provider = ({ children }: { children: React$Node }) => {
  const [isReady] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();

  const rest = {};

  if (process.env.PLAYWRIGHT_RUN) {
    rest.WalletConnect = WalletConnectClientMock;
  }

  return (
    <ProviderCommon
      onMessage={(wcCallRequest, account) => {
        if (wcCallRequest.type === "transaction" && wcCallRequest.method === "send") {
          return () => {
            dispatch(
              openModal("MODAL_SEND", {
                transaction: wcCallRequest.data,
                recipient: wcCallRequest.data.recipient,
                walletConnectProxy: true,
                stepId: "amount",
                account,
                onConfirmationHandler: operation => {
                  setCurrentCallRequestResult(operation.hash);
                },
                onFailHandler: err => {
                  setCurrentCallRequestError(err);
                },
                onClose: () => {
                  setCurrentCallRequestError("cancelled");
                },
                disableBacks: ["amount"],
              }),
            );
          };
        }

        if (wcCallRequest.type === "message") {
          return () => {
            dispatch(
              openModal("MODAL_SIGN_MESSAGE", {
                message: wcCallRequest.data,
                account,
                onConfirmationHandler: signature => {
                  setCurrentCallRequestResult(signature);
                },
                onFailHandler: err => {
                  console.log("err", err);
                  setCurrentCallRequestError(err);
                },
                onClose: () => {
                  setCurrentCallRequestError({ message: "cancelled" });
                },
              }),
            );
          };
        }

        return false;
      }}
      onSessionRestarted={account => {
        history.push({
          pathname: "/walletconnect",
        });
      }}
      onRemoteDisconnected={disconnectedAccount => {
        if (disconnectedAccount) {
          dispatch(closeAllModal());
          history.push({
            pathname: `/account/${disconnectedAccount.id}`,
          });
        }
      }}
      useAccount={useAccount}
      isReady={isReady}
      saveWCSession={session => {
        try {
          window.localStorage.setItem("wc_session", JSON.stringify(session));
        } catch (e) {}
      }}
      getWCSession={() => {
        try {
          return JSON.parse(window.localStorage.getItem("wc_session"));
        } catch (e) {}
      }}
      {...rest}
    >
      {children}
    </ProviderCommon>
  );
};

export * from "@ledgerhq/live-common/lib/walletconnect/Provider";
export default Provider;
