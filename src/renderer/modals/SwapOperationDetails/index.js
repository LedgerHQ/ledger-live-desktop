// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import SwapOperationDetailsBody from "~/renderer/modals/SwapOperationDetails/SwapOperationDetailsBody";

const Swap = () => {
  return (
    <Modal
      name="MODAL_SWAP_OPERATION_DETAILS"
      centered
      render={({ data, onClose }) => (
        <SwapOperationDetailsBody
          mappedSwapOperation={data.mappedSwapOperation}
          onClose={onClose}
        />
      )}
    />
  );
};

export default Swap;
