// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import Alert from "~/renderer/components/Alert";
import invariant from "invariant";
import type { Account, Transaction, TransactionStatus } from "@ledgerhq/live-common/lib/types";

const FeeField = ({
  onChange,
  account,
  transaction,
  status,
}: {
  onChange: string => void,
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
}) => {
  invariant(transaction.family === "stellar", "FeeField: stellar family expected");

  const bridge = getAccountBridge(account);

  const onFeeValueChange = useCallback(
    fees => {
      onChange(bridge.updateTransaction(transaction, { fees }));
    },
    [onChange, transaction, bridge],
  );

  const { networkCongestionLevel, fees: recommendedFee } = transaction?.networkInfo || {};

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "positiveGreen";
      case "MEDIUM":
        return "warning";
      // HIGH
      default:
        return "alertRed";
    }
  };

  // We use transaction as an error here.
  return (
    <Box maxWidth="100%">
      {networkCongestionLevel ? (
        <FeeMessageRow>
          <Text color={getCongestionColor(networkCongestionLevel)}>
            <Trans i18nKey={`families.stellar.networkCongestionLevel.${networkCongestionLevel}`} />{" "}
            <Trans i18nKey="families.stellar.networkCongestion" />
          </Text>
        </FeeMessageRow>
      ) : null}
      <FeeMessageRow mb={10}>
        <Text>
          <Trans i18nKey="families.stellar.recommendedFee" />
        </Text>
        <FormattedVal
          color="palette.text.shade60"
          val={recommendedFee?.toString()}
          unit={account.unit}
          showCode
          disableRounding
        />
      </FeeMessageRow>

      <InputCurrency
        error={status.errors.transaction}
        warning={status.warnings.transaction}
        containerProps={{ grow: true }}
        defaultUnit={account.unit}
        value={transaction.fees}
        onChange={onFeeValueChange}
        renderRight={<InputRight>XLM</InputRight>}
      />

      {status.warnings?.transaction?.name === "StellarFeeSmallerThanRecommended" && (
        <Box mt={25}>
          <Alert type="secondary">
            <Trans i18nKey="families.stellar.recommenndedFeeInfo" />
          </Alert>
        </Box>
      )}
    </Box>
  );
};

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
}))`
  padding-right: 10px;
`;

const FeeMessageRow = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 13,
  horizontal: true,
}))`
  gap: 4px;
`;

export default FeeField;
