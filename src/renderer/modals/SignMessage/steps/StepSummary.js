// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import type { StepProps } from "../types";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { rgba } from "~/renderer/styles/helpers";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Text from "~/renderer/components/Text";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import IconWallet from "~/renderer/icons/Wallet";

const Circle: ThemedComponent<{}> = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 32px;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  align-items: center;
  display: flex;
  justify-content: center;
  margin-right: 12px;
`;

const Separator = styled.div`
  height: 1px;
  background-color: rgba(20, 37, 51, 0.2);
  margin-top: 32px;
  margin-bottom: 32px;
`;

export default function StepSummary({ account, message }: StepProps) {
  return (
    <Box flow={1}>
      <Box horizontal alignItems="center">
        <Circle>
          <IconWallet size={14} />
        </Circle>
        <Box flex="1">
          <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
            <Trans i18nKey="send.steps.details.from" />
          </Text>
          <Box horizontal alignItems="center">
            <div style={{ marginRight: 7 }}>
              <CryptoCurrencyIcon size={16} currency={account.currency} />
            </div>
            <Text ff="Inter" color="palette.text.shade100" fontSize={4} style={{ flex: 1 }}>
              {account.name}
            </Text>
          </Box>
        </Box>
      </Box>
      <Separator />
      <Text>{message.message.domain ? JSON.stringify(message.message) : message.message}</Text>
    </Box>
  );
}

export function StepSummaryFooter({ transitionTo }: StepProps) {
  return (
    <Box horizontal justifyContent="flex-end">
      <Button
        onClick={() => {
          transitionTo("sign");
        }}
        primary
      >
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
