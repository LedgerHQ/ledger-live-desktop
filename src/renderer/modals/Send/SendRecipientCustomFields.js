// @flow
import React from "react";
import type { Account, Transaction, TransactionStatus } from "@ledgerhq/live-common/lib/types";

import byFamily from "~/renderer/generated/SendRecipientCustomFields";

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
};

const SendRecipientCustomFields = (props: Props) => {
  const module = byFamily[props.account.currency.family];
  if (!module) return null;
  const Cmp = module.component;
  return <Cmp {...props} />;
};

export default SendRecipientCustomFields;
