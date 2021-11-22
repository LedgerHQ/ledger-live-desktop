import React from "react";
import { Tag } from "@ledgerhq/react-ui";
import { TagProps } from "@ledgerhq/react-ui/components/Tag";
import { AccountLike } from "@ledgerhq/live-common/lib/types";
import { getTagDerivationMode } from "@ledgerhq/live-common/lib/derivation";

type Props = {
  account: AccountLike;
  margin?: string;
} & TagProps;

export default function AccountTagDerivationMode({
  account,
  margin,
  disabled = true,
  type,
  ...otherProps
}: Props) {
  if (account.type !== "Account") return null;

  const tag =
    account.derivationMode !== undefined &&
    account.derivationMode !== null &&
    getTagDerivationMode(account.currency, account.derivationMode);

  return tag ? (
    <Tag
      type={"outlinedOpacity" || type}
      size="small"
      disabled={disabled}
      active
      margin={margin ?? "0 6px"}
      {...otherProps}
    >
      {tag}
    </Tag>
  ) : null;
}
