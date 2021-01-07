// @flow
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import type { StepProps } from "../types";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Rewards from "~/renderer/images/rewards.svg";
import InfoBox from "~/renderer/components/InfoBox";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";

const RewardImg = styled.img.attrs(() => ({ src: Rewards }))`
  width: 130px;
  height: auto;
`;

export default function StepStarter({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && account.cosmosResources && transaction, "account and transaction required");
  return (
    <Box flow={4}>
      <TrackPage category="Redelegation Flow" name="Step Starter" />
      <Box flow={1} alignItems="center">
        <Box mb={4}>
          <RewardImg />
        </Box>
        <Box mb={4}>
          <Text
            ff="Inter|SemiBold"
            fontSize={13}
            textAlign="center"
            color="palette.text.shade80"
            style={{ lineHeight: 1.57 }}
          >
            <Trans i18nKey="cosmos.redelegation.flow.steps.starter.description" />
          </Text>
        </Box>
        <InfoBox>
          <Trans i18nKey="cosmos.redelegation.flow.steps.starter.warning">
            <b></b>
          </Trans>
        </InfoBox>
      </Box>
    </Box>
  );
}

export function StepStarterFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  invariant(account, "account required");
  return (
    <>
      <LinkWithExternalIcon
        label={<Trans i18nKey="cosmos.redelegation.flow.steps.starter.howDelegationWorks" />}
        onClick={() => openURL(urls.stakingCosmos)}
      />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button primary onClick={() => transitionTo("validators")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
