import React from "react";
import { Tag } from "@ledgerhq/react-ui";
import { AccountLike } from "@ledgerhq/live-common/lib/types";
import { getTagDerivationMode } from "@ledgerhq/live-common/lib/derivation";

type Props = {
  account: AccountLike;
  margin?: string;
};

export default function AccountTagDerivationMode({ account, margin }: Props) {
  if (account.type !== "Account") return null;

  const tag =
    account.derivationMode !== undefined &&
    account.derivationMode !== null &&
    getTagDerivationMode(account.currency, account.derivationMode);

  return tag ? (
    <Tag type="outlinedOpacity" size="small" disabled active margin={margin ?? "0 6px"}>
      {tag}
    </Tag>
  ) : null;
}
