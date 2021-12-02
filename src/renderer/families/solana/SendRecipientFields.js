// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import { BigNumber } from "bignumber.js";
import { withTranslation, useTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import type { Account, Transaction } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import Box from "~/renderer/components/Box";
import Input from "~/renderer/components/Input";
import Label from "~/renderer/components/Label";
import type { TransactionStatus } from "@ledgerhq/live-common/lib/types";
import { NotEnoughBalanceBecauseDestinationNotCreated } from "@ledgerhq/errors";
import CheckBox from "~/renderer/components/CheckBox";
import LabelInfoTooltip from "~/renderer/components/LabelInfoTooltip";
import TranslatedError from "~/renderer/components/TranslatedError";
import styled from "styled-components";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { track } from "~/renderer/analytics/segment";
import LabelWithExternalIcon from "~/renderer/components/LabelWithExternalIcon";

type Props = {
  account: Account,
  status: TransactionStatus,
  onChange: Transaction => void,
  transaction: Transaction,
};

const WarningDisplay = styled(Box)`
  color: ${p => p.theme.colors.warning};
`;

const Root = ({ onChange, account, transaction, status }: Props) => {
  invariant(transaction.family === "solana", "solana family expected");

  const { t } = useTranslation();

  const onChangeTx = useCallback(
    patch => {
      const bridge = getAccountBridge(account);
      onChange(bridge.updateTransaction(transaction, patch));
    },
    [onChange, account, transaction],
  );

  const extraWarnings = [
    status.warnings.recipientAssociatedTokenAccount,
    status.warnings.recipientOffCurve,
  ];

  return (
    <Box flow={2}>
      {status.warnings.recipient && (
        <LabelWithExternalIcon
          onClick={() => {
            openURL(urls.solana.recipient_info);
            track("Solana Recipient Info Requested");
          }}
          label={t("solana.send.flow.steps.recipient.info_label")}
        />
      )}
      {extraWarnings.filter(Boolean).map(warning => (
        <Box>
          <WarningDisplay>
            <TranslatedError error={warning} />
          </WarningDisplay>
        </Box>
      ))}
      <Box>
        <Label mb={5}>
          <span>Memo</span>
        </Label>
        <Input
          placeholder="Memo"
          value={transaction.model.uiState.memo || ""}
          onChange={memo =>
            onChangeTx({
              model: {
                ...transaction.model,
                uiState: {
                  ...transaction.model.uiState,
                  memo,
                },
              },
            })
          }
        />
      </Box>
    </Box>
  );
};

export default {
  component: withTranslation()(Root),
  fields: ["memo"],
};
