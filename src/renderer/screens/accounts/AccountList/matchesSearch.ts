import {
  getAccountCurrency,
  getAccountName,
  listSubAccounts,
} from "@ledgerhq/live-common/lib/account/helpers";
import { AccountLike } from "@ledgerhq/live-common/lib/types";

export const matchesSearch = (search?: string, account: AccountLike, subMatch = false): boolean => {
  if (!search) return true;
  let match;

  if (account.type === "Account") {
    match = `${account.currency.ticker}|${account.currency.name}|${getAccountName(account)}`;
    subMatch =
      subMatch &&
      !!account.subAccounts &&
      listSubAccounts(account).some(token => matchesSearch(search, token));
  } else {
    const c = getAccountCurrency(account);
    match = `${c.ticker}|${c.name}|${getAccountName(account)}`;
  }

  return match.toLowerCase().includes(search.toLowerCase()) || subMatch;
};
