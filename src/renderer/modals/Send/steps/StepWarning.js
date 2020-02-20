// @flow
import React from "react";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import byFamily from "~/renderer/generated/SendWarning";
import type { StepProps } from "../types";

const StepWarning = (props: StepProps) => {
  const { account, parentAccount } = props;
  const mainAccount = account && getMainAccount(account, parentAccount);
  if (!mainAccount) return null;
  const module = byFamily[mainAccount.currency.family];
  if (!module) return null;
  const Comp = module.component;

  return <Comp {...props} />;
};

export const StepWarningFooter = (props: StepProps) => {
  const { account, parentAccount } = props;
  const mainAccount = account && getMainAccount(account, parentAccount);
  if (!mainAccount) return null;
  const module = byFamily[mainAccount.currency.family];
  if (!module) return null;
  const Comp = module.footer;

  return <Comp {...props} />;
};

export default StepWarning;
