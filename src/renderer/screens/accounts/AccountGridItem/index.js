// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import type { TokenAccount, Account, PortfolioRange } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import AccountCardHeader from "./Header";
import AccountCardBody from "./Body";
import AccountContextMenu from "~/renderer/components/ContextMenu/AccountContextMenu";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  hidden?: boolean,
  account: TokenAccount | Account,
  parentAccount: ?Account,
  onClick: (Account | TokenAccount, ?Account) => void,
  range: PortfolioRange,
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
      <Card {...props} style={hidden ? { display: "none" } : {}} p={20} onClick={onClick}>
        <AccountCardHeader account={account} parentAccount={parentAccount} />
        <AccountCardBody account={account} parentAccount={parentAccount} range={range} />
      </Card>
    </AccountContextMenu>
  );
}

const Card: ThemedComponent<{}> = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  p: 3,
  boxShadow: 0,
  borderRadius: 1,
}))`
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color ease-in-out 200ms;
  :hover {
    border-color: ${p => p.theme.colors.palette.text.shade20};
  }
  :active {
    border-color: ${p => p.theme.colors.palette.text.shade20};
    background: ${p => p.theme.colors.palette.action.hover};
  }
`;
