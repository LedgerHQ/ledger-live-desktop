// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";

const WalletConnectPasteLink = () => (
  <Modal
    name="MODAL_WALLETCONNECT_PASTE_LINK"
    centered
    render={({ data, onClose }) => <Body onClose={onClose} data={data} />}
  />
);

export default WalletConnectPasteLink;
