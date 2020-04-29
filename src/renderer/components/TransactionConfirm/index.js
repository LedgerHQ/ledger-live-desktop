// @flow

import invariant from "invariant";
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
import { getDeviceTransactionConfig } from "@ledgerhq/live-common/lib/transaction";
import type { DeviceTransactionField } from "@ledgerhq/live-common/lib/transaction";
import type { Device } from "~/renderer/reducers/devices";
import transactionConfirmFieldsPerFamily from "~/renderer/generated/TransactionConfirmFields";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import WarnBox from "~/renderer/components/WarnBox";
import useTheme from "~/renderer/hooks/useTheme";
import FormattedVal from "~/renderer/components/FormattedVal";
import { renderVerifyUnwrapped } from "~/renderer/components/DeviceAction/rendering";
import TransactionConfirmField from "./TransactionConfirmField";

const AddressText = styled(Text).attrs(() => ({
  ml: 1,
  ff: "Inter|Medium",
  color: "palette.text.shade80",
  fontSize: 3,
}))`
  word-break: break-all;
  text-align: right;
  max-width: 50%;
`;

export type FieldComponentProps = {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  status: TransactionStatus,
  field: DeviceTransactionField,
};

export type FieldComponent = React$ComponentType<FieldComponentProps>;

const AmountField = ({ account, status: { amount } }: FieldComponentProps) => (
  <TransactionConfirmField label={<Trans i18nKey="send.steps.details.amount" />}>
    <FormattedVal
      color={"palette.text.shade80"}
      unit={getAccountUnit(account)}
      val={amount}
      fontSize={3}
      inline
      showCode
      disableRounding
    />
  </TransactionConfirmField>
);

const FeesField = ({ account, parentAccount, status }: FieldComponentProps) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const { estimatedFees } = status;
  const feesUnit = getAccountUnit(mainAccount);
  return (
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
  );
};

const AddressField = ({ account, parentAccount, field }: FieldComponentProps) => {
  invariant(field.type === "address", "AddressField invalid");
  return (
    <TransactionConfirmField label={field.label}>
      <AddressText>{field.address}</AddressText>
    </TransactionConfirmField>
  );
};

const commonFieldComponents: { [_: *]: FieldComponent } = {
  amount: AmountField,
  fees: FeesField,
  address: AddressField,
};

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
  const type = useTheme("colors.palette.type");

  if (!device) return null;

  const r = transactionConfirmFieldsPerFamily[mainAccount.currency.family];

  const fieldComponents = {
    ...commonFieldComponents,
    ...(r && r.fieldComponents),
  };
  const Warning = r && r.warning;
  const Title = r && r.title;

  const fields = getDeviceTransactionConfig({
    account,
    parentAccount,
    transaction,
    status,
  });

  const recipientWording = t(`TransactionConfirm.recipientWording.${transaction.mode || "send"}`);

  return (
    <Container>
      {Warning ? (
        <Warning
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          recipientWording={recipientWording}
          status={status}
        />
      ) : (
        <WarnBox>
          <Trans i18nKey="TransactionConfirm.warning" values={{ recipientWording }} />
        </WarnBox>
      )}
      {Title ? (
        <Title
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          status={status}
        />
      ) : (
        <Info>
          <Trans i18nKey="TransactionConfirm.title" />
        </Info>
      )}

      <Box style={{ width: "100%" }} px={80} mb={20}>
        {fields.map((field, i) => {
          const MaybeComponent = fieldComponents[field.type];
          if (!MaybeComponent) {
            console.log(
              `TransactionConfirm field ${field.type} is not implemented! add a generic implementation in components/TransactionConfirm.js or inside families/*/TransactionConfirmFields.js`,
            );
            return null;
          }
          return (
            <MaybeComponent
              key={i}
              field={field}
              account={account}
              parentAccount={parentAccount}
              transaction={transaction}
              status={status}
            />
          );
        })}
      </Box>

      {renderVerifyUnwrapped({ modelId: device.modelId, type })}
    </Container>
  );
};

export default withTranslation()(TransactionConfirm);
