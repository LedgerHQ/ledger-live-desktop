// @flow

import React, { PureComponent } from "react";
import Box from "~/renderer/components/Box";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/types/portfolio";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import styled from "styled-components";
import Header from "~/renderer/screens/accounts/AccountRowItem/Header";
import Balance from "~/renderer/screens/accounts/AccountRowItem/Balance";
import Delta from "~/renderer/screens/accounts/AccountRowItem/Delta";
import Countervalue from "~/renderer/screens/accounts/AccountRowItem/Countervalue";
import Star from "~/renderer/components/Stars/Star";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  account: AccountLike,
  nested?: boolean,
  disableRounding?: boolean,
  index: number,
  parentAccount: Account,
  onClick: (AccountLike, Account) => void,
  range: PortfolioRange,
};

const TopLevelRow: ThemedComponent<{}> = styled(Box)`
  background: ${p => p.theme.colors.palette.background.paper};
  align-items: center;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 4px 8px 0 #00000007;
  flex-direction: row;
  color: #abadb6;
  cursor: pointer;
  display: flex;
  margin-bottom: 9px;
  padding: 20px;
  :hover {
    border-color: ${p => p.theme.colors.palette.text.shade40};
  }
`;

const NestedRow: ThemedComponent<{}> = styled(Box)`
  flex: 1;
  font-weight: 600;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  position: relative;
  &:last-of-type {
    margin-bottom: 0px;
  }
`;

class TokenRow extends PureComponent<Props> {
  onClick = () => {
    const { account, parentAccount, onClick } = this.props;
    onClick(account, parentAccount);
  };

  render() {
    const { account, range, index, nested, disableRounding } = this.props;
    const currency = getAccountCurrency(account);
    const unit = currency.units[0];
    const Row = nested ? NestedRow : TopLevelRow;
    return (
      <Row index={index} onClick={this.onClick}>
        <Header nested={nested} account={account} />
        <Balance unit={unit} balance={account.balance} disableRounding={disableRounding} />
        <Countervalue account={account} currency={currency} range={range} />
        <Delta account={account} range={range} />
        <Star
          accountId={account.id}
          parentId={account.type !== "Account" ? account.parentId : undefined}
        />
      </Row>
    );
  }
}

export default TokenRow;
