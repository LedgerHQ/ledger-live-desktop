// @flow
import invariant from "invariant";
import React from "react";
import styled from "styled-components";

import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";

import { BigNumber } from "bignumber.js";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ClaimRewards from "~/renderer/icons/ClaimReward";

const IconWrapperCircle = styled(Box)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => (props.green ? "#66be5419" : "#6490f119")};
  color: ${props => (props.green ? "#66be54" : "#6490f1")};
  align-items: center;
  justify-content: center;
  align-self: center;
`;

export default function StepRewards({ account, parentAccount, reward }: StepProps) {
  invariant(account, "account is required");
  const mainAccount = getMainAccount(account, parentAccount);

  const formattedReward = formatCurrencyUnit(mainAccount.unit, BigNumber(reward || 0), {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
  });

  return (
    <Box flow={1}>
      <TrackPage category="Claim Reward Flow" name="Step reward" />
      <Box>
        <IconWrapperCircle>
          <ClaimRewards size={24} />
        </IconWrapperCircle>
      </Box>
      <Box px={6} py={4}>
        <Text ff="Inter|Medium" textAlign="center">
          <Trans
            i18nKey="claimReward.steps.rewards.description"
            values={{ amount: formattedReward }}
          >
            {"placeholder"}
            <b>{"placeholder"}</b>
            {"placeholder"}
          </Trans>
        </Text>
      </Box>
      <Box borderRadius={4} horizontal alignItems="center" mx={4} p={1} bg="palette.divider">
        <Box mr={2}>
          <InfoCircle size={12} />
        </Box>
        <Text ff="Inter|Regular" textAlign="center" fontSize={3}>
          <Trans i18nKey="claimReward.steps.rewards.info" />
        </Text>
      </Box>
    </Box>
  );
}

export function StepRewardsFooter({ transitionTo, account, parentAccount, onClose }: StepProps) {
  return (
    <Box horizontal>
      <Button mr={1} secondary onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button disabled={!account} primary onClick={() => transitionTo("connectDevice")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
