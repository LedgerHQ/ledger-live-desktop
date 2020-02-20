// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { BigNumber } from "bignumber.js";
import { Trans, withTranslation } from "react-i18next";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/ethereum/types";
import { getGasLimit } from "@ledgerhq/live-common/lib/families/ethereum/transaction";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import Box from "~/renderer/components/Box";
import Input from "~/renderer/components/Input";
import Label from "~/renderer/components/Label";

type Props = {
  onChange: Transaction => void,
  transaction: Transaction,
  account: Account,
  status: TransactionStatus,
};

const AdvancedOptions = ({ onChange, account, transaction, status }: Props) => {
  invariant(transaction.family === "ethereum", "AdvancedOptions: ethereum family expected");

  const onGasLimitChange = useCallback(
    (str: string) => {
      const bridge = getAccountBridge(account);
      let userGasLimit = BigNumber(str || 0);
      if (userGasLimit.isNaN() || !userGasLimit.isFinite()) {
        userGasLimit = BigNumber(0x5208);
      }
      onChange(bridge.updateTransaction(transaction, { userGasLimit }));
    },
    [account, transaction, onChange],
  );

  const gasLimit = getGasLimit(transaction);
  const { gasLimit: gasLimitError } = status.errors;
  const { gasLimit: gasLimitWarning } = status.warnings;

  return (
    <Box horizontal alignItems="center" flow={5}>
      <Box style={{ width: 200 }}>
        <Label>
          <span>
            <Trans i18nKey="send.steps.details.ethereumGasLimit" />
          </span>
        </Label>
      </Box>
      <Box grow>
        <Input
          ff="Inter"
          warning={gasLimitWarning}
          error={gasLimitError}
          value={gasLimit.toString()}
          onChange={onGasLimitChange}
          loading={!transaction.networkInfo && !transaction.userGasLimit}
        />
      </Box>
    </Box>
  );
};

export default withTranslation()(AdvancedOptions);
