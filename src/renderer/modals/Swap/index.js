// @flow

import React, { useState } from "react";
import Modal from "~/renderer/components/Modal";
import SwapBody from "~/renderer/modals/Swap/SwapBody";

const Swap = () => {
  const [stepId, setStepId] = useState("summary");
  const isModalLocked = ["device"].includes(stepId);
  return (
    <Modal
      name="MODAL_SWAP"
      centered
      preventBackdropClick={isModalLocked}
      render={({ data, onClose }) => (
        <SwapBody
          swap={data.swap}
          transaction={data.transaction}
          onStepChange={setStepId}
          activeStep={stepId}
          onClose={onClose}
        />
      )}
    />
  );
};

export default Swap;
