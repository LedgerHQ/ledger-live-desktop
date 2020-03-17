// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import SwapBody from "~/renderer/modals/Swap/SwapBody";

const Swap = () => {
  return (
    <Modal
      name="MODAL_SWAP"
      centered
      render={({ data, onClose }) => <SwapBody swap={data.swap} onClose={onClose} />}
    />
  );
};

export default Swap;
