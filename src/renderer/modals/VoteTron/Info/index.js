// @flow

import React from "react";
import Modal from "~/renderer/components/Modal";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import VoteTronInfoModalBody from "./Body";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function VoteTronInfoModal({ name, account, parentAccount }: Props) {
  return (
    <Modal
      name={name}
      centered
      render={props => (
        <VoteTronInfoModalBody
          {...props}
          name={name}
          account={account}
          parentAccount={parentAccount}
        />
      )}
    />
  );
}
