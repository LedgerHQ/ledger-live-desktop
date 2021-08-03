// @flow
import type { AccountLike } from "@ledgerhq/live-common/lib/types";

const getAccountId = (fromAccount: ?AccountLike) => {
  if (!fromAccount) return "";

  if (fromAccount.type === "Account") return fromAccount.currency.id;
  if (fromAccount.type === "TokenAccount") return fromAccount.token.id;
  if (fromAccount.type === "ChildAccount") return fromAccount.id;

  return "";
};

export default getAccountId;
