// @flow
import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { AccountLikeArray, TokenAccount } from "@ledgerhq/live-common/lib/types";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import { makeCompoundSummaryForAccount } from "@ledgerhq/live-common/lib/compound/logic";
import { findCompoundToken } from "@ledgerhq/live-common/lib/currencies";
import { isCompoundTokenSupported } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
import { accountsSelector } from "~/renderer/reducers/accounts";

const makeSummaries = (accounts: AccountLikeArray): CompoundAccountSummary[] =>
  accounts
    .map(acc => {
      if (acc.type !== "TokenAccount") return;
      const ctoken = findCompoundToken(acc.token);
      if (!ctoken) return;

      if (!isCompoundTokenSupported(ctoken)) return;

      const parentAccount = accounts.find(a => a.id === acc.parentId);
      if (!parentAccount || parentAccount.type !== "Account") return;
      const summary = makeCompoundSummaryForAccount(acc, parentAccount);
      return summary;
    })
    .filter(Boolean);

export function useCompoundSummaries(accounts: AccountLikeArray): CompoundAccountSummary[] {
  const summaries = useMemo(() => makeSummaries(accounts), [accounts]);
  return summaries;
}

export function useCompoundSummary(account: TokenAccount): ?CompoundAccountSummary {
  const accounts = useSelector(accountsSelector);
  const ctoken = findCompoundToken(account.token);
  if (!ctoken) return;

  if (!isCompoundTokenSupported(ctoken)) return;

  const parentAccount = accounts.find(a => a.id === account.parentId);
  if (!parentAccount || parentAccount.type !== "Account") return;
  const summary = makeCompoundSummaryForAccount(account, parentAccount);
  return summary;
}
