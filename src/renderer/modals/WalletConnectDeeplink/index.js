// @flow
import React from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";

const WalletConnectDeeplink = () => {
  return (
    <Modal
      name="MODAL_WALLETCONNECT_DEEPLINK"
      centered
      preventBackdropClick
      render={({ data, onClose }) => <Body link={data.link} onClose={onClose} />}
    />
  );
};

export default WalletConnectDeeplink;
