import React, { useCallback } from "react";
import { TokenAccount, Account } from "@ledgerhq/live-common/lib/types";
import { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import AccountCardHeader from "./Header";
import AccountCardBody from "./Body";
import AccountContextMenu from "~/renderer/components/ContextMenu/AccountContextMenu";
import Cell from "./Cell";

type Props = {
  hidden?: boolean;
  account: TokenAccount | Account;
  parentAccount: Account;
  onClick: (arg1: Account | TokenAccount, arg2: Account) => void;
  range: PortfolioRange;
};

export default function AccountCard({
  account,
  parentAccount,
  range,
  hidden,
  onClick: onClickProp,
  ...props
}: Props) {
  const onClick = useCallback(() => {
    onClickProp(account, parentAccount);
  }, [account, parentAccount, onClickProp]);

  return (
    <AccountContextMenu account={account} parentAccount={parentAccount}>
      <Cell {...props} style={hidden ? { display: "none" } : {}} p={20} onClick={onClick}>
        <AccountCardHeader account={account} parentAccount={parentAccount} />
        <AccountCardBody account={account} parentAccount={parentAccount} range={range} />
      </Cell>
    </AccountContextMenu>
  );
}
