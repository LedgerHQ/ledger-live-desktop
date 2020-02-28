// @flow

import React from "react";
import { Trans, withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import styled from "styled-components";
import { getAccountUnit, getMainAccount } from "@ledgerhq/live-common/lib/account";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import type { Device } from "~/renderer/reducers/devices";
import transactionConfirmFieldsPerFamily from "~/renderer/generated/TransactionConfirmFields";
import Box from "~/renderer/components/Box";
import WarnBox from "~/renderer/components/WarnBox";
import useTheme from "~/renderer/hooks/useTheme";
import FormattedVal from "~/renderer/components/FormattedVal";
import { renderVerifyUnwrapped } from "~/renderer/components/DeviceAction/rendering";
import TransactionConfirmField from "./TransactionConfirmField";

const Container = styled(Box).attrs(() => ({
  alignItems: "center",
  fontSize: 4,
  pb: 4,
}))``;

const Info = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  mt: 6,
  mb: 4,
  px: 5,
}))`
  text-align: center;
`;

type Props = {
  t: TFunction,
  device: Device,
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  status: TransactionStatus,
};

const TransactionConfirm = ({ t, device, account, parentAccount, transaction, status }: Props) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const { estimatedFees, amount } = status;
  const unit = getAccountUnit(account);
  const feesUnit = getAccountUnit(mainAccount);
  const type = useTheme("colors.palette.type");

  if (!device) return null;

  const r = transactionConfirmFieldsPerFamily[mainAccount.currency.family];
  const Pre = r && r.pre;
  const Post = r && r.post;

  const recipientWording = t(`TransactionConfirm.recipientWording.${transaction.mode || "send"}`);

  return (
    <Container>
      <WarnBox>
        <Trans i18nKey="TransactionConfirm.warning" values={{ recipientWording }} />
      </WarnBox>

      <Info>
        <Trans i18nKey="TransactionConfirm.title" />
      </Info>
      <Box style={{ width: "100%" }} px={80} mb={20}>
        {Pre ? (
          <Pre
            account={account}
            parentAccount={parentAccount}
            transaction={transaction}
            status={status}
          />
        ) : null}

        {amount.isZero() ? null : (
          <TransactionConfirmField label={<Trans i18nKey="send.steps.details.amount" />}>
            <FormattedVal
              color={"palette.text.shade80"}
              unit={unit}
              val={amount}
              fontSize={3}
              inline
              showCode
            />
          </TransactionConfirmField>
        )}

        <TransactionConfirmField label={<Trans i18nKey="send.steps.details.fees" />}>
          <FormattedVal
            color={"palette.text.shade80"}
            unit={feesUnit}
            val={estimatedFees}
            fontSize={3}
            inline
            showCode
          />
        </TransactionConfirmField>

        {Post ? (
          <Post
            account={account}
            parentAccount={parentAccount}
            transaction={transaction}
            status={status}
          />
        ) : null}
      </Box>

      {renderVerifyUnwrapped({ modelId: device.modelId, type })}
    </Container>
  );
};

export default withTranslation()(TransactionConfirm);
