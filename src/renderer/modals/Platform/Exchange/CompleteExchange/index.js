// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";

const CompleteExchange = () => {
  return (
    <Modal
      name="MODAL_PLATFORM_EXCHANGE_COMPLETE"
      centered
      preventBackdropClick
      render={({ data, onClose }) => <Body onClose={onClose} data={data} />}
    />
  );
};

export default CompleteExchange;
