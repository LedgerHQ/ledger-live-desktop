// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import { rgba } from "~/renderer/styles/helpers";
import Box from "~/renderer/components/Box";
import type { TFunction } from "react-i18next";
import type { AccountLike, Account, Operation } from "@ledgerhq/live-common/lib/types";
import {
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";

import ConfirmationCell from "./ConfirmationCell";
import DateCell from "./DateCell";
import AccountCell from "./AccountCell";
import AddressCell from "./AddressCell";
import AmountCell from "./AmountCell";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const OperationRow: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
}))`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  height: 68px;
  opacity: ${p => (p.isOptimistic ? 0.5 : 1)};
  cursor: pointer;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`;

type Props = {
  operation: Operation,
  account: AccountLike,
  parentAccount?: Account,
  onOperationClick: (operation: Operation, account: AccountLike, parentAccount?: Account) => void,
  t: TFunction,
  withAccount: boolean,
  withAddress: boolean,
  text?: string,
};

class OperationComponent extends PureComponent<Props> {
  static defaultProps = {
    withAccount: false,
    withAddress: true,
  };

  onOperationClick = () => {
    const { account, parentAccount, onOperationClick, operation } = this.props;
    onOperationClick(operation, account, parentAccount);
  };

  render() {
    const { account, parentAccount, t, operation, withAccount, text, withAddress } = this.props;
    const isOptimistic = operation.blockHeight === null;
    const currency = getAccountCurrency(account);
    const unit = getAccountUnit(account);

    return (
      <OperationRow isOptimistic={isOptimistic} onClick={this.onOperationClick}>
        <ConfirmationCell
          operation={operation}
          parentAccount={parentAccount}
          account={account}
          t={t}
        />
        <DateCell text={text} operation={operation} t={t} />
        {withAccount && <AccountCell accountName={getAccountName(account)} currency={currency} />}
        {withAddress ? <AddressCell operation={operation} /> : <Box flex="1" />}
        <AmountCell operation={operation} currency={currency} unit={unit} />
      </OperationRow>
    );
  }
}

export default OperationComponent;
