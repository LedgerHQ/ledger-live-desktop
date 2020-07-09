// @flow

import React from "react";
import { Trans } from "react-i18next";
import { bitcoinPickingStrategy } from "@ledgerhq/live-common/lib/families/bitcoin/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/bitcoin/types";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Select from "~/renderer/components/Select";

type Props = {
  account: Account,
  transaction: Transaction,
  onChange: Transaction => void,
  status: TransactionStatus,
};

const keys = Object.keys(bitcoinPickingStrategy);
const options = keys.map(value => ({
  value,
  label: <Trans i18nKey={`bitcoin.pickingStrategyLabels.${value}`} />,
}));

export const PickingStrategy = ({ transaction, account, onChange, status }: Props) => {
  const bridge = getAccountBridge(account);
  const item = options.find(
    o => bitcoinPickingStrategy[o.value] === transaction.utxoStrategy.strategy,
  );

  return (
    <Box flow={2} horizontal alignItems="center">
      <Select
        width={300}
        options={options}
        value={item}
        onChange={item =>
          onChange(
            bridge.updateTransaction(transaction, {
              utxoStrategy: {
                ...transaction.utxoStrategy,
                strategy: bitcoinPickingStrategy[item.value] || 0,
              },
            }),
          )
        }
      />
      <Text color="palette.text.shade50" ff="Inter|Medium" fontSize={12}>
        <Trans i18nKey="bitcoin.pickingStrategy" />
      </Text>
    </Box>
  );
};
