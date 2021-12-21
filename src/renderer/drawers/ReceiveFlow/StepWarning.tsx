import React from "react";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import byFamily from "~/renderer/generated/ReceiveWarning";
import { Account, AccountLike, TokenCurrency } from "@ledgerhq/live-common/lib/types";

export type Props = {
  account?: AccountLike;
  parentAccount?: Account;
  token?: TokenCurrency;
  onContinue: () => void;
};

export const StepWarning = (props: Props) => {
  const { account, parentAccount } = props;
  const mainAccount = account && getMainAccount(account, parentAccount);
  if (!mainAccount) return null;
  const module = byFamily[mainAccount.currency.family];
  if (!module) return null;
  const Comp = module.component;
  return <Comp {...props} />;
};

export const StepWarningFooter = (props: Props) => {
  const { account, parentAccount } = props;
  const mainAccount = account && getMainAccount(account, parentAccount);
  if (!mainAccount) return null;
  const module = byFamily[mainAccount.currency.family];
  if (!module) return null;
  const Comp = module.footer;
  return <Comp {...props} />;
};
