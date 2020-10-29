// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import Bridge from "./Bridge";

const BridgeModal = () => (
  <Modal
    name="MODAL_WEBSOCKET_BRIDGE"
    centered
    preventBackdropClick
    render={({ data, onClose }) => <Bridge {...data} onClose={onClose} />}
  />
);

export default BridgeModal;
