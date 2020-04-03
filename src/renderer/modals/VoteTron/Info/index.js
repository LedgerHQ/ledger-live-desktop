// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import { AccountProvider } from "./shared";
import type { Props } from "./shared";
import VoteTronInfoModalBody from "./Body";

export default function VoteTronInfoModal(props: Props) {
  return (
    // FIXME: this makes no sense, remove it and pass it down by props because everyone need it under it
    <AccountProvider value={props}>
      <Modal name={props.name} centered render={props => <VoteTronInfoModalBody {...props} />} />
    </AccountProvider>
  );
}
