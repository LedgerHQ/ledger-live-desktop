// @flow
import React, { useContext } from "react";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

export type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountContext = React.createContext<?Props>();

export const AccountProvider = AccountContext.Provider;

export function useAccount() {
  return useContext(AccountContext);
}
