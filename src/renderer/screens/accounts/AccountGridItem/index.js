// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import type { TokenAccount, Account, PortfolioRange } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import AccountCardHeader from "./Header";
import AccountCardBody from "./Body";
import AccountContextMenu from "~/renderer/components/ContextMenu/AccountContextMenu";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

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

type Props = {
  hidden?: boolean,
  account: TokenAccount | Account,
  parentAccount: ?Account,
  onClick: (Account | TokenAccount, ?Account) => void,
  range: PortfolioRange,
};

class AccountCard extends PureComponent<Props> {
  onClick = () => {
    const { account, parentAccount, onClick } = this.props;
    onClick(account, parentAccount);
  };

  render() {
    const { account, parentAccount, range, hidden, ...props } = this.props;

    return (
      <AccountContextMenu account={account} parentAccount={parentAccount}>
        <Card
          {...props}
          style={{ display: hidden && "none" }}
          p={20}
          onClick={this.onClick}
          data-automation-id="dashboard_AccountCardWrapper"
        >
          <AccountCardHeader account={account} parentAccount={parentAccount} />
          <AccountCardBody account={account} parentAccount={parentAccount} range={range} />
        </Card>
      </AccountContextMenu>
    );
  }
}

export default AccountCard;
