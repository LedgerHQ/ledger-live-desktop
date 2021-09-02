// @flow
import React from "react";
import styled from "styled-components";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import { getTagDerivationMode } from "@ledgerhq/live-common/lib/derivation";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";

const CurrencyLabel: ThemedComponent<*> = styled(Text).attrs(() => ({
  color: "palette.text.shade60",
  ff: "Inter|SemiBold",
  fontSize: "8px",
}))`
  display: inline-block;
  padding: 0 4px;
  height: 14px;
  line-height: 14px;
  border-color: currentColor;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  text-align: center;
  flex: 0 0 auto !important;
  box-sizing: content-box;
  text-transform: uppercase;
  margin: ${p => p.margin || "0 8px"};
  flex: unset;
`;

type Props = {
  account: AccountLike,
  margin?: string,
};

export default function AccountTagDerivationMode({ account, margin }: Props) {
  if (account.type !== "Account") return null;

  const tag =
    account.derivationMode !== undefined &&
    account.derivationMode !== null &&
    getTagDerivationMode(account.currency, account.derivationMode);

  return tag ? <CurrencyLabel margin={margin}>{tag}</CurrencyLabel> : null;
}
