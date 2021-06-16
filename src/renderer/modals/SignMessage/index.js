// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";

const SignMessage = (props: { onClose: Function }) => {
  const rest = {};
  if (props.onClose) {
    rest.onClose = props.onClose;
  }

  return (
    <Modal
      name="MODAL_SIGN_MESSAGE"
      centered
      render={({ data, onClose }) => <Body onClose={onClose} data={data} />}
      {...rest}
    />
  );
};

export default SignMessage;
