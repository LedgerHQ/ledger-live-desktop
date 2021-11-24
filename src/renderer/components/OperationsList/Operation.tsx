import React, { PureComponent } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import { TFunction } from "react-i18next";
import { AccountLike, Account, Operation } from "@ledgerhq/live-common/lib/types";
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
import { ThemedComponent } from "~/renderer/styles/StyleProvider";

const OperationRow: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
}))`
  height: 56px;
  opacity: ${p => (p.isOptimistic ? 0.5 : 1)};
  cursor: pointer;
`;

type Props = {
  operation: Operation;
  account: AccountLike;
  parentAccount?: Account;
  onOperationClick: (operation: Operation, account: AccountLike, parentAccount?: Account) => void;
  t: TFunction;
  withAccount: boolean;
  withAddress: boolean;
  text?: string;
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
      <OperationRow
        className="operation-row"
        isOptimistic={isOptimistic}
        onClick={this.onOperationClick}
      >
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
