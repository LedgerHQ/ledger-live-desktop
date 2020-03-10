// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import type { StepProps } from "~/renderer/modals/Delegation/types";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import Check from "~/renderer/icons/CheckFull";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

import Rewards from "~/renderer/images/rewards.png";

const RewardImg = styled.img.attrs(() => ({ src: Rewards }))`
  width: 182px;
  height: auto;
`;

const Row = styled(Box).attrs(p => ({
  horizontal: true,
  justifyContent: "flex-start",
  alignItems: "center",
  color: p.theme.colors.greenPill,
}))`
  margin-bottom: 6px;

  & > :first-child {
    margin-right: 8px;
  }
`;

const StepStarter = ({ transitionTo }: StepProps) => {
  return (
    <Box flow={4} mx={4}>
      <TrackPage category="Delegation Flow" name="Step Starter" />
      <Box flow={1} alignItems="center">
        <Box mb={4}>
          <RewardImg />
        </Box>
        <Box mb={4}>
          <Text
            ff="Inter|Regular"
            fontSize={14}
            textAlign="center"
            color="palette.text.shade80"
            style={{ lineHeight: 1.57 }}
          >
            <Trans i18nKey="tron.voting.flow.steps.starter.description" />
          </Text>
        </Box>
        <Box>
          <Row>
            <Check size={16} />
            <Text
              ff="Inter|Bold"
              style={{ lineHeight: 1.57 }}
              color="palette.text.shade100"
              fontSize={14}
            >
              <Trans i18nKey="tron.voting.flow.steps.starter.bullet.delegate" />
            </Text>
          </Row>
          <Row>
            <Check size={16} />
            <Text
              ff="Inter|Bold"
              style={{ lineHeight: 1.57 }}
              color="palette.text.shade100"
              fontSize={14}
            >
              <Trans i18nKey="tron.voting.flow.steps.starter.bullet.access" />
            </Text>
          </Row>
          <Row>
            <Check size={16} />
            <Text
              ff="Inter|Bold"
              style={{ lineHeight: 1.57 }}
              color="palette.text.shade100"
              fontSize={14}
            >
              <Trans i18nKey="tron.voting.flow.steps.starter.bullet.ledger" />
            </Text>
          </Row>
        </Box>
        <Box my={4}>
          <LinkWithExternalIcon
            label={<Trans i18nKey="delegation.howItWorks" />}
            onClick={() => openURL(urls.delegation)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export const StepStarterFooter = ({ transitionTo }: StepProps) => {
  const onNext = useCallback(() => transitionTo("starter"), [transitionTo]);
  /** @TODO update and redirect to next step */

  return (
    <>
      <Button isLoading={false} primary onClick={onNext}>
        <Trans i18nKey="common.continue" />
      </Button>
    </>
  );
};

export default StepStarter;
