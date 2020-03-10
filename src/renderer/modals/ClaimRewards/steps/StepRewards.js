// @flow

import React from "react";
import styled from "styled-components";

import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import { getMainAccount, getReceiveFlowError } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Text from "~/renderer/components/Text";

import { BigNumber } from "bignumber.js";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import InfoCircle from "~/renderer/icons/InfoCircle";

const IconWrapperCircle = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => (props.green ? "#66be5419" : "#6490f119")};
  color: ${props => (props.green ? "#66be54" : "#6490f1")};
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-bottom: 15px;
`;

export default function StepAccount({
  token,
  account,
  parentAccount,
  receiveTokenMode,
  reward,
}: StepProps) {
  if (!account) return null;
  const mainAccount = getMainAccount(account, parentAccount);
  const error = getReceiveFlowError(account, parentAccount);

  const formattedReward = formatCurrencyUnit(mainAccount.unit, BigNumber(reward || 0), {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
  });

  return (
    <Box flow={1}>
      <TrackPage category="Receive Flow" name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box>
        <IconWrapperCircle>
          <CryptoCurrencyIcon inactive currency={mainAccount.currency} size={24} />
        </IconWrapperCircle>
      </Box>
      <Box px={6} py={4}>
        <Text ff="Inter|Medium" textAlign="center">
          <Trans
            i18nKey="claimRewards.steps.rewards.description"
            values={{ amount: formattedReward }}
          >
            {"placeholder"}
            <b>{"placeholder"}</b>
            {"placeholder"}
          </Trans>
        </Text>
      </Box>
      <Box borderRadius={4} horizontal alignItems="center" mx={4} p={2} bg="palette.divider">
        <Box mr={1}>
          <InfoCircle size={16} />
        </Box>
        <Text ff="Inter|Regular" textAlign="center">
          <Trans i18nKey="claimRewards.steps.rewards.info" />
        </Text>
      </Box>
    </Box>
  );
}

export function StepRewardsFooter({
  transitionTo,
  receiveTokenMode,
  token,
  account,
  parentAccount,
  onClose,
}: StepProps) {
  const error = account ? getReceiveFlowError(account, parentAccount) : null;
  return (
    <Box horizontal>
      <Button mr={1} secondary onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button
        disabled={!account || (receiveTokenMode && !token) || !!error}
        primary
        onClick={() => transitionTo("device")}
      >
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
