// @flow
import { useState, useEffect } from "react";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import { findCompoundToken } from "@ledgerhq/live-common/lib/currencies";
import { makeCompoundSummaryForAccount } from "@ledgerhq/live-common/lib/compound/logic";

const makeSummaries = (accounts: AccountLike[]) =>
  accounts.reduce((summaries, account) => {
    if (account.type !== "TokenAccount") return summaries;
    if (!findCompoundToken(account.token)) return summaries;

    const parentAccount = accounts.find(acc => acc.id === account.parentId);
    if (!parentAccount || parentAccount.type !== "Account") return summaries;

    const summary = makeCompoundSummaryForAccount(account, parentAccount);
    return summaries.concat(summary);
  }, []);

export function useCompoundSummaries(accounts: AccountLike[]): CompoundAccountSummary[] {
  const [summaries, setSummaries] = useState(() => {
    return makeSummaries(accounts);
  });

  useEffect(() => {
    const newSummaries = makeSummaries(accounts);
    if (newSummaries) {
      setSummaries(newSummaries);
    }
  }, [accounts, setSummaries]);

  return summaries;
}
