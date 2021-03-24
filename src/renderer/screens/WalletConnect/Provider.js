import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProviderCommon, { setCurrentCallRequestError } from "@ledgerhq/live-common/lib/walletconnect/Provider";
import { useHistory } from "react-router-dom";
import { accountSelector } from "~/renderer/reducers/accounts";
import { openModal, closeAllModal } from "~/renderer/actions/modals";

const useAccount = accountId => {
  return useSelector(s => accountSelector(s, { accountId }));
};

const Provider = ({ children }: { children: React$Node }) => {
  const [isReady] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <ProviderCommon
      onMessage={(wcCallRequest, account) => {
        if (wcCallRequest.type === "transaction" && wcCallRequest.method === "send") {
          console.log("wc send transaction", wcCallRequest.data);
          return () => {
            console.log("open modal");
            dispatch(
              openModal("MODAL_SEND", {
                transaction: wcCallRequest.data,
                recipient: wcCallRequest.data.recipient,
                stepId: "amount",
                account,
                onConfirmationHandler: operation => {
                  console.log("successs");
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
          console.log("wc message");
          /*
          return () =>
            navigate(NavigatorName.SignMessage, {
              screen: ScreenName.SignSummary,
              params: {
                message: wcCallRequest.data,
                accountId: account.id,
              },
            });
          */
        }

        return false;
      }}
      onSessionRestarted={account => {
        console.log("wc session restarted should navigat to wc screen");
        history.push({
          pathname: "/walletconnect",
        });
      }}
      onRemoteDisconnected={() => {
        console.log("wc session restarted should navigate bakc to account");
        dispatch(closeAllModal);
        history.goBack();
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
    >
      {children}
    </ProviderCommon>
  );
};

export * from "@ledgerhq/live-common/lib/walletconnect/Provider";
export default Provider;
