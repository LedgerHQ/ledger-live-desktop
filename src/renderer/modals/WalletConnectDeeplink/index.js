// @flow
import React from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";

const WalletConnectDeeplink = () => {
  return (
    <Modal
      name="MODAL_WALLETCONNECT_DEEPLINK"
      centered
      render={({ data, onClose }) => (
        <Body
          account={data.account}
          onClose={onClose}
          link="TODO: this link should be retrieved in the data passed to the modal"
        />
      )}
    />
  );
};

export default WalletConnectDeeplink;
