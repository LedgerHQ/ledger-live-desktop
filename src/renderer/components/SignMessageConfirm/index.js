// @flow

import invariant from "invariant";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import type { TypedMessageData } from "@ledgerhq/live-common/lib/families/ethereum/types";
import type { MessageData } from "@ledgerhq/live-common/lib/hw/signMessage/types";
import type { DeviceTransactionField } from "@ledgerhq/live-common/lib/transaction";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import useTheme from "~/renderer/hooks/useTheme";
import { renderVerifyUnwrapped } from "~/renderer/components/DeviceAction/rendering";
import SignMessageConfirmField from "./SignMessageConfirmField";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const FieldText = styled(Text).attrs(() => ({
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
  field: DeviceTransactionField,
};

export type FieldComponent = React$ComponentType<FieldComponentProps>;

const TextField = ({ field }: FieldComponentProps) => {
  invariant(field.type === "text", "TextField invalid");
  return (
    <SignMessageConfirmField label={field.label}>
      <FieldText>{field.value}</FieldText>
    </SignMessageConfirmField>
  );
};

const Container: ThemedComponent<*> = styled(Box).attrs(() => ({
  alignItems: "center",
  fontSize: 4,
  pb: 4,
}))``;

type Props = {
  device: Device,
  account: AccountLike,
  signMessageRequested: TypedMessageData | MessageData,
};

const SignMessageConfirm = ({ device, account, signMessageRequested: message }: Props) => {
  const type = useTheme("colors.palette.type");
  const { t } = useTranslation();

  if (!device) return null;

  const fields = [];

  if (message.hashes && message.hashes.domainHash) {
    fields.push({
      type: "text",
      label: t("SignMessageConfirm.domainHash"),
      // $FlowFixMe
      value: message.hashes.domainHash,
    });
  }
  if (message.hashes && message.hashes.messageHash) {
    fields.push({
      type: "text",
      label: t("SignMessageConfirm.messageHash"),
      // $FlowFixMe
      value: message.hashes.messageHash,
    });
  }
  if (message.hashes && message.hashes.stringHash) {
    fields.push({
      type: "text",
      label: t("SignMessageConfirm.stringHash"),
      // $FlowFixMe
      value: message.hashes.stringHash,
    });
  }
  fields.push({
    type: "text",
    label: t("SignMessageConfirm.message"),
    value: message.message.domain ? JSON.stringify(message.message) : message.message,
  });

  return (
    <Container>
      <Box style={{ width: "100%" }} px={30} mb={20}>
        {fields.map((field, i) => {
          return <TextField key={i} field={field} account={account} />;
        })}
      </Box>

      {renderVerifyUnwrapped({ modelId: device.modelId, type })}
    </Container>
  );
};

export default SignMessageConfirm;
