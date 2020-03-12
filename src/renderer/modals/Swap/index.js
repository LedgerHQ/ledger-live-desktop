// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import Body from "~/renderer/modals/Swap/Body";

const Swap = () => {
  return (
    <Modal
      name="MODAL_SWAP"
      centered
      render={({ data, onClose }) => <Body exchange={data.exchange} onClose={onClose} />}
    />
  );
};

export default Swap;
