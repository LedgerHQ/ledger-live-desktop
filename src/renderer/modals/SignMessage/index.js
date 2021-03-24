// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import Body from "./Body";

const SignMessage = (props: { onClose: Function }) => (
  <Modal
    name="MODAL_SIGN_MESSAGE"
    centered
    onClose={props.onClose || (() => {})}
    render={({ data, onClose }) => <Body onClose={onClose} data={data} />}
  />
);

export default SignMessage;
