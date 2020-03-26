// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import { AccountProvider } from "./shared";
import type { Props } from "./shared";
import VoteTronInfoModalBody from "./Body";

export default function VoteTronInfoModal(props: Props) {
  return (
    <AccountProvider value={props}>
      <Modal name={props.name} centered render={props => <VoteTronInfoModalBody {...props} />} />
    </AccountProvider>
  );
}
