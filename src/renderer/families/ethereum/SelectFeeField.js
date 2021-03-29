// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import IconClock from "~/renderer/icons/Clock";
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";

import {
  getAccountCurrency,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getGasLimit } from "@ledgerhq/live-common/lib/families/ethereum/transaction";
import { useFeesStrategy } from "@ledgerhq/live-common/lib/families/ethereum/react";
import type { Account } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/ethereum/types";

type Props = {
  onChange: Transaction => void,
  transaction: Transaction,
  account: Account,
  parentAccount: ?Account,
};
const FeesWrapper = styled(Box)`
  border: ${p =>
    `1px solid ${
      p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.divider
    }`};
  padding: 12px;
  font-family: "Inter";
  width: 140px;
  border-radius: 4px;

  &:hover {
    cursor: pointer;
  }
`;

const AdvancedText = styled(Text)`
  color: ${p =>
    p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade50};
  &:hover {
    cursor: pointer;
  }
`;

const FeesHeader = styled(Box)`
  color: ${p =>
    p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade30};
`;

const FeeBox = ({ label, amount, accountUnit, feesCurrency, selected, onClick }) => {
  return (
    <FeesWrapper selected={selected} onClick={onClick}>
      <FeesHeader horizontal alignItems="center" selected={selected}>
        <IconClock size={14} />
        <Text
          style={{ marginLeft: "5px", textTransform: "uppercase" }}
          fontSize={3}
          fontWeight="800"
        >
          {label}
        </Text>
      </FeesHeader>
      <Box>
        <FormattedVal
          color="palette.text.shade100"
          fontSize={3}
          fontWeight="600"
          val={amount}
          unit={accountUnit}
          showCode
        />
      </Box>
      <Box>
        <CounterValue
          currency={feesCurrency}
          value={amount}
          color="palette.text.shade50"
          fontWeight="500"
          fontSize={3}
          showCode
        />
      </Box>
    </FeesWrapper>
  );
};

const SelectFeeStrategy = ({ transaction, account, parentAccount, onClick }) => {
  const strategies = useFeesStrategy(transaction);
  const gasLimit = getGasLimit(transaction);
  const mainAccount = getMainAccount(account, parentAccount);
  const accountUnit = getAccountUnit(mainAccount);
  const feesCurrency = getAccountCurrency(mainAccount);

  return (
    <Box horizontal alignItems="center" flow={3}>
      {strategies.map(s => (
        <FeeBox
          key={s.name}
          label={s.name}
          selected={s.amount === transaction.gasPrice}
          amount={gasLimit.multipliedBy(s.amount)}
          accountUnit={accountUnit}
          feesCurrency={feesCurrency}
          onClick={() => {
            onClick(s.amount);
          }}
        />
      ))}
    </Box>
  );
};

const SelectFee = ({ onChange, account, parentAccount, transaction }: Props) => {
  invariant(transaction.family === "ethereum", "Select fee: ethereum families");

  const bridge = getAccountBridge(account);

  const onGasPriceChange = useCallback(
    gasPrice => {
      onChange(bridge.updateTransaction(transaction, { gasPrice }));
    },
    [bridge, onChange, transaction],
  );

  return (
    <SelectFeeStrategy
      transaction={transaction}
      account={account}
      parentAccount={parentAccount}
      onClick={onGasPriceChange}
    />
  );
};

export default withTranslation()(SelectFee);
